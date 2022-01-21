import * as cdk from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { Construct } from 'constructs';
import { NextjsArtifact, ServerlessNextjs } from '../src';

export class SnapshotEmptyArtifact extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps = {}) {
    super(scope, id, props);

    const serverlessNextjs = new ServerlessNextjs(this, 'ServerlessNextJs', {
      nextjsArtifact: NextjsArtifact._emptyArtifact(),
    });

    new cloudfront.Distribution(this, 'Distribution', {
      ...serverlessNextjs.cloudFrontConfig,
    });
  }
}