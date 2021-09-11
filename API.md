# API Reference <a name="API Reference"></a>

## Constructs <a name="Constructs"></a>

### ApiLambda <a name="@rayova/cdk-serverless-nextjs.ApiLambda"></a>

#### Initializers <a name="@rayova/cdk-serverless-nextjs.ApiLambda.Initializer"></a>

```typescript
import { ApiLambda } from '@rayova/cdk-serverless-nextjs'

new ApiLambda(scope: Construct, id: string, props: ApiLambdaProps)
```

##### `scope`<sup>Required</sup> <a name="@rayova/cdk-serverless-nextjs.ApiLambda.parameter.scope"></a>

- *Type:* [`@aws-cdk/core.Construct`](#@aws-cdk/core.Construct)

---

##### `id`<sup>Required</sup> <a name="@rayova/cdk-serverless-nextjs.ApiLambda.parameter.id"></a>

- *Type:* `string`

---

##### `props`<sup>Required</sup> <a name="@rayova/cdk-serverless-nextjs.ApiLambda.parameter.props"></a>

- *Type:* [`@rayova/cdk-serverless-nextjs.ApiLambdaProps`](#@rayova/cdk-serverless-nextjs.ApiLambdaProps)

---



#### Properties <a name="Properties"></a>

##### `cdnBehaviorOptions`<sup>Required</sup> <a name="@rayova/cdk-serverless-nextjs.ApiLambda.property.cdnBehaviorOptions"></a>

- *Type:* [`@aws-cdk/aws-cloudfront.BehaviorOptions`](#@aws-cdk/aws-cloudfront.BehaviorOptions)

---


### ServerlessNextjs <a name="@rayova/cdk-serverless-nextjs.ServerlessNextjs"></a>

Deploy Next.js as Lambda@Edge.

> https://github.com/serverless-nextjs/serverless-next.js#architecture

#### Initializers <a name="@rayova/cdk-serverless-nextjs.ServerlessNextjs.Initializer"></a>

```typescript
import { ServerlessNextjs } from '@rayova/cdk-serverless-nextjs'

new ServerlessNextjs(scope: Construct, id: string, props: ServerlessNextjsProps)
```

##### `scope`<sup>Required</sup> <a name="@rayova/cdk-serverless-nextjs.ServerlessNextjs.parameter.scope"></a>

- *Type:* [`@aws-cdk/core.Construct`](#@aws-cdk/core.Construct)

---

##### `id`<sup>Required</sup> <a name="@rayova/cdk-serverless-nextjs.ServerlessNextjs.parameter.id"></a>

- *Type:* `string`

---

##### `props`<sup>Required</sup> <a name="@rayova/cdk-serverless-nextjs.ServerlessNextjs.parameter.props"></a>

- *Type:* [`@rayova/cdk-serverless-nextjs.ServerlessNextjsProps`](#@rayova/cdk-serverless-nextjs.ServerlessNextjsProps)

---



#### Properties <a name="Properties"></a>

##### `cloudFrontConfig`<sup>Required</sup> <a name="@rayova/cdk-serverless-nextjs.ServerlessNextjs.property.cloudFrontConfig"></a>

- *Type:* [`@rayova/cdk-serverless-nextjs.ServerlessNextjsCloudFrontConfig`](#@rayova/cdk-serverless-nextjs.ServerlessNextjsCloudFrontConfig)

---


## Structs <a name="Structs"></a>

### ApiLambdaProps <a name="@rayova/cdk-serverless-nextjs.ApiLambdaProps"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { ApiLambdaProps } from '@rayova/cdk-serverless-nextjs'

const apiLambdaProps: ApiLambdaProps = { ... }
```

##### `apiLambdaPath`<sup>Required</sup> <a name="@rayova/cdk-serverless-nextjs.ApiLambdaProps.property.apiLambdaPath"></a>

- *Type:* `string`

---

##### `bucket`<sup>Required</sup> <a name="@rayova/cdk-serverless-nextjs.ApiLambdaProps.property.bucket"></a>

- *Type:* [`@aws-cdk/aws-s3.IBucket`](#@aws-cdk/aws-s3.IBucket)

---

### NextjsArtifactFromBuildOptions <a name="@rayova/cdk-serverless-nextjs.NextjsArtifactFromBuildOptions"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { NextjsArtifactFromBuildOptions } from '@rayova/cdk-serverless-nextjs'

const nextjsArtifactFromBuildOptions: NextjsArtifactFromBuildOptions = { ... }
```

##### `buildCommand`<sup>Required</sup> <a name="@rayova/cdk-serverless-nextjs.NextjsArtifactFromBuildOptions.property.buildCommand"></a>

- *Type:* `string`[]

The command to build nextjs's .next directory.

i.e., ['yarn', 'build'] or ['yarn', 'next', 'build']

---

##### `nextjsDirectory`<sup>Required</sup> <a name="@rayova/cdk-serverless-nextjs.NextjsArtifactFromBuildOptions.property.nextjsDirectory"></a>

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

- *Type:* {[ key: string ]: [`@aws-cdk/aws-cloudfront.BehaviorOptions`](#@aws-cdk/aws-cloudfront.BehaviorOptions)}

Additional behaviors.

---

##### `defaultBehavior`<sup>Required</sup> <a name="@rayova/cdk-serverless-nextjs.ServerlessNextjsCloudFrontConfig.property.defaultBehavior"></a>

- *Type:* [`@aws-cdk/aws-cloudfront.BehaviorOptions`](#@aws-cdk/aws-cloudfront.BehaviorOptions)

CDN default behavior.

---

### ServerlessNextjsProps <a name="@rayova/cdk-serverless-nextjs.ServerlessNextjsProps"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { ServerlessNextjsProps } from '@rayova/cdk-serverless-nextjs'

const serverlessNextjsProps: ServerlessNextjsProps = { ... }
```

##### `nextjsArtifact`<sup>Required</sup> <a name="@rayova/cdk-serverless-nextjs.ServerlessNextjsProps.property.nextjsArtifact"></a>

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




