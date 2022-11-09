const assert = require("assert");
const { map, pipe, tap, get, eq, assign, or, pick } = require("rubico");
const { isEmpty, first, defaultsDeep, unless } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

const {
  buildTags,
  findNamespaceInTagsOrEksCluster,
  hasKeyInTags,
} = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");
const { createELB, tagResource, untagResource } = require("./ELBCommon");

const logger = require("@grucloud/core/logger")({
  prefix: "LoadBalancer",
});

const findName = get("live.Name");
const findId = get("live.LoadBalancerArn");
const pickId = pick(["LoadBalancerArn"]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html

exports.ELBLoadBalancerV2 = ({ spec, config }) => {
  const elb = createELB(config);
  const client = AwsClient({ spec, config })(elb);

  const assignTags = ({ endpoint }) =>
    unless(
      isEmpty,
      assign({
        Tags: pipe([
          ({ LoadBalancerArn }) => ({ ResourceArns: [LoadBalancerArn] }),
          endpoint().describeTags,
          get("TagDescriptions"),
          first,
          get("Tags"),
        ]),
      })
    );

  const decorate = ({ endpoint }) =>
    pipe([
      ({ LoadBalancerName, ...other }) => ({
        Name: LoadBalancerName,
        ...other,
      }),
      assignTags({ endpoint }),
    ]);

  const managedByOther = or([
    hasKeyInTags({
      key: "elbv2.k8s.aws/cluster",
    }),
    hasKeyInTags({
      key: "elasticbeanstalk:environment-id",
    }),
  ]);

  const findNamespace = findNamespaceInTagsOrEksCluster({
    config,
    key: "elbv2.k8s.aws/cluster",
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#describeLoadBalancers-property
  const getById = client.getById({
    pickId: pipe([
      tap(({ Name }) => {
        assert(Name);
      }),
      ({ Name }) => ({ Names: [Name] }),
    ]),
    method: "describeLoadBalancers",
    getField: "LoadBalancers",
    ignoreErrorCodes: ["LoadBalancerNotFound"],
    decorate,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#describeLoadBalancers-property
  const getList = client.getList({
    method: "describeLoadBalancers",
    getParam: "LoadBalancers",
    decorate,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#describeLoadBalancers-property
  const getByName = pipe([({ name }) => ({ Name: name }), getById({})]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#createLoadBalancer-property
  const configDefault = ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { subnets, securityGroups },
  }) =>
    pipe([
      tap(() => {
        assert(Array.isArray(subnets));
        assert(Array.isArray(securityGroups));
      }),
      () => otherProps,
      defaultsDeep({
        Type: "application",
        Scheme: "internet-facing",
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
        Subnets: map((subnet) => getField(subnet, "SubnetId"))(subnets),
        SecurityGroups: map((securityGroup) =>
          getField(securityGroup, "GroupId")
        )(securityGroups),
      }),
      tap((result) => {
        assert(result);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#createLoadBalancer-property
  const create = client.create({
    method: "createLoadBalancer",
    getById,
    isInstanceUp: pipe([
      tap(({ State }) => {
        logger.info(`createLoadBalancer state: ${State.Code}`);
      }),
      eq(get("State.Code"), "active"),
    ]),
    isInstanceError: eq(get("State.Code"), "failed"),
    getErrorMessage: get("State.Reason", "failed"),
    pickCreated: ({ payload }) => pipe([() => payload]),
    config: { retryCount: 60 * 10, retryDelay: 10e3 },
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#deleteLoadBalancer-property
  const destroy = client.destroy({
    pickId,
    method: "deleteLoadBalancer",
    getById,
    ignoreErrorCodes: ["LoadBalancerNotFound"],
  });

  return {
    spec,
    findId,
    getByName,
    findNamespace,
    findName,
    getById,
    create,
    destroy,
    getList,
    configDefault,
    managedByOther,
    tagResource: tagResource({ endpoint: elb }),
    untagResource: untagResource({ endpoint: elb }),
  };
};
