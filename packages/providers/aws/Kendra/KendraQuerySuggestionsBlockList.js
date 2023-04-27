const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep, isIn, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./KendraCommon");

const assignArn = ({ config }) =>
  pipe([
    tap(({ IndexId, Id }) => {
      assert(IndexId);
      assert(Id);
    }),
    assign({
      Arn: pipe([
        ({ IndexId, Id }) =>
          `arn:aws:kendra:${
            config.region
          }:${config.accountId()}:index/${IndexId}/query-suggestions-block-list/${Id}`,
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
  tap(({ Id, IndexId }) => {
    assert(Id);
    assert(IndexId);
  }),
  pick(["Id", "IndexId"]),
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
exports.KendraQuerySuggestionsBlockList = () => ({
  type: "QuerySuggestionsBlockList",
  package: "kendra",
  client: "Kendra",
  propertiesDefault: {},
  omitProperties: [
    "Arn",
    "Id",
    "IndexId",
    "Status",
    "CreatedAt",
    "UpdatedAt",
    "RoleArn",
    "ItemCount",
    "FileSizeBytes",
    "ErrorMessage",
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
    index: {
      type: "Index",
      group: "Kendra",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("IndexId"),
          tap((IndexId) => {
            assert(IndexId);
          }),
        ]),
    },
    iamRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("RoleArn"),
          tap((RoleArn) => {
            assert(RoleArn);
          }),
        ]),
    },
    s3Bucket: {
      type: "Bucket",
      group: "S3",
      dependencyId: ({ lives, config }) => pipe([get("SourceS3Path.Bucket")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kendra.html#getQuerySuggestionsBlockList-property
  getById: {
    method: "describeQuerySuggestionsBlockList",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kendra.html#listQuerySuggestionsBlockLists-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Index", group: "Kendra" },
          pickKey: pipe([
            tap(({ Id }) => {
              assert(Id);
            }),
            ({ Id }) => ({ IndexId: Id }),
          ]),
          method: "listQuerySuggestionsBlockLists",
          getParam: "BlockListSummaryItems",
          config,
          decorate: ({ parent }) =>
            pipe([
              tap(({ Id }) => {
                assert(parent.Id);
                assert(Id);
              }),
              defaultsDeep({ IndexId: parent.Id }),
              getById({}),
              tap((params) => {
                assert(true);
              }),
            ]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kendra.html#createQuerySuggestionsBlockList-property
  create: {
    method: "createQuerySuggestionsBlockList",
    pickCreated: ({ payload }) => pipe([identity, defaultsDeep(payload)]),
    isInstanceUp: pipe([get("Status"), isIn(["ACTIVE"])]),
    isInstanceError: pipe([get("Status"), isIn(["FAILED"])]),
    getErrorMessage: pipe([get("ErrorMessage", "FAILED")]),
    // "Couldn't access the source file in the specified S3 bucket. The IAM role used to access the file doesn't have access. Update the IAM role policy to grant Amazon Kendra access to the file and try the request again."
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kendra.html#updateQuerySuggestionsBlockList-property
  update: {
    method: "updateQuerySuggestionsBlockList",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kendra.html#deleteQuerySuggestionsBlockList-property
  destroy: {
    method: "deleteQuerySuggestionsBlockList",
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
    dependencies: { iamRole, index },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(index);
        assert(iamRole);
      }),
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
        IndexId: getField(index, "Id"),
        RoleArn: getField(iamRole, "Arn"),
      }),
    ])(),
});
