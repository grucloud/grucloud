const assert = require("assert");
const {
  map,
  pipe,
  tap,
  get,
  not,
  and,
  assign,
  eq,
  switchCase,
  tryCatch,
  pick,
} = require("rubico");
const { first, find, defaultsDeep, isEmpty, identity } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

const logger = require("@grucloud/core/logger")({ prefix: "ELBTargetGroup" });

const { retryCall } = require("@grucloud/core/Retry");
const { tos } = require("@grucloud/core/tos");
const { isUpByIdCore, isDownByIdCore } = require("@grucloud/core/Common");
const {
  ELBv2New,
  AutoScalingNew,
  buildTags,
  findNamespaceInTagsOrEksCluster,
  shouldRetryOnException,
  hasKeyInTags,
} = require("../AwsCommon");

const { AwsClient } = require("../AwsClient");

const findName = get("live.TargetGroupName");
const findId = get("live.TargetGroupArn");
const pickId = pick(["TargetGroupArn"]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html

exports.ELBTargetGroup = ({ spec, config }) => {
  const client = AwsClient({ spec, config });
  const elb = ELBv2New(config);

  const managedByOther = hasKeyInTags({
    key: "elbv2.k8s.aws/cluster",
  });

  // TODO findDependencies
  const findDependencies = ({ live }) => [
    { type: "Vpc", group: "EC2", ids: [live.VpcId] },
    { type: "LoadBalancer", group: "ELBv2", ids: live.LoadBalancerArns },
    // TODO eks.NodeGroup
  ];

  const findNamespace = findNamespaceInTagsOrEksCluster({
    config,
    key: "elbv2.k8s.aws/cluster",
  });

  //TODO rubico unless
  const assignTags = switchCase([
    not(isEmpty),
    assign({
      Tags: pipe([
        tap(({ TargetGroupArn }) => {
          assert(TargetGroupArn);
        }),
        ({ TargetGroupArn }) =>
          elb().describeTags({ ResourceArns: [TargetGroupArn] }),
        get("TagDescriptions"),
        first,
        get("Tags"),
      ]),
    }),
    identity,
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#describeTargetGroups-property
  const getList = () =>
    pipe([
      tap(() => {
        logger.info(`getList target group`);
      }),
      elb().describeTargetGroups,
      get("TargetGroups"),
      map(assignTags),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#describeTargetGroups-property
  const getByName = ({ name }) =>
    pipe([
      tap(() => {
        logger.info(`getByName ${name}`);
      }),
      () => elb().describeTargetGroups({}),
      get("TargetGroups"),
      find(eq((live) => findName({ live }), name)),
      assignTags,
      tap((result) => {
        logger.debug(`getByName ${name}, result: ${tos(result)}`);
      }),
    ])();

  const getById = client.getById({
    pickId: ({ TargetGroupArn }) => ({ TargetGroupArns: [TargetGroupArn] }),
    method: "describeTargetGroups",
    getField: "TargetGroups",
    ignoreErrorCodes: ["TargetGroupNotFound"],
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#createTargetGroup-property
  const create = client.create({
    method: "createTargetGroup",
    pickId,
    getById,
    config,
    pickCreated: () => pipe([get("TargetGroups"), first]),
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#deleteTargetGroup-property
  const destroy = client.destroy({
    pickId,
    method: "deleteTargetGroup",
    ignoreErrorCodes: ["TargetGroupNotFound"],
    getById,
    config,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#createTargetGroup-property
  const configDefault = ({
    name,
    namespace,
    properties,
    dependencies: { vpc },
  }) =>
    pipe([
      tap(() => {
        assert(vpc);
      }),
      () => properties,
      defaultsDeep({
        Name: name,
        Protocol: "HTTP",
        VpcId: getField(vpc, "VpcId"),
        Tags: buildTags({ name, namespace, config }),
      }),
    ])();

  return {
    spec,
    findId,
    findNamespace,
    findDependencies,
    getByName,
    findName,
    create,
    destroy,
    getList,
    configDefault,
    shouldRetryOnException,
    managedByOther,
  };
};
