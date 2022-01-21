import * as cdk from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as cloudfront_origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export interface StaticAssetsProps {
  /** The bucket to create as an origin containing the assets */
  readonly originBucket: s3.IBucket;
}

/** Creates CDN Behavior Options for static assets */
export class StaticAssets extends Construct {
  public readonly cdnBehaviorOptions: cloudfront.BehaviorOptions;

  constructor(scope: Construct, id: string, props: StaticAssetsProps) {
    super(scope, id);

    const origin = new cloudfront_origins.S3Origin(props.originBucket);

    const cachePolicy = new cloudfront.CachePolicy(this, 'CachePolicy', {
      queryStringBehavior: cloudfront.CacheQueryStringBehavior.none(),
      headerBehavior: cloudfront.CacheHeaderBehavior.none(),
      cookieBehavior: cloudfront.CacheCookieBehavior.none(),
      defaultTtl: cdk.Duration.days(30),
      maxTtl: cdk.Duration.days(30),
      minTtl: cdk.Duration.days(30),
      enableAcceptEncodingBrotli: true,
      enableAcceptEncodingGzip: true,
    });

    this.cdnBehaviorOptions = {
      origin,
      cachePolicy,
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
      cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
      compress: true,
    };
  }
}
