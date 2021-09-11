import * as path from 'path';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as cloudfront_origins from '@aws-cdk/aws-cloudfront-origins';
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { IMAGE_LAMBDA_SUBPATH, NEXTJS_LAMBDA_RUNTIME } from './constants';
import { hasManifest } from './has-manifest';
import { LambdaAtEdgeRole } from './lambda-at-edge-role';

export interface ImageLambdaProps {
  /** The origin bucket in which to find image assets */
  readonly originBucket: s3.IBucket;
  /** Path of the directory containing the image lambda handler */
  readonly buildOutputDir: string;
}

/** Create an image lambda that handles image optimization */
export class ImageLambda extends cdk.Construct {
  private readonly behaviorOptions?: cloudfront.BehaviorOptions;

  constructor(scope: cdk.Construct, id: string, props: ImageLambdaProps) {
    super(scope, id);

    const lambdaPath = path.join(props.buildOutputDir, IMAGE_LAMBDA_SUBPATH);
    if (!hasManifest(lambdaPath)) return;

    const origin = new cloudfront_origins.S3Origin(props.originBucket);

    const imageLambda = new lambda.Function(this, 'Lambda', {
      runtime: NEXTJS_LAMBDA_RUNTIME,
      code: lambda.Code.fromAsset(props.buildOutputDir),
      handler: 'index.handler',
      role: new LambdaAtEdgeRole(this, 'Role'),
      timeout: cdk.Duration.seconds(30),
      // The Lambda needs a fair bit of memory or it runs quite slowly.
      memorySize: 2048,
    });
    props.originBucket.grantReadWrite(imageLambda);

    const originRequestPolicy = new cloudfront.OriginRequestPolicy(
      this,
      'OriginRequestPolicy',
      {
        queryStringBehavior: cloudfront.OriginRequestQueryStringBehavior.all(),
      },
    );

    const cachePolicy = new cloudfront.CachePolicy(this, 'CachePolicy', {
      queryStringBehavior: cloudfront.CacheQueryStringBehavior.all(),
      headerBehavior: cloudfront.CacheHeaderBehavior.allowList('Accept'),
      cookieBehavior: cloudfront.CacheCookieBehavior.none(),
      defaultTtl: cdk.Duration.days(1),
      maxTtl: cdk.Duration.days(365),
      minTtl: cdk.Duration.days(0),
      enableAcceptEncodingBrotli: true,
      enableAcceptEncodingGzip: true,
    });

    this.behaviorOptions = {
      origin,
      cachePolicy,
      originRequestPolicy,
      edgeLambdas: [
        {
          eventType: cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
          functionVersion: imageLambda.currentVersion,
        },
      ],
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
      cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
      compress: true,
    };
  }

  addAdditionalBehaviors(additionalBehaviors: Record<string, cloudfront.BehaviorOptions>) {
    if (!this.behaviorOptions) return;

    additionalBehaviors['_next/image*'] = this.behaviorOptions;
  }
}
