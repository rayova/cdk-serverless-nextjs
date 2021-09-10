import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as cloudfront_origins from '@aws-cdk/aws-cloudfront-origins';
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { NEXTJS_LAMBDA_RUNTIME } from './constants';
import { LambdaAtEdgeRole } from './lambda-at-edge-role';

export interface ImageLambdaProps {
  /** The origin bucket in which to find image assets */
  readonly originBucket: s3.IBucket;
  /** Path of the directory containing the image lambda handler */
  readonly imageLambdaPath: string;
}

/** Create an image lambda that handles image optimization */
export class ImageLambda extends cdk.Construct {
  private readonly cachePolicy: cloudfront.CachePolicy;
  private readonly lambda: lambda.Function;
  private readonly origin: cloudfront_origins.S3Origin;
  private readonly originRequestPolicy: cloudfront.OriginRequestPolicy;

  constructor(scope: cdk.Construct, id: string, props: ImageLambdaProps) {
    super(scope, id);

    this.origin = new cloudfront_origins.S3Origin(props.originBucket);

    this.lambda = new lambda.Function(this, 'Lambda', {
      runtime: NEXTJS_LAMBDA_RUNTIME,
      code: lambda.Code.fromAsset(props.imageLambdaPath),
      handler: 'index.handler',
      role: new LambdaAtEdgeRole(this, 'Role'),
      timeout: cdk.Duration.seconds(30),
      // The Lambda needs a fair bit of memory or it runs quite slowly.
      memorySize: 2048,
    });
    props.originBucket.grantReadWrite(this.lambda);

    this.originRequestPolicy = new cloudfront.OriginRequestPolicy(
      this,
      'OriginRequestPolicy',
      {
        queryStringBehavior: cloudfront.OriginRequestQueryStringBehavior.all(),
      },
    );

    this.cachePolicy = new cloudfront.CachePolicy(this, 'CachePolicy', {
      queryStringBehavior: cloudfront.CacheQueryStringBehavior.all(),
      headerBehavior: cloudfront.CacheHeaderBehavior.allowList('Accept'),
      cookieBehavior: cloudfront.CacheCookieBehavior.none(),
      defaultTtl: cdk.Duration.days(1),
      maxTtl: cdk.Duration.days(365),
      minTtl: cdk.Duration.days(0),
      enableAcceptEncodingBrotli: true,
      enableAcceptEncodingGzip: true,
    });
  }

  get cdnBehaviorOptions(): cloudfront.BehaviorOptions {
    return {
      origin: this.origin,
      cachePolicy: this.cachePolicy,
      originRequestPolicy: this.originRequestPolicy,
      edgeLambdas: [
        {
          eventType: cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
          functionVersion: this.lambda.currentVersion,
        },
      ],
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
      cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
      compress: true,
    };
  }
}
