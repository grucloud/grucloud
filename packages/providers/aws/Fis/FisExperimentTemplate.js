const assert = require("assert");
const { pipe, tap, get, pick, assign, map, filter, eq } = require("rubico");
const {
  defaultsDeep,
  pluck,
  when,
  values,
  find,
  unless,
  isEmpty,
} = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");
const { replaceWithName } = require("@grucloud/core/Common");

const { replaceAccountAndRegion } = require("../AwsCommon");

const { Tagger } = require("./FisCommon");

const targetDependencies = {
  ec2EbsVolume: {
    type: "Volume",
    group: "EC2",
    resourceType: "aws:ec2:ebs-volume",
    arnKey: "Arn",
  },
  ec2Instance: {
    type: "Instance",
    group: "EC2",
    resourceType: "aws:ec2:instance",
    arnKey: "Arn",
  },
  ec2SpotInstance: {
    type: "SpotInstance",
    group: "EC2",
    resourceType: "aws:ec2:spot-instance",
    arnKey: "Arn",
  },
  ec2Subnet: {
    type: "Subnet",
    group: "EC2",
    resourceType: "aws:ec2:subnet",
    arnKey: "SubnetArn",
  },
  ecsCluster: {
    type: "Cluster",
    group: "ECS",
    resourceType: "aws:ecs:cluster",
    arnKey: "clusterArn",
  },
  ecsTask: {
    type: "Task",
    group: "ECS",
    resourceType: "aws:ecs:task",
    arnKey: "taskArn",
  },
  eksCluster: {
    type: "Cluster",
    group: "EKS",
    resourceType: "aws:eks:cluster",
    arnKey: "clusterArn",
  },
  eksNodegroup: {
    type: "NodeGroup",
    group: "EKS",
    resourceType: "aws:eks:nodegroup",
    arnKey: "nodegroupArn",
  },
  iamRoleTarget: {
    type: "Role",
    group: "IAM",
    resourceType: "aws:iam:role",
    arnKey: "Arn",
  },
  rdsCluster: {
    type: "Cluster",
    group: "RDS",
    resourceType: "aws:rds:cluster",
    arnKey: "DBClusterArn",
  },
  rdsInstance: {
    type: "Instance",
    group: "RDS",
    resourceType: "aws:rds:db",
    arnKey: "DBInstanceArn",
  },
};

const assignArn = ({ config }) =>
  pipe([
    tap((params) => {
      assert(config);
    }),
    assign({
      arn: pipe([
        tap(({ id }) => {
          assert(id);
        }),
        ({ id }) =>
          `arn:aws:fis:${
            config.region
          }:${config.accountId()}:experiment-template/${id}`,
      ]),
    }),
  ]);

const buildDependencyIds =
  ({ resourceType, arnKey, type, group }) =>
  ({ lives, config }) =>
    pipe([
      tap((params) => {
        assert(arnKey);
      }),
      get("targets"),
      values,
      filter(eq(get("resourceType"), resourceType)),
      pluck("resourceArns"),
      map(
        pipe([
          get("resourceArns"),
          map((resourceArn) =>
            pipe([
              //
              lives.getByType({
                type,
                group,
                providerName: config.providerName,
              }),
              find(eq(get(`live.${arnKey}`), resourceArn)),
              get("id"),
            ])()
          ),
        ])
      ),
    ]);

const buildargetDependencies = pipe([
  () => targetDependencies,
  map(assign({ list: () => true, dependencyIds: buildDependencyIds })),
]);

const buildArn = () =>
  pipe([
    get("arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ id }) => {
    assert(id);
  }),
  pick(["id"]),
]);

const findId = () =>
  pipe([
    get("id"),
    tap((id) => {
      assert(id);
    }),
  ]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignArn({ config }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Fis.html
exports.FisExperimentTemplate = () => ({
  type: "ExperimentTemplate",
  package: "fis",
  client: "Fis",
  propertiesDefault: {},
  omitProperties: [
    "id",
    "arn",
    "creationTime",
    "lastUpdateTime",
    "logConfiguration.cloudWatchLogsConfiguration.logGroupArn",
    "roleArn",
  ],
  inferName: () =>
    pipe([
      get("description"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("description"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId,
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    cloudWatchAlarm: {
      type: "MetricAlarm",
      group: "CloudWatch",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("stopConditions"),
          filter(eq(get("source"), "aws:cloudwatch:alarm")),
          pluck("value"),
        ]),
    },
    iamRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("roleArn"),
          tap((roleArn) => {
            assert(roleArn);
          }),
        ]),
    },
    cloudWatchLogGroup: {
      type: "LogGroup",
      group: "CloudWatchLogs",
      dependencyId: ({ lives, config }) =>
        get("logConfiguration.cloudWatchLogsConfiguration.logGroupArn"),
    },
    s3Bucket: {
      type: "Bucket",
      group: "S3",
      dependencyId: ({ lives, config }) =>
        pipe([get("logConfiguration.s3Configuration.bucketName")]),
    },
    ...buildargetDependencies(),
  },
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        targets: pipe([
          get("targets"),
          when(
            get("resourceArns"),
            assign({
              resourceArns: ({ resourceType, resourceArns }) =>
                pipe([
                  tap(() => {
                    assert(resourceType);
                  }),
                  () => targetDependencies,
                  find(eq(get("resourceType"), resourceType)),
                  unless(isEmpty, ({ type, group, arnKey }) =>
                    pipe([
                      tap(() => {
                        assert(arnKey);
                        assert(type);
                        assert(group);
                      }),
                      () => resourceArns,
                      map(
                        replaceWithName({
                          groupType: `${group}::${type}`,
                          path: "id",
                          pathLive: arnKey,
                          providerConfig,
                          lives,
                        })
                      ),
                    ])()
                  ),
                ])(),
            })
          ),
        ]),
        stopConditions: pipe([
          get("stopConditions"),
          map(
            when(
              eq(get("source"), "aws:cloudwatch:alarm"),
              assign({
                value: pipe([
                  get("value"),
                  replaceWithName({
                    groupType: "CloudWatch::MetricAlarm",
                    path: "id",
                    providerConfig,
                    lives,
                  }),
                ]),
              })
            )
          ),
        ]),
      }),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Fis.html#getExperimentTemplate-property
  getById: {
    method: "getExperimentTemplate",
    getField: "experimentTemplate",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Fis.html#listExperimentTemplates-property
  getList: {
    method: "listExperimentTemplates",
    getParam: "experimentTemplates",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Fis.html#createExperimentTemplate-property
  create: {
    method: "createExperimentTemplate",
    pickCreated: ({ payload }) => pipe([get("experimentTemplate")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Fis.html#updateExperimentTemplate-property
  update: {
    method: "updateExperimentTemplate",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Fis.html#deleteExperimentTemplate-property
  destroy: {
    method: "deleteExperimentTemplate",
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
    properties: { tags, ...otherProps },
    dependencies: { iamRole, cloudWatchLogGroup },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(iamRole);
      }),
      () => otherProps,
      defaultsDeep({
        tags: buildTagsObject({ name, config, namespace, userTags: tags }),
        roleArn: getField(iamRole, "Arn"),
      }),
      when(
        () => cloudWatchLogGroup,
        defaultsDeep({
          logConfiguration: {
            cloudWatchLogsConfiguration: {
              logGroupArn: getField(cloudWatchLogGroup, "arn"),
            },
          },
        })
      ),
    ])(),
});
