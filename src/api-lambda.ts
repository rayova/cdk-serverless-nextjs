import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as cloudfront_origins from '@aws-cdk/aws-cloudfront-origins';
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { NEXTJS_LAMBDA_RUNTIME } from './constants';
import { LambdaAtEdgeRole } from './lambda-at-edge-role';

export interface ApiLambdaProps {
  readonly bucket: s3.IBucket;
  readonly apiLambdaPath: string;
}

export class ApiLambda extends cdk.Construct {
  private readonly apiLambda: lambda.Function;
  private readonly cachePolicy: cloudfront.CachePolicy;
  private readonly origin: cloudfront.IOrigin;

  constructor(scope: cdk.Construct, id: string, props: ApiLambdaProps) {
    super(scope, id);

    this.origin = new cloudfront_origins.S3Origin(props.bucket);

    this.apiLambda = new lambda.Function(this, 'Lambda', {
      runtime: NEXTJS_LAMBDA_RUNTIME,
      code: lambda.Code.fromAsset(props.apiLambdaPath),
      handler: 'index.handler',
      role: new LambdaAtEdgeRole(this, 'Role'),
      memorySize: 512,
      timeout: cdk.Duration.seconds(30),
    });

    this.cachePolicy = new cloudfront.CachePolicy(this, 'CachePolicy', {
      queryStringBehavior: cloudfront.CacheQueryStringBehavior.all(),
      headerBehavior: cloudfront.CacheHeaderBehavior.none(),
      defaultTtl: cdk.Duration.seconds(0),
      maxTtl: cdk.Duration.days(365),
      minTtl: cdk.Duration.seconds(0),
      enableAcceptEncodingBrotli: true,
      enableAcceptEncodingGzip: true,
    });
  }

  get cdnBehaviorOptions(): cloudfront.BehaviorOptions {
    return {
      origin: this.origin,
      cachePolicy: this.cachePolicy,
      edgeLambdas: [
        {
          includeBody: true,
          eventType: cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
          functionVersion: this.apiLambda.currentVersion,
        },
      ],
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
      cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
      compress: true,
    };
  }
}