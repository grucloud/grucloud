const assert = require("assert");
const { pipe, tap, get, pick, eq, assign, map } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger } = require("./SyntheticsCommon");

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ Name }) => {
    assert(Name);
  }),
  pick(["Name"]),
]);

const assignArn = ({ config }) =>
  pipe([
    tap((params) => {
      assert(config.region);
    }),
    assign({
      arn: pipe([
        tap(({ Name }) => {
          assert(Name);
        }),
        ({ Name }) => `arn:aws:apigateway:${config.region}::/canary/${Name}`,
      ]),
    }),
  ]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignArn({ config }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Synthetics.html
exports.SyntheticsCanary = () => ({
  type: "Canary",
  package: "synthetics",
  client: "Synthetics",
  propertiesDefault: {},
  omitProperties: [
    "Arn",
    "Id",
    "ExecutionRoleArn",
    "Status",
    "Timeline",
    "EngineArn",
    "VpcConfig",
    "VisualReference",
    "Code.SourceLocationArn",
  ],
  inferName: () =>
    pipe([
      get("Name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("Name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("Name"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    iamRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("ExecutionRoleArn"),
          tap((ExecutionRoleArn) => {
            assert(ExecutionRoleArn);
          }),
        ]),
    },
    kmsKey: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) =>
        get("ArtifactConfig.S3Encryption.KmsKeyArn"),
    },
    lambdaFunction: {
      type: "Function",
      group: "Lambda",
      dependencyId: ({ lives, config }) => get("EngineArn"),
    },
    lambdaLayer: {
      type: "Layer",
      group: "Lambda",
      dependencyId: ({ lives, config }) => get("Code.SourceLocationArn"),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => get("VpcConfig.SecurityGroupIds"),
    },
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => get("VpcConfig.SubnetIds"),
    },
    s3BucketArtifact: {
      type: "Bucket",
      group: "S3",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("ArtifactS3Location"),
          tap((ArtifactS3Location) => {
            assert(ArtifactS3Location);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Synthetics.html#getCanary-property
  getById: {
    method: "getCanary",
    getField: "Canary",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Synthetics.html#describeCanaries-property
  getList: {
    method: "describeCanaries",
    getParam: "Canaries",
    // decorate: ({ getById }) => pipe([getById]),
    decorate,
  },

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Synthetics.html#createCanary-property
  create: {
    method: "createCanary",
    pickCreated: ({ payload }) => pipe([get("Canary")]),
    isInstanceUp: eq(get("Status.State"), "READY"),
    isInstanceError: eq(get("Status.State"), "ERROR"),
    getErrorMessage: get("Status.StateReason", "failed"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Synthetics.html#updateCanary-property
  update: {
    method: "updateCanary",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Synthetics.html#deleteCanary-property
  destroy: {
    method: "deleteCanary",
    pickId,
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {
      iamRole,
      kmsKey,
      lambdaFunction,
      lambdaLayer,
      securityGroups,
      subnets,
    },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
      }),
      when(
        () => iamRole,
        defaultsDeep({
          ExecutionRoleArn: getField(iamRole, "Arn"),
        })
      ),
      when(
        () => kmsKey,
        defaultsDeep({
          configuration: {
            ArtifactConfig: {
              S3Encryption: { KmsKeyArn: getField(kmsKey, "Arn") },
            },
          },
        })
      ),
      when(
        () => lambdaFunction,
        defaultsDeep({
          Code: {
            ZipFile: Buffer.from(getField(lambdaFunction, "Code.Data")),
          },
        })
      ),
      //   when(
      //     () => lambdaLayer,
      //     defaultsDeep({
      //       Code: {
      //         SourceLocationArn: getField(lambdaLayer, "LayerVersionArn"),
      //       },
      //     })
      //   ),
      //Code SourceLocationArn
      when(
        () => securityGroups,
        defaultsDeep({
          VpcConfig: {
            SecurityGroupIds: pipe([
              () => securityGroups,
              map((sg) => getField(sg, "GroupId")),
            ])(),
          },
        })
      ),
      when(
        () => subnets,
        defaultsDeep({
          VpcConfig: {
            SubnetIds: pipe([
              () => subnets,
              map((subnet) => getField(subnet, "SubnetId")),
            ])(),
          },
        })
      ),
    ])(),
});
