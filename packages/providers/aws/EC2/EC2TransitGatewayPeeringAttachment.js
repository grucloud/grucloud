const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  eq,
  fork,
  filter,
  not,
  assign,
} = require("rubico");
const { when, includes, isObject } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const logger = require("@grucloud/core/logger")({
  prefix: "TgwPeeringAttachment",
});

const { buildTags } = require("../AwsCommon");
const {
  tagResource,
  untagResource,
  replacePeeringInfo,
} = require("./EC2Common");

const isInstanceDown = pipe([eq(get("State"), "deleted")]);

const managedByOther = ({ lives, config }) =>
  pipe([
    get("AccepterTgwInfo.TransitGatewayId"),
    lives.getById({
      type: "TransitGateway",
      group: "EC2",
      providerName: config.providerName,
    }),
    eq(get("providerName"), config.providerName),
  ]);

const findId = () => pipe([get("TransitGatewayAttachmentId")]);

const findNamePeeringAttachment =
  ({ lives, config }) =>
  (live) =>
    pipe([
      () => live,
      fork({
        transitGatewayRequester: pipe([
          get("RequesterTgwInfo.TransitGatewayId"),
          (id) =>
            pipe([
              () => id,
              lives.getById({
                type: "TransitGateway",
                group: "EC2",
                providerName: config.providerName,
              }),
              get("name", id),
            ])(),
        ]),
        transitGatewayAcceptor: pipe([
          get("AccepterTgwInfo.TransitGatewayId"),
          (id) =>
            pipe([
              () => id,
              lives.getById({
                id,
                type: "TransitGateway",
                group: "EC2",
                providerName: config.providerName,
              }),
              get("name", id),
            ])(),
        ]),
      }),
      tap(({ transitGatewayRequester, transitGatewayAcceptor }) => {
        assert(transitGatewayRequester);
        assert(transitGatewayAcceptor);
      }),
      ({ transitGatewayRequester, transitGatewayAcceptor }) =>
        `tgw-peering-attach::${transitGatewayRequester}::${transitGatewayAcceptor}`,
    ])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2TransitGatewayPeeringAttachment = ({ compare }) => ({
  type: "TransitGatewayPeeringAttachment",
  package: "ec2",
  client: "EC2",
  managedByOther,
  findName: findNamePeeringAttachment,
  findId,
  cannotBeDeleted: () => eq(get("State"), "deleted"),
  inferName:
    ({ dependenciesSpec: { transitGateway, transitGatewayPeer } }) =>
    () =>
      pipe([
        tap(() => {
          assert(transitGateway);
          assert(transitGatewayPeer);
        }),
        () => transitGatewayPeer,
        when(isObject, get("name")),
        (transitGatewayPeerName) =>
          `tgw-peering-attach::${transitGateway}::${transitGatewayPeerName}`,
      ])(),
  // TODO remove this
  compare: compare({
    filterTarget: () => pipe([pick([])]),
    filterLive: () => pipe([pick([])]),
  }),
  ignoreResource: () => pipe([get("live"), eq(get("State"), "deleted")]),
  omitProperties: [
    "TransitGatewayAttachmentId",
    "RequesterTgwInfo.TransitGatewayId",
    "AccepterTgwInfo.TransitGatewayId",
    "Status",
    "State",
    "CreationTime",
  ],
  dependencies: {
    transitGateway: {
      type: "TransitGateway",
      group: "EC2",
      parent: true,
      parentForName: true,
      dependencyId: ({ lives, config }) =>
        get("RequesterTgwInfo.TransitGatewayId"),
    },
    transitGatewayPeer: {
      type: "TransitGateway",
      group: "EC2",
      parent: true,
      parentForName: true,
      dependencyId: ({ lives, config }) =>
        get("AccepterTgwInfo.TransitGatewayId"),
    },
  },
  filterLive: ({ providerConfig }) =>
    pipe([
      assign({
        RequesterTgwInfo: replacePeeringInfo({
          resourceType: "RequesterTgwInfo",
          providerConfig,
        }),
        AccepterTgwInfo: replacePeeringInfo({
          resourceType: "AccepterTgwInfo",
          providerConfig,
        }),
      }),
    ]),
  ignoreErrorCodes: ["InvalidTransitGatewayAttachmentID.NotFound"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeTransitGatewayPeeringAttachments-property
  getById: {
    method: "describeTransitGatewayPeeringAttachments",
    getField: "TransitGatewayPeeringAttachments",
    pickId: pipe([
      ({ TransitGatewayAttachmentId }) => ({
        TransitGatewayAttachmentIds: [TransitGatewayAttachmentId],
      }),
    ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeTransitGatewayPeeringAttachments-property
  getList: {
    method: "describeTransitGatewayPeeringAttachments",
    getParam: "TransitGatewayPeeringAttachments",
    transformListPre: () => pipe([filter(not(isInstanceDown))]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createTransitGatewayPeeringAttachment-property
  create: {
    method: "createTransitGatewayPeeringAttachment",
    pickCreated: ({ payload }) =>
      pipe([get("TransitGatewayPeeringAttachment")]),
    configIsUp: { retryCount: 20 * 10, retryDelay: 5e3 },
    isInstanceError: eq(get("State"), "failed"),
    getErrorMessage: get("Status.Message", "error"),
    isInstanceUp: pipe([
      tap(({ State }) => {
        logger.debug(`TransitGatewayPeeringAttachment State: ${State}`);
      }),
      ({ State }) =>
        pipe([() => ["available", "pendingAcceptance"], includes(State)])(),
    ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteTransitGatewayPeeringAttachment-property
  destroy: {
    method: "deleteTransitGatewayPeeringAttachment",
    pickId: pipe([pick(["TransitGatewayAttachmentId"])]),
    isInstanceDown,
  },
  getByName: getByNameCore,
  tagger: () => ({ tagResource: tagResource, untagResource: untagResource }),

  configDefault: ({
    name,
    namespace,
    properties: { Tags, AccepterTgwInfo, ...otherProps },
    dependencies: { transitGateway, transitGatewayPeer },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(transitGateway);
        assert(transitGatewayPeer);
        assert(AccepterTgwInfo);
      }),
      () => ({
        PeerAccountId: AccepterTgwInfo.OwnerId,
        PeerRegion: AccepterTgwInfo.Region,
        TransitGatewayId: getField(transitGateway, "TransitGatewayId"),
        PeerTransitGatewayId: getField(transitGatewayPeer, "TransitGatewayId"),
        TagSpecifications: [
          {
            ResourceType: "transit-gateway-attachment",
            Tags: buildTags({ config, namespace, name, UserTags: Tags }),
          },
        ],
      }),
    ])(),
});
