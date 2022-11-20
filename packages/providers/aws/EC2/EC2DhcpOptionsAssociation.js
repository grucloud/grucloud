const assert = require("assert");
const { pipe, tap, get, map, pick, fork, filter, not, and } = require("rubico");
const { defaultsDeep, first, pluck } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

const { createAwsResource } = require("../AwsClient");

const createModel = ({ config }) => ({
  package: "ec2",
  client: "EC2",
  ignoreErrorCodes: ["InvalidVpcID.NotFound"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#associateDhcpOptions-property
  create: { method: "associateDhcpOptions" },
  destroy: {
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#associateDhcpOptions-property
    method: "associateDhcpOptions",
    pickId: pipe([({ VpcId }) => ({ VpcId, DhcpOptionsId: "default" })]),
  },
});

const findId = () =>
  pipe([
    ({ DhcpOptionsId, VpcId }) =>
      `dhcp-options-assoc::${DhcpOptionsId}::${VpcId}`,
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2DhcpOptionsAssociation = ({ spec, config }) =>
  createAwsResource({
    model: createModel({ config }),
    spec,
    config,
    findName:
      ({ lives, config }) =>
      (live) =>
        pipe([
          fork({
            vpc: pipe([
              () =>
                lives.getById({
                  id: live.VpcId,
                  type: "Vpc",
                  group: "EC2",
                  providerName: config.providerName,
                }),
              get("name", live.VpcId),
            ]),
            dhcpOptions: pipe([
              () =>
                lives.getById({
                  id: live.DhcpOptionsId,
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
          ({ vpc, dhcpOptions }) =>
            `dhcp-options-assoc::${vpc}::${dhcpOptions}`,
        ])(),
    findId,
    getList:
      ({ endpoint }) =>
      ({ lives, config }) =>
        pipe([
          () =>
            lives.getByType({
              providerName: config.providerName,
              type: "Vpc",
              group: "EC2",
            }),
          pluck("live"),
          filter(
            and([
              get("DhcpOptionsId"),
              not(({ DhcpOptionsId }) =>
                pipe([
                  () =>
                    lives.getById({
                      id: DhcpOptionsId,
                      providerName: config.providerName,
                      type: "DhcpOptions",
                      group: "EC2",
                    }),
                  get("managedByOther"),
                ])()
              ),
            ])
          ),
          map(pick(["VpcId", "DhcpOptionsId"])),
        ])(),
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
