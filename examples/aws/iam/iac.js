const { AwsProvider } = require("@grucloud/provider-aws");
const hook = require("./hook");

const createResources = async ({ provider, resources: { keyPair } }) => {
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

  const iamPolicyToUser = await provider.makeIamPolicy({
    name: policyNameToUser,
    properties: () => ({
      PolicyDocument,
      Description: "Allow ec2:Describe",
    }),
  });

  const iamPolicyToRole = await provider.makeIamPolicy({
    name: policyNameToRole,
    properties: () => ({
      PolicyDocument,
      Description: "Allow ec2:Describe",
    }),
  });

  const iamPolicyToGroup = await provider.makeIamPolicy({
    name: policyNameToGroup,
    properties: () => ({
      PolicyDocument,
      Description: "Allow ec2:Describe",
    }),
  });

  const iamPolicyEKSWorkerNode = await provider.useIamPolicy({
    name: "AmazonEKSWorkerNodePolicy",
    properties: () => ({
      Arn: "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy",
    }),
  });

  const iamGroup = await provider.makeIamGroup({
    name: groupName,
    dependencies: { policies: [iamPolicyToGroup] },
    properties: () => ({}),
  });

  const iamUser = await provider.makeIamUser({
    name: userName,
    dependencies: { iamGroups: [iamGroup], policies: [iamPolicyToUser] },
    properties: () => ({}),
  });

  const iamRole = await provider.makeIamRole({
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

  const iamInstanceProfile = await provider.makeIamInstanceProfile({
    name: iamInstanceProfileName,
    dependencies: { iamRoles: [iamRole] },
    properties: () => ({}),
  });

  const image = await provider.useImage({
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

  const server = await provider.makeEC2({
    name: "web-iam",
    dependencies: { image, keyPair, iamInstanceProfile },
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

exports.createStack = async () => {
  // Create a AWS provider
  const provider = AwsProvider({ config: require("./config") });
  const keyPair = await provider.useKeyPair({
    name: "kp",
  });

  const resources = await createResources({ provider, resources: { keyPair } });

  return {
    provider,
    resources,
    hooks: [hook],
  };
};
