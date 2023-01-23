const assert = require("assert");
const { pipe, tap, get, map, pick, fork, filter, not, and } = require("rubico");
const { defaultsDeep, first, pluck } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

const findId = () =>
  pipe([
    ({ DhcpOptionsId, VpcId }) =>
      `dhcp-options-assoc::${DhcpOptionsId}::${VpcId}`,
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2DhcpOptionsAssociation = ({ compare }) => ({
  type: "DhcpOptionsAssociation",
  package: "ec2",
  client: "EC2",
  ignoreErrorCodes: ["InvalidVpcID.NotFound"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#associateDhcpOptions-property
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        fork({
          vpc: pipe([
            () => live,
            get("VpcId"),
            lives.getById({
              type: "Vpc",
              group: "EC2",
              providerName: config.providerName,
            }),
            get("name", live.VpcId),
          ]),
          dhcpOptions: pipe([
            () => live,
            get("DhcpOptionsId"),
            lives.getById({
              type: "DhcpOptions",
              group: "EC2",
              providerName: config.providerName,
            }),
            get("name", live.DhcpOptionsId),
          ]),
        }),
        tap(({ dhcpOptions, vpc }) => {
          assert(dhcpOptions);
          assert(vpc);
        }),
        ({ vpc, dhcpOptions }) => `dhcp-options-assoc::${vpc}::${dhcpOptions}`,
      ])(),
  findId,
  omitProperties: ["DhcpOptionsId", "VpcId"],
  inferName: ({ dependenciesSpec: { vpc, dhcpOptions } }) =>
    pipe([
      tap((params) => {
        assert(vpc);
        assert(dhcpOptions);
      }),
      () => `dhcp-options-assoc::${vpc}::${dhcpOptions}`,
    ]),
  dependencies: {
    vpc: {
      type: "Vpc",
      group: "EC2",
      parent: true,
      dependencyId: ({ lives, config }) => get("VpcId"),
    },
    dhcpOptions: {
      type: "DhcpOptions",
      group: "EC2",
      parent: true,
      parentForName: true,
      dependencyId: ({ lives, config }) => get("DhcpOptionsId"),
    },
  },
  getList:
    ({ endpoint }) =>
    ({ lives, config }) =>
      pipe([
        lives.getByType({
          providerName: config.providerName,
          type: "Vpc",
          group: "EC2",
        }),
        pluck("live"),
        filter(
          and([
            get("DhcpOptionsId"),
            not(
              pipe([
                get("DhcpOptionsId"),
                lives.getById({
                  providerName: config.providerName,
                  type: "DhcpOptions",
                  group: "EC2",
                }),
                get("managedByOther"),
              ])
            ),
          ])
        ),
        map(pick(["VpcId", "DhcpOptionsId"])),
      ])(),
  create: { method: "associateDhcpOptions" },
  destroy: {
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#associateDhcpOptions-property
    method: "associateDhcpOptions",
    pickId: pipe([({ VpcId }) => ({ VpcId, DhcpOptionsId: "default" })]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeVpcs-property
  getByName:
    ({ getById, endpoint }) =>
    ({ resolvedDependencies: { vpc, dhcpOptions } }) =>
      pipe([
        tap((params) => {
          assert(vpc);
          assert(dhcpOptions);
        }),
        () => ({
          VpcIds: [vpc.live.VpcId],
          Filters: [
            {
              Name: "dhcp-options-id",
              Values: [dhcpOptions.live.DhcpOptionsId],
            },
          ],
        }),
        endpoint().describeVpcs,
        get("Vpcs"),
        first,
      ])(),
  configDefault: ({
    name,
    namespace,
    properties,
    dependencies: { vpc, dhcpOptions },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(vpc);
        assert(dhcpOptions);
      }),
      () => properties,
      defaultsDeep({
        VpcId: getField(vpc, "VpcId"),
        DhcpOptionsId: getField(dhcpOptions, "DhcpOptionsId"),
      }),
    ])(),
});
