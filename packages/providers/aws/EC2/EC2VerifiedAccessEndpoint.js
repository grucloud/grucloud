const assert = require("assert");
const { pipe, tap, get, pick, map, assign } = require("rubico");
const { defaultsDeep, isIn, when, callProp, first } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");
const { findNameInTagsOrId } = require("../AwsCommon");

const { tagResource, untagResource } = require("./EC2Common");

const findId = () =>
  pipe([
    get("VerifiedAccessEndpointId"),
    tap((id) => {
      assert(id);
    }),
  ]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assign({
      EndpointDomainPrefix: pipe([
        get("EndpointDomain"),
        callProp("split", "."),
        first,
      ]),
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2VerifiedAccessEndpoint = () => ({
  type: "VerifiedAccessEndpoint",
  package: "ec2",
  client: "EC2",
  propertiesDefault: {},
  omitProperties: [
    "VerifiedAccessInstanceId",
    "VerifiedAccessGroupId",
    "VerifiedAccessEndpointId",
    "Status",
    "CreationTime",
    "LastUpdatedTime",
    "DeletionTime",
    "EndpointDomain",
    "DeviceValidationDomain",
    "DomainCertificateArn",
    "SecurityGroupIds",
    "NetworkInterfaceOptions.NetworkInterfaceId",
    "LoadBalancerOptions.LoadBalancerArn",
    "LoadBalancerOptions.SubnetIds",
  ],
  findName: findNameInTagsOrId({ findId }),
  findId,
  ignoreErrorCodes: ["InvalidVerifiedAccessEndpointId.NotFound"],
  dependencies: {
    certificate: {
      type: "Certificate",
      group: "ACM",
      dependencyId: ({ lives, config }) => pipe([get("DomainCertificateArn")]),
    },
    loadBalancer: {
      type: "LoadBalancer",
      group: "ElasticLoadBalancingV2",
      dependencyId: ({ lives, config }) =>
        get("LoadBalancerOptions.LoadBalancerArn"),
    },
    networkInterface: {
      type: "NetworkInterface",
      group: "EC2",
      dependencyId: ({ lives, config }) =>
        get("NetworkInterfaceOptions.NetworkInterfaceId"),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => get("SecurityGroupIds"),
    },
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        get("LoadBalancerOptions.SubnetIds"),
    },
    verifiedAccessGroup: {
      type: "VerifiedAccessGroup",
      group: "EC2",
      dependencyId: ({ lives, config }) => get("VerifiedAccessGroupId"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeVerifiedAccessEndpoints-property
  getById: {
    method: "describeVerifiedAccessEndpoints",
    getField: "VerifiedAccessEndpoints",
    pickId: pipe([
      tap(({ VerifiedAccessEndpointId }) => {
        assert(VerifiedAccessEndpointId);
      }),
      ({ VerifiedAccessEndpointId }) => ({
        VerifiedAccessEndpointIds: [VerifiedAccessEndpointId],
      }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeVerifiedAccessEndpoints-property
  getList: {
    method: "describeVerifiedAccessEndpoints",
    getParam: "VerifiedAccessEndpoints",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createVerifiedAccessEndpoint-property
  create: {
    method: "createVerifiedAccessEndpoint",
    pickCreated: ({ payload }) => pipe([get("VerifiedAccessEndpoint")]),
    isInstanceUp: pipe([get("Status.Code"), isIn(["active"])]),
    isInstanceError: pipe([get("State.Code"), isIn(["failed"])]),
    getErrorMessage: pipe([get("Status.Message", "FAILED")]),
    configIsUp: { retryCount: 30 * 12, retryDelay: 5e3 },
  },
  // TODO No update
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteVerifiedAccessEndpoint-property
  destroy: {
    method: "deleteVerifiedAccessEndpoint",
    pickId: pipe([pick(["VerifiedAccessEndpointId"])]),
  },
  getByName: getByNameCore,
  tagger: () => ({ tagResource, untagResource }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {
      certificate,
      verifiedAccessGroup,
      loadBalancer,
      networkInterface,
      securityGroups,
      subnets,
    },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(verifiedAccessGroup);
      }),
      () => otherProps,
      defaultsDeep({
        VerifiedAccessGroupId: getField(
          verifiedAccessGroup,
          "VerifiedAccessGroupId"
        ),
        TagSpecifications: [
          {
            ResourceType: "verified-access-endpoint",
            Tags: buildTags({ config, namespace, name, UserTags: Tags }),
          },
        ],
      }),
      when(
        () => certificate,
        defaultsDeep({
          DomainCertificateArn: getField(certificate, "CertificateArn"),
        })
      ),
      when(
        () => loadBalancer,
        defaultsDeep({
          LoadBalancerOptions: {
            LoadBalancerArn: getField(loadBalancer, "LoadBalancerArn"),
          },
        })
      ),
      when(
        () => subnets,
        defaultsDeep({
          LoadBalancerOptions: {
            SubnetIds: pipe([
              () => subnets,
              map((subnet) => getField(subnet, "SubnetId")),
            ])(),
          },
        })
      ),
      when(
        () => securityGroups,
        defaultsDeep({
          SecurityGroupIds: pipe([
            () => securityGroups,
            map((securityGroup) => getField(securityGroup, "GroupId")),
          ])(),
        })
      ),
      when(
        () => networkInterface,
        defaultsDeep({
          NetworkInterfaceOptions: {
            NetworkInterfaceId: getField(
              networkInterface,
              "NetworkInterfaceId"
            ),
          },
        })
      ),
    ])(),
});
