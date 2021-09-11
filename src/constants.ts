import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';

export const NEXTJS_LAMBDA_RUNTIME = lambda.Runtime.NODEJS_12_X;
export const BUILD_SERVERLESS_NEXTJS_SCRIPT = path.join(__dirname, '..', 'bin', 'build-serverless-nextjs.js');

export const DEFAULT_LAMBDA_SUBPATH = 'default-lambda';
export const IMAGE_LAMBDA_SUBPATH = 'image-lambda';
export const API_LAMBDA_SUBPATH = 'api-lambda';
export const REGENERATION_LAMBDA_SUBPATH = 'regeneration-lambda';
export const ASSETS_SUBPATH = 'assets';
