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

  return buildDir;
}