const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ Name }) => {
    assert(Name);
  }),
  pick(["Name"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html
exports.GlueSecurityConfiguration = () => ({
  type: "SecurityConfiguration",
  package: "glue",
  client: "Glue",
  propertiesDefault: {},
  omitProperties: ["CreatedTimeStamp"],
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
  ignoreErrorCodes: ["EntityNotFoundException"],
  dependencies: {
    kmsKeyCloudWatch: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) =>
        get("EncryptionConfiguration.CloudWatchEncryption.KmsKeyArn"),
    },
    kmsKeyJobBookmark: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) =>
        get("EncryptionConfiguration.JobBookmarksEncryption.KmsKeyArn"),
    },
    kmsKeyS3: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) =>
        get("EncryptionConfiguration.S3Encryption.KmsKeyArn"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#getSecurityConfiguration-property
  getById: {
    method: "getSecurityConfiguration",
    getField: "SecurityConfiguration",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#getSecurityConfigurations-property
  getList: {
    method: "getSecurityConfigurations",
    getParam: "SecurityConfigurations",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#createSecurityConfiguration-property
  create: {
    method: "createSecurityConfiguration",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#updateSecurityConfiguration-property
  // TODO no update
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#deleteSecurityConfiguration-property
  destroy: {
    method: "deleteSecurityConfiguration",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { kmsKeyCloudWatch, kmsKeyJobBookmark, kmsKeyS3 },
    config,
  }) =>
    pipe([
      () => otherProps,
      when(
        () => kmsKeyCloudWatch,
        defaultsDeep({
          EncryptionConfiguration: {
            CloudWatchEncryption: {
              KmsKeyArn: getField(kmsKeyCloudWatch, "Arn"),
            },
          },
        })
      ),
      when(
        () => kmsKeyJobBookmark,
        defaultsDeep({
          EncryptionConfiguration: {
            JobBookmarksEncryption: {
              KmsKeyArn: getField(kmsKeyJobBookmark, "Arn"),
            },
          },
        })
      ),
      when(
        () => kmsKeyS3,
        defaultsDeep({
          EncryptionConfiguration: {
            S3Encryption: {
              KmsKeyArn: getField(kmsKeyS3, "Arn"),
            },
          },
        })
      ),
    ])(),
});
