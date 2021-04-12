const assert = require("assert");
const { map, assign, pipe } = require("rubico");

// Create Load Balancer, Target Group, Listeners and Rule

exports.createResources = async ({
  provider,
  resources: { vpc, subnets, hostedZone, k8s, certificate },
}) => {
  assert(Array.isArray(subnets));
  assert(vpc);
  assert(certificate);
  assert(hostedZone);
  assert(k8s);
  const { config } = provider;
  assert(config.elb);
  assert(config.elb.loadBalancer);
  assert(config.elb.targetGroups);
  assert(config.elb.listeners);
  assert(config.elb.rules);
  assert(config.elb.listeners.https.name);

  const loadBalancer = await provider.makeLoadBalancer({
    name: config.elb.loadBalancer.name,
    dependencies: {
      subnets,
    },
    properties: () => ({}),
  });

  const targetGroups = {
    web: await provider.makeTargetGroup({
      name: config.elb.targetGroups.web.name,
      dependencies: {
        vpc,
      },
      properties: () => ({}),
    }),
    rest: await provider.makeTargetGroup({
      name: config.elb.targetGroups.rest.name,
      dependencies: {
        vpc,
      },
      properties: () => ({}),
    }),
  };

  const listeners = {
    http: await provider.makeListener({
      name: config.elb.listeners.http.name,
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
    http: {
      web: await provider.makeRule({
        name: config.elb.rules.http.web.name,
        dependencies: {
          listener: listeners.http,
          targetGroup: targetGroups.web,
        },
        properties: config.elb.rules.http.web.properties,
      }),
      rest: await provider.makeRule({
        name: config.elb.rules.http.rest.name,
        dependencies: {
          listener: listeners.http,
          targetGroup: targetGroups.rest,
        },
        properties: config.elb.rules.http.rest.properties,
      }),
    },
  };

  const loadBalancerDnsRecord = await provider.makeRoute53Record({
    name: `load-balancer-dns-record-alias-${hostedZone.name}`,
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
