const assert = require("assert");
const { get, map, pipe, assign, tap, and } = require("rubico");
const { pluck } = require("rubico/x");

const { AwsProvider } = require("@grucloud/provider-aws");

const loadBalancerPolicy = require("./load-balancer-policy.json");
const podPolicy = require("./pod-policy.json");
const hooks = require("./hooks");

const createResources = async ({ provider }) => {
  const { config } = provider;
  const clusterName = "cluster";
  const iamOpenIdConnectProviderName = "oicp-eks";

  const iamPolicyEKSCluster = await provider.useIamPolicyReadOnly({
    name: "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy",
  });

  const iamPolicyEKSVPCResourceController = await provider.useIamPolicyReadOnly(
    {
      name: "arn:aws:iam::aws:policy/AmazonEKSVPCResourceController",
    }
  );

  const roleCluster = await provider.makeIamRole({
    name: "role-cluster",
    dependencies: {
      policies: [iamPolicyEKSCluster, iamPolicyEKSVPCResourceController],
    },
    properties: () => ({
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "eks.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
    }),
  });

  const iamPolicyEKSWorkerNode = await provider.useIamPolicyReadOnly({
    name: "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy",
  });

  const iamPolicyEC2ContainerRegistryReadOnly = await provider.useIamPolicyReadOnly(
    {
      name: "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly",
    }
  );

  const iamPolicyEKS_CNI = await provider.useIamPolicyReadOnly({
    name: "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy",
  });

  const roleNodeGroup = await provider.makeIamRole({
    name: "role-node-group",
    dependencies: {
      policies: [
        iamPolicyEKSWorkerNode,
        iamPolicyEC2ContainerRegistryReadOnly,
        iamPolicyEKS_CNI,
      ],
    },
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

  const vpc = await provider.makeVpc({
    name: "vpc-eks",
    properties: () => ({
      DnsHostnames: true,
      CidrBlock: config.vpc.CidrBlock,
      Tags: [{ Key: `kubernetes.io/cluster/${clusterName}`, Value: "shared" }],
    }),
  });

  const ig = await provider.makeInternetGateway({
    name: "ig-eks",
    dependencies: { vpc },
  });

  const eip = await provider.makeElasticIpAddress({
    name: "ip-eks",
  });

  //Public subnets
  assert(config.vpc.subnetsPublic);

  const publics = await map(({ name, CidrBlock, AvailabilityZone }) =>
    pipe([
      assign({
        subnet: () =>
          provider.makeSubnet({
            name,
            dependencies: { vpc },
            properties: () => ({
              CidrBlock,
              AvailabilityZone,
              Tags: [
                {
                  Key: `kubernetes.io/cluster/${clusterName}`,
                  Value: "shared",
                },
                { Key: "kubernetes.io/role/elb", Value: "1" },
              ],
            }),
          }),
      }),
      assign({
        routeTable: ({ subnet }) =>
          provider.makeRouteTables({
            name: `route-table-${subnet.name}`,
            dependencies: { vpc, subnet },
          }),
      }),
      assign({
        routeIg: ({ routeTable }) =>
          provider.makeRoute({
            name: `route-igw-${routeTable.name}`,
            dependencies: { routeTable, ig },
          }),
      }),
    ])()
  )(config.vpc.subnetsPublic);

  const subnet = publics[0].subnet;
  const natGateway = await provider.makeNatGateway({
    name: `nat-gateway-${subnet.name}`,
    dependencies: { subnet, eip },
  });

  //Private
  assert(config.vpc.subnetsPrivate);

  const privates = await map(({ name, CidrBlock, AvailabilityZone }) =>
    pipe([
      assign({
        subnet: () =>
          provider.makeSubnet({
            name,
            dependencies: { vpc },
            properties: () => ({
              CidrBlock,
              AvailabilityZone,
              Tags: [
                {
                  Key: `kubernetes.io/cluster/${clusterName}`,
                  Value: "shared",
                },
                { Key: "kubernetes.io/role/internal-elb", Value: "1" },
              ],
            }),
          }),
      }),
      assign({
        routeTable: ({ subnet }) =>
          provider.makeRouteTables({
            name: `route-table-${subnet.name}`,
            dependencies: { vpc, subnet },
          }),
      }),
      assign({
        routeNat: ({ routeTable }) =>
          provider.makeRoute({
            name: `route-nat-${routeTable.name}`,
            dependencies: { routeTable, natGateway },
          }),
      }),
    ])()
  )(config.vpc.subnetsPrivate);

  const securityGroupCluster = await provider.makeSecurityGroup({
    name: "security-group-cluster",
    dependencies: { vpc },
    properties: () => ({
      //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createSecurityGroup-property
      create: {
        Description: "SG for the EKS Cluster",
      },
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#authorizeSecurityGroupIngress-property
      ingress: {
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
      },
      egress: {
        IpPermissions: [
          {
            FromPort: 1024,
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
            ToPort: 65535,
          },
        ],
      },
    }),
  });
  const securityGroupNodes = await provider.makeSecurityGroup({
    name: "security-group-nodes",
    dependencies: { vpc, securityGroup: securityGroupCluster },
    properties: ({ dependencies: { securityGroup } }) => ({
      Tags: [{ Key: `kubernetes.io/cluster/${clusterName}`, Value: "owned" }],
      //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createSecurityGroup-property
      create: {
        Description: "SG for the EKS Nodes",
      },
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#authorizeSecurityGroupIngress-property
      ingress: {
        IpPermissions: [
          {
            FromPort: 0,
            IpProtocol: "-1",
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
            ToPort: 65535,
          },
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
            UserIdGroupPairs: [{ GroupId: securityGroup.live?.GroupId }],
            ToPort: 65535,
          },
        ],
      },
    }),
  });

  const cluster = await provider.makeEKSCluster({
    name: clusterName,
    dependencies: {
      subnets: [...pluck("subnet")(publics), ...pluck("subnet")(privates)],
      securityGroups: [securityGroupCluster, securityGroupNodes],
      role: roleCluster,
    },
  });

  const nodeGroup = await provider.makeEKSNodeGroup({
    name: "node-group-public",
    dependencies: {
      subnets: pluck("subnet")(privates),
      cluster,
      role: roleNodeGroup,
    },
  });

  const iamOpenIdConnectProvider = await provider.makeIamOpenIDConnectProvider({
    name: iamOpenIdConnectProviderName,
    dependencies: { cluster },
    properties: ({ dependencies: { cluster } }) => ({
      Url: get(
        "live.identity.oidc.issuer",
        "oidc.issuer not available yet"
      )(cluster),
      ClientIDList: ["sts.amazonaws.com"],
    }),
  });

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

  const iamLoadBalancerPolicy = await provider.makeIamPolicy({
    name: "AWSLoadBalancerControllerIAMPolicy",
    properties: () => ({
      PolicyDocument: loadBalancerPolicy,
      Description: "Load Balancer Policy",
    }),
  });

  const roleLoadBalancer = await provider.makeIamRole({
    name: "role-load-balancer",
    dependencies: {
      iamOpenIdConnectProvider,
      policies: [iamLoadBalancerPolicy],
    },
    properties: ({ dependencies: { iamOpenIdConnectProvider } }) => ({
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Federated: get(
                "live.Arn",
                "iamOpenIdConnectProvider.Arn not yet known"
              )(iamOpenIdConnectProvider),
            },
            Action: "sts:AssumeRoleWithWebIdentity",
            Condition: {
              StringEquals: {
                [`${get(
                  "live.Url",
                  "iamOpenIdConnectProvider.Url not yet known"
                )(iamOpenIdConnectProvider)}:aud`]: "sts.amazonaws.com",
              },
            },
          },
        ],
      },
    }),
  });
  assert(config.rootDomainName);
  assert(config.domainName);

  //TODO remove
  const domain = await provider.useRoute53Domain({
    name: config.rootDomainName,
  });

  const makeDomainName = ({ domainName, stage }) =>
    `${stage == "production" ? "" : `${stage}.`}${domainName}`;

  const domainName = makeDomainName({
    domainName: config.domainName,
    stage: config.stage,
  });

  const certificate = await provider.makeCertificate({
    name: domainName,
  });

  const hostedZone = await provider.makeHostedZone({
    name: `${domainName}.`,
    dependencies: { domain },
  });

  const certificateRecordValidation = await provider.makeRoute53Record({
    name: `certificate-validation-${domainName}.`,
    dependencies: { hostedZone, certificate },
    properties: ({ dependencies: { certificate } }) => {
      const domainValidationOption =
        certificate?.live?.DomainValidationOptions[0];
      const record = domainValidationOption?.ResourceRecord;
      if (domainValidationOption) {
        assert(
          record,
          `missing record in DomainValidationOptions, certificate ${JSON.stringify(
            certificate.live
          )}`
        );
      }
      return {
        Name: record?.Name,
        ResourceRecords: [
          {
            Value: record?.Value,
          },
        ],
        TTL: 300,
        Type: "CNAME",
      };
    },
  });

  return {
    roleCluster,
    roleNodeGroup,
    roleLoadBalancer,
    rolePod,
    vpc,
    ig,
    privates,
    publics,
    securityGroupCluster,
    cluster,
    nodeGroup,
    iamOpenIdConnectProvider,
    certificate,
    certificateRecordValidation,
    hostedZone,
  };
};

exports.createResources = createResources;

const isProviderUp = ({ resources }) =>
  pipe([
    and([() => resources.cluster.getLive()]),
    tap((isUp) => {
      assert(true);
    }),
  ])();

exports.isProviderUp = isProviderUp;

exports.createStack = async () => {
  const provider = AwsProvider({ config: require("./config") });
  const resources = await createResources({ provider, resources: {} });
  return {
    provider,
    resources,
    hooks,
    isProviderUp: () => isProviderUp({ resources }),
  };
};
