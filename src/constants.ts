import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';

export const NEXTJS_LAMBDA_RUNTIME = lambda.Runtime.NODEJS_12_X;
export const BUILD_SERVERLESS_NEXTJS_SCRIPT = path.join(__dirname, '..', 'bin', 'build-serverless-nextjs.js');