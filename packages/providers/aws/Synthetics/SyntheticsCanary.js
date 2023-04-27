const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  eq,
  assign,
  map,
  tryCatch,
  set,
  omit,
} = require("rubico");
const {
  defaultsDeep,
  when,
  prepend,
  callProp,
  first,
  isIn,
  find,
} = require("rubico/x");
const path = require("path");

const AdmZip = require("adm-zip");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");
const { createZipBuffer } = require("../Lambda/LambdaCommon");

const { Tagger } = require("./SyntheticsCommon");
const { replaceAccountAndRegion } = require("../AwsCommon");

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const assignArn = ({ config }) =>
  pipe([
    assign({
      Arn: pipe([
        tap(({ Name }) => {
          assert({ Name });
        }),
        ({ Name }) =>
          `arn:aws:synthetics:${
            config.region
          }:${config.accountId()}:canary:${Name}`,
      ]),
    }),
  ]);

const pickId = pipe([
  tap(({ Name }) => {
    assert(Name);
  }),
  pick(["Name"]),
]);

const decorate = ({ endpoint, lives, config }) =>
  pipe([
    tap((params) => {
      assert(config);
    }),
    assignArn({ config }),
    assign({
      ArtifactS3Location: pipe([get("ArtifactS3Location"), prepend("s3://")]),
    }),
    when(
      get("EngineArn"),
      set("Code.Data", ({ EngineArn }) =>
        pipe([
          tap(() => {
            assert(EngineArn);
          }),
          lives.getByType({
            type: "Function",
            group: "Lambda",
            providerName: config.providerName,
          }),
          find(pipe([get("live.Configuration.FunctionArn"), isIn(EngineArn)])),
          get("live.Code.Data"),
          tap((Data) => {
            // assert(Data);
          }),
        ])()
      )
    ),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Synthetics.html
exports.SyntheticsCanary = () => ({
  type: "Canary",
  package: "synthetics",
  client: "Synthetics",
  displayResource: () => pipe([omit(["Code.ZipFile", "Code.Data"])]),
  propertiesDefault: {},
  omitProperties: [
    "Arn",
    "Id",
    "ExecutionRoleArn",
    "Status",
    "Timeline",
    "EngineArn",
    "Code.SourceLocationArn",
    "Code.ZipFile",
    "Code.Data",
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
      get("Arn"),
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
      parent: true,
      // dependencyId:
      //   ({ lives, config }) =>
      //   ({ EngineArn }) =>
      //     pipe([
      //       tap((params) => {
      //         assert(EngineArn);
      //       }),
      //       lives.getByType({
      //         type: "Function",
      //         group: "Lambda",
      //         providerName: config.providerName,
      //       }),
      //       find(
      //         pipe([get("live.Configuration.FunctionArn"), isIn(EngineArn)])
      //       ),
      //       get("id"),
      //     ])(),
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
          callProp("replace", "s3://", ""),
          callProp("split", "/"),
          first,
          tap((ArtifactS3Location) => {
            assert(ArtifactS3Location);
          }),
        ]),
    },
  },
  filterLive: ({ lives, providerConfig, programOptions }) =>
    pipe([
      tap((params) => {
        assert(programOptions);
      }),
      assign({
        ArtifactS3Location: pipe([
          get("ArtifactS3Location"),
          replaceAccountAndRegion({ lives, providerConfig }),
        ]),
      }),
      tap(({ Code, Name }) =>
        pipe([
          () => new AdmZip(Buffer.from(Code.Data, "base64")),
          (zip) =>
            zip.extractAllTo(
              path.resolve(programOptions.workingDirectory, Name),
              true
            ),
        ])()
      ),
    ]),
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
    decorate: ({ getById }) => pipe([getById]),
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
    preDestroy: ({ endpoint }) =>
      tap(pipe([pickId, tryCatch(endpoint().stopCanary, () => undefined)])),
    method: "deleteCanary",
    pickId,
    shouldRetryOnExceptionMessages: [
      "Canary is in a state that can't be deleted",
    ],
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
    dependencies: { iamRole, kmsKey, securityGroups, subnets },
    config,
    programOptions,
  }) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      () => ({
        localPath: path.resolve(programOptions.workingDirectory, name),
      }),
      createZipBuffer,
      (ZipFile) =>
        pipe([
          () => otherProps,
          defaultsDeep({
            Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
            Code: { ZipFile },
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
    ])(),
});
