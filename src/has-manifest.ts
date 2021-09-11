import * as path from 'path';
import * as fs from 'fs-extra';

export function hasManifest(lambdaPath: string) {
  return fs.existsSync(path.join(lambdaPath, 'manifest.json'));
}