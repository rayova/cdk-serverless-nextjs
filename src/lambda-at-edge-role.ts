import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class LambdaAtEdgeRole extends iam.Role {
  constructor(scope: Construct, id: string) {
    super(scope, id, {
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal('lambda.amazonaws.com'),
        new iam.ServicePrincipal('edgelambda.amazonaws.com'),
      ),
      managedPolicies: [AWS_LAMBDA_BASIC_EXECUTION_ROLE_POLICY],
    });
  }
}

const AWS_LAMBDA_BASIC_EXECUTION_ROLE_POLICY =
  iam.ManagedPolicy.fromAwsManagedPolicyName(
    'service-role/AWSLambdaBasicExecutionRole',
  );
