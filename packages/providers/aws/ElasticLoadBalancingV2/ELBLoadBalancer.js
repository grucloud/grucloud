const assert = require("assert");
const { pipe, tap, get, pick, eq, assign, map, or } = require("rubico");
const {
  defaultsDeep,
  first,
  isEmpty,
  unless,
  pluck,
  callProp,
  when,
} = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags, hasKeyInTags } = require("../AwsCommon");

const { tagResource, untagResource } = require("./ELBCommon");

const logger = require("@grucloud/core/logger")({
  prefix: "LoadBalancer",
});

const pickId = pipe([
  tap(({ LoadBalancerArn }) => {
    assert(LoadBalancerArn);
  }),
  pick(["LoadBalancerArn"]),
]);

const assignTags = ({ endpoint }) =>
  unless(
    isEmpty,
    assign({
      Tags: pipe([
        ({ LoadBalancerArn }) => ({ ResourceArns: [LoadBalancerArn] }),
        endpoint().describeTags,
        get("TagDescriptions"),
        first,
        get("Tags"),
      ]),
    })
  );

const decorate = ({ endpoint }) =>
  pipe([
    ({ LoadBalancerName, ...other }) => ({
      Name: LoadBalancerName,
      ...other,
    }),
    assignTags({ endpoint }),
    assign({ DNSName: pipe([get("DNSName", ""), callProp("toLowerCase")]) }),
  ]);

const managedByOther = () =>
  or([
    hasKeyInTags({
      key: "elbv2.k8s.aws/cluster",
    }),
    hasKeyInTags({
      key: "elasticbeanstalk:environment-id",
    }),
  ]);

const ignoreErrorCodes = [
  "LoadBalancerNotFound",
  "LoadBalancerNotFoundException",
];

// const findNamespace = findNamespaceInTagsOrEksCluster({
//   config,
//   key: "elbv2.k8s.aws/cluster",
// });

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElasticLoadBalancingV2.html
exports.ElasticLoadBalancingV2LoadBalancer = () => ({
  type: "LoadBalancer",
  package: "elastic-load-balancing-v2",
  client: "ElasticLoadBalancingV2",
  propertiesDefault: {},
  inferName: () =>
    pipe([
      get("Name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("Name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("LoadBalancerArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes,
  managedByOther,
  dependencies: {
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("AvailabilityZones"), pluck("SubnetId")]),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => get("SecurityGroups"),
    },
  },
  omitProperties: [
    "Subnets",
    "LoadBalancerArn",
    "DNSName",
    "CanonicalHostedZoneId",
    "CreatedTime",
    "LoadBalancerName",
    "VpcId",
    "State",
    "AvailabilityZones",
    "SecurityGroups",
  ],
  filterLive: () => pick(["Name", "Scheme", "Type", "IpAddressType"]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElasticLoadBalancingV2.html#getLoadBalancer-property
  getById: {
    pickId: pipe([
      tap(({ Name }) => {
        assert(Name);
      }),
      ({ Name }) => ({ Names: [Name] }),
    ]),
    method: "describeLoadBalancers",
    getField: "LoadBalancers",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElasticLoadBalancingV2.html#listLoadBalancers-property
  getList: {
    method: "describeLoadBalancers",
    getParam: "LoadBalancers",
    decorate,
  },

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElasticLoadBalancingV2.html#createLoadBalancer-property
  create: {
    method: "createLoadBalancer",
    isInstanceUp: pipe([
      tap(({ State }) => {
        logger.info(`createLoadBalancer state: ${State.Code}`);
      }),
      eq(get("State.Code"), "active"),
    ]),
    isInstanceError: eq(get("State.Code"), "failed"),
    getErrorMessage: get("State.Reason", "failed"),
    pickCreated: ({ payload }) => pipe([() => payload]),
    config: { retryCount: 60 * 10, retryDelay: 10e3 },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElasticLoadBalancingV2.html#updateLoadBalancer-property
  update: {
    method: "updateLoadBalancer",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElasticLoadBalancingV2.html#deleteLoadBalancer-property
  destroy: {
    pickId,
    method: "deleteLoadBalancer",
  },
  getByName: ({ getById }) =>
    pipe([({ name }) => ({ Name: name }), getById({})]),
  tagger: ({ config }) => ({ tagResource, untagResource }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { subnets, securityGroups },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(Array.isArray(subnets));
      }),
      () => otherProps,
      defaultsDeep({
        Type: "application",
        Scheme: "internet-facing",
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
        Subnets: map((subnet) => getField(subnet, "SubnetId"))(subnets),
      }),
      when(
        () => securityGroups,
        defaultsDeep({
          SecurityGroups: map((securityGroup) =>
            getField(securityGroup, "GroupId")
          )(securityGroups),
        })
      ),
      tap((result) => {
        assert(result);
      }),
    ])(),
});
