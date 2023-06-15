const assert = require("assert");
const { pipe, tap, get, assign, map } = require("rubico");
const { defaultsDeep, isIn, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");
const { findNameInTagsOrId } = require("../AwsCommon");

const { tagResource, untagResource } = require("./EC2Common");

const findId = () =>
  pipe([
    get("ServiceId"),
    tap((id) => {
      assert(id);
    }),
  ]);

const pickId = pipe([
  tap(({ ServiceId }) => {
    assert(ServiceId);
  }),
  ({ ServiceId }) => ({
    ServiceIds: [ServiceId],
  }),
]);

const assignArn = ({ config }) =>
  pipe([
    tap((params) => {
      assert(config);
    }),
    assign({
      Arn: pipe([
        tap(({ ServiceId }) => {
          assert(ServiceId);
        }),
        ({ ServiceId }) =>
          `arn:${config.partition}:ec2:${
            config.region
          }:${config.accountId()}:vpc-endpoint-service/${ServiceId}`,
      ]),
    }),
  ]);

const decorate = ({ config }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    assignArn({ config }),
    when(
      get("PrivateDnsNameConfiguration.Name"),
      assign({ PrivateDnsName: get("PrivateDnsNameConfiguration.Name") })
    ),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2VpcEndpointService = () => ({
  type: "VpcEndpointService",
  package: "ec2",
  client: "EC2",
  propertiesDefault: {},
  omitProperties: [
    "Arn",
    "ServiceId",
    "Owner",
    "ServiceState",
    "NetworkLoadBalancerArns",
    "GatewayLoadBalancerArns",
    "ServiceName",
    "BaseEndpointDnsNames",
    "AvailabilityZones",
    "ServiceType",
    "PrivateDnsNameConfiguration",
    "PayerResponsibility",
    "ManagesVpcEndpoints",
  ],
  findName: findNameInTagsOrId({ findId }),
  findId,
  ignoreErrorCodes: ["InvalidVpcEndpointServiceId.NotFound"],
  dependencies: {
    networkLoadBalancers: {
      type: "LoadBalancer",
      group: "ElasticLoadBalancingV2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("NetworkLoadBalancerArns")]),
    },
    gatewayLoadBalancers: {
      type: "LoadBalancer",
      group: "ElasticLoadBalancingV2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("GatewayLoadBalancerArns")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeVpcEndpointServiceConfigurations-property
  getById: {
    method: "describeVpcEndpointServiceConfigurations",
    getField: "ServiceConfigurations",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeVpcEndpointServiceConfigurations-property
  getList: {
    method: "describeVpcEndpointServiceConfigurations",
    getParam: "ServiceConfigurations",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createVpcEndpointServiceConfiguration-property
  create: {
    method: "createVpcEndpointServiceConfiguration",
    pickCreated: ({ payload }) => pipe([get("ServiceConfiguration")]),
    isInstanceUp: pipe([get("ServiceState"), isIn(["Available"])]),
    isInstanceError: pipe([get("ServiceState"), isIn(["Failed"])]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#modifyVpcEndpointServiceConfiguration-property
  update: {
    method: "modifyVpcEndpointServiceConfiguration",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteVpcEndpointServiceConfiguration-property
  destroy: {
    method: "deleteVpcEndpointServiceConfigurations",
    pickId,
  },
  getByName: getByNameCore,
  tagger: () => ({ tagResource, untagResource }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { networkLoadBalancers, gatewayLoadBalancers },
    config,
  }) =>
    pipe([
      tap((params) => {}),
      () => otherProps,
      defaultsDeep({
        TagSpecifications: [
          {
            ResourceType: "vpc-endpoint-service",
            Tags: buildTags({ config, namespace, name, UserTags: Tags }),
          },
        ],
      }),
      when(
        () => networkLoadBalancers,
        assign({
          NetworkLoadBalancerArns: pipe([
            () => networkLoadBalancers,
            map((lb) => getField(lb, "LoadBalancerArn")),
          ]),
        })
      ),
      when(
        () => gatewayLoadBalancers,
        assign({
          GatewayLoadBalancerArns: pipe([
            () => gatewayLoadBalancers,
            map((lb) => getField(lb, "LoadBalancerArn")),
          ]),
        })
      ),
    ])(),
});
