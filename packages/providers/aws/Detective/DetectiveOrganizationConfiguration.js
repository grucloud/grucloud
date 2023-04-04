const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  pick(["GraphArn"]),
  tap(({ GraphArn }) => {
    assert(GraphArn);
  }),
]);

const decorate = ({ endpoint, config, live }) =>
  pipe([
    tap((params) => {
      assert(live.GraphArn);
    }),
    defaultsDeep({ GraphArn: live.GraphArn }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Detective.html
exports.DetectiveOrganizationConfiguration = () => ({
  type: "OrganizationConfiguration",
  package: "detective",
  client: "Detective",
  propertiesDefault: {},
  omitProperties: ["GraphArn"],
  inferName: () => pipe([() => "default"]),
  findName: () => pipe([() => "default"]),
  findId: () =>
    pipe([
      get("GraphArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  cannotBeDeleted: () => () => true,
  managedByOther: () => () => true,
  ignoreErrorCodes: ["ResourceNotFoundException", "AccessDeniedException"],
  dependencies: {
    graph: {
      type: "Graph",
      group: "Detective",
      parent: true,
      dependencyId: () =>
        pipe([
          get("GraphArn"),
          tap((GraphArn) => {
            assert(GraphArn);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Detective.html#describeOrganizationConfiguration-property
  getById: {
    method: "describeOrganizationConfiguration",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Detective.html#describeOrganizationConfiguration-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Graph", group: "Detective" },
          pickKey: pipe([
            pick(["GraphArn"]),
            tap(({ GraphArn }) => {
              assert(GraphArn);
            }),
          ]),
          method: "describeOrganizationConfiguration",
          config,
          decorate: ({ live }) =>
            pipe([decorate({ endpoint, config, live: parent })]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Detective.html#updateOrganizationConfiguration-property
  create: {
    method: "updateOrganizationConfiguration",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Detective.html#updateOrganizationConfiguration-property
  update: {
    method: "updateOrganizationConfiguration",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Detective.html#deleteOrganizationConfiguration-property
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { graph },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(graph);
      }),
      () => otherProps,
      defaultsDeep({
        GraphArn: getField(graph, "GraphArn"),
      }),
    ])(),
});
