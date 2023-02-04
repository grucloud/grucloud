const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { ignoreErrorCodes } = require("./AthenaCommon");
const ignoreErrorMessages = ["was not found"];

const pickId = pipe([
  tap(({ NamedQueryId }) => {
    assert(NamedQueryId);
  }),
  pick(["NamedQueryId"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Athena.html
exports.AthenaNamedQuery = ({ compare }) => ({
  type: "NamedQuery",
  package: "athena",
  client: "Athena",
  propertiesDefault: {},
  omitProperties: ["NamedQueryId", "WorkGroup"],
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
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { workgroup },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({}),
      when(
        () => workgroup,
        defaultsDeep({ WorkGroup: getField(workgroup, "Name") })
      ),
    ])(),
  ignoreErrorCodes,
  ignoreErrorMessages,
  dependencies: {
    workgroup: {
      type: "Workgroup",
      group: "Athena",
      parent: true,
      dependencyId: () => pipe([get("WorkGroup")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Athena.html#getNamedQuery-property
  getById: {
    method: "getNamedQuery",
    getField: "NamedQuery",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Athena.html#listNamedQueries-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Workgroup", group: "Athena" },
          pickKey: pipe([
            pick(["WorkGroup"]),
            tap(({ WorkGroup }) => {
              assert(WorkGroup);
            }),
          ]),
          method: "listNamedQueries",
          getParam: "NamedQueryIds",
          config,
          decorate: () =>
            pipe([(NamedQueryId) => ({ NamedQueryId }), getById({})]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Athena.html#createNamedQuery-property
  create: {
    method: "createNamedQuery",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Athena.html#updateNamedQuery-property
  update: {
    method: "updateNamedQuery",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Athena.html#deleteNamedQuery-property
  destroy: {
    method: "deleteNamedQuery",
    pickId,
    ignoreErrorMessages,
  },
});
