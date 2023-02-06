const assert = require("assert");
const { pipe, tap, get, pick, assign, map } = require("rubico");
const { defaultsDeep, callProp, when, identity, last } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./ComprehendCommon");

const buildArn = () =>
  pipe([
    get("EntityRecognizerArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ EntityRecognizerArn }) => {
    assert(EntityRecognizerArn);
  }),
  pick(["EntityRecognizerArn"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    assign({
      RecognizerName: pipe([
        get("EntityRecognizerArn"),
        callProp("split", "entity-recognizer/"),
        last,
      ]),
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Comprehend.html
exports.ComprehendEntityRecognizer = () => ({
  type: "EntityRecognizer",
  package: "comprehend",
  client: "Comprehend",
  propertiesDefault: {},
  omitProperties: [
    "EntityRecognizerArn",
    "Status",
    "Message",
    "SubmitTime",
    "EndTime",
    "TrainingStartTime",
    "TrainingEndTime",
    "SourceModelArn",
    "DataAccessRoleArn",
    "ModelKmsKeyId",
    "VolumeKmsKeyId",
    "ClientRequestToken",
    "VpcConfig",
  ],
  inferName: () =>
    pipe([
      get("RecognizerName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("RecognizerName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("EntityRecognizerArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    kmsKeyModel: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) => get("ModelKmsKeyId"),
    },
    kmsKeyOutputData: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) => get("OutputDataConfig.KmsKeyId"),
    },
    kmsKeyVolume: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) => get("VolumeKmsKeyId"),
    },
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => get("VpcConfig.Subnets"),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => get("VpcConfig.SecurityGroupIds"),
    },
    iamRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => pipe([get("DataAccessRoleArn")]),
    },
    s3BucketAnnotation: {
      type: "Bucket",
      group: "S3",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("InputDataConfig.Annotations.S3Uri"),
          callProp("replace", "s3://", ""),
          lives.getByName({
            type: "Bucket",
            group: "S3",
            providerName: config.providerName,
          }),
          get("id"),
        ]),
    },
    s3BucketDocument: {
      type: "Bucket",
      group: "S3",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("InputDataConfig.Documents.S3Uri"),
          callProp("replace", "s3://", ""),
          lives.getByName({
            type: "Bucket",
            group: "S3",
            providerName: config.providerName,
          }),
          get("id"),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Comprehend.html#getEntityRecognizer-property
  getById: {
    method: "describeEntityRecognizer",
    getField: "EntityRecognizerProperties",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Comprehend.html#listEntityRecognizers-property
  getList: {
    method: "listEntityRecognizers",
    getParam: "EntityRecognizerPropertiesList",
    decorate: ({ getById }) => pipe([getById]),
  },

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Comprehend.html#createEntityRecognizer-property
  create: {
    method: "createEntityRecognizer",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Comprehend.html#updateEntityRecognizer-property
  update: {
    method: "updateEntityRecognizer",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Comprehend.html#deleteEntityRecognizer-property
  destroy: {
    method: "deleteEntityRecognizer",
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
      kmsKeyModel,
      kmsKeyOutputData,
      kmsKeyVolume,
      subnets,
      securityGroups,
    },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(iamRole);
      }),
      () => otherProps,
      defaultsDeep({
        DataAccessRoleArn: getField(iamRole, "Arn"),
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
      when(
        () => kmsKeyModel,
        defaultsDeep({
          ModelKmsKeyId: getField(kmsKeyModel, "Arn"),
        })
      ),
      when(
        () => kmsKeyOutputData,
        defaultsDeep({
          OutputDataConfig: { KmsKeyId: getField(kmsKeyOutputData, "Arn") },
        })
      ),
      when(
        () => kmsKeyVolume,
        defaultsDeep({
          VolumeKmsKeyId: getField(kmsKeyVolume, "Arn"),
        })
      ),
      when(
        () => subnets,
        defaultsDeep({
          VpcConfig: {
            Subnets: pipe([
              () => subnets,
              map((subnet) => getField(subnet, "SubnetId")),
            ])(),
          },
        })
      ),
      when(
        () => securityGroups,
        defaultsDeep({
          VpcConfig: {
            SecurityGroupIds: pipe([
              () => securityGroups,
              map((securityGroup) => getField(securityGroup, "GroupId")),
            ])(),
          },
        })
      ),
    ])(),
});
