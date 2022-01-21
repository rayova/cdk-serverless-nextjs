const { awscdk } = require('projen');

const cdkDependencies = [
  '@aws-cdk/aws-s3',
  '@aws-cdk/aws-s3-deployment',
  '@aws-cdk/aws-cloudfront',
  '@aws-cdk/aws-cloudfront-origins',
  '@aws-cdk/aws-iam',
  '@aws-cdk/aws-lambda',
  '@aws-cdk/aws-lambda-event-sources',
  '@aws-cdk/aws-sqs',
  '@aws-cdk/core',
];
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Josh Kellendonk',
  authorAddress: 'josh@rayova.com',
  cdkVersion: '1.95.2',
  defaultReleaseBranch: 'main',
  name: '@rayova/cdk-serverless-nextjs',
  repositoryUrl: 'https://github.com/rayova/cdk-serverless-nextjs.git',
  description: 'Deploy Serverless Next.js on Lambda @ Edge with the AWS CDK',

  keywords: [
    'cdk',
    'lambda',
    'cloudfront',
    'next',
    'nextjs',
    'serverless',
    'ssr',
    'isr',
    'react',
  ],

  releaseEveryCommit: true,
  releaseToNpm: true,

  depsUpgradeOptions: {
    ignoreProjen: false,
  },

  autoApproveUpgrades: true,
  autoApproveOptions: {
    allowedUsernames: ['rayova-bot'],
  },

  workflowNodeVersion: '14',

  cdkDependenciesAsDeps: false,
  cdkDependencies: cdkDependencies, // Created as peer deps
  cdkTestDependencies: cdkDependencies, // Duplicate into dev deps

  bundledDeps: [
    'fs-extra',
    'execa',
    'yargs',
    '@sls-next/lambda-at-edge',
  ],

  devDeps: [
    'aws-cdk',
    '@types/fs-extra',
    'ts-node',
    'markmac@^0.1',
    'shx',
    '@wheatstalk/lit-snip@^0.0',
  ],

  tsconfig: {
    exclude: [
      'cdk.out',
      'test/pages',
      'test/tmp-*',
    ],
  },

  // cdkDependencies: undefined,        /* Which AWS CDK modules (those that start with "@aws-cdk/") does this library require when consumed? */
  // cdkTestDependencies: undefined,    /* AWS CDK modules required for testing. */
  // deps: [],                          /* Runtime dependencies of this module. */
  // description: undefined,            /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],                       /* Build dependencies for this module. */
  // packageName: undefined,            /* The "name" in package.json. */
  // projectType: ProjectType.UNKNOWN,  /* Which type of project this is (library/app). */
  // release: undefined,                /* Add release management to this project. */
});

project.package.setScript('integ:main', 'cdk --app "ts-node -P tsconfig.jest.json test/integ.main.lit.ts"');

const ignores = [
  '/.idea',
  '/cdk.out',
  'tmp-*',
];

for (const ignore of ignores) {
  project.addGitIgnore(ignore);
  project.addPackageIgnore(ignore);
}

const macros = project.addTask('readme-macros');
macros.exec('shx mv README.md README.md.bak');
macros.exec('shx cat README.md.bak | markmac > README.md');
macros.exec('shx rm README.md.bak');
project.postCompileTask.spawn(macros);

project.synth();