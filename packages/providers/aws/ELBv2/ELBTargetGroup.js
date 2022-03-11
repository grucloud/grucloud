const assert = require("assert");
const { pipe, tap, get, assign, pick } = require("rubico");
const { first, defaultsDeep, isEmpty, unless } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

const { getByNameCore } = require("@grucloud/core/Common");
const {
  buildTags,
  findNamespaceInTagsOrEksCluster,
  hasKeyInTags,
} = require("../AwsCommon");

const { AwsClient } = require("../AwsClient");
const { createELB, tagResource, untagResource } = require("./ELBCommon");

const findName = get("live.TargetGroupName");
const findId = get("live.TargetGroupArn");
const pickId = pick(["TargetGroupArn"]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html
exports.ELBTargetGroup = ({ spec, config }) => {
  const elb = createELB(config);
  const client = AwsClient({ spec, config })(elb);

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

  const assignTags = unless(
    isEmpty,
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
    })
  );

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#describeTargetGroups-property
  const getList = client.getList({
    method: "describeTargetGroups",
    getParam: "TargetGroups",
    decorate: () => pipe([assignTags]),
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#describeTargetGroups-property
  const getByName = getByNameCore({ getList, findName });

  const getById = client.getById({
    pickId: ({ TargetGroupArn }) => ({ TargetGroupArns: [TargetGroupArn] }),
    method: "describeTargetGroups",
    getField: "TargetGroups",
    ignoreErrorCodes: ["TargetGroupNotFound"],
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#createTargetGroup-property
  const create = client.create({
    method: "createTargetGroup",
    getById,
    pickCreated: () => pipe([get("TargetGroups"), first]),
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#deleteTargetGroup-property
  const destroy = client.destroy({
    pickId,
    method: "deleteTargetGroup",
    ignoreErrorCodes: ["TargetGroupNotFound"],
    getById,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#createTargetGroup-property
  const configDefault = ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { vpc },
  }) =>
    pipe([
      tap(() => {
        assert(vpc);
      }),
      () => otherProps,
      defaultsDeep({
        Name: name,
        Protocol: "HTTP",
        VpcId: getField(vpc, "VpcId"),
        Tags: buildTags({ name, namespace, config, UserTags: Tags }),
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
    managedByOther,
    tagResource: tagResource({ elb }),
    untagResource: untagResource({ elb }),
  };
};
