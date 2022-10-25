const assert = require("assert");
const { pipe, tap, get, assign, pick } = require("rubico");
const { first, defaultsDeep, isEmpty, unless, when } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

const { getByNameCore } = require("@grucloud/core/Common");
const {
  buildTags,
  findNamespaceInTagsOrEksCluster,
  hasKeyInTags,
} = require("../AwsCommon");

const { AwsClient } = require("../AwsClient");
const { createELB, tagResource, untagResource } = require("./ELBCommon");

const findName = get("live.Name");
const findId = get("live.TargetGroupArn");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html
exports.ELBTargetGroup = ({ spec, config }) => {
  const elb = createELB(config);
  const client = AwsClient({ spec, config })(elb);

  const managedByOther = hasKeyInTags({
    key: "elbv2.k8s.aws/cluster",
  });

  const findNamespace = findNamespaceInTagsOrEksCluster({
    config,
    key: "elbv2.k8s.aws/cluster",
  });

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

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#describeTargetGroups-property
  const getList = client.getList({
    method: "describeTargetGroups",
    getParam: "TargetGroups",
    decorate,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#describeTargetGroups-property
  //TODO use describeTargetGroups
  const getByName = getByNameCore({ getList, findName });

  const getById = client.getById({
    pickId: ({ TargetGroupArn, Names }) => ({
      TargetGroupArns: [TargetGroupArn],
      Names,
    }),
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
    pickId: pick(["TargetGroupArn"]),
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
        //assert(vpc);
      }),
      () => otherProps,
      defaultsDeep({
        //TODO move to propertiesDefault
        Protocol: "HTTP",
        Tags: buildTags({ name, namespace, config, UserTags: Tags }),
      }),
      when(() => vpc, assign({ VpcId: () => getField(vpc, "VpcId") })),
    ])();

  return {
    spec,
    findId,
    findNamespace,
    getByName,
    findName,
    create,
    destroy,
    getList,
    configDefault,
    managedByOther,
    tagResource: tagResource({ endpoint: elb }),
    untagResource: untagResource({ endpoint: elb }),
  };
};
