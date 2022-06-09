const assert = require("assert");
const { pipe, tap, get, switchCase, map, not } = require("rubico");
const { defaultsDeep, first, prepend, find, isEmpty } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags, findNameInTagsOrId } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./EC2Common");

const findId = pipe([get("live.FlowLogId")]);

const createModel = ({ config }) => ({
  package: "ec2",
  client: "EC2",
  ignoreErrorCodes: ["InvalidFlowLogId.NotFound"],
  getById: {
    pickId: pipe([
      ({ FlowLogId }) => ({
        FlowLogIds: [FlowLogId],
      }),
    ]),
    method: "describeFlowLogs",
    getField: "FlowLogs",
  },
  getList: {
    method: "describeFlowLogs",
    getParam: "FlowLogs",
    decorate: ({ endpoint, getById }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
      ]),
  },
  create: {
    method: "createFlowLogs",
    pickCreated: ({ payload }) =>
      pipe([
        get("FlowLogIds"),
        first,
        tap((FlowLogId) => {
          assert(FlowLogId);
        }),
        (FlowLogId) => ({ FlowLogId }),
      ]),
  },
  destroy: {
    method: "deleteFlowLogs",
    pickId: ({ FlowLogId }) => ({ FlowLogIds: [FlowLogId] }),
  },
});

const FlowLogsDependencies = [
  { type: "Vpc", group: "EC2" },
  { type: "Subnet", group: "EC2" },
  { type: "NetworkInterface", group: "EC2" },
];

const findDependenciesFlowLog = ({ live, lives, config, type, group }) => ({
  type,
  group,
  ids: [
    pipe([
      () =>
        lives.getById({
          id: live.ResourceId,
          type,
          group,
          providerName: config.providerName,
        }),
      get("id"),
    ])(),
  ],
});

const findNameInDependency =
  ({ live, lives, config }) =>
  ({ type, group }) =>
    pipe([
      () =>
        lives.getById({
          id: live.ResourceId,
          type,
          group,
          providerName: config.providerName,
        }),
      get("name"),
    ])();

const findNameInDependencies = ({ live, lives, config }) =>
  pipe([
    tap((params) => {
      assert(config);
      assert(live);
    }),
    () => FlowLogsDependencies,
    map(findNameInDependency({ live, lives, config })),
    find(not(isEmpty)),
    tap((name) => {
      assert(name, `cannot find flowlog dependency name`);
    }),
    prepend("flowlog::"),
  ])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2FlowLogs = ({ spec, config }) =>
  createAwsResource({
    model: createModel({ config }),
    spec,
    config,
    findName: pipe([
      tap((params) => {
        assert(true);
      }),
      findNameInTagsOrId({ findId: findNameInDependencies }),
      tap((params) => {
        assert(true);
      }),
    ]),
    findId,
    findDependencies: pipe([
      ({ live, lives }) => [
        findDependenciesFlowLog({
          live,
          lives,
          config,
          type: "Vpc",
          group: "EC2",
        }),
        findDependenciesFlowLog({
          live,
          lives,
          config,
          type: "Subnet",
          group: "EC2",
        }),
        findDependenciesFlowLog({
          live,
          lives,
          config,
          type: "NetworkInterface",
          group: "EC2",
        }),
        {
          type: "Role",
          group: "IAM",
          ids: [pipe([() => live.DeliverLogsPermissionArn])()],
        },
        {
          type: "LogGroup",
          group: "CloudWatchLogs",
          ids: [
            pipe([
              () =>
                lives.getByName({
                  name: live.LogGroupName,
                  type: "LogGroup",
                  group: "CloudWatchLogs",
                  providerName: config.providerName,
                }),
              get("id"),
            ])(),
          ],
        },
        //TODO S3
      ],
      tap((params) => {
        assert(true);
      }),
    ]),
    getByName: getByNameCore,
    tagResource: tagResource,
    untagResource: untagResource,
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: {
        vpc,
        subnet,
        networkInterface,
        s3Bucket,
        iamRole,
        cloudWatchLogGroup,
      },
    }) =>
      pipe([
        tap((params) => {
          assert(iamRole);
        }),
        () => otherProps,
        switchCase([
          () => s3Bucket,
          defaultsDeep({
            LogDestinationType: "s3",
          }),
          () => cloudWatchLogGroup,
          defaultsDeep({
            LogDestinationType: "cloud-watch-logs",
            LogGroupName: get("resource.name")(cloudWatchLogGroup),
            DeliverLogsPermissionArn: getField(iamRole, "Arn"),
          }),
          () => {
            assert(false, "missing flow logs destination dependencies");
          },
        ]),
        switchCase([
          () => vpc,
          defaultsDeep({
            ResourceType: "VPC",
            ResourceIds: [getField(vpc, "VpcId")],
          }),
          () => subnet,
          defaultsDeep({
            ResourceType: "Subnet",
            ResourceIds: [getField(subnet, "SubnetId")],
          }),
          () => networkInterface,
          defaultsDeep({
            ResourceType: "NetworkInterface",
            ResourceIds: [getField(networkInterface, "NetworkInterfaceId")],
          }),
          () => {
            assert(false, "missing flow logs resource dependencies");
          },
        ]),
        defaultsDeep({
          TagSpecifications: [
            {
              ResourceType: "vpc-flow-log",
              Tags: buildTags({ config, namespace, name, UserTags: Tags }),
            },
          ],
        }),
      ])(),
  });
