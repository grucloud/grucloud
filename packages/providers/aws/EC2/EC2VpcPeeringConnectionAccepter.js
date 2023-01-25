const assert = require("assert");
const { pipe, tap, get, and, eq, pick, not, filter } = require("rubico");
const { first, includes, when, isObject } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { retryCall } = require("@grucloud/core/Retry");

const isInstanceDown = pipe([
  get("Status.Code"),
  (code) =>
    pipe([() => ["deleted", "failed", "pending-acceptance"], includes(code)])(),
]);

const findId = () => pipe([get("VpcPeeringConnectionId")]);

const findName =
  ({ lives, config }) =>
  (live) =>
    pipe([
      () => live.VpcPeeringConnectionId,
      (id) =>
        pipe([
          () => id,
          lives.getById({
            type: "VpcPeeringConnection",
            group: "EC2",
            providerName: config.providerName,
          }),
          get("name", id),
        ])(),
      tap((vpcPeeringConnection) => {
        assert(vpcPeeringConnection);
      }),
      (vpcPeeringConnection) => `vpc-peering-accepter::${vpcPeeringConnection}`,
    ])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2VpcPeeringConnectionAccepter = ({ compare }) => ({
  type: "VpcPeeringConnectionAccepter",
  package: "ec2",
  client: "EC2",
  findName,
  findId,
  inferName:
    ({ dependenciesSpec: { vpcPeeringConnection } }) =>
    () =>
      pipe([
        tap((params) => {
          assert(vpcPeeringConnection);
        }),
        () => vpcPeeringConnection,
        when(isObject, get("name")),
        (vpcPeeringConnectionName) =>
          `vpc-peering-accepter::${vpcPeeringConnectionName}`,
      ])(),
  cannotBeDeleted: () => () => true,
  omitProperties: [
    "Status",
    "VpcPeeringConnectionId",
    "AccepterVpcInfo",
    "RequesterVpcInfo",
  ],
  ignoreResource: () =>
    pipe([
      get("live.Status.Code"),
      (code) => pipe([() => ["deleted", "failed"], includes(code)])(),
    ]),
  filterLive: ({ providerConfig }) => pipe([pick([])]),
  compare: compare({
    filterTarget: () => pipe([pick([])]),
    filterLive: () => pipe([pick([])]),
  }),
  dependencies: {
    vpcPeeringConnection: {
      type: "VpcPeeringConnection",
      group: "EC2",
      parent: true,
      dependencyId: ({ lives, config }) => get("VpcPeeringConnectionId"),
    },
  },
  getByName: getByNameCore,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#acceptVpcPeeringConnection-property
  create:
    ({ endpoint }) =>
    ({ payload, resolvedDependencies: { vpcPeeringConnection } }) =>
      pipe([
        tap((params) => {
          assert(endpoint);
          assert(vpcPeeringConnection);
          assert(payload);
        }),
        () => vpcPeeringConnection,
        get("live"),
        pick(["VpcPeeringConnectionId"]),
        endpoint().acceptVpcPeeringConnection,
        get("VpcPeeringConnection"),
        ({ VpcPeeringConnectionId }) =>
          pipe([
            () =>
              retryCall({
                name: `VpcPeeringConnectionAccepter ${VpcPeeringConnectionId}`,
                fn: pipe([
                  () => ({
                    VpcPeeringConnectionIds: [VpcPeeringConnectionId],
                  }),
                  endpoint().describeVpcPeeringConnections,
                  get("VpcPeeringConnections"),
                  tap((params) => {
                    assert(true);
                  }),
                  //What if multiple peer connections ? for instance in the same region
                  first,
                  tap.if(
                    pipe([
                      get("Status"),
                      ({ Code }) =>
                        pipe([() => ["rejected", "failed"], includes(Code)])(),
                    ]),
                    pipe([
                      get("Status.Message"),
                      (Message) => {
                        throw Error(Message);
                      },
                    ])
                  ),
                ]),
                isExpectedResult: pipe([eq(get("Status.Code"), "active")]),
                config: { retryCount: 40, retryDelay: 5e3 },
              }),
          ])(),
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeVpcPeeringConnections-property
  getList: {
    method: "describeVpcPeeringConnections",
    getParam: "VpcPeeringConnections",
    transformListPre: ({ config }) =>
      pipe([
        filter(
          and([
            eq(get("AccepterVpcInfo.Region"), config.region),
            not(isInstanceDown),
          ])
        ),
      ]),
  },
  configDefault: ({
    name,
    namespace,
    properties: {},
    dependencies: { vpcPeeringConnection },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(vpcPeeringConnection);
      }),
      () => ({}),
    ])(),
});
