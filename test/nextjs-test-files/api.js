export default function handler(req, res) {
  res.status(200);
  res.setHeader('Cache-Control', 'no-cache');
  res.json({
      randomness: Math.random(),
      date: new Date().toISOString(),
      info: extractFunctionInfo(process.env.AWS_LAMBDA_FUNCTION_NAME),
      CDK_SERVERLESS_NEXTJS_ORIGIN_REGION: process.env.CDK_SERVERLESS_NEXTJS_ORIGIN_REGION || false,
      CDK_SERVERLESS_NEXTJS_ORIGIN_BUCKET: process.env.CDK_SERVERLESS_NEXTJS_ORIGIN_BUCKET || false,
    });
}

function extractFunctionInfo(name) {
  const [region, functionName] = name.split('.');
  return {
    region,
    functionName,
  };
}