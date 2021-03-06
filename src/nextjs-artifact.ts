import * as os from 'os';
import * as path from 'path';
import * as execa from 'execa';
import * as fs from 'fs-extra';
import { ASSET_DEPLOYMENT_CONFIGS } from './assets-deployment';
import {
  API_LAMBDA_SUBPATH,
  BUILD_SERVERLESS_NEXTJS_SCRIPT,
  DEFAULT_LAMBDA_SUBPATH,
  IMAGE_LAMBDA_SUBPATH,
  REGENERATION_LAMBDA_SUBPATH,
} from './constants';

export abstract class NextjsArtifact {
  /** Build a NextjsArtifact from your project directory */
  static fromBuild(options: NextjsArtifactFromBuildOptions): NextjsArtifact {
    return new FromBuild(options);
  }

  /** @internal */
  static _emptyArtifact(): NextjsArtifact {
    return new EmptyArtifact();
  }

  /** @internal */
  abstract _bind(): ServerlessNextjsArtifactConfig;
}

/** @internal */
interface ServerlessNextjsArtifactConfig {
  readonly buildOutputDir: string;
}

export interface NextjsArtifactFromBuildOptions {
  /** The directory containing the Next.js project. */
  readonly nextjsDirectory: string;

  /**
   * The command to build nextjs's .next directory.
   *
   * i.e., ['yarn', 'build'] or ['yarn', 'next', 'build']
   */
  readonly buildCommand: string[];
}

class FromBuild extends NextjsArtifact {
  private readonly nextjsDirectory: string;
  private readonly buildCommand: string[];

  constructor(options: NextjsArtifactFromBuildOptions) {
    super();

    this.nextjsDirectory = options.nextjsDirectory;
    this.buildCommand = options.buildCommand;
  }

  _bind(): ServerlessNextjsArtifactConfig {
    execa.sync('node', [
      BUILD_SERVERLESS_NEXTJS_SCRIPT,
      this.nextjsDirectory,
      ...this.buildCommand,
    ]);

    const outputDir = path.normalize(path.join(this.nextjsDirectory, '.serverless_nextjs'));

    // Insert a custom handler that provides extra context for the Next.js app.
    const indirectHandler = 'index-indirect.js';
    const indirectHandlerSrc = path.join(__dirname, '..', 'functions', indirectHandler);
    fs.copyFileSync(indirectHandlerSrc, path.join(outputDir, DEFAULT_LAMBDA_SUBPATH, indirectHandler));
    fs.copyFileSync(indirectHandlerSrc, path.join(outputDir, API_LAMBDA_SUBPATH, indirectHandler));

    return {
      buildOutputDir: outputDir,
    };
  }
}

/** Create a stable NextjsArtifact suitable for snapshot tests */
class EmptyArtifact extends NextjsArtifact {
  _bind(): ServerlessNextjsArtifactConfig {
    const buildOutputDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nextjsartifact'));

    const lambdas = [
      API_LAMBDA_SUBPATH,
      DEFAULT_LAMBDA_SUBPATH,
      IMAGE_LAMBDA_SUBPATH,
      REGENERATION_LAMBDA_SUBPATH,
    ];

    for (const lambda of lambdas) {
      fs.mkdirSync(path.join(buildOutputDir, lambda));
      fs.writeFileSync(path.join(buildOutputDir, lambda, 'index.js'), 'some handler code');
    }

    const assetsDir = path.join(buildOutputDir, 'assets');
    for (const asset of ASSET_DEPLOYMENT_CONFIGS) {
      const assetDeploymentPath = path.join(assetsDir, asset.assetPath);
      fs.mkdirSync(assetDeploymentPath, { recursive: true });
      fs.writeFileSync(path.join(assetDeploymentPath, 'file.txt'), 'asset content');
    }

    return {
      buildOutputDir: buildOutputDir,
    };
  }
}
