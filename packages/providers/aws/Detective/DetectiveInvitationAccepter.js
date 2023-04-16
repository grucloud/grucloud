const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep, find, isEmpty, unless } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ GraphArn }) => {
    assert(GraphArn);
  }),
  pick(["GraphArn"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Detective.html
exports.DetectiveInvitationAccepter = () => ({
  type: "InvitationAccepter",
  package: "detective",
  client: "Detective",
  propertiesDefault: {},
  omitProperties: [],
  inferName: () =>
    pipe([
      get("EmailAddress"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("EmailAddress"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("GraphArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  filterLive: () => pipe([pick([])]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    graph: {
      type: "Graph",
      group: "Detective",
      dependencyId: () =>
        pipe([
          get("GraphArn"),
          tap((GraphArn) => {
            assert(GraphArn);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Detective.html#listInvitations-property
  getById: {
    method: "listInvitations",
    pickId,
    decorate: ({ live, config, endpoint }) =>
      pipe([
        tap((params) => {
          assert(live.GraphArn);
        }),
        get("Invitations"),
        find(eq(get("GraphArn"), live.GraphArn)),
        unless(isEmpty, decorate({ config, endpoint })),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Detective.html#listInvitations-property
  getList: {
    method: "listInvitations",
    getParam: "Invitations",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Detective.html#acceptInvitation-property
  create: {
    method: "acceptInvitation",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Detective.html#disassociateMembership-property
  destroy: {
    method: "disassociateMembership",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { graph },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(graph);
      }),
      () => otherProps,
      defaultsDeep({
        GraphArn: getField(graph, "GraphArn"),
      }),
    ])(),
});
