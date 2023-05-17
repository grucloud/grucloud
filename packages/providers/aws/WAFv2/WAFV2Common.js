const assert = require("assert");
const { pipe, tap, get, assign, pick, omit, map } = require("rubico");
const { defaultsDeep, pluck, when } = require("rubico/x");
const { omitIfEmpty } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");
const { replaceWithName } = require("@grucloud/core/Common");

const { getByNameCore } = require("@grucloud/core/Common");

const { createTagger } = require("../AwsTagger");

const filterDescription = omitIfEmpty(["Description"]);

const omitPropertiesWebACL = ["ARN", "Id", "LockToken", "LabelNamespace"];

const Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "ResourceARN",
  TagsKey: "Tags",
  UnTagsKey: "TagKeys",
});

exports.Tagger = Tagger;

const buildArn = () =>
  pipe([
    get("ARN"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html#listTagsForResource-property
const assignTags = ({ findId, endpoint }) =>
  pipe([
    assign({
      Tags: pipe([
        findId(),
        (ResourceARN) => ({ ResourceARN }),
        endpoint().listTagsForResource,
        get("TagInfoForResource.TagList"),
      ]),
    }),
  ]);

exports.assignTags = assignTags;

const findId = () => pipe([get("ARN")]);

const pickId = pick(["Id", "LockToken", "Name", "Scope"]);

const decorate =
  ({ Scope }) =>
  ({ endpoint }) =>
    pipe([assignTags({ endpoint, findId }), defaultsDeep({ Scope })]);

const dependenciesRuleGroup = {
  ipSets: {
    type: "IPSet",
    group: "WAFv2",
    list: true,
    optional: true,
    dependencyIds: ({ lives, config }) =>
      pipe([get("Rules"), pluck("Statement.IPSetReferenceStatement.ARN")]),
  },
  regexPatternSet: {
    type: "RegexPatternSet",
    group: "WAFv2",
    list: true,
    optional: true,
    dependencyIds: ({ lives, config }) =>
      pipe([
        get("Rules"),
        pluck("Statement.RegexPatternSetReferenceStatement.ARN"),
      ]),
  },
};

exports.dependenciesRuleGroup = dependenciesRuleGroup;

const filterLiveRuleGroup = ({ providerConfig, lives }) =>
  pipe([
    when(
      get("IPSetReferenceStatement"),
      assign({
        IPSetReferenceStatement: pipe([
          get("IPSetReferenceStatement"),
          assign({
            ARN: pipe([
              get("ARN"),
              replaceWithName({
                groupType: "WAFv2::IPSet",
                path: "id",
                providerConfig,
                lives,
              }),
            ]),
          }),
        ]),
      })
    ),
    when(
      get("RegexPatternSetReferenceStatement"),
      assign({
        RegexPatternSetReferenceStatement: pipe([
          get("RegexPatternSetReferenceStatement"),
          assign({
            ARN: pipe([
              get("ARN"),
              replaceWithName({
                groupType: "WAFv2::RegexPatternSet",
                path: "id",
                providerConfig,
                lives,
              }),
            ]),
          }),
        ]),
      })
    ),
  ]);

exports.filterLiveRuleGroup = filterLiveRuleGroup;

exports.createModelWebAcls = ({ compare, type, region, Scope }) => ({
  type,
  package: "wafv2",
  client: "WAFV2",
  region,
  findName: () => pipe([get("Name")]),
  findId,
  inferName: () => get("Name"),
  omitProperties: omitPropertiesWebACL,
  compare: compare({
    filterLive: () => pipe([filterDescription]),
  }),
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      filterDescription,
      assign({
        Rules: pipe([
          get("Rules"),
          map(
            assign({
              Statement: pipe([
                get("Statement"),
                filterLiveRuleGroup({ providerConfig, lives }),
                when(
                  get("RuleGroupReferenceStatement"),
                  assign({
                    RuleGroupReferenceStatement: pipe([
                      get("RuleGroupReferenceStatement"),
                      assign({
                        ARN: pipe([
                          get("ARN"),
                          replaceWithName({
                            groupType: "WAFv2::RuleGroup",
                            path: "id",
                            providerConfig,
                            lives,
                          }),
                        ]),
                      }),
                    ]),
                  })
                ),
              ]),
            })
          ),
        ]),
      }),
    ]),
  ignoreErrorCodes: ["WAFNonexistentItemException"],
  dependencies: {
    ruleGroups: {
      type: "RuleGroup",
      group: "WAFv2",
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("Rules"),
          pluck("Statement.RuleGroupReferenceStatement.ARN"),
        ]),
    },
    ...dependenciesRuleGroup,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html#getWebACL-property
  getById: {
    method: "getWebACL",
    pickId: pipe([
      pick(["Id", "LockToken", "Name", "Scope"]),
      tap(({ Id, Scope }) => {
        assert(Id);
        assert(Scope);
      }),
    ]),
    getField: "WebACL",
    decorate: decorate({ Scope }),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html#listWebACLs-property
  getList: {
    method: "listWebACLs",
    enhanceParams: () => () => ({ Scope }),
    getParam: "WebACLs",
    decorate:
      ({ getById }) =>
      (live) =>
        pipe([
          () => live,
          defaultsDeep({ Scope }),
          getById,
          defaultsDeep(live),
        ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html#createWebACL-property
  create: {
    method: "createWebACL",
    pickCreated: ({ payload }) =>
      pipe([get("Summary"), defaultsDeep({ Scope })]),
    //isInstanceUp: eq(get("Status"), "DEPLOYED"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html#updateWebACL-property
  update: {
    method: "updateWebACL",
    filterParams: ({ payload, live }) =>
      pipe([
        () => payload,
        defaultsDeep(pipe([() => live, pickId])()),
        omit(["Tags"]),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html#deleteWebACL-property
  destroy: {
    method: "deleteWebACL",
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
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
    ])(),
});
