const assert = require("assert");
const { pipe, tap, get, pick, eq, switchCase } = require("rubico");
const { defaultsDeep, first, unless } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { retryCall } = require("@grucloud/core/Retry");

const { findNameInTagsOrId, isAwsError } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ IpamPoolId, Cidr }) => {
    assert(IpamPoolId);
    assert(Cidr);
  }),
  pick(["IpamPoolId", "Cidr"]),
]);

const createModel = ({ config }) => ({
  package: "ec2",
  client: "EC2",
  //TODO what is cidr does not exist

  ignoreErrorCodes: ["InvalidIpamPoolId.NotFound"],
  getById: {
    pickId,
    method: "getIpamPoolCidrs",
    getField: "IpamPoolCidrs",
  },
  create: {
    method: "provisionIpamPoolCidr",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
});

const findId = pipe([get("live.Cidr")]);

const isDeprovisioned = eq(get("State"), "deprovisioned");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2IpamPoolCidr = ({ spec, config }) =>
  createAwsResource({
    model: createModel({ config }),
    spec,
    config,
    cannotBeDeleted: eq(get("live.State"), "deprovisioned"),
    findName: findNameInTagsOrId({ findId }),
    findId,
    findDependencies: ({ live, lives }) => [
      {
        type: "IpamPool",
        group: "EC2",
        ids: [pipe([() => live.IpamPoolId])()],
      },
    ],
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#getIpamPoolCidrs-property
    getList: ({ client }) =>
      pipe([
        client.getListWithParent({
          parent: { type: "IpamPool", group: "EC2" },
          pickKey: pipe([pick(["IpamPoolId"])]),
          method: "getIpamPoolCidrs",
          getParam: "IpamPoolCidrs",
          config,
          decorate: ({ lives, parent: { IpamPoolId } }) =>
            pipe([defaultsDeep({ IpamPoolId })]),
        }),
      ]),
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deprovisionIpamPoolCidr-property
    destroy: ({ client, endpoint }) =>
      pipe([
        get("live"),
        (live) =>
          retryCall({
            name: "deprovisionIpamPoolCidr",
            // The weirdest API to delete a resource in my entire career.
            fn: pipe([
              () => live,
              pickId,
              endpoint().getIpamPoolCidrs,
              get("IpamPoolCidrs"),
              first,
              unless(
                isDeprovisioned,
                pipe([
                  () => live,
                  pickId,
                  endpoint().deprovisionIpamPoolCidr,
                  get("IpamPoolCidr"),
                ])
              ),
            ]),
            isExpectedException: isAwsError("InvalidIpamPoolId.NotFound"),
            shouldRetryOnException: pipe([
              eq(get("error.name"), "IncorrectState"),
            ]),
            isExpectedResult: isDeprovisioned,
            config: { retryCount: 400, retryDelay: 5e3 },
          }),
      ]),
    getByName: getByNameCore,
    configDefault: ({
      properties: { Tags, ...otherProps },
      dependencies: { ipamPool },
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          IpamPoolId: getField(ipamPool, "IpamPoolId"),
        }),
      ])(),
  });
