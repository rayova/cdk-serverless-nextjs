const pj = require('projen');

const project = new pj.AwsCdkConstructLibrary({
  author: 'Josh Kellendonk',
  authorAddress: 'josh@rayova.com',
  cdkVersion: '1.95.2',
  defaultReleaseBranch: 'main',
  name: '@rayova/cdk-serverless-nextjs',
  repositoryUrl: 'https://github.com/rayova/cdk-serverless-nextjs.git',
  description: 'Deploy Serverless Next.js on Lambda @ Edge with the AWS CDK',

  keywords: [
    'cdk',
    'next',
    'lambda',
    'cloudfront',
    'serverless',
    'ssr',
    'isr',
    'react',
  ],

  releaseEveryCommit: false,
  releaseToNpm: true,
  npmAccess: pj.NpmAccess.PUBLIC,

  projenUpgradeSecret: 'BOT_GITHUB_TOKEN',
  autoApproveUpgrades: true,
  autoApproveOptions: {
    secret: 'GITHUB_TOKEN',
    allowedUsernames: ['github-actions', 'github-actions[bot]', 'rayova-bot'],
  },

  minNodeVersion: '12.13.0',

  cdkDependenciesAsDeps: false,
  cdkDependencies: [
    '@aws-cdk/aws-s3',
    '@aws-cdk/aws-s3-deployment',
    '@aws-cdk/aws-cloudfront',
    '@aws-cdk/aws-cloudfront-origins',
    '@aws-cdk/aws-iam',
    '@aws-cdk/aws-lambda',
    '@aws-cdk/aws-lambda-event-sources',
    '@aws-cdk/aws-sqs',
    '@aws-cdk/core',
  ],

  bundledDeps: [
    'fs-extra',
    'execa',
  ],

  devDeps: [
    '@sls-next/lambda-at-edge@latest',
    'aws-cdk',
    '@types/fs-extra',
    'ts-node',
    'yargs',
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
project.buildTask.spawn(macros);

project.synth();