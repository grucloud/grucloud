const assert = require("assert");
const { pipe, tap, get, pick, eq, omit, assign, map, not } = require("rubico");
const { defaultsDeep, find, when, isEmpty } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { buildTags, findNameInTags, replaceRegion } = require("../AwsCommon");
const { tagResource, untagResource, assignIpamRegion } = require("./EC2Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const assignLocale = ({ providerConfig }) =>
  when(
    get("Locale"),
    assign({
      Locale: pipe([get("Locale"), replaceRegion({ providerConfig })]),
    })
  );
const omitLocaleNone = when(eq(get("Locale"), "None"), omit(["Locale"]));

const findName =
  ({ lives, config }) =>
  (live) =>
    pipe([
      () => [
        findNameInTags({}),
        get("Description"),
        // TODO add locale ?
        pipe([({ live }) => "ipam-pool"]),
      ],
      map((fn) => fn(live)),
      find(not(isEmpty)),
      tap((params) => {
        assert(true);
      }),
    ])();

const findId = () => pipe([get("IpamPoolId")]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2IpamPool = ({ compare }) => ({
  type: "IpamPool",
  package: "ec2",
  client: "EC2",
  ignoreErrorCodes: ["InvalidIpamPoolId.NotFound"],
  findName,
  findId,
  omitProperties: [
    "SourceIpamPoolId",
    "IpamArn",
    "IpamPoolArn",
    "IpamPoolId",
    "IpamScopeId",
    "IpamScopeArn",
    "PoolDepth",
    "OwnerId",
    "State",
    "Allocations",
  ],
  compare: compare({
    filterLive: () => pipe([omitLocaleNone]),
  }),
  filterLive: ({ providerConfig }) =>
    pipe([
      assignIpamRegion({ providerConfig }),
      omitLocaleNone,
      assignLocale({ providerConfig }),
    ]),
  dependencies: {
    ipamPoolSource: {
      type: "IpamPool",
      group: "EC2",
      dependencyId: ({ lives, config }) => get("SourceIpamPoolId"),
    },
    ipamScope: {
      type: "IpamScope",
      group: "EC2",
      dependencyId:
        ({ lives, config }) =>
        (live) =>
          pipe([
            tap(() => {
              assert(live.IpamScopeArn);
            }),
            lives.getByType({
              type: "IpamScope",
              group: "EC2",
              providerName: config.providerName,
            }),
            find(eq(get("live.IpamScopeArn"), live.IpamScopeArn)),
            get("id"),
            tap((id) => {
              // Why it is sometimes hit ?
              //  assert(id);
            }),
          ])(),
    },
  },
  getById: {
    pickId: pipe([
      tap(({ IpamPoolId }) => {
        assert(IpamPoolId);
      }),
      ({ IpamPoolId }) => ({ IpamPoolIds: [IpamPoolId] }),
    ]),
    method: "describeIpamPools",
    getField: "IpamPools",
  },
  getList: {
    method: "describeIpamPools",
    getParam: "IpamPools",
    decorate: ({ endpoint, getById }) =>
      pipe([
        assign({
          Allocations: pipe([
            pick(["IpamPoolId"]),
            endpoint().getIpamPoolAllocations,
            get("IpamPoolAllocations"),
          ]),
        }),
      ]),
  },
  create: {
    method: "createIpamPool",
    pickCreated: ({ payload }) => pipe([get("IpamPool")]),
    isInstanceUp: eq(get("State"), "create-complete"),
  },
  //TODO
  update: {
    method: "modifyIpamPool",
    filterParams: ({ payload, live }) =>
      pipe([
        () => payload,
        omit(["TagSpecifications"]),
        defaultsDeep(pickId(live)),
      ])(),
    isInstanceUp: eq(get("State"), "create-complete"),
  },
  destroy: {
    method: "deleteIpamPool",
    pickId: pipe([
      pick(["IpamPoolId"]),
      tap(({ IpamPoolId }) => {
        assert(IpamPoolId);
      }),
    ]),
  },
  getByName: getByNameCore,
  tagger: () => ({ tagResource: tagResource, untagResource: untagResource }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { ipamScope, ipamPoolSource },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(ipamScope);
      }),
      () => otherProps,
      defaultsDeep({
        IpamScopeId: getField(ipamScope, "IpamScopeId"),
        TagSpecifications: [
          {
            ResourceType: "ipam-pool",
            Tags: buildTags({ config, namespace, name, UserTags: Tags }),
          },
        ],
      }),
      when(
        () => ipamPoolSource,
        defaultsDeep({
          SourceIpamPoolId: getField(ipamPoolSource, "IpamPoolId"),
        })
      ),
    ])(),
});
