const assert = require("assert");
const { pipe, tap, get, pick, eq, switchCase, map, not } = require("rubico");
const { defaultsDeep, find, isEmpty } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { buildTags } = require("../AwsCommon");
const { tagResource, untagResource } = require("./EC2Common");
const { getField } = require("@grucloud/core/ProviderCommon");

// TODO OwnerId
const managedByOther = () => get("IsDefault");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2IpamResourceDiscoveryAssociation = ({ compare }) => ({
  type: "IpamResourceDiscoveryAssociation",
  package: "ec2",
  client: "EC2",
  ignoreErrorCodes: ["InvalidIpamResourceDiscoveryAssociationId.NotFound"],
  inferName:
    ({ dependenciesSpec: { ipam, ipamResourceDiscovery } }) =>
    ({}) =>
      pipe([
        tap(() => {
          assert(ipam);
          assert(ipamResourceDiscovery);
        }),
        () => `${ipam}::${ipamResourceDiscovery}`,
      ])(),
  findName: ({ lives, config }) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      switchCase([
        get("IsDefault"),
        () => "default",
        (live) =>
          pipe([
            tap((params) => {
              assert(live.IpamId);
              assert(live.IpamResourceDiscoveryId);
            }),
            fork({
              ipamName: pipe([
                lives.getByType({
                  type: "Ipam",
                  group: "EC2",
                  providerName: config.providerName,
                }),
                find(eq(get("live.IpamId"), live.IpamId)),
                get("name", live.IpamId),
                tap((name) => {
                  assert(name);
                }),
              ]),
              ipamResourceDiscoveryName: pipe([
                lives.getByType({
                  type: "IpamResourceDiscovery",
                  group: "EC2",
                  providerName: config.providerName,
                }),
                find(
                  eq(
                    get("live.IpamResourceDiscoveryId"),
                    live.IpamResourceDiscoveryId
                  )
                ),
                get("name", live.IpamResourceDiscoveryId),
                tap((name) => {
                  assert(name);
                }),
              ]),
            }),
            ({ ipamName, ipamResourceDiscoveryName }) =>
              `${ipamName}::${ipamResourceDiscoveryName}`,
          ])(),
      ]),
    ]),
  findId: () =>
    pipe([
      get("IpamResourceDiscoveryAssociationId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  cannotBeDeleted: managedByOther,
  managedByOther,
  omitProperties: [
    "OwnerId",
    "IpamResourceDiscoveryAssociationId",
    "IpamResourceDiscoveryAssociationArn",
    "ResourceDiscoveryStatus",
    "IpamResourceDiscoveryArn",
    "IpamResourceDiscoveryId",
    "IpamId",
    "IpamArn",
    "State",
    "OwnerId",
  ],
  filterLive: ({ providerConfig }) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      //assignIpamRegion({ providerConfig }),
    ]),
  dependencies: {
    ipam: {
      type: "Ipam",
      group: "EC2",
      dependencyId:
        ({ lives, config }) =>
        (live) =>
          pipe([
            tap((params) => {
              assert(live.IpamId);
            }),
            lives.getByType({
              type: "Ipam",
              group: "EC2",
              providerName: config.providerName,
            }),
            find(eq(get("live.IpamId"), live.IpamId)),
            get("id"),
            tap((id) => {
              assert(id);
            }),
          ])(),
    },
    ipamResourceDiscovery: {
      type: "IpamResourceDiscovery",
      group: "EC2",
      dependencyId:
        ({ lives, config }) =>
        (live) =>
          pipe([
            tap((params) => {
              assert(live.IpamResourceDiscoveryId);
            }),
            lives.getByType({
              type: "IpamResourceDiscovery",
              group: "EC2",
              providerName: config.providerName,
            }),
            find(
              eq(
                get("live.IpamResourceDiscoveryId"),
                live.IpamResourceDiscoveryId
              )
            ),
            get("id"),
            tap((id) => {
              assert(id);
            }),
          ])(),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeIpamResourceDiscoveryAssociations-property
  getById: {
    pickId: pipe([
      ({ IpamResourceDiscoveryAssociationId }) => ({
        IpamResourceDiscoveryAssociationIds: [
          IpamResourceDiscoveryAssociationId,
        ],
      }),
    ]),
    method: "describeIpamResourceDiscoveryAssociations",
    getField: "IpamResourceDiscoveryAssociations",
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeIpamResourceDiscoveryAssociations-property
  getList: {
    method: "describeIpamResourceDiscoveryAssociations",
    getParam: "IpamResourceDiscoveryAssociations",
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#associateIpamResourceDiscovery-property
  create: {
    method: "associateIpamResourceDiscovery",
    pickCreated: ({ payload }) =>
      pipe([get("IpamResourceDiscoveryAssociation")]),
    isInstanceUp: eq(get("State"), "associate-complete"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#disassociateIpamResourceDiscovery-property
  destroy: {
    method: "disassociateIpamResourceDiscovery",
    pickId: pipe([
      pick(["IpamResourceDiscoveryAssociationId"]),
      tap((IpamResourceDiscoveryAssociationId) => {
        assert(IpamResourceDiscoveryAssociationId);
      }),
    ]),
  },
  getByName: getByNameCore,
  tagger: () => ({ tagResource: tagResource, untagResource: untagResource }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { ipam, ipamResourceDiscovery },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(ipam);
        assert(ipamResourceDiscovery);
      }),
      () => otherProps,
      defaultsDeep({
        IpamId: getField(ipam, "IpamId"),
        IpamResourceDiscoveryId: getField(ipam, "IpamResourceDiscoveryId"),
        TagSpecifications: [
          {
            ResourceType: "ipam-resource-discovery-association",
            Tags: buildTags({ config, namespace, name, UserTags: Tags }),
          },
        ],
      }),
    ])(),
});
