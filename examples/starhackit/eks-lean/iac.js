const assert = require("assert");
const { tap, pipe, get, and, eq } = require("rubico");
const { find } = require("rubico/x");

const { AwsProvider } = require("@grucloud/provider-aws");
const { K8sProvider } = require("@grucloud/provider-k8s");

const ModuleAwsVpc = require("@grucloud/module-aws-vpc");
const ModuleAwsEks = require("@grucloud/module-aws-eks");
const ModuleAwsCertificate = require("@grucloud/module-aws-certificate");
const ModuleAwsLoadBalancer = require("@grucloud/module-aws-load-balancer");

const BaseStack = require("../base/k8sStackBase");

const createAwsStack = async ({ stage }) => {
  const provider = AwsProvider({
    stage,
    configs: [
      ModuleAwsCertificate.config,
      ModuleAwsEks.config,
      ModuleAwsVpc.config,
      ModuleAwsLoadBalancer.config,
      require("./configAws"),
    ],
  });

  const { config } = provider;
  const { eks } = config;
  assert(config.certificate);
  const { domainName, rootDomainName } = config.certificate;
  assert(domainName);
  assert(rootDomainName);

  const domain = await provider.useRoute53Domain({
    name: rootDomainName,
  });

  const hostedZone = await provider.makeHostedZone({
    name: `${domainName}.`,
    dependencies: { domain },
  });

  const resourcesCertificate = await ModuleAwsCertificate.createResources({
    provider,
    resources: { hostedZone },
  });

  const resourcesVpc = await ModuleAwsVpc.createResources({ provider });
  const resourcesEks = await ModuleAwsEks.createResources({
    provider,
    resources: resourcesVpc,
  });

  const resourcesLb = await ModuleAwsLoadBalancer.createResources({
    provider,
    resources: {
      certificate: resourcesCertificate.certificate,
      vpc: resourcesVpc.vpc,
      hostedZone,
      subnets: resourcesVpc.subnetsPublic,
      nodeGroup: resourcesEks.nodeGroupsPrivate[0],
    },
  });

  // Use the security group created by EKS
  const securityGroupEKSCluster = await provider.useSecurityGroup({
    name: "sg-eks-cluster",
    namespace: "EKS",
    filterLives: ({ items }) =>
      pipe([
        () => items,
        find(
          pipe([
            get("Tags"),
            find(
              and([
                eq(get("Key"), "aws:eks:cluster-name"),
                eq(get("Value"), eks.cluster.name),
              ])
            ),
          ])
        ),
        tap((live) => {
          //logger.info(`securityGroupEKSCluster live ${live}`);
        }),
      ])(),
  });

  const findGroupIdFromSecurityGroup = ({ securityGroupEKSCluster }) =>
    pipe([
      tap(() => {}),
      //TODO getLive instead ?
      () => securityGroupEKSCluster.resolveConfig(),
      get("GroupId"),
      tap((GroupId) => {
        assert(true);
      }),
    ])();

  // Attach an Ingress Rule to the eks security group to allow traffic from the load balancer
  const sgRuleIngressEks = await provider.makeSecurityGroupRuleIngress({
    name: "sg-rule-ingress-eks",
    namespace: "EKS",
    dependencies: {
      cluster: resourcesEks.cluster, // Wait until the cluster is up
      securityGroup: securityGroupEKSCluster,
      securityGroupLoadBalancer: resourcesLb.securityGroupLoadBalancer,
    },
    properties: async ({ dependencies: { securityGroupLoadBalancer } }) => ({
      GroupId: await findGroupIdFromSecurityGroup({ securityGroupEKSCluster }),
      IpPermissions: [
        {
          FromPort: 1025,
          IpProtocol: "tcp",
          IpRanges: [
            {
              CidrIp: "0.0.0.0/0",
            },
          ],
          Ipv6Ranges: [
            {
              CidrIpv6: "::/0",
            },
          ],
          UserIdGroupPairs: [
            { GroupId: get("live.GroupId")(securityGroupLoadBalancer) },
          ],
          ToPort: 65535,
        },
      ],
    }),
  });

  return {
    provider,
    resources: {
      domain,
      hostedZone,
      certificate: resourcesCertificate,
      vpc: resourcesVpc,
      eks: resourcesEks,
      lb: resourcesLb,
    },
    hooks: [
      ...ModuleAwsCertificate.hooks,
      ...ModuleAwsVpc.hooks,
      ...ModuleAwsEks.hooks,
    ],
    isProviderUp: () => ModuleAwsEks.isProviderUp({ resources: resourcesEks }),
  };
};

const createK8sStack = async ({ stackAws, stage }) => {
  const provider = K8sProvider({
    stage,
    configs: [require("./configK8s"), ...BaseStack.configs],
    dependencies: { aws: stackAws.provider },
  });

  const baseStackResources = await BaseStack.createResources({
    provider,
    resources: stackAws.resources,
  });

  return {
    provider,
    resources: { baseStackResources },
    hooks: [...BaseStack.hooks],
  };
};

exports.createStack = async ({ stage }) => {
  const stackAws = await createAwsStack({ stage });
  const stackK8s = await createK8sStack({ stackAws, stage });

  return {
    hookGlobal: require("./hookGlobal"),
    stacks: [stackAws, stackK8s],
  };
};
