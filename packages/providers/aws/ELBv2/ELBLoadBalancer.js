const assert = require("assert");
const { map, pipe, tap, get, eq, assign, filter, pick } = require("rubico");
const {
  isEmpty,
  includes,
  first,
  defaultsDeep,
  pluck,
  callProp,
  unless,
} = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

const {
  buildTags,
  findNamespaceInTagsOrEksCluster,
  hasKeyInTags,
} = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");
const { createELB } = require("./ELBCommon");

const findName = get("live.LoadBalancerName");
const findId = get("live.LoadBalancerArn");
const pickId = pick(["LoadBalancerArn"]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html

exports.ELBLoadBalancerV2 = ({ spec, config }) => {
  const elb = createELB(config);
  const client = AwsClient({ spec, config })(elb);
  const { providerName } = config;

  const managedByOther = hasKeyInTags({
    key: "elbv2.k8s.aws/cluster",
  });

  const findDependencies = ({ live, lives }) => [
    {
      type: "Subnet",
      group: "EC2",
      ids: pipe([() => live, get("AvailabilityZones"), pluck("SubnetId")])(),
    },
    {
      type: "SecurityGroup",
      group: "EC2",
      ids: live.SecurityGroups,
    },
    {
      type: "NetworkInterface",
      group: "EC2",
      ids: pipe([
        () =>
          lives.getByType({
            type: "NetworkInterface",
            group: "EC2",
            providerName,
          }),
        filter(
          pipe([
            get("live.Description"),
            callProp("replace", "ELB ", ""),
            (description) => includes(description)(live.LoadBalancerArn),
          ])
        ),
        pluck("id"),
      ])(),
    },
  ];

  const findNamespace = findNamespaceInTagsOrEksCluster({
    config,
    key: "elbv2.k8s.aws/cluster",
  });

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

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#describeLoadBalancers-property

  const getById = client.getById({
    pickId: ({ LoadBalancerName }) => ({ Names: [LoadBalancerName] }),
    method: "describeLoadBalancers",
    getField: "LoadBalancers",
    ignoreErrorCodes: ["LoadBalancerNotFound"],
    decorate: () => pipe([assignTags]),
  });

  const getList = client.getList({
    method: "describeLoadBalancers",
    getParam: "LoadBalancers",
    decorate: () => pipe([assignTags]),
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#describeLoadBalancers-property
  const getByName = pipe([({ name }) => ({ LoadBalancerName: name }), getById]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#createLoadBalancer-property
  const configDefault = ({
    name,
    namespace,
    properties,
    dependencies: { subnets, securityGroups },
  }) =>
    pipe([
      tap(() => {
        assert(Array.isArray(subnets));
        assert(Array.isArray(securityGroups));
      }),
      () => properties,
      defaultsDeep({
        Name: name,
        Type: "application",
        Scheme: "internet-facing",
        Tags: buildTags({ name, config, namespace, UserTags: properties.Tags }),
        Subnets: map((subnet) => getField(subnet, "SubnetId"))(subnets),
        SecurityGroups: map((securityGroup) =>
          getField(securityGroup, "GroupId")
        )(securityGroups),
      }),
      tap((result) => {
        assert(result);
      }),
    ])();

  const create = client.create({
    method: "createLoadBalancer",
    pickId,
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
    config,
  });

  return {
    spec,
    findId,
    findDependencies,
    findNamespace,
    getByName,
    findName,
    create,
    destroy,
    getList,
    configDefault,
    managedByOther,
  };
};
