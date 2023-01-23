const assert = require("assert");
const { pipe, tap, get, pick, assign, or } = require("rubico");
const { defaultsDeep, first, when, isEmpty, unless } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags, hasKeyInTags } = require("../AwsCommon");

const { tagResource, untagResource } = require("./ELBCommon");

const pickId = pipe([
  tap(({ TargetGroupArn }) => {
    assert(TargetGroupArn);
  }),
  pick(["TargetGroupArn"]),
]);

const managedByOther = () =>
  pipe([
    or([
      hasKeyInTags({
        key: "elbv2.k8s.aws/cluster",
      }),
      hasKeyInTags({
        key: "elasticbeanstalk:environment-id",
      }),
    ]),
  ]);

// const findNamespace = findNamespaceInTagsOrEksCluster({
//   key: "elbv2.k8s.aws/cluster",
// });

const assignTags = ({ endpoint }) =>
  unless(
    isEmpty,
    assign({
      Tags: pipe([
        ({ TargetGroupArn }) =>
          endpoint().describeTags({ ResourceArns: [TargetGroupArn] }),
        get("TagDescriptions"),
        first,
        get("Tags"),
      ]),
    })
  );

const decorate = ({ endpoint }) =>
  pipe([
    ({ TargetGroupName, ...other }) => ({ Name: TargetGroupName, ...other }),
    assignTags({ endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElasticLoadBalancingV2.html
exports.ElasticLoadBalancingV2TargetGroup = () => ({
  type: "TargetGroup",
  package: "elastic-load-balancing-v2",
  client: "ElasticLoadBalancingV2",
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
      get("TargetGroupArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  managedByOther,
  ignoreErrorCodes: ["TargetGroupNotFound", "TargetGroupNotFoundException"],
  dependencies: {
    vpc: {
      type: "Vpc",
      group: "EC2",
      dependencyId: ({ lives, config }) => get("VpcId"),
    },
    //TODO autoScalingGroup
  },
  propertiesDefault: {
    HealthCheckPath: "/",
    HealthCheckPort: "traffic-port",
    HealthCheckEnabled: true,
    HealthCheckIntervalSeconds: 30,
    HealthCheckTimeoutSeconds: 5,
    HealthyThresholdCount: 5,
    UnhealthyThresholdCount: 2,
    Matcher: { HttpCode: "200" },
    TargetType: "instance",
    ProtocolVersion: "HTTP1",
    IpAddressType: "ipv4",
  },
  omitProperties: ["TargetGroupArn", "LoadBalancerArns"],
  filterLive: () =>
    pick([
      "Name",
      "Protocol",
      "Port",
      "HealthCheckProtocol",
      "HealthCheckPort",
      "HealthCheckEnabled",
      "HealthCheckIntervalSeconds",
      "HealthCheckTimeoutSeconds",
      "HealthyThresholdCount",
      "HealthCheckPath",
      "Matcher",
      "TargetType",
      "ProtocolVersion",
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElasticLoadBalancingV2.html#getTargetGroup-property
  getById: {
    pickId: ({ TargetGroupArn, Names }) => ({
      TargetGroupArns: [TargetGroupArn],
      Names,
    }),
    method: "describeTargetGroups",
    getField: "TargetGroups",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElasticLoadBalancingV2.html#listTargetGroups-property
  getList: {
    method: "describeTargetGroups",
    getParam: "TargetGroups",
    decorate,
  },

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElasticLoadBalancingV2.html#createTargetGroup-property
  create: {
    method: "createTargetGroup",
    pickCreated: () => pipe([get("TargetGroups"), first]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElasticLoadBalancingV2.html#updateTargetGroup-property
  //TODO
  // update: {
  //   method: "updateTargetGroup",
  //   filterParams: ({ payload, diff, live }) =>
  //     pipe([() => payload, defaultsDeep(pickId(live))])(),
  // },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElasticLoadBalancingV2.html#deleteTargetGroup-property
  destroy: {
    method: "deleteTargetGroup",
    pickId,
  },
  getByName: getByNameCore,
  tagger: ({ config }) => ({ tagResource, untagResource }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { vpc },
    config,
  }) =>
    pipe([
      tap(() => {
        //assert(vpc);
      }),
      () => otherProps,
      defaultsDeep({
        //TODO move to propertiesDefault
        Protocol: "HTTP",
        Tags: buildTags({ name, namespace, config, UserTags: Tags }),
      }),
      when(() => vpc, assign({ VpcId: () => getField(vpc, "VpcId") })),
    ])(),
});
