import * as path from 'path';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as cloudfront_origins from '@aws-cdk/aws-cloudfront-origins';
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { DEFAULT_LAMBDA_SUBPATH, NEXTJS_LAMBDA_RUNTIME } from './constants';
import { IncrementalStaticRegeneration } from './incremental-static-regeneration';
import { LambdaAtEdgeRole } from './lambda-at-edge-role';

export interface DefaultLambdaProps {
  readonly bucket: s3.IBucket;
  readonly incrementalStaticRegeneration: IncrementalStaticRegeneration;
  readonly buildOutputDir: string;
}

export class DefaultLambda extends cdk.Construct {
  public readonly defaultLambda: lambda.Function;
  private readonly origin: cloudfront_origins.S3Origin;
  private readonly cachePolicy: cloudfront.ICachePolicy;

  constructor(scope: cdk.Construct, id: string, props: DefaultLambdaProps) {
    super(scope, id);

    this.origin = new cloudfront_origins.S3Origin(props.bucket);
    this.cachePolicy = cloudfront.CachePolicy.CACHING_DISABLED;

    const lambdaDir = path.join(props.buildOutputDir, DEFAULT_LAMBDA_SUBPATH);

    this.defaultLambda = new lambda.Function(this, 'Lambda', {
      runtime: NEXTJS_LAMBDA_RUNTIME,
      code: lambda.Code.fromAsset(lambdaDir),
      handler: 'index-indirect.handler',
      role: new LambdaAtEdgeRole(this, 'Role'),
      memorySize: 512,
      timeout: cdk.Duration.seconds(30),
    });
    props.bucket.grantReadWrite(this.defaultLambda);

    const incrementalStaticRegeneration = props.incrementalStaticRegeneration;
    incrementalStaticRegeneration.regenerationQueue?.grantSendMessages(
      this.defaultLambda,
    );
    incrementalStaticRegeneration.regenerationFunction?.grantInvoke(
      this.defaultLambda,
    );
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
