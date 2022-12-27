const assert = require("assert");
const { pipe, tap, get, pick, eq, fork } = require("rubico");
const { defaultsDeep, find, isObject, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignArnAttachment } = require("./NetworkManagerCommon");

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const findId = () =>
  pipe([
    get("AttachmentId"),
    tap((AttachmentId) => {
      assert(AttachmentId);
    }),
  ]);

const pickId = pipe([
  tap(({ AttachmentId }) => {
    assert(AttachmentId);
  }),
  pick(["AttachmentId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignArnAttachment({ config }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkManager.html
exports.NetworkManagerSiteToSiteVpnAttachment = () => ({
  type: "SiteToSiteVpnAttachment",
  package: "networkmanager",
  client: "NetworkManager",
  propertiesDefault: {},
  omitProperties: [
    "CoreNetworkId",
    "CoreNetworkArn",
    "AttachmentId",
    "State",
    "ResourceArn",
    "AttachmentPolicyRuleNumber",
  ],
  inferName: ({ dependenciesSpec: { coreNetwork, vpnConnection } }) =>
    pipe([
      tap(() => {
        assert(coreNetwork);
        assert(vpnConnection);
      }),
      () => vpnConnection,
      when(isObject, get("name")),
      (vpnConnection) => `site2site-attach::${coreNetwork}::${vpnConnection}`,
    ]),
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        tap((params) => {
          assert(live.ResourceArn);
        }),
        () => live,
        fork({
          coreNetworkName: pipe([
            tap(() => {
              assert(live.CoreNetworkId);
            }),
            get("CoreNetworkId"),
            lives.getById({
              type: "CoreNetwork",
              group: "NetworkManager",
              providerName: config.providerName,
            }),
            get("name", live.CoreNetworkId),
          ]),
          vpnConnectionName: pipe([
            lives.getByType({
              type: "VpnConnection",
              group: "EC2",
              // Cross region
            }),
            find(pipe([eq(get("live.Arn"), live.ResourceArn)])),
            get("name", live.ResourceArn),
          ]),
        }),
        ({ coreNetworkName, vpnConnectionName }) =>
          `site2site-attach::${coreNetworkName}::${vpnConnectionName}`,
      ])(),
  findId,
  dependencies: {
    coreNetwork: {
      type: "CoreNetwork",
      group: "NetworkManager",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("CoreNetworkId"),
          tap((CoreNetworkId) => {
            assert(CoreNetworkId);
          }),
        ]),
    },
    vpnConnection: {
      type: "VpnConnection",
      group: "EC2",
      parent: true,
      dependencyId:
        ({ lives, config }) =>
        (live) =>
          pipe([
            tap((params) => {
              assert(live.ResourceArn);
            }),
            lives.getByType({
              type: "VpnConnection",
              group: "EC2",
            }),
            find(eq(get("live.Arn"), live.ResourceArn)),
            get("id"),
            tap((id) => {
              //assert(id);
            }),
          ])(),
    },
  },
  omitProperties: [
    "VpnConnectionArn",
    "CoreNetworkId",
    "CoreNetworkArn",
    "AttachmentId",
    "State",
    "ResourceArn",
    "AttachmentPolicyRuleNumber",
    "Arn",
    "CreatedAt",
    "UpdatedAt",
  ],
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkManager.html#getSiteToSiteAttachment-property
  getById: {
    method: "getSiteToSiteVpnAttachment",
    pickId,
    getField: "SiteToSiteVpnAttachment.Attachment",
    decorate,
  },
  getList: {
    enhanceParams: () => () => ({ AttachmentType: "SITE_TO_SITE_VPN" }),
    method: "listAttachments",
    getParam: "Attachments",
    decorate: ({ getById }) => getById,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkManager.html#createSiteToSiteVpnAttachment-property
  create: {
    method: "createSiteToSiteVpnAttachment",
    pickCreated: ({ payload: { VpnConnectionArn, CoreNetworkId }, endpoint }) =>
      pipe([
        tap((params) => {
          assert(VpnConnectionArn);
        }),
        () => ({
          CoreNetworkId,
          AttachmentType: "SITE_TO_SITE_VPN",
        }),
        endpoint().listAttachments,
        get("Attachments"),
        find(eq(get("ResourceArn"), VpnConnectionArn)),
      ]),
  },
  // TODO up update function
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkManager.html#deleteSiteToSiteAttachment-property
  destroy: {
    method: "deleteAttachment",
    pickId,
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { coreNetwork, vpnConnection },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(coreNetwork);
        assert(vpnConnection);
      }),
      () => ({
        CoreNetworkId: getField(coreNetwork, "CoreNetworkId"),
        VpnConnectionArn: getField(vpnConnection, "Arn"),
        Tags: buildTags({ config, namespace, name, UserTags: Tags }),
      }),
      defaultsDeep(otherProps),
    ])(),
});
