import * as path from 'path';
import * as execa from 'execa';
import * as fs from 'fs-extra';

export function createNextjsExample(example: string) {
  const subdir = `tmp-${example}`;
  const baseDir = path.normalize(path.join(__dirname, '..'));
  const buildDir = path.join(baseDir, subdir);

  if (!fs.existsSync(buildDir)) {
    execa.sync('npx', ['create-next-app', '--example', example, subdir], {
      cwd: baseDir,
    });
  }

  execa.sync('yarn', ['install'], {
    cwd: buildDir,
  });

  const nextBuildDir = path.join(buildDir, '.next');
  if (fs.existsSync(nextBuildDir)) {
    fs.rmdirSync(nextBuildDir, { recursive: true });
  }

  const slsNextBuildDir = path.join(buildDir, '.serverless_nextjs');
  if (fs.existsSync(slsNextBuildDir)) {
    fs.rmdirSync(slsNextBuildDir, { recursive: true });
  }

  return buildDir;
}