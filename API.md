# API Reference <a name="API Reference"></a>

## Constructs <a name="Constructs"></a>

### ServerlessNextjs <a name="@rayova/cdk-serverless-nextjs.ServerlessNextjs"></a>

Deploy Next.js as Lambda@Edge.

> https://github.com/serverless-nextjs/serverless-next.js#architecture

#### Initializers <a name="@rayova/cdk-serverless-nextjs.ServerlessNextjs.Initializer"></a>

```typescript
import { ServerlessNextjs } from '@rayova/cdk-serverless-nextjs'

new ServerlessNextjs(scope: Construct, id: string, props: ServerlessNextjsProps)
```

##### `scope`<sup>Required</sup> <a name="@rayova/cdk-serverless-nextjs.ServerlessNextjs.parameter.scope"></a>

- *Type:* [`constructs.Construct`](#constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="@rayova/cdk-serverless-nextjs.ServerlessNextjs.parameter.id"></a>

- *Type:* `string`

---

##### `props`<sup>Required</sup> <a name="@rayova/cdk-serverless-nextjs.ServerlessNextjs.parameter.props"></a>

- *Type:* [`@rayova/cdk-serverless-nextjs.ServerlessNextjsProps`](#@rayova/cdk-serverless-nextjs.ServerlessNextjsProps)

---



#### Properties <a name="Properties"></a>

##### `cloudFrontConfig`<sup>Required</sup> <a name="@rayova/cdk-serverless-nextjs.ServerlessNextjs.property.cloudFrontConfig"></a>

```typescript
public readonly cloudFrontConfig: ServerlessNextjsCloudFrontConfig;
```

- *Type:* [`@rayova/cdk-serverless-nextjs.ServerlessNextjsCloudFrontConfig`](#@rayova/cdk-serverless-nextjs.ServerlessNextjsCloudFrontConfig)

---


## Structs <a name="Structs"></a>

### NextjsArtifactFromBuildOptions <a name="@rayova/cdk-serverless-nextjs.NextjsArtifactFromBuildOptions"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { NextjsArtifactFromBuildOptions } from '@rayova/cdk-serverless-nextjs'

const nextjsArtifactFromBuildOptions: NextjsArtifactFromBuildOptions = { ... }
```

##### `buildCommand`<sup>Required</sup> <a name="@rayova/cdk-serverless-nextjs.NextjsArtifactFromBuildOptions.property.buildCommand"></a>

```typescript
public readonly buildCommand: string[];
```

- *Type:* `string`[]

The command to build nextjs's .next directory.

i.e., ['yarn', 'build'] or ['yarn', 'next', 'build']

---

##### `nextjsDirectory`<sup>Required</sup> <a name="@rayova/cdk-serverless-nextjs.NextjsArtifactFromBuildOptions.property.nextjsDirectory"></a>

```typescript
public readonly nextjsDirectory: string;
```

- *Type:* `string`

The directory containing the Next.js project.

---

### ServerlessNextjsCloudFrontConfig <a name="@rayova/cdk-serverless-nextjs.ServerlessNextjsCloudFrontConfig"></a>

CloudFront configuration.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { ServerlessNextjsCloudFrontConfig } from '@rayova/cdk-serverless-nextjs'

const serverlessNextjsCloudFrontConfig: ServerlessNextjsCloudFrontConfig = { ... }
```

##### `additionalBehaviors`<sup>Required</sup> <a name="@rayova/cdk-serverless-nextjs.ServerlessNextjsCloudFrontConfig.property.additionalBehaviors"></a>

```typescript
public readonly additionalBehaviors: {[ key: string ]: BehaviorOptions};
```

- *Type:* {[ key: string ]: [`aws-cdk-lib.aws_cloudfront.BehaviorOptions`](#aws-cdk-lib.aws_cloudfront.BehaviorOptions)}

Additional behaviors.

---

##### `defaultBehavior`<sup>Required</sup> <a name="@rayova/cdk-serverless-nextjs.ServerlessNextjsCloudFrontConfig.property.defaultBehavior"></a>

```typescript
public readonly defaultBehavior: BehaviorOptions;
```

- *Type:* [`aws-cdk-lib.aws_cloudfront.BehaviorOptions`](#aws-cdk-lib.aws_cloudfront.BehaviorOptions)

CDN default behavior.

---

### ServerlessNextjsProps <a name="@rayova/cdk-serverless-nextjs.ServerlessNextjsProps"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { ServerlessNextjsProps } from '@rayova/cdk-serverless-nextjs'

const serverlessNextjsProps: ServerlessNextjsProps = { ... }
```

##### `nextjsArtifact`<sup>Required</sup> <a name="@rayova/cdk-serverless-nextjs.ServerlessNextjsProps.property.nextjsArtifact"></a>

```typescript
public readonly nextjsArtifact: NextjsArtifact;
```

- *Type:* [`@rayova/cdk-serverless-nextjs.NextjsArtifact`](#@rayova/cdk-serverless-nextjs.NextjsArtifact)

The Next.js artifact.

---

## Classes <a name="Classes"></a>

### NextjsArtifact <a name="@rayova/cdk-serverless-nextjs.NextjsArtifact"></a>

#### Initializers <a name="@rayova/cdk-serverless-nextjs.NextjsArtifact.Initializer"></a>

```typescript
import { NextjsArtifact } from '@rayova/cdk-serverless-nextjs'

new NextjsArtifact()
```


#### Static Functions <a name="Static Functions"></a>

##### `fromBuild` <a name="@rayova/cdk-serverless-nextjs.NextjsArtifact.fromBuild"></a>

```typescript
import { NextjsArtifact } from '@rayova/cdk-serverless-nextjs'

NextjsArtifact.fromBuild(options: NextjsArtifactFromBuildOptions)
```

###### `options`<sup>Required</sup> <a name="@rayova/cdk-serverless-nextjs.NextjsArtifact.parameter.options"></a>

- *Type:* [`@rayova/cdk-serverless-nextjs.NextjsArtifactFromBuildOptions`](#@rayova/cdk-serverless-nextjs.NextjsArtifactFromBuildOptions)

---




