const assert = require("assert");
const { get, pipe, tap, and, eq } = require("rubico");
const { find } = require("rubico/x");

const NamespaceDefault = "LoadBalancer";

// Create Load Balancer, Target Group, Listeners and Rule, Security Group and Rules

exports.createResources = async ({
  provider,
  resources: { vpc, subnets, hostedZone, k8s, eks, certificate },
  namespace = NamespaceDefault,
}) => {
  assert(Array.isArray(subnets));
  assert(vpc);
  assert(certificate);
  assert(hostedZone);
  assert(k8s);
  assert(eks);
  assert(eks.cluster);

  const { config } = provider;
  assert(config.eks);
  assert(config.eks.cluster);
  assert(config.eks.cluster.name);
  assert(config.elb);
  assert(config.elb.loadBalancer);
  assert(config.elb.targetGroups);
  assert(config.elb.listeners);
  assert(config.elb.rules);
  assert(config.elb.listeners.https.name);

  const securityGroupLoadBalancer = await provider.makeSecurityGroup({
    name: "load-balancer-security-group",
    namespace,
    dependencies: { vpc },
    properties: () => ({
      create: {
        Description: "Load Balancer HTTP HTTPS Security Group",
      },
      Tags: [
        {
          Key: "ingress.k8s.aws/stack",
          Value: "default/ingress",
        },
        {
          Key: "elbv2.k8s.aws/cluster",
          Value: config.eks.cluster.name,
        },
        {
          Key: "ingress.k8s.aws/resource",
          Value: "ManagedLBSecurityGroup",
        },
      ],
    }),
  });

  const sgRuleIngressHttp = await provider.makeSecurityGroupRuleIngress({
    name: "sg-rule-ingress-http",
    namespace,
    dependencies: {
      securityGroup: securityGroupLoadBalancer,
    },
    properties: () => ({
      IpPermissions: [
        {
          FromPort: 80,
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
          ToPort: 80,
        },
      ],
    }),
  });
  const sgRuleIngressHttps = await provider.makeSecurityGroupRuleIngress({
    name: "sg-rule-ingress-https",
    namespace,
    dependencies: {
      securityGroup: securityGroupLoadBalancer,
    },
    properties: () => ({
      IpPermissions: [
        {
          FromPort: 443,
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
          ToPort: 443,
        },
      ],
    }),
  });
  const findGroupIdFromSecurityGroup = ({ securityGroupK8sCluster }) =>
    pipe([
      tap(() => {}),
      () => securityGroupK8sCluster.resolveConfig(),
      tap((live) => {}),
      get("GroupId"),
      tap((GroupId) => {}),
    ])();

  // Use the security group created by EKS
  const securityGroupK8sCluster = await provider.useSecurityGroup({
    name: "sg-eks-k8s-cluster",
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
          //logger.info(`securityGroupK8sCluster live ${live}`);
        }),
      ])(),
  });

  // Attach an Ingress Rule to the eks-k8s security group to allow traffic from the load balancer
  const sgRuleIngress = await provider.makeSecurityGroupRuleIngress({
    name: "sg-rule-ingress",
    namespace,
    dependencies: {
      cluster: eks.cluster,
      securityGroup: securityGroupK8sCluster,
      securityGroupLoadBalancer,
    },
    properties: async ({ dependencies: { securityGroupLoadBalancer } }) => ({
      GroupId: await findGroupIdFromSecurityGroup({ securityGroupK8sCluster }),
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

  const loadBalancer = await provider.makeLoadBalancer({
    name: config.elb.loadBalancer.name,
    namespace,
    dependencies: {
      subnets,
      securityGroups: [securityGroupLoadBalancer],
    },
    properties: () => ({}),
  });

  const targetGroups = {
    web: await provider.makeTargetGroup({
      name: config.elb.targetGroups.web.name,
      namespace,
      dependencies: {
        vpc,
        nodeGroup: eks.nodeGroupsPrivate[0],
      },
      properties: config.elb.targetGroups.web.properties,
    }),
    rest: await provider.makeTargetGroup({
      name: config.elb.targetGroups.rest.name,
      namespace,
      dependencies: {
        nodeGroup: eks.nodeGroupsPrivate[0],
        vpc,
      },
      properties: config.elb.targetGroups.rest.properties,
    }),
  };

  const listeners = {
    http: await provider.makeListener({
      name: config.elb.listeners.http.name,
      namespace,
      dependencies: {
        loadBalancer,
        targetGroups: [targetGroups.web],
      },
      properties: ({
        dependencies: {
          targetGroups: [targetGroup],
        },
      }) => ({
        Port: 80,
        Protocol: "HTTP",
        DefaultActions: [
          {
            TargetGroupArn: targetGroup?.live?.TargetGroupArn,
            Type: "forward",
          },
        ],
      }),
    }),
    https: await provider.makeListener({
      name: config.elb.listeners.https.name,
      namespace,
      dependencies: {
        loadBalancer,
        targetGroups: [targetGroups.web],
        certificate,
      },
      properties: ({
        dependencies: {
          targetGroups: [targetGroup],
          certificate,
        },
      }) => ({
        Port: 443,
        Protocol: "HTTPS",
        Certificates: [
          {
            CertificateArn: certificate?.live.CertificateArn,
          },
        ],
        DefaultActions: [
          {
            TargetGroupArn: targetGroup?.live?.TargetGroupArn,
            Type: "forward",
          },
        ],
      }),
    }),
  };

  const rules = {
    http2https: await provider.makeRule({
      name: config.elb.rules.http2https.name,
      namespace,
      dependencies: {
        listener: listeners.http,
      },
      properties: config.elb.rules.http2https.properties,
    }),
    https: {
      web: await provider.makeRule({
        name: config.elb.rules.https.web.name,
        namespace,
        dependencies: {
          listener: listeners.https,
          targetGroup: targetGroups.web,
        },
        properties: config.elb.rules.https.web.properties,
      }),
      rest: await provider.makeRule({
        name: config.elb.rules.https.rest.name,
        namespace,
        dependencies: {
          listener: listeners.https,
          targetGroup: targetGroups.rest,
        },
        properties: config.elb.rules.https.rest.properties,
      }),
    },
  };

  const loadBalancerDnsRecord = await provider.makeRoute53Record({
    name: `load-balancer-dns-record-alias-${hostedZone.name}`,
    namespace,
    dependencies: { hostedZone, loadBalancer },
    properties: ({ dependencies: { loadBalancer } }) => {
      const hostname = loadBalancer.live?.DNSName;
      if (!hostname) {
        return {
          message: "loadBalancer not up yet",
          Type: "A",
          Name: hostedZone.name,
        };
      }
      return {
        Name: hostedZone.name,
        Type: "A",
        AliasTarget: {
          HostedZoneId: "ZHURV8PSTC4K8",
          DNSName: `${hostname}.`,
          EvaluateTargetHealth: false,
        },
      };
    },
  });

  return {
    loadBalancer,
    targetGroups,
    listeners,
    rules,
    loadBalancerDnsRecord,
  };
};
