import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { ApiLambda } from './api-lambda';
import { AssetsDeployment } from './assets-deployment';
import { DefaultLambda } from './default-lambda';
import { ImageLambda } from './image-lambda';
import { IncrementalStaticRegeneration } from './incremental-static-regeneration';
import { NextjsArtifact } from './nextjs-artifact';
import { StaticAssets } from './static-assets';

export interface ServerlessNextjsProps {
  /** The Next.js artifact */
  readonly nextjsArtifact: NextjsArtifact;
}

/** CloudFront configuration */
export interface ServerlessNextjsCloudFrontConfig {
  /** CDN default behavior */
  readonly defaultBehavior: cloudfront.BehaviorOptions;
  /** Additional behaviors */
  readonly additionalBehaviors: Record<string, cloudfront.BehaviorOptions>;
}

/**
 * Deploy Next.js as Lambda@Edge.
 * @see https://github.com/serverless-nextjs/serverless-next.js#architecture
 */
export class ServerlessNextjs extends cdk.Construct {
  private readonly buildOutputDir: string;
  private readonly bucket: s3.Bucket;
  private readonly defaultLambda: DefaultLambda;
  private readonly bucketAssets: StaticAssets;
  private readonly imageLambda: ImageLambda;
  private readonly incrementalStaticRegeneration?: IncrementalStaticRegeneration;
  private readonly apiLambda: ApiLambda;

  constructor(scope: cdk.Construct, id: string, props: ServerlessNextjsProps) {
    super(scope, id);

    this.buildOutputDir = props.nextjsArtifact._bind().buildOutputDir;

    this.bucket = new s3.Bucket(this, 'Bucket');
    new AssetsDeployment(this, 'AssetsDeployment', {
      bucket: this.bucket,
      buildOutputDir: this.buildOutputDir,
    });

    this.bucketAssets = new StaticAssets(this, 'BucketAssets', {
      originBucket: this.bucket,
    });

    this.imageLambda = new ImageLambda(this, 'ImageLambda', {
      originBucket: this.bucket,
      buildOutputDir: this.buildOutputDir,
    });

    this.incrementalStaticRegeneration = new IncrementalStaticRegeneration(this,
      'IncrementalStaticRegeneration',
      {
        originBucket: this.bucket,
        buildOutputDir: this.buildOutputDir,
      },
    );

    this.defaultLambda = new DefaultLambda(this, 'Default', {
      bucket: this.bucket,
      incrementalStaticRegeneration: this.incrementalStaticRegeneration,
      buildOutputDir: this.buildOutputDir,
    });

    this.apiLambda = new ApiLambda(this, 'Api', {
      bucket: this.bucket,
      buildOutputDir: this.buildOutputDir,
    });
  }

  get cloudFrontConfig(): ServerlessNextjsCloudFrontConfig {
    const additionalBehaviors: Record<string, cloudfront.BehaviorOptions> = {};

    this.imageLambda.addAdditionalBehaviors(additionalBehaviors);
    this.apiLambda.addAdditionalBehaviors(additionalBehaviors);

    additionalBehaviors['_next/*'] = this.bucketAssets.cdnBehaviorOptions;
    additionalBehaviors['static/*'] = this.bucketAssets.cdnBehaviorOptions;

    return {
      defaultBehavior: this.defaultLambda.cdnBehaviorOptions,
      additionalBehaviors,
    };
  }
}
