const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  tryCatch,
  flatMap,
  map,
  assign,
} = require("rubico");
const { defaultsDeep, isEmpty, filterOut } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const { buildTags } = require("../AwsCommon");
const {
  Tagger,
  assignTags,
  dependenciesRuleGroup,
  filterLiveRuleGroup,
} = require("./WAFV2Common");

const findId = () =>
  pipe([
    get("ARN"),
    tap((id) => {
      assert(id);
    }),
  ]);

const buildArn = () =>
  pipe([
    get("ARN"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ Id, LockToken, Name, Scope }) => {
    assert(Id);
    //assert(LockToken);
    assert(Name);
    assert(Scope);
  }),
  pick(["Id", "LockToken", "Name", "Scope"]),
]);

const decorate = ({ endpoint, config, live }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
      assert(live.LockToken);
      assert(live.Scope);
    }),
    assignTags({ endpoint, findId }),
    defaultsDeep({ LockToken: live.LockToken, Scope: live.Scope }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html
exports.WAFV2RuleGroup = () => ({
  type: "RuleGroup",
  package: "wafv2",
  client: "WAFV2",
  propertiesDefault: {},
  omitProperties: [
    "ARN",
    "Id",
    "LockToken",
    "ConsumedLabels",
    "LabelNamespace",
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
  findId,
  ignoreErrorCodes: ["WAFNonexistentItemException"],
  dependencies: dependenciesRuleGroup,
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        Rules: pipe([
          get("Rules"),
          map(
            assign({
              Statement: pipe([
                get("Statement"),
                filterLiveRuleGroup({ providerConfig, lives }),
              ]),
            })
          ),
        ]),
      }),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html#getRuleGroup-property
  getById: {
    method: "getRuleGroup",
    getField: "RuleGroup",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html#listRuleGroups-property
  getList: ({ endpoint, getById }) =>
    pipe([
      () => ["CLOUDFRONT", "REGIONAL"],
      flatMap((Scope) =>
        tryCatch(
          pipe([
            () => ({ Scope }),
            endpoint().listRuleGroups,
            get("RuleGroups"),
            map(pipe([defaultsDeep({ Scope }), getById({})])),
          ]),
          (error) =>
            pipe([
              tap((params) => {
                assert(error);
              }),
              () => undefined,
            ])()
        )()
      ),
      filterOut(isEmpty),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html#createRuleGroup-property
  create: {
    method: "createRuleGroup",
    pickCreated: ({ payload }) => pipe([get("Summary"), defaultsDeep(payload)]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html#updateRuleGroup-property
  update: {
    method: "updateRuleGroup",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html#deleteRuleGroup-property
  destroy: {
    method: "deleteRuleGroup",
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
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
    ])(),
});
