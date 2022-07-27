const assert = require("assert");
const { map, pipe, tap, get, eq, assign, filter, pick } = require("rubico");
const { isEmpty, first, defaultsDeep, unless } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

const {
  buildTags,
  findNamespaceInTagsOrEksCluster,
  hasKeyInTags,
} = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");
const { createELB, tagResource, untagResource } = require("./ELBCommon");

const findName = get("live.LoadBalancerName");
const findId = get("live.LoadBalancerArn");
const pickId = pick(["LoadBalancerArn"]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html

exports.ELBLoadBalancerV2 = ({ spec, config }) => {
  const elb = createELB(config);
  const client = AwsClient({ spec, config })(elb);

  const assignTags = unless(
    isEmpty,
    assign({
      Tags: pipe([
        ({ LoadBalancerArn }) =>
          elb().describeTags({ ResourceArns: [LoadBalancerArn] }),
        get("TagDescriptions"),
        first,
        get("Tags"),
      ]),
    })
  );

  const decorate = () => pipe([assignTags]);

  const managedByOther = hasKeyInTags({
    key: "elbv2.k8s.aws/cluster",
  });

  const findNamespace = findNamespaceInTagsOrEksCluster({
    config,
    key: "elbv2.k8s.aws/cluster",
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#describeLoadBalancers-property
  const getById = client.getById({
    pickId: ({ LoadBalancerName }) => ({ Names: [LoadBalancerName] }),
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
  const getByName = pipe([({ name }) => ({ LoadBalancerName: name }), getById]);

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
        Name: name,
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
    isInstanceUp: eq(get("State.Code"), "active"),
    pickCreated: () => pipe([get("LoadBalancers"), first]),
    config: { retryCount: 40 * 10, retryDelay: 10e3 },
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
