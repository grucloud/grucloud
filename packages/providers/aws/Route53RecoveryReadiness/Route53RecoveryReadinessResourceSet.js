const assert = require("assert");
const { pipe, tap, get, omit, pick, map, flatMap } = require("rubico");
const { defaultsDeep, callProp, last } = require("rubico/x");
const { buildTagsObject } = require("@grucloud/core/Common");

const { createAwsResource } = require("../AwsClient");
const {
  tagResource,
  untagResource,
} = require("./Route53RecoveryReadinessCommon");

const ResourceSetDependencies = {
  apiGatewayStage: { type: "Stage", group: "APIGateway" },
  apiGatewayV2Stage: { type: "Stage", group: "ApiGatewayV2" },
  autoScalingGroup: { type: "AutoScalingGroup", group: "AutoScaling" },
  cloudWatchAlarm: { type: "MetricAlarm", group: "CloudWatch" },
  customerGateway: { type: "CustomerGateway", group: "EC2" },
  dynamoDBTable: { type: "Table", group: "DynamoDB" },
  ec2Volume: { type: "Volume", group: "EC2" },
  elbV2LoadBalancer: { type: "LoadBalancer", group: "ElasticLoadBalancingV2" },
  lambdaFunction: { type: "Function", group: "Lambda" },
  //TODO
  //mskCluster: { type: "Cluster", group: "MSK" },
  rdsDBCluster: { type: "DBCluster", group: "RDS" },
  route53HealthCheck: { type: "HealthCheck", group: "Route53" },
  sqsQueue: { type: "Queue", group: "SQS" },
  snsTopic: { type: "Topic", group: "SNS" },
  snsSubscription: { type: "Subscription", group: "SNS" },
  vpc: { type: "Vpc", group: "EC2" },
  vpnConnection: { type: "VpnConnection", group: "EC2" },
  vpnGateway: { type: "VpnGateway", group: "EC2" },
  //TODO
  route53RecoveryReadinessDNSTargetResource: {
    type: "DNSTargetResource",
    group: "Route53RecoveryReadiness",
  },
};

exports.ResourceSetDependencies = ResourceSetDependencies;

const pickId = pipe([pick(["ResourceSetName"])]);

const model = ({ config }) => ({
  package: "route53-recovery-readiness",
  client: "Route53RecoveryReadiness",
  region: "us-west-2",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryReadiness.html#getResourceSet-property
  getById: {
    method: "getResourceSet",
    pickId,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryReadiness.html#listResourceSets-property
  getList: {
    method: "listResourceSets",
    getParam: "ResourceSets",
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryReadiness.html#createResourceSet-property
  create: {
    method: "createResourceSet",
    pickCreated: ({ payload }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryReadiness.html#updateResourceSet-property
  update: {
    method: "updateResourceSet",
    filterParams: ({ payload, live }) =>
      pipe([() => payload, omit(["Tags"])])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryReadiness.html#deleteResourceSet-property
  destroy: { method: "deleteResourceSet", pickId },
});

const findDependenciesResourceSet = ({ live, lives, config }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    () => live,
    get("ResourceSetType"),
    tap((ResourceSetType) => {
      assert(ResourceSetType);
    }),
    callProp("split", "::"),
    ([prefix, group, type]) =>
      pipe([
        tap((params) => {
          assert(group);
          assert(type);
        }),
        () => live,
        get("Resources"),
        map(({ ResourceArn }) =>
          pipe([
            tap(() => {
              assert(ResourceArn);
            }),
            () =>
              lives.getById({
                id: ResourceArn,
                type,
                group,
                config: config.providerName,
              }),
            get("id"),
            tap((id) => {
              assert(id);
            }),
          ])()
        ),
        (ids) => ({ type, group, ids }),
      ])(),
  ])();

const findDependenciesReadinessScope = ({ live, lives, config }) =>
  pipe([
    () => live,
    get("Resources"),
    flatMap(({ ReadinessScopes }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        () => ReadinessScopes,
        map(
          pipe([
            (id) =>
              lives.getById({
                id,
                type: "Cell",
                group: "Route53RecoveryReadiness",
                config: config.providerName,
              }),
            get("id"),
            tap((id) => {
              assert(id);
            }),
          ])
        ),
      ])()
    ),
    tap((params) => {
      assert(true);
    }),
    (ids) => ({ type: "Cell", group: "Route53RecoveryReadiness", ids }),
  ])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryReadiness.html
exports.Route53RecoveryReadinessResourceSet = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: pipe([get("live.ResourceSetName")]),
    findId: pipe([get("live.ResourceSetArn")]),
    getByName: ({ getList, endpoint, getById }) =>
      pipe([
        ({ name }) => ({ ResourceSetName: name }),
        getById({}),
        tap((params) => {
          assert(true);
        }),
      ]),
    findDependencies: ({ live, lives }) => [
      findDependenciesResourceSet({ live, lives, config }),
      findDependenciesReadinessScope({ live, lives, config }),
    ],
    tagResource: tagResource,
    untagResource: untagResource,
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: {},
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          ResourceSetName: name,
          Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
        }),
      ])(),
  });
