const assert = require("assert");
const { pipe, tap, get, map, pick, fork, filter, not } = require("rubico");
const { defaultsDeep, first, unless, isEmpty, pluck } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

const { createAwsResource } = require("../AwsClient");

const createModel = ({ config }) => ({
  package: "ec2",
  client: "EC2",
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#associateDhcpOptions-property
  create: { method: "associateDhcpOptions" },
  destroy: {
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#associateDhcpOptions-property
    method: "associateDhcpOptions",
    pickId: pipe([
      tap(({ VpcId }) => {
        assert(VpcId);
      }),
      ({ VpcId }) => ({ VpcId, DhcpOptionsId: "default" }),
    ]),
  },
});

const findId = pipe([
  get("live"),
  tap(({ DhcpOptionsId, VpcId }) => {
    assert(DhcpOptionsId);
    assert(VpcId);
  }),
  ({ DhcpOptionsId, VpcId }) =>
    `dhcp-options-assoc::${DhcpOptionsId}::${VpcId}`,
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2DhcpOptionsAssociation = ({ spec, config }) =>
  createAwsResource({
    model: createModel({ config }),
    spec,
    config,
    findDependencies: ({ live }) => [
      {
        type: "Vpc",
        group: "EC2",
        ids: [live.VpcId],
      },
      {
        type: "DhcpOptions",
        group: "EC2",
        ids: [live.DhcpOptionsId],
      },
    ],
    findName: ({ live, lives }) =>
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
            get("name"),
          ]),
          dhcpOptions: pipe([
            () =>
              lives.getById({
                id: live.DhcpOptionsId,
                type: "DhcpOptions",
                group: "EC2",
                providerName: config.providerName,
              }),
            get("name"),
          ]),
        }),
        tap(({ dhcpOptions, vpc }) => {
          //assert(dhcpOptions);
          assert(vpc);
        }),
        ({ vpc, dhcpOptions = "deleted" }) =>
          `dhcp-options-assoc::${dhcpOptions}::${vpc}`,
      ])(),
    findId,
    getList:
      ({ endpoint }) =>
      ({ lives }) =>
        pipe([
          () =>
            lives.getByType({
              providerName: config.providerName,
              type: "Vpc",
              group: "EC2",
            }),
          pluck("live"),
          filter(
            not(({ DhcpOptionsId }) =>
              pipe([
                tap((params) => {
                  assert(true);
                }),
                () =>
                  lives.getById({
                    id: DhcpOptionsId,
                    providerName: config.providerName,
                    type: "DhcpOptions",
                    group: "EC2",
                  }),
                get("managedByOther"),
              ])()
            )
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
