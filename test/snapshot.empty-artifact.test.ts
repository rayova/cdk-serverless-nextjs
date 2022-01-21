import * as cdk from 'aws-cdk-lib';
import * as assertions from 'aws-cdk-lib/assertions';
import { SnapshotEmptyArtifact } from './snapshot.empty-artifact';

test('snapshot', () => {
  const app = new cdk.App();
  const stack = new SnapshotEmptyArtifact(app, 'Snapshot');

  expect(assertions.Template.fromStack(stack).toJSON()).toMatchSnapshot();
});