const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep, isIn, when, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./KendraCommon");

const assignArn = ({ config }) =>
  pipe([
    tap(({ Id }) => {
      assert(Id);
    }),
    assign({
      Arn: pipe([
        ({ Id }) =>
          `arn:${config.partition}:kendra:${
            config.region
          }:${config.accountId()}:index/${Id}`,
      ]),
    }),
  ]);

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ Id }) => {
    assert(Id);
  }),
  pick(["Id"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignArn({ config }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kendra.html
exports.KendraIndex = () => ({
  type: "Index",
  package: "kendra",
  client: "Kendra",
  propertiesDefault: {},
  omitProperties: [
    "Arn",
    "Id",
    "Status",
    "CreatedAt",
    "UpdatedAt",
    "Search",
    "IndexStatistics",
    "ErrorMessage",
    "DocumentMetadataConfigurations",
    "RoleArn",
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
      get("Id"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    iamRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => pipe([get("RoleArn")]),
    },
    kmsKey: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) =>
        get("ServerSideEncryptionConfiguration.KmsKeyId"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kendra.html#describeIndex-property
  getById: {
    method: "describeIndex",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kendra.html#listIndices-property
  getList: {
    method: "listIndices",
    getParam: "IndexConfigurationSummaryItems",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kendra.html#createIndex-property
  create: {
    method: "createIndex",
    pickCreated: ({ payload }) => pipe([identity]),
    isInstanceUp: pipe([get("Status"), isIn(["ACTIVE"])]),
    isInstanceError: pipe([get("Status"), isIn(["FAILED"])]),
    getErrorMessage: pipe([get("ErrorMessage", "FAILED")]),
    configIsUp: { retryCount: 60 * 12, retryDelay: 5e3 },
    shouldRetryOnExceptionMessages: [
      "Please make sure your role exists and has `kendra.amazonaws.com` as trusted entity",
    ],
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kendra.html#updateIndex-property
  update: {
    method: "updateIndex",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kendra.html#deleteIndex-property
  destroy: {
    method: "deleteIndex",
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
    dependencies: { iamRole, kmsKey },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(iamRole);
      }),
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
        RoleArn: getField(iamRole, "Arn"),
      }),
      when(
        () => kmsKey,
        defaultsDeep({
          ServerSideEncryptionConfiguration: {
            KmsKey: getField(kmsKey, "Arn"),
          },
        })
      ),
    ])(),
});
