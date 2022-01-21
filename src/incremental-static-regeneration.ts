import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambda_es from 'aws-cdk-lib/aws-lambda-event-sources';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import { NEXTJS_LAMBDA_RUNTIME, REGENERATION_LAMBDA_SUBPATH } from './constants';
import { hasManifest } from './has-manifest';
import { LambdaAtEdgeRole } from './lambda-at-edge-role';

export interface IncrementalStaticRegenerationProps {
  /** Origin bucket */
  readonly originBucket: s3.IBucket;
  /** Path to the regeneration lambda bundle */
  readonly buildOutputDir: string;
}

/** Creates a queue-driven incremental static regeneration lambda. */
export class IncrementalStaticRegeneration extends Construct {
  /** The queue that drives regeneration */
  public readonly regenerationQueue?: sqs.Queue;
  /** The regeneration function */
  public readonly regenerationFunction?: lambda.Function;

  constructor(scope: Construct, id: string, props: IncrementalStaticRegenerationProps) {
    super(scope, id);

    const lambdaPath = path.join(props.buildOutputDir, REGENERATION_LAMBDA_SUBPATH);
    if (!hasManifest(lambdaPath)) return;

    this.regenerationQueue = new sqs.Queue(this, 'Queue', {
      // Lambda@Edge does not support environment variables, but the associated
      // DefaultLambda handler still needs to find this queue. So, as a
      // work-around, DefaultLambda uses the origin bucket name as a convention
      // to locate other resources, including this queue.
      queueName: `${props.originBucket.bucketName}.fifo`,
      fifo: true,
    });

    this.regenerationFunction = new lambda.Function(this, 'Function', {
      runtime: NEXTJS_LAMBDA_RUNTIME,
      handler: 'index.handler',
      timeout: cdk.Duration.seconds(30),
      role: new LambdaAtEdgeRole(this, 'Role'),
      code: lambda.Code.fromAsset(lambdaPath),
      events: [new lambda_es.SqsEventSource(this.regenerationQueue)],
    });
    props.originBucket.grantReadWrite(this.regenerationFunction);
  }
}
