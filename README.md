![Rayova A Fintech Corporation][logo]

# CDK Serverless Next.js

A CDK construct to Deploy Serverless Next.js on Lambda @ Edge.

# Example Usage

<!-- <macro exec="lit-snip ./test/integ.main.lit.ts"> -->
```ts
// Create a ServerlessNextjs construct in your stack to get started.
// Your stack MUST be in us-east-1 as that's the only region in which AWS
// supports deploying edge lambdas.
const serverlessNextjs = new ServerlessNextjs(scope, 'NextJs', {
  // Then produce and add a Next.js artifact to ServerlessNextjs by
  // building it from your project directory.
  nextjsArtifact: NextjsArtifact.fromBuild({
    // Provide your Next.js project directory.
    nextjsDirectory: props.nextjsDirectory,

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
```
<!-- </macro> -->

[logo]: images/rayova-fintech-corp.png