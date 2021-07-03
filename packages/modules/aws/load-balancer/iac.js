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
  assert(config.elb);
  assert(config.elb.loadBalancer);
  assert(config.elb.targetGroups);
  assert(config.elb.listeners);
  assert(config.elb.rules);
  assert(config.elb.listeners.https.name);

  // Load Balancer Security Group,
  // HTTP and HTTPS Ingress rule
  const securityGroupLoadBalancer = await provider.ec2.makeSecurityGroup({
    name: "load-balancer-security-group",
    namespace,
    dependencies: { vpc },
    properties: () => ({
      create: {
        Description: "Load Balancer HTTP HTTPS Security Group",
      },
    }),
  });

  const sgRuleIngressHttp = await provider.ec2.makeSecurityGroupRuleIngress({
    name: "sg-rule-ingress-lb-http",
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
  const sgRuleIngressHttps = await provider.ec2.makeSecurityGroupRuleIngress({
    name: "sg-rule-ingress-lb-https",
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

  // The Load Balancer
  const loadBalancer = await provider.elb.makeLoadBalancer({
    name: config.elb.loadBalancer.name,
    namespace,
    dependencies: {
      subnets,
      securityGroups: [securityGroupLoadBalancer],
    },
    properties: () => ({}),
  });

  // Web and REST API target group
  const targetGroups = {
    web: await provider.elb.makeTargetGroup({
      name: config.elb.targetGroups.web.name,
      namespace,
      dependencies: {
        vpc,
        autoScalingGroup,
        nodeGroup,
      },
      properties: () => config.elb.targetGroups.web.properties,
    }),
    rest: await provider.elb.makeTargetGroup({
      name: config.elb.targetGroups.rest.name,
      namespace,
      dependencies: {
        autoScalingGroup,
        nodeGroup,
        vpc,
      },
      properties: () => config.elb.targetGroups.rest.properties,
    }),
  };

  // HTTP and HTTPS Listeners
  const listeners = {
    http: await provider.elb.makeListener({
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
            TargetGroupArn: getField(targetGroup, "TargetGroupArn"),
            Type: "forward",
          },
        ],
      }),
    }),
    https: await provider.elb.makeListener({
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
            CertificateArn: getField(certificate, "CertificateArn"),
          },
        ],
        DefaultActions: [
          {
            TargetGroupArn: getField(targetGroup, "TargetGroupArn"),
            Type: "forward",
          },
        ],
      }),
    }),
  };
  // Listener Rules
  const rules = {
    http2https: await provider.elb.makeRule({
      name: config.elb.rules.http2https.name,
      namespace,
      dependencies: {
        listener: listeners.http,
      },
      properties: () => config.elb.rules.http2https.properties,
    }),
    https: {
      web: await provider.elb.makeRule({
        name: config.elb.rules.https.web.name,
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
          })(config.elb.rules.https.web.properties),
      }),
      rest: await provider.elb.makeRule({
        name: config.elb.rules.https.rest.name,
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
          })(config.elb.rules.https.rest.properties),
      }),
    },
  };

  // The load balancer DNS record
  const loadBalancerDnsRecord = await provider.route53.makeRecord({
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
          HostedZoneId: getField(loadBalancer, "CanonicalHostedZoneId"),
          DNSName: `${hostname}.`,
          EvaluateTargetHealth: false,
        },
      };
    },
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
