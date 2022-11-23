const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  eq,
  fork,
  or,
  not,
  filter,
  and,
} = require("rubico");
const { isEmpty, includes } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const logger = require("@grucloud/core/logger")({
  prefix: "VpcPeeringConnection",
});

const { buildTags } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./EC2Common");

const isInstanceDown = pipe([
  tap(({ Status }) => {
    logger.debug(`isInstanceDown State: ${JSON.stringify(Status)}`);
  }),
  // TODO isEmpty not needed
  or([isEmpty, eq(get("Status.Code"), "deleted")]),
]);

const managedByOther =
  ({ lives, config }) =>
  (live) =>
    pipe([
      () => live,
      get("AccepterVpcInfo.VpcId"),
      (id) =>
        lives.getById({
          id,
          type: "Vpc",
          group: "EC2",
          providerName: config.providerName,
        }),
      eq(get("providerName"), config.providerName),
    ])();

const createModel = ({ config }) => ({
  package: "ec2",
  client: "EC2",
  ignoreErrorCodes: ["InvalidVpcPeeringConnectionID.NotFound"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeVpcPeeringConnections-property
  getById: {
    method: "describeVpcPeeringConnections",
    getField: "VpcPeeringConnections",
    pickId: pipe([
      ({ VpcPeeringConnectionId }) => ({
        VpcPeeringConnectionIds: [VpcPeeringConnectionId],
      }),
    ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeVpcPeeringConnections-property
  getList: {
    method: "describeVpcPeeringConnections",
    getParam: "VpcPeeringConnections",
    transformListPre: () =>
      pipe([
        filter(
          and([
            eq(get("RequesterVpcInfo.Region"), config.region),
            not(isInstanceDown),
          ])
        ),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createVpcPeeringConnection-property
  create: {
    method: "createVpcPeeringConnection",
    pickCreated: ({ payload }) => pipe([get("VpcPeeringConnection")]),
    configIsUp: { retryCount: 20 * 10, retryDelay: 5e3 },
    isInstanceError: eq(get("Status.Code"), "failed"),
    getErrorMessage: get("Status.Message", "failed"),
    isInstanceUp: pipe([
      tap(({ Status }) => {
        logger.debug(`VpcPeeringConnection State: ${JSON.stringify(Status)}`);
      }),
      get("Status.Code"),
      (Code) =>
        pipe([() => ["available", "pending-acceptance"], includes(Code)])(),
    ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteVpcPeeringConnection-property
  destroy: {
    method: "deleteVpcPeeringConnection",
    pickId: pipe([pick(["VpcPeeringConnectionId"])]),
    isInstanceDown,
  },
});

const findId = () => pipe([get("VpcPeeringConnectionId")]);

const findName =
  ({ lives, config }) =>
  (live) =>
    pipe([
      () => live,
      tap((params) => {
        assert(true);
      }),
      fork({
        vpcName: pipe([
          get("RequesterVpcInfo.VpcId"),
          (id) =>
            pipe([
              () =>
                lives.getById({
                  id,
                  type: "Vpc",
                  group: "EC2",
                  providerName: config.providerName,
                }),
              get("name", id),
            ])(),
        ]),
        vpcPeerName: pipe([
          get("AccepterVpcInfo.VpcId"),
          (id) =>
            pipe([
              () =>
                lives.getById({
                  id,
                  type: "Vpc",
                  group: "EC2",
                  providerName: config.providerName,
                }),
              get("name", id),
            ])(),
        ]),
      }),
      tap(({ vpcName, vpcPeerName }) => {
        assert(vpcName);
        assert(vpcPeerName);
      }),
      ({ vpcName, vpcPeerName }) => `vpc-peering::${vpcName}::${vpcPeerName}`,
    ])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2VpcPeeringConnection = ({ spec, config }) =>
  createAwsResource({
    model: createModel({ config }),
    spec,
    config,
    managedByOther,
    findName,
    findId,
    cannotBeDeleted: () => eq(get("Status.Code"), "failed"),
    getByName: getByNameCore,
    tagResource: tagResource,
    untagResource: untagResource,
    configDefault: ({
      name,
      namespace,
      properties: { Tags, AccepterVpcInfo },
      dependencies: { vpc, vpcPeer },
    }) =>
      pipe([
        tap(() => {
          assert(vpc);
          assert(vpcPeer);
        }),
        () => ({
          PeerOwnerId: AccepterVpcInfo.OwnerId,
          PeerRegion: AccepterVpcInfo.Region,
          PeerVpcId: getField(vpcPeer, "VpcId"),
          VpcId: getField(vpc, "VpcId"),
          TagSpecifications: [
            {
              ResourceType: "vpc-peering-connection",
              Tags: buildTags({ config, namespace, UserTags: Tags }),
            },
          ],
        }),
      ])(),
  });
