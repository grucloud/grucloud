const assert = require("assert");
const { pipe, tap, get, and, eq, pick, or, not, filter } = require("rubico");
const { first, includes } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { retryCall } = require("@grucloud/core/Retry");

const { createAwsResource } = require("../AwsClient");

const isInstanceDown = pipe([
  get("Status.Code"),
  (code) =>
    pipe([() => ["deleted", "failed", "pending-acceptance"], includes(code)])(),
]);

const createModel = ({ config }) => ({
  package: "ec2",
  client: "EC2",
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeVpcPeeringConnections-property
  getList: {
    method: "describeVpcPeeringConnections",
    getParam: "VpcPeeringConnections",
    transformListPre: pipe([
      filter(
        and([
          eq(get("AccepterVpcInfo.Region"), config.region),
          not(isInstanceDown),
        ])
      ),
    ]),
    decorate: ({ endpoint }) =>
      pipe([
        tap((params) => {
          assert(endpoint);
        }),
      ]),
  },
});

const findId = pipe([
  get("live.VpcPeeringConnectionId"),
  tap((VpcPeeringConnectionId) => {
    assert(VpcPeeringConnectionId);
  }),
]);

const findName =
  ({ config }) =>
  ({ live, lives }) =>
    pipe([
      () => live.VpcPeeringConnectionId,
      (id) =>
        pipe([
          () =>
            lives.getById({
              id,
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
exports.EC2VpcPeeringConnectionAccepter = ({ spec, config }) =>
  createAwsResource({
    model: createModel({ config }),
    spec,
    config,
    findDependencies: ({ live }) => [
      {
        type: "VpcPeeringConnection",
        group: "EC2",
        ids: [live.VpcPeeringConnectionId],
      },
    ],
    findName: findName({ config }),
    findId,
    cannotBeDeleted: () => true,
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
                          pipe([
                            () => ["rejected", "failed"],
                            includes(Code),
                          ])(),
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

    configDefault: ({
      name,
      namespace,
      properties: {},
      dependencies: { vpcPeeringConnection },
    }) =>
      pipe([
        tap(() => {
          assert(vpcPeeringConnection);
        }),
        () => ({}),
      ])(),
  });
