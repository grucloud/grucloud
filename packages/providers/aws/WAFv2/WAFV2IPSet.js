const assert = require("assert");
const { pipe, tap, get, pick, flatMap, tryCatch, map } = require("rubico");
const { defaultsDeep, filterOut, isEmpty } = require("rubico/x");

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
exports.WAFV2IPSet = () => ({
  type: "IPSet",
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
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html#getIPSet-property
  getById: {
    method: "getIPSet",
    getField: "IPSet",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html#listIPSets-property
  getList: ({ endpoint, getById }) =>
    pipe([
      () => ["CLOUDFRONT", "REGIONAL"],
      flatMap((Scope) =>
        tryCatch(
          pipe([
            tap((params) => {
              assert(true);
            }),
            () => ({ Scope }),
            endpoint().listIPSets,
            get("IPSets"),
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
      tap((params) => {
        assert(true);
      }),
      filterOut(isEmpty),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html#createIPSet-property
  create: {
    method: "createIPSet",
    pickCreated: ({ payload }) => pipe([get("Summary"), defaultsDeep(payload)]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html#updateIPSet-property
  update: {
    method: "updateIPSet",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html#deleteIPSet-property
  destroy: {
    method: "deleteIPSet",
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
