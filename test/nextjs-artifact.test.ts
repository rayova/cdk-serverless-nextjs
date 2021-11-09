import * as path from 'path';
import * as fs from 'fs-extra';
import { NextjsArtifact } from '../src';
import { createNextjsExample } from './create-nextjs-example';

it('generates the lambda bundle', () => {
  // Create a Next.js project from an example.
  const nextjsDirectory = createNextjsExample('blog-starter');

  const artifact = NextjsArtifact.fromBuild({
    nextjsDirectory,
    buildCommand: ['yarn', 'next', 'build'],
  });

  // WHEN
  const { buildOutputDir } = artifact._bind();

  // THEN
  expect(fs.existsSync(path.join(buildOutputDir, 'default-lambda'))).toBe(true);
  expect(fs.existsSync(path.join(buildOutputDir, 'image-lambda'))).toBe(true);
  expect(fs.existsSync(path.join(buildOutputDir, 'regeneration-lambda'))).toBe(true);
  expect(fs.existsSync(path.join(buildOutputDir, 'api-lambda'))).toBe(true);
  expect(fs.existsSync(path.join(buildOutputDir, 'assets'))).toBe(true);
});