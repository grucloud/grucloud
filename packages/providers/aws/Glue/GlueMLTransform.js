const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep, isIn, pluck, when, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger, assignTags } = require("./GlueCommon");

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const assignArn = ({ config }) =>
  pipe([
    tap(({ Name }) => {
      assert(Name);
    }),
    assign({
      Arn: pipe([
        ({ Name }) =>
          `arn:aws:glue:${
            config.region
          }:${config.accountId()}:mlTransform/${Name}`,
      ]),
    }),
  ]);

const pickId = pipe([
  tap(({ TransformId }) => {
    assert(TransformId);
  }),
  pick(["TransformId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignArn({ config }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html
exports.GlueMLTransform = () => ({
  type: "MLTransform",
  package: "glue",
  client: "Glue",
  propertiesDefault: {},
  omitProperties: ["Arn", "Status", "CreatedOn", "LastModifiedOn"],
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
  dependencies: {
    iamRole: {
      type: "Role",
      group: "IAM",
      pathId: "Role",
      dependencyId: () => pipe([get("Role")]),
    },
    kmsKey: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) =>
        get("TransformEncryption.MlUserDataEncryption.KmsKeyId"),
    },
    tables: {
      type: "Table",
      group: "Glue",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("InputRecordTables"), pluck("TableName")]),
    },
  },
  ignoreErrorCodes: ["EntityNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#getMLTransform-property
  getById: {
    method: "getMLTransform",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#getMLTransforms-property
  getList: {
    method: "getMLTransforms",
    getParam: "Transforms",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#createMLTransform-property
  create: {
    method: "createMLTransform",
    pickCreated: ({ payload }) => pipe([identity]),
    isInstanceUp: pipe([get("Status"), isIn(["READY"])]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#updateMLTransform-property
  update: {
    method: "updateMLTransform",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#deleteMLTransform-property
  destroy: {
    method: "deleteMLTransform",
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
      tap((params) => {}),
      () => otherProps,
      defaultsDeep({
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
      }),
      when(
        () => iamRole,
        defaultsDeep({
          Role: getField(iamRole, "Arn"),
        })
      ),
      when(
        () => kmsKey,
        defaultsDeep({
          TransformEncryption: {
            MlUserDataEncryption: { KmsKeyId: getField(kmsKey, "Arn") },
          },
        })
      ),
    ])(),
});
