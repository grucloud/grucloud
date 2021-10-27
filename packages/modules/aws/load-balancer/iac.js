const assert = require("assert");
const { get, pipe, tap, and, eq } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

exports.config = require("./config");

const NamespaceDefault = "LoadBalancer";

// Create Load Balancer, Target Group, Listeners and Rule, Security Group and Rules

exports.createResources = async ({
  provider,
  resources: {
    vpc,
    subnets,
    hostedZone,
    certificate,
    nodeGroup,
    autoScalingGroup,
  },
  namespace = NamespaceDefault,
}) => {
  assert(Array.isArray(subnets));
  assert(vpc);
  assert(certificate);
  assert(hostedZone);
  //TODO
  //assert(autoScalingGroup)
  const { config } = provider;
  assert(config.ELBv2);
  assert(config.ELBv2.loadBalancer);
  assert(config.ELBv2.targetGroups);
  assert(config.ELBv2.listeners);
  assert(config.ELBv2.rules);
  assert(config.ELBv2.listeners.https.name);

  // Load Balancer Security Group,
  // HTTP and HTTPS Ingress rule
  const securityGroupLoadBalancer = provider.EC2.makeSecurityGroup({
    name: "security-group-load-balancer",
    namespace,
    dependencies: { vpc },
    properties: () => ({
      Description: "Load Balancer HTTP HTTPS Security Group",
    }),
  });

  const sgRuleIngressHttp = provider.EC2.makeSecurityGroupRuleIngress({
    name: "sg-rule-ingress-lb-http",
    namespace,
    dependencies: {
      securityGroup: securityGroupLoadBalancer,
    },
    properties: () => ({
      IpPermission: {
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
    }),
  });
  const sgRuleIngressHttps = provider.EC2.makeSecurityGroupRuleIngress({
    name: "sg-rule-ingress-lb-https",
    namespace,
    dependencies: {
      securityGroup: securityGroupLoadBalancer,
    },
    properties: () => ({
      IpPermission: {
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
    }),
  });

  // The Load Balancer
  const loadBalancer = provider.ELBv2.makeLoadBalancer({
    name: config.ELBv2.loadBalancer.name,
    namespace,
    dependencies: {
      subnets,
      securityGroups: [securityGroupLoadBalancer],
    },
    properties: () => ({}),
  });

  // Web and REST API target group
  const targetGroups = {
    web: provider.ELBv2.makeTargetGroup({
      name: config.ELBv2.targetGroups.web.name,
      namespace,
      dependencies: {
        vpc,
        autoScalingGroup,
        nodeGroup,
      },
      properties: () => config.ELBv2.targetGroups.web.properties,
    }),
    rest: provider.ELBv2.makeTargetGroup({
      name: config.ELBv2.targetGroups.rest.name,
      namespace,
      dependencies: {
        autoScalingGroup,
        nodeGroup,
        vpc,
      },
      properties: () => config.ELBv2.targetGroups.rest.properties,
    }),
  };

  // HTTP and HTTPS Listeners
  const listeners = {
    http: provider.ELBv2.makeListener({
      name: config.ELBv2.listeners.http.name,
      namespace,
      dependencies: {
        loadBalancer,
        targetGroup: targetGroups.web,
      },
      properties: () => ({
        Port: 80,
        Protocol: "HTTP",
      }),
    }),
    https: provider.ELBv2.makeListener({
      name: config.ELBv2.listeners.https.name,
      namespace,
      dependencies: {
        loadBalancer,
        targetGroup: targetGroups.web,
        certificate,
      },
      properties: ({}) => ({
        Port: 443,
        Protocol: "HTTPS",
      }),
    }),
  };
  // Listener Rules
  const rules = {
    http2https: provider.ELBv2.makeRule({
      name: config.ELBv2.rules.http2https.name,
      namespace,
      dependencies: {
        listener: listeners.http,
      },
      properties: () => config.ELBv2.rules.http2https.properties,
    }),
    https: {
      web: provider.ELBv2.makeRule({
        name: config.ELBv2.rules.https.web.name,
        namespace,
        dependencies: {
          listener: listeners.https,
          targetGroup: targetGroups.web,
        },
        properties: ({ dependencies: { targetGroup } }) =>
          defaultsDeep({
            Actions: [
              {
                TargetGroupArn: getField(targetGroup, "TargetGroupArn"),
                Type: "forward",
              },
            ],
          })(config.ELBv2.rules.https.web.properties),
      }),
      rest: provider.ELBv2.makeRule({
        name: config.ELBv2.rules.https.rest.name,
        namespace,
        dependencies: {
          listener: listeners.https,
          targetGroup: targetGroups.rest,
        },
        properties: ({ dependencies: { targetGroup } }) =>
          defaultsDeep({
            Actions: [
              {
                TargetGroupArn: getField(targetGroup, "TargetGroupArn"),
                Type: "forward",
              },
            ],
          })(config.ELBv2.rules.https.rest.properties),
      }),
    },
  };

  // The load balancer DNS record
  const loadBalancerDnsRecord = provider.Route53.makeRecord({
    namespace,
    dependencies: { hostedZone, loadBalancer },
  });

  return {
    securityGroupLoadBalancer,
    loadBalancer,
    targetGroups,
    listeners,
    rules,
    loadBalancerDnsRecord,
  };
};
