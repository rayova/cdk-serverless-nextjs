import * as fs from 'fs';
import * as path from 'path';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3_deployment from '@aws-cdk/aws-s3-deployment';
import * as cdk from '@aws-cdk/core';

export interface AssetsDeploymentProps {
  /** Bucket to deploy the assets to */
  readonly bucket: s3.Bucket;
  /** The directory containing the assets */
  readonly assetsDir: string;
}

/** Deploys Next.js assets */
export class AssetsDeployment extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props: AssetsDeploymentProps) {
    super(scope, id);

    for (const config of ASSET_DEPLOYMENT_CONFIGS) {
      const assetPath = path.join(props.assetsDir, config.assetPath);
      if (!fs.existsSync(assetPath)) continue;

      new s3_deployment.BucketDeployment(this, `Deploy_${config.assetPath}`, {
        destinationBucket: props.bucket,
        destinationKeyPrefix: config.assetPath,
        sources: [s3_deployment.Source.asset(assetPath)],
        cacheControl: [config.cacheControl],
        prune: true,
      });
    }
  }
}

export interface AssetDeploymentConfig {
  /** Subdirectory of assets and destination key prefix */
  readonly assetPath: string;
  /** Cache headers */
  readonly cacheControl: s3_deployment.CacheControl;
}

const CACHE_CONTROL_PUBLIC = s3_deployment.CacheControl.fromString(
  'public, max-age=31536000, must-revalidate',
);
const CACHE_CONTROL_SERVER = s3_deployment.CacheControl.fromString(
  'public, max-age=0, s-maxage=2678400, must-revalidate',
);
const CACHE_CONTROL_IMMUTABLE = s3_deployment.CacheControl.fromString(
  'public, max-age=31536000, immutable',
);

export const ASSET_DEPLOYMENT_CONFIGS: AssetDeploymentConfig[] = [
  { assetPath: 'public', cacheControl: CACHE_CONTROL_PUBLIC },
  { assetPath: 'static', cacheControl: CACHE_CONTROL_PUBLIC },
  { assetPath: 'static-pages', cacheControl: CACHE_CONTROL_SERVER },
  { assetPath: '_next/data', cacheControl: CACHE_CONTROL_SERVER },
  { assetPath: '_next/static', cacheControl: CACHE_CONTROL_IMMUTABLE },
];
