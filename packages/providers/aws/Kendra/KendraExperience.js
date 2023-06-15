const assert = require("assert");
const { pipe, tap, get, pick, assign, map } = require("rubico");
const { defaultsDeep, isIn, when, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const assignArn = ({ config }) =>
  pipe([
    tap(({ IndexId, Id }) => {
      assert(IndexId);
      assert(Id);
    }),
    assign({
      Arn: pipe([
        ({ IndexId, Id }) =>
          `arn:${config.partition}:kendra:${
            config.region
          }:${config.accountId()}:index/${IndexId}/experience/${Id}`,
      ]),
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
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kendra.html
exports.KendraExperience = () => ({
  type: "Experience",
  package: "kendra",
  client: "Kendra",
  propertiesDefault: {},
  omitProperties: [
    "Arn",
    "Id",
    "IndexId",
    "RoleArn",
    "Status",
    "UpdatedAt",
    "CreatedAt",
    "ErrorMessage",
    "Endpoints",
    "Configuration.ContentSourceConfiguration.DataSourceIds",
    "Configuration.ContentSourceConfiguration.FaqIds",
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
    dataSources: {
      type: "DataSource",
      group: "Kendra",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("Configuration.ContentSourceConfiguration.DataSourceIds")]),
    },
    faqs: {
      type: "Faq",
      group: "Kendra",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("Configuration.ContentSourceConfiguration.FaqIds")]),
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
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kendra.html#getExperience-property
  getById: {
    method: "describeExperience",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kendra.html#listExperiences-property
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
          method: "listExperiences",
          getParam: "SummaryItems",
          config,
          decorate: ({ parent }) =>
            pipe([
              tap(({ Id }) => {
                assert(parent.Id);
                assert(Id);
              }),
              defaultsDeep({ IndexId: parent.Id }),
              getById({}),
            ]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kendra.html#createExperience-property
  create: {
    method: "createExperience",
    pickCreated: ({ payload }) => pipe([identity, defaultsDeep(payload)]),
    isInstanceUp: pipe([get("Status"), isIn(["ACTIVE"])]),
    isInstanceError: pipe([get("Status"), isIn(["FAILED"])]),
    getErrorMessage: pipe([get("ErrorMessage", "FAILED")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kendra.html#updateExperience-property
  update: {
    method: "updateExperience",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kendra.html#deleteExperience-property
  destroy: {
    method: "deleteExperience",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { dataSources, faqs, iamRole, index },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(index);
        assert(iamRole);
      }),
      () => otherProps,
      defaultsDeep({
        IndexId: getField(index, "Id"),
        RoleArn: getField(iamRole, "Arn"),
      }),
      when(
        () => dataSources,
        defaultsDeep({
          Configuration: {
            ContentSourceConfiguration: {
              DataSourceIds: pipe([
                () => dataSources,
                map((dataSource) => getField(dataSource, "Id")),
              ])(),
            },
          },
        })
      ),
      when(
        () => faqs,
        defaultsDeep({
          Configuration: {
            ContentSourceConfiguration: {
              FaqIds: pipe([() => faqs, map((faq) => getField(faq, "Id"))])(),
            },
          },
        })
      ),
    ])(),
});
