const assert = require("assert");
const { pipe, tap, get, pick, tryCatch, map } = require("rubico");
const { defaultsDeep, isEmpty, filterOut } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./WAFV2Common");

const buildArn = () =>
  pipe([
    get("ARN"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const findId = () =>
  pipe([
    get("ARN"),
    tap((id) => {
      assert(id);
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

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ endpoint, findId }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html
exports.WAFV2RegexPatternSet = () => ({
  type: "RegexPatternSet",
  package: "wafv2",
  client: "WAFV2",
  propertiesDefault: {},
  omitProperties: ["ARN", "Id", "LockToken"],
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
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html#getRegexPatternSet-property
  getById: {
    method: "getRegexPatternSet",
    getField: "RegexPatternSet",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html#listRegexPatternSets-property
  getList: {
    method: "listRegexPatternSets",
    getParam: "RegexPatternSets",
    decorate: ({ getById }) => pipe([getById]),
  },
  getList: ({ endpoint }) =>
    pipe([
      () => ["CLOUDFRONT", "REGIONAL"],
      map(
        tryCatch(
          pipe([
            (Scope) => ({ Scope }),
            endpoint().listRegexPatternSets,
            get("RegexPatternSets"),
          ]),
          (error) =>
            pipe([
              tap((params) => {
                assert(error);
              }),
              () => undefined,
            ])()
        )
      ),
      filterOut(isEmpty),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html#createRegexPatternSet-property
  create: {
    method: "createRegexPatternSet",
    pickCreated: ({ payload }) => pipe([get("Summary")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html#updateRegexPatternSet-property
  update: {
    method: "updateRegexPatternSet",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html#deleteRegexPatternSet-property
  destroy: {
    method: "deleteRegexPatternSet",
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
