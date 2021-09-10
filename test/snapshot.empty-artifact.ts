import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as cdk from '@aws-cdk/core';
import { NextjsArtifact, ServerlessNextjs } from '../src';

export class SnapshotEmptyArtifact extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: cdk.StackProps = {}) {
    super(scope, id, props);

    const serverlessNextjs = new ServerlessNextjs(this, 'ServerlessNextJs', {
      nextjsArtifact: NextjsArtifact._emptyArtifact(),
    });

    new cloudfront.Distribution(this, 'Distribution', {
      ...serverlessNextjs.cloudFrontConfig,
    });

  }
}