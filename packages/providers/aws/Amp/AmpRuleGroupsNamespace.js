const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep, append, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger } = require("./AmpCommon");

const buildArn = () =>
  pipe([
    get("arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ name, workspaceId }) => {
    assert(name);
    assert(workspaceId);
  }),
  pick(["name", "workspaceId"]),
]);

// decorate
const decorate = ({ endpoint, live }) =>
  pipe([
    tap((params) => {
      assert(live.workspaceId);
    }),
    defaultsDeep({ workspaceId: live.workspaceId }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Amp.html
exports.AmpRuleGroupsNamespace = () => ({
  type: "RuleGroupsNamespace",
  package: "amp",
  client: "Amp",
  propertiesDefault: {},
  omitProperties: ["arn", "createdAt", "status", "modifiedAt", "workspaceId"],
  inferName:
    ({ dependenciesSpec: { workspace } }) =>
    ({ name }) =>
      pipe([
        tap((params) => {
          assert(workspace);
          assert(name);
        }),
        () => `${workspace}::${name}`,
      ])(),
  findName:
    ({ lives, config }) =>
    ({ name, workspaceId }) =>
      pipe([
        tap((params) => {
          assert(workspaceId);
        }),
        () => workspaceId,
        lives.getById({
          type: "Workspace",
          group: "Aps",
          providerName: config.providerName,
        }),
        get("name"),
        tap((name) => {
          assert(name);
        }),
        append(`::${name}`),
      ])(),
  findId: () =>
    pipe([
      get("arn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    workspace: {
      type: "Workspace",
      group: "Aps",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("workspaceId"),
          tap((workspaceId) => {
            assert(workspaceId);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Amp.html#describeRuleGroupsNamespace-property
  getById: {
    method: "describeRuleGroupsNamespace",
    getField: "ruleGroupsNamespace",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Amp.html#listRuleGroupsNamespaces-property
  getList: ({ client, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Workspace", group: "Aps" },
          pickKey: pipe([pickId]),
          method: "listRuleGroupsNamespaces",
          getParam: "ruleGroupsNamespaces",
          config,
          decorate: ({ endpoint, config, parent }) =>
            pipe([decorate({ endpoint, config, live: parent })]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Amp.html#createRuleGroupsNamespace-property
  create: {
    method: "createRuleGroupsNamespace",
    pickCreated: ({ payload }) => pipe([identity]),
    isInstanceUp: eq(get("status.statusCode"), "ACTIVE"),
    isInstanceError: eq(get("status.statusCode"), "CREATION_FAILED"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Amp.html#putRuleGroupsNamespace-property
  update: {
    method: "putRuleGroupsNamespace",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Amp.html#deleteRuleGroupsNamespace-property
  destroy: {
    method: "deleteRuleGroupsNamespace",
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
    dependencies: { workspace },
    config,
  }) =>
    pipe([
      () => otherProps,
      tap((params) => {
        assert(workspace);
      }),
      defaultsDeep({
        tags: buildTagsObject({ name, config, namespace, userTags: tags }),
        workspaceId: getField(workspace, "arn"),
      }),
    ])(),
});
