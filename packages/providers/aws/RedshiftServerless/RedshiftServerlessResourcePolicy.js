const assert = require("assert");
const { pipe, tap, get, pick, assign, omit } = require("rubico");
const { defaultsDeep, prepend, first } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const {
  assignPolicyAccountAndRegion,
  sortStatements,
} = require("../IAM/IAMCommon");

const pickId = pipe([
  tap(({ resourceArn }) => {
    assert(resourceArn);
  }),
  pick(["resourceArn"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assign({
      policy: pipe([
        get("policy"),
        JSON.parse,
        sortStatements,
        assign({
          Statement: pipe([
            get("Statement"),
            omit(["Resource"]),
            (Statement) => [Statement],
          ]),
        }),
      ]),
    }),
  ]);

const filterPayload = pipe([
  assign({ policy: pipe([get("policy"), JSON.stringify]) }),
  tap((params) => {
    assert(true);
  }),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RedshiftServerless.html
exports.RedshiftServerlessResourcePolicy = () => ({
  type: "ResourcePolicy",
  package: "redshift-serverless",
  client: "RedshiftServerless",
  propertiesDefault: {},
  omitProperties: ["resourceArn"],
  inferName: ({ dependenciesSpec: { snapshot } }) =>
    pipe([
      tap((params) => {
        assert(snapshot);
      }),
      () => snapshot,
    ]),
  findName: ({ lives, config }) =>
    pipe([
      get("resourceArn"),
      tap((params) => {
        assert(true);
      }),
      lives.getById({
        type: "Snapshot",
        group: "RedshiftServerless",
        providerName: config.providerName,
      }),
      get("name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () => pipe([get("resourceArn"), prepend("policy::")]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      assign({
        policy: pipe([
          get("policy"),
          tap((params) => {
            assert(true);
          }),
          assignPolicyAccountAndRegion({ providerConfig, lives }),
        ]),
      }),
    ]),
  dependencies: {
    accounts: {
      type: "Account",
      group: "Organisations",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("policy.Statement"),
          first,
          get("Principal.AWS"),
          tap((ids) => {
            assert(ids);
          }),
        ]),
    },
    snapshot: {
      type: "Snapshot",
      group: "RedshiftServerless",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("resourceArn"),
          tap((id) => {
            assert(id);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RedshiftServerless.html#batchGetRumMetricDefinitions-property
  getById: {
    method: "getResourcePolicy",
    getField: "resourcePolicy",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RedshiftServerless.html#listRumResourcePolicys-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Snapshot", group: "RedshiftServerless" },
          pickKey: pipe([
            tap(({ snapshotArn }) => {
              assert(snapshotArn);
            }),
            ({ snapshotArn }) => ({ resourceArn: snapshotArn }),
          ]),
          method: "getResourcePolicy",
          getParam: "resourcePolicy",
          config,
          decorate,
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RedshiftServerless.html#putRumResourcePolicy-property
  create: {
    filterPayload,
    method: "putResourcePolicy",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RedshiftServerless.html#putRumResourcePolicy-property
  update: {
    method: "putResourcePolicy",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, filterPayload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RedshiftServerless.html#deleteRumResourcePolicy-property
  destroy: {
    method: "deleteResourcePolicy",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { snapshot },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(snapshot);
      }),
      () => otherProps,
      defaultsDeep({ resourceArn: getField(snapshot, "snapshotArn") }),
    ])(),
});
