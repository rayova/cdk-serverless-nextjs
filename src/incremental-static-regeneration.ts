import * as lambda from '@aws-cdk/aws-lambda';
import * as lambda_es from '@aws-cdk/aws-lambda-event-sources';
import * as s3 from '@aws-cdk/aws-s3';
import * as sqs from '@aws-cdk/aws-sqs';
import * as cdk from '@aws-cdk/core';
import { NEXTJS_LAMBDA_RUNTIME } from './constants';
import { LambdaAtEdgeRole } from './lambda-at-edge-role';

export interface ISRRegenerationProps {
  /** Origin bucket */
  readonly originBucket: s3.IBucket;
  /** Path to the regeneration lambda bundle */
  readonly regenerationLambdaPath: string;
}

/** Creates a queue-driven incremental static regeneration lambda. */
export class IncrementalStaticRegeneration extends cdk.Construct {
  /** The queue that drives regeneration */
  public readonly regenerationQueue: sqs.Queue;
  /** The regeneration function */
  public readonly regenerationFunction: lambda.Function;

  constructor(scope: cdk.Construct, id: string, props: ISRRegenerationProps) {
    super(scope, id);

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
      code: lambda.Code.fromAsset(props.regenerationLambdaPath),
      events: [new lambda_es.SqsEventSource(this.regenerationQueue)],
    });
    props.originBucket.grantReadWrite(this.regenerationFunction);
  }
}
