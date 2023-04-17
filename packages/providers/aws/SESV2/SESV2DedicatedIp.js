const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const cannotBeDeleted = () => () => true;

const pickId = pipe([
  tap(({ Ip }) => {
    assert(Ip);
  }),
  pick(["Ip"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SESv2.html
exports.SESV2DedicatedIp = () => ({
  type: "DedicatedIp",
  package: "sesv2",
  client: "SESv2",
  propertiesDefault: {},
  omitProperties: ["PoolName", "WarmupStatus", "WarmupPercentage"],
  inferName: () =>
    pipe([
      get("Ip"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("Ip"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("Ip"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["NotFoundException"],
  cannotBeDeleted,
  dependencies: {
    ipPool: {
      type: "DedicatedIpPool",
      group: "SESv2",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("PoolName"),
          tap((PoolName) => {
            assert(PoolName);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SESv2.html#getDedicatedIp-property
  getById: {
    method: "getDedicatedIp",
    getField: "DedicatedIp",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SESv2.html#getDedicatedIps-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "DedicatedIpPool", group: "SESv2" },
          pickKey: pipe([pick(["PoolName"])]),
          method: "getDedicatedIps",
          getParam: "DedicatedIps",
          config,
          decorate: () =>
            pipe([
              tap((params) => {
                assert(true);
              }),
              decorate({ endpoint, config }),
            ]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SESv2.html#putDedicatedIpInPool-property
  create: {
    method: "putDedicatedIpInPool",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SESv2.html#putDedicatedIpInPool-property
  update: {
    method: "putDedicatedIpInPool",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // TODO no API to destroy, go to the support center: https://docs.aws.amazon.com/ses/latest/dg/dedicated-ip-case.html
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { ipPool },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(ipPool);
      }),
      () => otherProps,
      defaultsDeep({ PoolName: ipPool.config.PoolName }),
    ])(),
});
