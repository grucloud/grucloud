const assert = require("assert");
const { get, pipe } = require("rubico");
const { first } = require("rubico/x");

const { AwsProvider } = require("@grucloud/provider-aws");
const { K8sProvider } = require("@grucloud/provider-k8s");

const podPolicy = require("./pod-policy.json");

const createAwsStack = async ({ config }) => {
  const provider = AwsProvider({ config });

  const iamPodPolicy = await provider.makeIamPolicy({
    name: "PodPolicy",
    properties: () => ({
      PolicyDocument: podPolicy,
      Description: "Pod Policy",
    }),
  });

  const rolePod = await provider.makeIamRole({
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
  config,
  resources: { rolePod },
  dependencies,
}) => {
  const provider = K8sProvider({ config, dependencies });
  const { ui, namespaceName } = provider.config;
  assert(ui);
  assert(namespaceName);
  assert(rolePod);

  const serviceAccountName = "service-account-aws";

  const namespace = await provider.makeNamespace({
    name: namespaceName,
  });

  const serviceAccount = await provider.makeServiceAccount({
    name: serviceAccountName,
    dependencies: { namespace, rolePod },
    properties: ({ dependencies: { rolePod } }) => ({
      annotations: {
        "eks.amazonaws.com/role-arn": get(
          "live.Arn",
          "<< rolePod.Arn not available yet >>"
        )(rolePod),
      },
    }),
  });

  const ingress = await provider.makeIngress({
    name: "ingress",
    dependencies: {
      namespace,
    },
    properties: () => ({
      metadata: {
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

exports.createStack = async () => {
  const awsStack = await createAwsStack({ config: require("./configAws") });
  const k8sStack = await createK8sStack({
    config: require("./configK8s"),
    resources: awsStack.resources,
    dependencies: { aws: awsStack.provider },
  });

  const { domainName } = k8sStack.provider.config;
  assert(domainName);

  const hostedZone = await awsStack.provider.makeHostedZone({
    name: `${domainName}.`,
  });
  const { ingress } = k8sStack.resources;

  const loadBalancerRecord = await awsStack.provider.makeRoute53Record({
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

  return [awsStack, k8sStack];
};
