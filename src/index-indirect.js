const index = require('./index');

exports.handler = handler;

/**
 * A lambda handler that injects contextual information about the CloudFront
 * event into the environment variables, then hands the request off to the
 * `@sls-next/lambda-at-edge` handler.
 */
async function handler(event, context) {
  const request = event.Records[0].cf.request;
  process.env.CDK_SERVERLESS_NEXTJS_ORIGIN_REGION = s3RegionFromRequest(request);
  process.env.CDK_SERVERLESS_NEXTJS_ORIGIN_BUCKET = s3BucketNameFromRequest(request);

  return await index.handler(event, context);
}

function s3RegionFromRequest(request) {
  return request && request.origin && request.origin.s3 && request.origin.s3.region
    ? request.origin.s3.region
    : '';
}

function s3OriginFromRequest(request) {
  return request && request.origin && request.origin.s3
    ? request.origin.s3
    : {};
}

function s3BucketNameFromRequest(request) {
  const s3 = s3OriginFromRequest(request);

  const region = s3.region;
  const domainName = s3.domainName || '';

  return !!region && domainName.includes(region)
    ? domainName.replace(`.s3.${region}.amazonaws.com`, '')
    : domainName.replace(`.s3.amazonaws.com`, '');
}