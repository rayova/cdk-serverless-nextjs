const path = require('path');
const fs = require('fs-extra');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { Builder } = require('@sls-next/lambda-at-edge');

const argv = yargs(hideBin(process.argv)).argv;
const positional = Array.from(argv._);

const nextConfigDir = positional.shift();
const outputDir = argv.output || path.join(nextConfigDir, '.serverless_nextjs');

const cmd = positional.shift();
const cmdArgs = positional;

if (!fs.existsSync(nextConfigDir)) {
  throw new Error(`The next directory ${nextConfigDir} does not exist`);
}

console.log(`Building contents of ${nextConfigDir} into ${outputDir} using ${cmd} ${cmdArgs.join(' ')}`);
const builder = new Builder(nextConfigDir, outputDir, {
  cwd: nextConfigDir,
  cmd: cmd,
  args: cmdArgs,
});

builder.build()
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
