const assert = require("assert");
const { pipe, tap, get, pick, switchCase, map } = require("rubico");
const { defaultsDeep, first } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags, findNameInTagsOrId } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./EC2Common");

const findId = pipe([get("live.FlowLogsId")]);

const createModel = ({ config }) => ({
  package: "ec2",
  client: "EC2",
  ignoreErrorCodes: ["TODO"],
  getById: {
    pickId: pipe([
      ({ FlowLogsId }) => ({
        FlowLogsIds: [FlowLogsId],
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
      pipe([get("FlowLogIds"), first, (FlowLogsId) => ({ FlowLogsId })]),
  },
  destroy: {
    method: "deleteFlowLogs",
    pickId: pick(["FlowLogsId"]),
  },
});

const findDependenciesFlowLog = ({ live, lives, config, type, group }) => ({
  type,
  group,
  ids: pipe([
    () => live.ResourceIds,
    map((ResourceId) =>
      pipe([
        () =>
          lives.getById({
            id: ResourceId,
            type,
            group,
            providerName: config.providerName,
          }),
        get("id"),
      ])()
    ),
  ])(),
});
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2FlowLogs = ({ spec, config }) =>
  createAwsResource({
    model: createModel({ config }),
    spec,
    config,
    findName: pipe([findNameInTagsOrId({ findId })]),
    findId,
    findDependencies: ({ live, lives }) => [
      ...findDependenciesFlowLog({
        live,
        lives,
        config,
        type: "Vpc",
        group: "EC2",
      }),
      ...findDependenciesFlowLog({
        live,
        lives,
        config,
        type: "Subnet",
        group: "EC2",
      }),
      ...findDependenciesFlowLog({
        live,
        lives,
        config,
        type: "NetworkInterface",
        group: "EC2",
      }),
      {
        type: "Role",
        group: "Iam",
        ids: [pipe([() => live.DeliverLogsPermissionArn])()],
      },
      {
        type: "LogGroup",
        group: "CloudWatchLogs",
        ids: [
          pipe([
            () =>
              lives.getByName({
                name: LogGroupName,
                type,
                group,
                providerName: config.providerName,
              }),
            get("id"),
          ])(),
        ],
      },
      //TODO S3
    ],
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
        interface,
        s3Bucket,
        iamRole,
        cloudWatchLogGroups,
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
          () => cloudWatchLogGroups,
          defaultsDeep({
            LogDestinationType: "cloud-watch-logs",
            LogGroupName: cloudWatchLogGroups.resource.name,
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
          () => interface,
          defaultsDeep({
            ResourceType: "NetworkInterface",
            ResourceIds: [getField(interface, "NetworkInterfaceId")],
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
