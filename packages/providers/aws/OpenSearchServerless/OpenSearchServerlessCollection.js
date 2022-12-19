const assert = require("assert");
const { pipe, tap, get, eq, pick, map } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { getByNameCore } = require("@grucloud/core/Common");

const { buildTags } = require("../AwsCommon");

const { Tagger } = require("./OpenSearchServerlessCommon");

const buildArn = () =>
  pipe([
    get("arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ id }) => {
    assert(id);
  }),
  pick(["id"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearchServerless.html
exports.OpenSearchServerlessCollection = ({ compare }) => ({
  type: "Collection",
  package: "opensearchserverless",
  client: "OpenSearchServerless",
  propertiesDefault: {},
  omitProperties: [
    "id",
    "arn",
    "status",
    "lastModifiedDate",
    "kmsKeyArn",
    "createdDate",
    "collectionEndpoint",
    "dashboardEndpoint",
  ],
  inferName: () => pipe([get("name")]),
  findName: () => pipe([get("name")]),
  findId: () =>
    pipe([
      get("id"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {},
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    kmsKey: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) => get("kmsKeyArn"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearchServerless.html#batchGetCollection-property
  getById: {
    method: "batchGetCollection",
    getField: "collectionDetails",
    pickId: pipe([
      tap(({ id }) => {
        assert(id);
      }),
      ({ id }) => ({ ids: [id] }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearchServerless.html#listCollections-property
  getList: {
    method: "listCollections",
    getParam: "collectionSummaries",
    decorate,
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearchServerless.html#createCollection-property
  create: {
    method: "createCollection",
    pickCreated: ({ payload }) => pipe([get("createCollectionDetail")]),
    isInstanceUp: pipe([eq(get("status"), "ACTIVE")]),
    isInstanceError: pipe([eq(get("status"), "FAILED")]),
    getErrorMessage: get("collectionErrorDetails", "errorMessage"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearchServerless.html#updateCollection-property
  update: {
    method: "updateCollection",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearchServerless.html#deleteCollection-property
  destroy: {
    method: "deleteCollection",
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
    properties: { tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        tags: buildTags({
          name,
          config,
          namespace,
          UserTags: tags,
          key: "key",
          value: "value",
        }),
      }),
    ])(),
});
