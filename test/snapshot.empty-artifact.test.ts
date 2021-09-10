import { SynthUtils } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { SnapshotEmptyArtifact } from './snapshot.empty-artifact';

test('snapshot', () => {
  const app = new cdk.App();
  const stack = new SnapshotEmptyArtifact(app, 'Snapshot');
  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});