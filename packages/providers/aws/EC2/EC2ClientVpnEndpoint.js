const assert = require("assert");
const {
  pipe,
  tap,
  get,
  eq,
  pick,
  map,
  set,
  assign,
  switchCase,
} = require("rubico");
const { defaultsDeep, when, find, identity } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { omitIfEmpty } = require("@grucloud/core/Common");
const { replaceWithName } = require("@grucloud/core/Common");

const { buildTags, findNameInTagsOrId } = require("../AwsCommon");
const { tagResource, untagResource } = require("./EC2Common");

const findId = () => pipe([get("ClientVpnEndpointId")]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2ClientVpnEndpoint = ({ compare }) => ({
  type: "ClientVpnEndpoint",
  package: "ec2",
  client: "EC2",
  ignoreErrorCodes: ["InvalidClientVpnEndpointId.NotFound"],
  findName: findNameInTagsOrId({ findId }),
  findId,
  cannotBeDeleted: () => eq(get("Status.Code"), "deleted"),
  omitProperties: [
    "ClientVpnEndpointId",
    "CreationTime",
    "ServerCertificateArn",
    "DnsName",
    "SecurityGroupIds",
    "VpcId",
    "Status",
    "ClientConnectOptions.Status",
    "AuthenticationOptions[].MutualAuthentication.ClientRootCertificateChain",
    "SelfServicePortalUrl",
    "ConnectionLogOptions.CloudwatchLogGroup",
    "ConnectionLogOptions.CloudwatchLogStream",
  ],
  ignoreResource: () => pipe([get("live"), eq(get("State"), "deleted")]),
  propertiesDefault: {
    VpnPort: 443,
    SessionTimeoutHours: 24,
    ClientLoginBannerOptions: { Enabled: false },
    ConnectionLogOptions: {
      Enabled: false,
    },
    ClientConnectOptions: {
      Enabled: false,
    },
    SplitTunnel: false,
    VpnProtocol: "openvpn",
    TransportProtocol: "udp",
  },
  compare: compare({ filterAll: () => pick([]) }),
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      omitIfEmpty(["Description"]),
      assign({
        AuthenticationOptions: pipe([
          get("AuthenticationOptions"),
          map(
            pipe([
              switchCase([
                eq(get("Type"), "certificate-authentication"),
                pipe([
                  assign({
                    MutualAuthentication: pipe([
                      get("MutualAuthentication"),
                      assign({
                        ClientRootCertificateChainArn: pipe([
                          get("ClientRootCertificateChain"),
                          tap((params) => {
                            assert(true);
                          }),
                          replaceWithName({
                            groupType: "ACM::Certificate",
                            path: "id",
                            providerConfig,
                            lives,
                          }),
                        ]),
                      }),
                    ]),
                  }),
                ]),
                identity,
              ]),
            ])
          ),
        ]),
      }),
    ]),
  dependencies: {
    vpc: {
      type: "Vpc",
      group: "EC2",
      dependencyId: ({ lives, config }) => get("VpcId"),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      excludeDefaultDependencies: true,
      dependencyIds: ({ lives, config }) => get("SecurityGroupIds"),
    },
    cloudWatchLogGroup: {
      type: "LogGroup",
      group: "CloudWatchLogs",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("ConnectionLogOptions.CloudwatchLogGroup"),
          lives.getByName({
            providerName: config.providerName,
            type: "LogGroup",
            group: "CloudWatchLogs",
          }),
          get("id"),
        ]),
    },
    // cloudWatchLogStream: {
    //   type: "LogStream",
    //   group: "CloudWatchLogs",
    //   dependencyId: ({ lives, config }) =>
    //     pipe([
    //       get("ConnectionLogOptions.CloudwatchLogStream"),
    //       (logStream) =>
    //         pipe([
    //             lives.getByType({
    //               providerName: config.providerName,
    //               type: "LogStream",
    //               group: "CloudWatchLogs",
    //             }),
    //           find(pipe([eq(get("live.logStreamName"), logStream)])),
    //           get("id"),
    //         ])(),
    //     ]),
    // },
    serverCertificate: {
      type: "Certificate",
      group: "ACM",
      dependencyId: ({ lives, config }) => get("ServerCertificateArn"),
    },
    clientCertificate: {
      type: "Certificate",
      group: "ACM",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("AuthenticationOptions"),
          find(get("MutualAuthentication.ClientRootCertificateChain")),
          get("MutualAuthentication.ClientRootCertificateChain"),
        ]),
    },
  },
  getById: {
    method: "describeClientVpnEndpoints",
    getField: "ClientVpnEndpoints",
    pickId: pipe([
      ({ ClientVpnEndpointId }) => ({
        ClientVpnEndpointIds: [ClientVpnEndpointId],
      }),
    ]),
  },
  getList: {
    method: "describeClientVpnEndpoints",
    getParam: "ClientVpnEndpoints",
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createClientVpnEndpoint-property
  create: {
    method: "createClientVpnEndpoint",
    pickCreated: ({ payload }) => pipe([pick(["ClientVpnEndpointId"])]),
    configIsUp: { retryCount: 20 * 10, retryDelay: 5e3 },
  },
  destroy: {
    method: "deleteClientVpnEndpoint",
    pickId: pick(["ClientVpnEndpointId"]),
    isInstanceDown: pipe([eq(get("Status.Code"), "deleted")]),
  },
  getByName: getByNameCore,
  tagger: () => ({ tagResource: tagResource, untagResource: untagResource }),

  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {
      vpc,
      securityGroups,
      cloudWatchLogGroup,
      cloudWatchLogStream,
      serverCertificate,
    },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      () => otherProps,
      defaultsDeep({
        TagSpecifications: [
          {
            ResourceType: "client-vpn-endpoint",
            Tags: buildTags({ config, namespace, name, UserTags: Tags }),
          },
        ],
      }),
      when(
        () => vpc,
        defaultsDeep({
          VpcId: getField(vpc, "VpcId"),
        })
      ),
      when(
        () => securityGroups,
        defaultsDeep({
          SecurityGroupIds: pipe([
            () => securityGroups,
            map((sg) => getField(sg, "GroupId")),
          ])(),
        })
      ),
      when(
        () => cloudWatchLogGroup,
        pipe([
          set("ConnectionLogOptions", {
            Enabled: true,
            CloudwatchLogGroup: cloudWatchLogGroup.config.logGroupName,
            // CloudwatchLogStream: getField(
            //   cloudWatchLogStream,
            //   "logStreamName"
            // ),
          }),
        ])
      ),
      when(
        () => serverCertificate,
        defaultsDeep({
          ServerCertificateArn: getField(serverCertificate, "CertificateArn"),
        })
      ),
      tap((params) => {
        assert(true);
      }),
    ])(),
});
