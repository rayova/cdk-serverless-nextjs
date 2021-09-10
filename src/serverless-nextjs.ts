import * as path from 'path';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as fs from 'fs-extra';
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
  private readonly imageLambda?: ImageLambda;
  private readonly incrementalStaticRegeneration?: IncrementalStaticRegeneration;

  constructor(scope: cdk.Construct, id: string, props: ServerlessNextjsProps) {
    super(scope, id);

    this.buildOutputDir = props.nextjsArtifact._bind().buildOutputDir;

    this.bucket = new s3.Bucket(this, 'Bucket');

    new AssetsDeployment(this, 'AssetsDeployment', {
      bucket: this.bucket,
      assetsDir: path.join(this.buildOutputDir, 'assets'),
    });

    this.bucketAssets = new StaticAssets(this, 'BucketAssets', {
      originBucket: this.bucket,
    });

    const imageLambdaPath = this.getOutputPath('image-lambda');
    if (imageLambdaPath) {
      this.imageLambda = new ImageLambda(this, 'ImageLambda', {
        originBucket: this.bucket,
        imageLambdaPath,
      });
    }

    const regenerationLambdaPath = this.getOutputPath('regeneration-lambda');
    if (regenerationLambdaPath) {
      this.incrementalStaticRegeneration = new IncrementalStaticRegeneration(
        this,
        'IncrementalStaticRegeneration',
        {
          originBucket: this.bucket,
          regenerationLambdaPath,
        },
      );
    }

    this.defaultLambda = new DefaultLambda(this, 'Default', {
      bucket: this.bucket,
      incrementalStatusGeneration: this.incrementalStaticRegeneration,
      defaultLambdaDir: path.join(this.buildOutputDir, 'default-lambda'),
    });
  }

  private getOutputPath(outputPath: string) {
    const fullOutputPath = path.join(this.buildOutputDir, outputPath);
    return fs.existsSync(fullOutputPath) ? fullOutputPath : undefined;
  }

  get cloudFrontConfig(): ServerlessNextjsCloudFrontConfig {
    const additionalBehaviors: Record<string, cloudfront.BehaviorOptions> = {};

    if (this.imageLambda) {
      additionalBehaviors['_next/image*'] = this.imageLambda.cdnBehaviorOptions;
    }

    additionalBehaviors['_next/*'] = this.bucketAssets.cdnBehaviorOptions;
    additionalBehaviors['static/*'] = this.bucketAssets.cdnBehaviorOptions;

    return {
      defaultBehavior: this.defaultLambda.cdnBehaviorOptions,
      additionalBehaviors,
    };
  }
}
