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
const { isEmpty, includes, when, isObject } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const logger = require("@grucloud/core/logger")({
  prefix: "VpcPeeringConnection",
});

const { buildTags } = require("../AwsCommon");
const {
  tagResource,
  untagResource,
  replacePeeringInfo,
} = require("./EC2Common");

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
      lives.getById({
        type: "Vpc",
        group: "EC2",
        providerName: config.providerName,
      }),
      eq(get("providerName"), config.providerName),
    ])();

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
              () => id,
              lives.getById({
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
              () => id,
              lives.getById({
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
exports.EC2VpcPeeringConnection = ({ compare }) => ({
  type: "VpcPeeringConnection",
  package: "ec2",
  client: "EC2",
  managedByOther,
  findName,
  findId,
  inferName:
    ({ dependenciesSpec: { vpc, vpcPeer } }) =>
    (properties) =>
      pipe([
        tap((params) => {
          assert(vpc);
          assert(vpcPeer);
          assert(properties);
        }),
        () => vpcPeer,
        when(isObject, get("name")),
        (vpcPeerName) => `vpc-peering::${vpc}::${vpcPeerName}`,
      ])(),
  ignoreResource: () =>
    pipe([
      get("live.Status.Code"),
      (code) => pipe([() => ["deleted", "failed"], includes(code)])(),
    ]),
  omitProperties: [
    "Status",
    "ExpirationTime",
    "VpcPeeringConnectionId",
    "AccepterVpcInfo.VpcId",
    "RequesterVpcInfo.CidrBlock",
    "RequesterVpcInfo.CidrBlockSet",
    "RequesterVpcInfo.PeeringOptions",
    "RequesterVpcInfo.VpcId",
  ],
  filterLive: ({ providerConfig }) =>
    pipe([
      assign({
        RequesterVpcInfo: replacePeeringInfo({
          resourceType: "RequesterVpcInfo",
          providerConfig,
        }),
        AccepterVpcInfo: replacePeeringInfo({
          resourceType: "AccepterVpcInfo",
          providerConfig,
        }),
      }),
    ]),
  compare: compare({
    filterTarget: () => pipe([pick([])]),
    filterLive: () => pipe([pick([])]),
  }),
  dependencies: {
    vpc: {
      type: "Vpc",
      group: "EC2",
      parent: true,
      dependencyId: ({ lives, config }) => get("RequesterVpcInfo.VpcId"),
    },
    vpcPeer: {
      type: "Vpc",
      group: "EC2",
      parent: true,
      dependencyId: ({ lives, config }) => get("AccepterVpcInfo.VpcId"),
    },
  },
  cannotBeDeleted: () => eq(get("Status.Code"), "failed"),
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
    transformListPre: ({ config }) =>
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
  getByName: getByNameCore,
  tagger: () => ({ tagResource: tagResource, untagResource: untagResource }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, AccepterVpcInfo },
    dependencies: { vpc, vpcPeer },
    config,
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
