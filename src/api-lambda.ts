import * as path from 'path';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as cloudfront_origins from '@aws-cdk/aws-cloudfront-origins';
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { API_LAMBDA_SUBPATH, NEXTJS_LAMBDA_RUNTIME } from './constants';
import { hasManifest } from './has-manifest';
import { LambdaAtEdgeRole } from './lambda-at-edge-role';

export interface ApiLambdaProps {
  readonly bucket: s3.IBucket;
  readonly buildOutputDir: string;
}

export class ApiLambda extends cdk.Construct {
  private readonly behaviorOptions?: cloudfront.BehaviorOptions;

  constructor(scope: cdk.Construct, id: string, props: ApiLambdaProps) {
    super(scope, id);

    const lambdaPath = path.join(props.buildOutputDir, API_LAMBDA_SUBPATH);

    // Only create resource if the handler has a manifest.
    if (!hasManifest(lambdaPath)) return;

    const origin = new cloudfront_origins.S3Origin(props.bucket);

    const apiLambda = new lambda.Function(this, 'Lambda', {
      runtime: NEXTJS_LAMBDA_RUNTIME,
      code: lambda.Code.fromAsset(lambdaPath),
      handler: 'index.handler',
      role: new LambdaAtEdgeRole(this, 'Role'),
      memorySize: 512,
      timeout: cdk.Duration.seconds(30),
    });

    const cachePolicy = new cloudfront.CachePolicy(this, 'CachePolicy', {
      queryStringBehavior: cloudfront.CacheQueryStringBehavior.all(),
      headerBehavior: cloudfront.CacheHeaderBehavior.none(),
      defaultTtl: cdk.Duration.seconds(0),
      maxTtl: cdk.Duration.days(365),
      minTtl: cdk.Duration.seconds(0),
      enableAcceptEncodingBrotli: true,
      enableAcceptEncodingGzip: true,
    });

    this.behaviorOptions = {
      origin,
      cachePolicy,
      edgeLambdas: [
        {
          includeBody: true,
          eventType: cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
          functionVersion: apiLambda.currentVersion,
        },
      ],
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
      cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
      compress: true,
    };
  }

  addAdditionalBehaviors(additionalBehaviors: Record<string, cloudfront.BehaviorOptions>) {
    if (this.behaviorOptions) {
      additionalBehaviors['api/*'] = this.behaviorOptions;
    }
  }
}

