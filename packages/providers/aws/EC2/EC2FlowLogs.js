const assert = require("assert");
const { pipe, tap, get, switchCase, map, not, eq } = require("rubico");
const {
  defaultsDeep,
  first,
  prepend,
  find,
  isEmpty,
  when,
  values,
  keys,
  unless,
  callProp,
} = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags, findNameInTagsOrId } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./EC2Common");

const FlowLogsDependencies = {
  vpc: {
    type: "Vpc",
    group: "EC2",
    ResourceType: "VPC",
    ResourceId: "VpcId",
  },
  subnet: {
    type: "Subnet",
    group: "EC2",
    ResourceType: "Subnet",
    ResourceId: "SubnetId",
  },
  networkInterface: {
    type: "NetworkInterface",
    group: "EC2",
    ResourceType: "NetworkInterface",
    ResourceId: "NetworkInterfaceId",
  },
  transitGateway: {
    type: "TransitGateway",
    group: "EC2",
    ResourceType: "TransitGateway",
    ResourceId: "TransitGatewayId",
  },
  transitGatewayVpcAttachment: {
    type: "TransitGatewayVpcAttachment",
    group: "EC2",
    ResourceType: "TransitGatewayAttachment",
    ResourceId: "TransitGatewayAttachmentId",
  },
  transitGatewayAttachment: {
    type: "TransitGatewayAttachment",
    group: "EC2",
    ResourceType: "TransitGatewayAttachment",
    ResourceId: "TransitGatewayAttachmentId",
  },
};

exports.FlowLogsDependencies = FlowLogsDependencies;

const findId = () => pipe([get("FlowLogId")]);

const createModel = ({ config }) => ({
  package: "ec2",
  client: "EC2",
  ignoreErrorCodes: ["InvalidFlowLogId.NotFound"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeFlowLogs-property
  getById: {
    pickId: pipe([
      ({ FlowLogId }) => ({
        FlowLogIds: [FlowLogId],
      }),
    ]),
    method: "describeFlowLogs",
    getField: "FlowLogs",
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeFlowLogs-property
  getList: {
    method: "describeFlowLogs",
    getParam: "FlowLogs",
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createFlowLogs-property
  create: {
    method: "createFlowLogs",
    pickCreated: ({ payload }) =>
      pipe([get("FlowLogIds"), first, (FlowLogId) => ({ FlowLogId })]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteFlowLogs-property
  destroy: {
    method: "deleteFlowLogs",
    pickId: ({ FlowLogId }) => ({ FlowLogIds: [FlowLogId] }),
  },
});

const findDependencyFlowLog =
  ({ live, lives, config }) =>
  ({ type, group }) =>
    pipe([
      tap(() => {
        assert(live.ResourceId);
      }),
      () =>
        lives.getById({
          id: live.ResourceId,
          type,
          group,
          providerName: config.providerName,
        }),
      get("id"),
      unless(isEmpty, (id) => ({ type, group, ids: [id] })),
    ])();

const findNameInDependency =
  ({ live, lives, config }) =>
  ({ type, group }) =>
    pipe([
      tap((name) => {
        assert(live.ResourceId);
      }),
      () =>
        lives.getById({
          id: live.ResourceId,
          type,
          group,
          providerName: config.providerName,
        }),
      get("name"),
    ])();

const findNameInDependencies =
  ({ lives, config }) =>
  (live) =>
    pipe([
      tap((params) => {
        assert(config);
        assert(live);
      }),
      () => FlowLogsDependencies,
      values,
      map(findNameInDependency({ live, lives, config })),
      find(not(isEmpty)),
      tap((name) => {
        assert(name, `cannot find flowlog dependency name`);
      }),
      prepend("flowlog::"),
    ])();

const findDependenciesFlowLog = ({ live, lives, config }) =>
  pipe([
    tap((params) => {
      assert(config);
      assert(live);
      assert(lives);
    }),
    () => FlowLogsDependencies,
    values,
    map(
      findDependencyFlowLog({
        live,
        lives,
        config,
      })
    ),
    find(not(isEmpty)),
  ])();
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2FlowLogs = ({ spec, config }) =>
  createAwsResource({
    model: createModel({ config }),
    spec,
    config,
    findName: pipe([findNameInTagsOrId({ findId: findNameInDependencies })]),
    findId,
    findDependencies: ({ live, lives }) => [
      findDependenciesFlowLog({ live, lives, config }),
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
      {
        type: "DeliveryStream",
        group: "Firehose",
        ids: [
          pipe([
            () => live,
            switchCase([
              eq(get("LogDestinationType"), "kinesis-data-firehose"),
              pipe([get("LogDestination")]),
              () => undefined,
            ]),
          ])(),
        ],
      },
      {
        type: "Bucket",
        group: "S3",
        ids: [
          pipe([
            () => live,
            switchCase([
              eq(get("LogDestinationType"), "s3"),
              pipe([
                get("LogDestination"),
                callProp("replace", "arn:aws:s3:::", ""),
              ]),
              () => undefined,
            ]),
          ])(),
        ],
      },
    ],
    getByName: getByNameCore,
    tagResource: tagResource,
    untagResource: untagResource,
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: {
        s3Bucket,
        iamRole,
        firehoseDeliveryStream,
        cloudWatchLogGroup,
        ...deps
      },
    }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        () => otherProps,
        when(
          () => iamRole,
          pipe([
            defaultsDeep({
              DeliverLogsPermissionArn: getField(iamRole, "Arn"),
            }),
          ])
        ),
        switchCase([
          () => s3Bucket,
          defaultsDeep({
            LogDestinationType: "s3",
            LogDestination: `arn:aws:s3:::${getField(s3Bucket, "Name")}`,
          }),
          () => cloudWatchLogGroup,
          defaultsDeep({
            LogDestinationType: "cloud-watch-logs",
            LogGroupName: get("resource.name")(cloudWatchLogGroup),
          }),
          () => firehoseDeliveryStream,
          defaultsDeep({
            LogDestinationType: "kinesis-data-firehose",
            LogDestination: getField(
              firehoseDeliveryStream,
              "DeliveryStreamARN"
            ),
          }),
          () => {
            assert(false, "missing flow logs destination dependencies");
          },
        ]),
        defaultsDeep(
          pipe([
            () => deps,
            keys,
            first,
            (key) =>
              pipe([
                tap((params) => {
                  assert(key, `missing dependencies`);
                  assert(FlowLogsDependencies[key]);
                }),
                () => ({
                  ResourceType: FlowLogsDependencies[key].ResourceType,
                  ResourceIds: [
                    getField(deps[key], FlowLogsDependencies[key].ResourceId),
                  ],
                }),
              ])(),
          ])()
        ),
        defaultsDeep({
          TagSpecifications: [
            {
              ResourceType: "vpc-flow-log",
              Tags: buildTags({ config, namespace, name, UserTags: Tags }),
            },
          ],
        }),
        tap((params) => {
          assert(true);
        }),
      ])(),
  });
