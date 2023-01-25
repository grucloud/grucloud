const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  eq,
  not,
  any,
  assign,
  and,
  fork,
  switchCase,
} = require("rubico");
const {
  defaultsDeep,
  when,
  flatten,
  includes,
  pluck,
  find,
} = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { replaceWithName } = require("@grucloud/core/Common");
const { buildTags, findNameInTagsOrId } = require("../AwsCommon");
const { tagResource, untagResource } = require("./EC2Common");

const findId = () => pipe([get("CustomerGatewayId")]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2CustomerGateway = ({ compare }) => ({
  type: "CustomerGateway",
  package: "ec2",
  client: "EC2",
  ignoreErrorCodes: ["InvalidCustomerGatewayID.NotFound"],
  findName: findNameInTagsOrId({ findId }),
  findId,
  cannotBeDeleted: () => eq(get("State"), "deleted"),
  omitProperties: ["CustomerGatewayId", "CertificateArn", "State"],
  ignoreResource: () => pipe([get("live"), eq(get("State"), "deleted")]),
  propertiesDefault: { Type: "ipsec.1" },
  compare: compare({ filterAll: () => pick([]) }),
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      assign({
        IpAddress: ({ IpAddress }) =>
          pipe([
            () => lives,
            fork({
              ipAddressAzure: pipe([
                find(
                  and([
                    eq(get("groupType"), "Network::PublicIPAddress"),
                    eq(get("live.properties.ipAddress"), IpAddress),
                  ])
                ),
                get("id"),
              ]),
              ipAddressGoogle: pipe([
                find(
                  and([
                    eq(get("groupType"), "compute::Address"),
                    eq(get("live.address"), IpAddress),
                  ])
                ),
                get("id"),
              ]),
            }),
            switchCase([
              get("ipAddressAzure"),
              pipe([
                get("ipAddressAzure"),
                replaceWithName({
                  groupType: "Network::PublicIPAddress",
                  pathLive: "id",
                  path: "live.properties.ipAddress",
                  providerConfig,
                  lives,
                }),
              ]),
              get("ipAddressGoogle"),
              pipe([
                get("ipAddressGoogle"),
                replaceWithName({
                  groupType: "compute::Address",
                  pathLive: "id",
                  path: "live.address",
                  providerConfig,
                  lives,
                }),
              ]),
              () => IpAddress,
            ]),
          ])(),
      }),
    ]),
  dependencies: {
    certificate: {
      type: "Certificate",
      group: "ACM",
      dependencyId: ({ lives, config }) => get("CertificateArn"),
    },
    ipAddressAzure: {
      type: "PublicIPAddress",
      group: "Network",
      providerType: "azure",
      dependencyId:
        ({ lives, config }) =>
        ({ IpAddress }) =>
          pipe([
            tap((params) => {
              assert(IpAddress);
            }),
            lives.getByType({
              providerType: "azure",
              type: "PublicIPAddress",
              group: "Network",
            }),
            find(eq(get("live.properties.ipAddress"), IpAddress)),
            get("id"),
          ])(),
    },
    ipAddressGoogle: {
      type: "Address",
      group: "compute",
      providerType: "google",
      dependencyId:
        ({ lives, config }) =>
        ({ IpAddress }) =>
          pipe([
            tap((params) => {
              assert(IpAddress);
            }),
            lives.getByType({
              providerType: "google",
              type: "Address",
              group: "compute",
            }),
            find(eq(get("live.address"), IpAddress)),
            get("id"),
          ])(),
    },
    virtualNetworkGatewayAzure: {
      type: "VirtualNetworkGateway",
      group: "Network",
      providerType: "azure",
      dependencyId:
        ({ lives, config }) =>
        ({ IpAddress }) =>
          pipe([
            lives.getByType({
              providerType: "azure",
              type: "VirtualNetworkGateway",
              group: "Network",
            }),
            find(
              pipe([
                get("live.properties.bgpSettings.bgpPeeringAddresses"),
                pluck("tunnelIpAddresses"),
                flatten,
                any(includes(IpAddress)),
              ])
            ),
            get("id"),
          ])(),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeCustomerGateways-property
  getById: {
    method: "describeCustomerGateways",
    getField: "CustomerGateways",
    pickId: pipe([
      ({ CustomerGatewayId }) => ({ CustomerGatewayIds: [CustomerGatewayId] }),
    ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeCustomerGateways-property
  getList: {
    method: "describeCustomerGateways",
    getParam: "CustomerGateways",
    filterResource: pipe([not(eq(get("State"), "deleted"))]),
  },
  create: {
    method: "createCustomerGateway",
    pickCreated: ({ payload }) => pipe([get("CustomerGateway")]),
    isInstanceUp: pipe([eq(get("State"), "available")]),
  },
  destroy: {
    method: "deleteCustomerGateway",
    pickId: pipe([pick(["CustomerGatewayId"])]),
    isInstanceDown: pipe([eq(get("State"), "deleted")]),
  },
  getByName: getByNameCore,
  tagger: () => ({ tagResource: tagResource, untagResource: untagResource }),

  configDefault: ({
    name,
    namespace,
    properties: { Tags, IpAddress, ...otherProps },
    dependencies: { certificate },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        PublicIp: IpAddress,
        TagSpecifications: [
          {
            ResourceType: "customer-gateway",
            Tags: buildTags({ config, namespace, name, UserTags: Tags }),
          },
        ],
      }),
      when(
        () => certificate,
        defaultsDeep({
          CertificateArn: getField(certificate, "CertificateArn"),
        })
      ),
    ])(),
});
