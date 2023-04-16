const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep, isIn } = require("rubico/x");

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
          }:${config.accountId()}:index/${IndexId}/thesaurus/${Id}`,
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
exports.KendraThesaurus = () => ({
  type: "Thesaurus",
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
    "FileSizeBytes",
    "TermCount",
    "SynonymRuleCount",
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
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kendra.html#getThesaurus-property
  getById: {
    method: "describeThesaurus",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kendra.html#listThesauruss-property
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
          method: "listThesauri",
          getParam: "ThesaurusSummaryItems",
          config,
          decorate: ({ parent }) =>
            pipe([
              tap(({ Id }) => {
                assert(Id);
                assert(parent.Id);
              }),
              defaultsDeep({ IndexId: parent.Id }),
              getById({}),
            ]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kendra.html#createThesaurus-property
  create: {
    method: "createThesaurus",
    pickCreated: ({ payload }) => pipe([identity, defaultsDeep(payload)]),
    isInstanceUp: pipe([get("Status"), isIn(["ACTIVE"])]),
    isInstanceError: pipe([get("Status"), isIn(["FAILED"])]),
    getErrorMessage: pipe([get("ErrorMessage", "FAILED")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kendra.html#updateThesaurus-property
  update: {
    method: "updateThesaurus",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kendra.html#deleteThesaurus-property
  destroy: {
    method: "deleteThesaurus",
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
