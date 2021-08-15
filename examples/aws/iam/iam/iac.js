const { AwsProvider } = require("@grucloud/provider-aws");
const hook = require("./hook");

const createResources = async ({ provider }) => {
  const userName = "Alice";
  const groupName = "Admin";
  const roleName = "role-allow-assume-role";
  const policyNameToUser = "myPolicy-to-user";
  const policyNameToRole = "myPolicy-to-role";
  const policyNameToGroup = "myPolicy-to-group";

  const iamInstanceProfileName = "my-profile";

  const PolicyDocument = {
    Version: "2012-10-17",
    Statement: [
      {
        Action: ["s3:*"],
        Effect: "Allow",
        Resource: "*",
      },
    ],
  };

  const iamPolicyToUser = provider.iam.makePolicy({
    name: policyNameToUser,
    properties: () => ({
      PolicyDocument,
      Description: "Allow ec2:Describe",
    }),
  });

  const iamPolicyToRole = provider.iam.makePolicy({
    name: policyNameToRole,
    properties: () => ({
      PolicyDocument,
      Description: "Allow ec2:Describe",
    }),
  });

  const iamPolicyToGroup = provider.iam.makePolicy({
    name: policyNameToGroup,
    properties: () => ({
      PolicyDocument,
      Description: "Allow ec2:Describe",
    }),
  });

  const iamPolicyEKSWorkerNode = provider.iam.usePolicy({
    name: "AmazonEKSWorkerNodePolicy",
    properties: () => ({
      Arn: "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy",
    }),
  });

  const iamGroup = provider.iam.makeGroup({
    name: groupName,
    dependencies: { policies: [iamPolicyToGroup] },
    properties: () => ({}),
  });

  const iamUser = provider.iam.makeUser({
    name: userName,
    dependencies: { iamGroups: [iamGroup], policies: [iamPolicyToUser] },
    properties: () => ({}),
  });

  const iamRole = provider.iam.makeRole({
    name: roleName,
    dependencies: { policies: [iamPolicyToRole, iamPolicyEKSWorkerNode] },
    properties: () => ({
      Path: "/",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "sts:AssumeRole",
            Principal: {
              Service: "ec2.amazonaws.com",
            },
            Effect: "Allow",
            Sid: "",
          },
        ],
      },
    }),
  });

  const iamInstanceProfile = provider.iam.makeInstanceProfile({
    name: iamInstanceProfileName,
    dependencies: { iamRoles: [iamRole] },
    properties: () => ({}),
  });

  const image = provider.ec2.useImage({
    name: "Amazon Linux 2",
    properties: () => ({
      Filters: [
        {
          Name: "architecture",
          Values: ["x86_64"],
        },
        {
          Name: "description",
          Values: ["Amazon Linux 2 AMI *"],
        },
      ],
    }),
  });

  const server = provider.ec2.makeInstance({
    name: "web-iam",
    dependencies: { image, iamInstanceProfile },
    properties: () => ({
      InstanceType: "t2.micro",
    }),
  });

  return {
    iamUser,
    iamGroup,
    iamPolicyToUser,
    iamPolicyToRole,
    iamPolicyToGroup,
    iamRole,
    iamInstanceProfile,
    server,
  };
};
exports.createResources = createResources;

exports.createStack = async ({ createProvider }) => {
  // Create a AWS provider
  const provider = createProvider(AwsProvider, { config: require("./config") });
  const resources = createResources({ provider });

  return {
    provider,
    resources,
    hooks: [hook],
  };
};
