const assert = require("assert");
const { pipe, tap, get } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const { ignoreErrorCodes } = require("./Macie2Common");

const pickId = pipe([() => ({})]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

const findName = () => () => "default";

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Macie2.html
exports.Macie2ClassificationExportConfiguration = () => ({
  type: "ClassificationExportConfiguration",
  package: "macie2",
  client: "Macie2",
  propertiesDefault: {},
  omitProperties: ["id", "arn", "createdAt"],
  inferName: findName,
  findName,
  findId: findName,
  ignoreErrorCodes,
  dependencies: {
    account: {
      type: "Account",
      group: "Macie2",
      dependencyId: ({ lives, config }) => pipe([() => "default"]),
    },
    kmsKey: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) =>
        get("configuration.s3Destination.kmsKeyArn"),
    },
    s3Bucket: {
      type: "Bucket",
      group: "S3",
      dependencyId: ({ lives, config }) =>
        get("configuration.s3Destination.bucketName"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Macie2.html#getClassificationExportConfiguration-property
  getById: {
    method: "getClassificationExportConfiguration",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Macie2.html#getClassificationExportConfiguration-property
  getList: {
    method: "getClassificationExportConfiguration",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Macie2.html#putClassificationExportConfiguration-property
  create: {
    method: "putClassificationExportConfiguration",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Macie2.html#putClassificationExportConfiguration-property
  update: {
    method: "putClassificationExportConfiguration",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Macie2.html#putClassificationExportConfiguration-property
  destroy: {
    method: "putClassificationExportConfiguration",
    pickId: pipe([() => ({ configuration: {} })]),
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { kmsKey },
    config,
  }) =>
    pipe([
      () => otherProps, //
      defaultsDeep({}),
      when(
        () => kmsKey,
        defaultsDeep({
          configuration: {
            s3Destination: { kmsKeyArn: getField(kmsKey, "Arn") },
          },
        })
      ),
    ])(),
});
