import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { Construct } from 'constructs';
import * as fs from 'fs-extra';
import { NextjsArtifact, ServerlessNextjs } from '../src';
import { createNextjsExample } from './create-nextjs-example';

export interface IntegMainLitProps extends cdk.StackProps {
  readonly nextjsDirectory: string;
}

export class IntegMainLit extends cdk.Stack {
  constructor(scope_: Construct, props: IntegMainLitProps) {
    super(scope_, 'cdk-serverless-nextjs-integ-main', props);

    const scope = this;
    const pathToYourProjectDirectory = props.nextjsDirectory;

    // ::SNIP
    // Create a ServerlessNextjs construct in your stack to get started.
    // Your stack MUST be in us-east-1 as that's the only region in which AWS
    // supports deploying edge lambdas.
    const serverlessNextjs = new ServerlessNextjs(scope, 'NextJs', {
      // Then produce and add a Next.js artifact to ServerlessNextjs by
      // building it from your project directory.
      nextjsArtifact: NextjsArtifact.fromBuild({
        // Provide your Next.js project directory.
        nextjsDirectory: pathToYourProjectDirectory,

        // Provide the commands you need NextjsArtifact to run to build the
        // `.next` directory.
        buildCommand: ['yarn', 'next', 'build'],
      }),
    });

    // Create CloudFront distribution
    const dist = new cloudfront.Distribution(scope, 'Distribution', {
      // And configure it with serverless Next.js as Lambda @ Edge
      ...serverlessNextjs.cloudFrontConfig,

      // Add anything else you need on your CloudFront distribution here, like
      // certificates, cnames, price classes, logging, etc.
    });
    // ::END-SNIP

    new cdk.CfnOutput(scope, 'Url', {
      value: cdk.Fn.join('', [
        'https://',
        dist.distributionDomainName,
        '/',
      ]),
    });
  }
}

if (require.main === module) {
  // Create a Next.js project from an example.
  const nextjsDirectory = createNextjsExample('blog-starter');
  // Copy a page in that has revalidation to test ISR.
  fs.copyFileSync(path.join(__dirname, 'nextjs-test-files', 'time.js'), path.join(nextjsDirectory, 'pages', 'time.js'));

  const apiDir = path.join(nextjsDirectory, 'pages', 'api');
  fs.mkdirSync(apiDir, { recursive: true });
  fs.copyFileSync(path.join(__dirname, 'nextjs-test-files', 'api.js'), path.join(apiDir, 'api.js'));

  const app = new cdk.App();
  new IntegMainLit(app, {
    nextjsDirectory,
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: 'us-east-1',
    },
  });
}
