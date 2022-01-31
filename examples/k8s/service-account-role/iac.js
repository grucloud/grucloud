const assert = require("assert");
const { get, pipe } = require("rubico");
const { first } = require("rubico/x");

const { AwsProvider } = require("@grucloud/provider-aws");
const { K8sProvider } = require("@grucloud/provider-k8s");

const podPolicy = require("./pod-policy.json");

const createAwsStack = async ({ createProvider, config }) => {
  const provider = createProvider(AwsProvider, { config });

  const iamPodPolicy = provider.IAM.makePolicy({
    name: "PodPolicy",
    properties: () => ({
      PolicyDocument: podPolicy,
      Description: "Pod Policy",
    }),
  });

  const rolePod = provider.IAM.makeRole({
    name: "role-pod",
    dependencies: { policies: [iamPodPolicy] },
    properties: () => ({
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "ec2.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
    }),
  });
  return {
    provider,
    resources: { rolePod },
    isProviderUp: () => true,
  };
};

const createK8sStack = async ({
  createProvider,
  config,
  resources: { rolePod },
  dependencies,
}) => {
  const provider = createProvider(K8sProvider, { config, dependencies });
  const { ui, namespaceName } = provider.config;
  assert(ui);
  assert(namespaceName);
  assert(rolePod);

  const serviceAccountName = "service-account-aws";

  const namespace = provider.makeNamespace({
    properties: ({}) => ({
      metadata: {
        name: namespaceName,
      },
    }),
  });

  const serviceAccount = provider.makeServiceAccount({
    dependencies: { rolePod },
    properties: ({ dependencies: { rolePod } }) => ({
      metadata: {
        name: serviceAccountName,
        namespace: namespace.name,
      },
      annotations: {
        "eks.amazonaws.com/role-arn": get(
          "live.Arn",
          "<< rolePod.Arn not available yet >>"
        )(rolePod),
      },
    }),
  });

  const ingress = provider.makeIngress({
    properties: () => ({
      metadata: {
        name: "ingress",
        namespace: namespace.name,
        annotations: {
          "nginx.ingress.kubernetes.io/use-regex": "true",
        },
      },
      spec: {
        rules: [
          {
            http: {
              paths: [
                {
                  path: "/.*",
                  pathType: "Prefix",
                  backend: {
                    service: {
                      name: ui.serviceName,
                      port: {
                        number: ui.port,
                      },
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    }),
  });

  return {
    provider,
    resources: {
      namespace,
      serviceAccount,
      ingress,
    },
  };
};

exports.createStack = async ({ createProvider }) => {
  const awsStack = await createAwsStack({
    createProvider,
    config: require("./configAws"),
  });
  const k8sStack = await createK8sStack({
    createProvider,
    config: require("./configK8s"),
    resources: awsStack.resources,
    dependencies: { aws: awsStack.provider },
  });

  const { domainName } = k8sStack.provider.config;
  assert(domainName);

  const hostedZone = await awsStack.provider.Route53.makeHostedZone({
    name: `${domainName}.`,
  });
  const { ingress } = k8sStack.resources;

  //TODO no longer need
  const loadBalancerRecord = await awsStack.provider.Route53.makeRecord({
    name: `record-alias-load-balancer-${domainName}.`,
    dependencies: { hostedZone, ingress },
    properties: ({ dependencies: { ingress } }) => {
      const loadBalancer = pipe([
        get("live.status.loadBalancer.ingress"),
        first,
      ])(ingress);
      if (!loadBalancer) {
        return {
          message: "loadBalancer not up yet",
          Type: "A",
          Name: `${domainName}.`,
        };
      }
      const { hostname, ip } = loadBalancer;
      assert(hostname || ip);
      if (hostname) {
        return {
          Name: `${domainName}.`,
          Type: "A",
          AliasTarget: {
            HostedZoneId: "Z2FDTNDATAQYW2",
            DNSName: hostname,
            EvaluateTargetHealth: false,
          },
        };
      }
      return {
        Name: `${domainName}.`,
        ResourceRecords: [
          {
            Value: ip,
          },
        ],
        TTL: 300,
        Type: "A",
      };
    },
  });

  return { stacks: [awsStack, k8sStack] };
};
