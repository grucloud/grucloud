const { AwsProvider } = require("@grucloud/core");

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
    dependencies: { policies: [iamPolicyToRole] },
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

  const server = await provider.makeEC2({
    name: "web-iam",
    dependencies: { keyPair, iamInstanceProfile },
    properties: () => ({
      InstanceType: "t2.micro",
      ImageId: "ami-00f6a0c18edb19300", // Ubuntu 18.04
    }),
  });

  const iamPolicyEKSCluster = await provider.useIamPolicyReadOnly({
    name: "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy",
  });

  const iamRoleEKS = await provider.makeIamRole({
    name: "eks",
    dependencies: { policies: [iamPolicyEKSCluster] },
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

  return {
    iamUser,
    iamGroup,
    iamPolicyToUser,
    iamPolicyToRole,
    iamPolicyToGroup,
    iamRole,
    iamInstanceProfile,
    iamRoleEKS,
    server,
  };
};
exports.createResources = createResources;

exports.createStack = async ({ config }) => {
  // Create a AWS provider
  const provider = AwsProvider({ name: "aws", config });
  const keyPair = await provider.useKeyPair({
    name: "kp",
  });

  const resources = await createResources({ provider, resources: { keyPair } });

  return {
    provider,
    resources,
  };
};
