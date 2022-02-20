const assert = require("assert");
const {
  map,
  pipe,
  tap,
  get,
  eq,
  assign,
  tryCatch,
  switchCase,
  filter,
  not,
  pick,
} = require("rubico");
const {
  isEmpty,
  includes,
  first,
  defaultsDeep,
  pluck,
  callProp,
  identity,
} = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

const logger = require("@grucloud/core/logger")({
  prefix: "LoadBalancerV2",
});
const { retryCall } = require("@grucloud/core/Retry");
const { tos } = require("@grucloud/core/tos");
const { isUpByIdCore, isDownByIdCore } = require("@grucloud/core/Common");
const {
  ELBv2New,
  buildTags,
  findNamespaceInTagsOrEksCluster,
  shouldRetryOnException,
  hasKeyInTags,
} = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");

const findName = get("live.LoadBalancerName");
const findId = get("live.LoadBalancerArn");
const pickId = pick(["LoadBalancerArn"]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html

exports.ELBLoadBalancerV2 = ({ spec, config }) => {
  const client = AwsClient({ spec, config });
  const elb = ELBv2New(config);
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

  const assignTags = switchCase([
    not(isEmpty),
    assign({
      Tags: pipe([
        ({ LoadBalancerArn }) =>
          elb().describeTags({ ResourceArns: [LoadBalancerArn] }),
        get("TagDescriptions"),
        first,
        get("Tags"),
      ]),
    }),
    identity,
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#describeLoadBalancers-property

  const describeLoadBalancers = (params) =>
    tryCatch(
      pipe([
        tap(() => {
          logger.info(`describeLoadBalancers ${JSON.stringify(params)}`);
        }),
        () => elb().describeLoadBalancers(params),
        get("LoadBalancers"),
        tap((results) => {
          logger.debug(`describeLoadBalancers: result: ${tos(results)}`);
        }),
        map(assignTags),
      ]),
      switchCase([
        eq(get("code"), "LoadBalancerNotFound"),
        () => [],
        (error) => {
          logger.error(
            `describeLoadBalancers, ${params}, error: ${tos(error)}`
          );
          throw error;
        },
      ])
    )();

  const getList = () =>
    pipe([
      tap(() => {
        logger.info(`getList load balancer`);
      }),
      describeLoadBalancers,
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#describeLoadBalancers-property
  const getByName = ({ name }) =>
    pipe([
      tap(() => {
        logger.info(`getByName ${name}`);
      }),
      () => ({ Names: [name] }),
      describeLoadBalancers,
      first,
      tap((result) => {
        logger.debug(`getByName ${name}: ${tos(result)}`);
      }),
    ])();

  const getById = client.getById({
    pickId: ({ LoadBalancerArn }) => ({ LoadBalancerArns: [LoadBalancerArn] }),
    method: "describeLoadBalancers",
    getField: "LoadBalancers",
    ignoreErrorCodes: ["LoadBalancerNotFound"],
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#createLoadBalancer-property
  const create = client.create({
    method: "createLoadBalancer",
    pickId,
    getById,
    config,
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
    shouldRetryOnException,
    managedByOther,
  };
};
