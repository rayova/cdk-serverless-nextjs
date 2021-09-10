import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as cloudfront_origins from '@aws-cdk/aws-cloudfront-origins';
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { NEXTJS_LAMBDA_RUNTIME } from './constants';
import { IncrementalStaticRegeneration } from './incremental-static-regeneration';
import { LambdaAtEdgeRole } from './lambda-at-edge-role';

export interface DefaultLambdaProps {
  readonly bucket: s3.IBucket;
  readonly incrementalStatusGeneration?: IncrementalStaticRegeneration;
  readonly defaultLambdaDir: string;
}

export class DefaultLambda extends cdk.Construct {
  public readonly defaultLambda: lambda.Function;
  private readonly origin: cloudfront_origins.S3Origin;
  private readonly cachePolicy: cloudfront.ICachePolicy;

  constructor(scope: cdk.Construct, id: string, props: DefaultLambdaProps) {
    super(scope, id);

    this.origin = new cloudfront_origins.S3Origin(props.bucket);
    this.cachePolicy = cloudfront.CachePolicy.CACHING_DISABLED;

    this.defaultLambda = new lambda.Function(this, 'Lambda', {
      runtime: NEXTJS_LAMBDA_RUNTIME,
      code: lambda.Code.fromAsset(props.defaultLambdaDir),
      handler: 'index.handler',
      role: new LambdaAtEdgeRole(this, 'Role'),
      memorySize: 512,
      timeout: cdk.Duration.seconds(30),
    });
    props.bucket.grantReadWrite(this.defaultLambda);

    const regenerationLambda = props.incrementalStatusGeneration;
    if (regenerationLambda) {
      regenerationLambda.regenerationQueue.grantSendMessages(
        this.defaultLambda,
      );
      regenerationLambda.regenerationFunction.grantInvoke(this.defaultLambda);
    }
  }

  get cdnBehaviorOptions(): cloudfront.BehaviorOptions {
    return {
      origin: this.origin,
      cachePolicy: this.cachePolicy,
      edgeLambdas: [
        {
          eventType: cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
          functionVersion: this.defaultLambda.currentVersion,
          includeBody: true,
        },
        {
          eventType: cloudfront.LambdaEdgeEventType.ORIGIN_RESPONSE,
          functionVersion: this.defaultLambda.currentVersion,
        },
      ],
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
      cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
      compress: true,
    };
  }
}
