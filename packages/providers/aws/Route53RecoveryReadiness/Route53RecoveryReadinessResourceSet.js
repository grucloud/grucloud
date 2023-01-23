const assert = require("assert");
const { pipe, tap, get, omit, pick, map, flatMap } = require("rubico");
const { defaultsDeep, callProp } = require("rubico/x");
const { buildTagsObject } = require("@grucloud/core/Common");
const { replaceWithName } = require("@grucloud/core/Common");

const { Tagger } = require("./Route53RecoveryReadinessCommon");

const buildArn = () =>
  pipe([
    get("ResourceSetArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

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

const pickId = pipe([pick(["ResourceSetName"])]);

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
            () => ResourceArn,
            lives.getById({
              id: type,
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
            (id) => id,
            lives.getById({
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
exports.Route53RecoveryReadinessResourceSet = ({}) => ({
  type: "ResourceSet",
  package: "route53-recovery-readiness",
  client: "Route53RecoveryReadiness",
  region: "us-west-2",
  inferName: () => get("ResourceSetName"),
  findName: () => pipe([get("ResourceSetName")]),
  findId: () => pipe([get("ResourceSetArn")]),

  dependencies: {
    cells: {
      type: "Cell",
      group: "Route53RecoveryReadiness",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("Resources"), flatMap(get("ReadinessScopes"))]),
    },
    ...ResourceSetDependencies,
  },

  omitProperties: ["ResourceSetArn"],
  filterLive:
    ({ lives, providerConfig }) =>
    (live) =>
      pipe([
        () => live,
        assign({
          Resources: pipe([
            get("Resources"),
            map(
              assign({
                ReadinessScopes: pipe([
                  get("ReadinessScopes"),
                  map(
                    replaceWithName({
                      groupType: "Route53RecoveryReadiness::Cell",
                      providerConfig,
                      lives,
                      path: "id",
                    })
                  ),
                ]),
                ResourceArn: pipe([
                  get("ResourceArn"),
                  replaceWithName({
                    groupType: pipe([
                      () => live.ResourceSetType,
                      callProp("replace", "AWS::", ""),
                    ])(),
                    providerConfig,
                    lives,
                    path: "id",
                  }),
                ]),
              })
            ),
          ]),
        }),
      ])(),
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
  getByName: ({ getList, endpoint, getById }) =>
    pipe([
      ({ name }) => ({ ResourceSetName: name }),
      getById({}),
      tap((params) => {
        assert(true);
      }),
    ]),
  findDependencies: ({ live, lives, config }) => [
    findDependenciesResourceSet({ live, lives, config }),
    findDependenciesReadinessScope({ live, lives, config }),
  ],
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        ResourceSetName: name,
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
      }),
    ])(),
});
