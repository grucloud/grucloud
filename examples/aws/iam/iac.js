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

  const iamGroup = await provider.makeIamGroup({
    name: groupName,
    properties: () => ({}),
  });

  const iamUser = await provider.makeIamUser({
    name: userName,
    dependencies: { iamGroups: [iamGroup] },
    properties: () => ({}),
  });

  const iamRole = await provider.makeIamRole({
    name: roleName,
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
      VolumeSize: 50,
      InstanceType: "t2.micro",
      ImageId: "ami-00f6a0c18edb19300", // Ubuntu 18.04
    }),
  });

  return {
    iamUser,
    iamGroup,
    iamPolicytoUser: await provider.makeIamPolicy({
      name: policyNameToUser,
      dependencies: { iamUser },
      properties: () => ({
        PolicyDocument,
        Description: "Allow ec2:Describe",
      }),
    }),
    iamPolicyToRole: await provider.makeIamPolicy({
      name: policyNameToRole,
      dependencies: { iamRole },
      properties: () => ({
        PolicyDocument,
        Description: "Allow ec2:Describe",
      }),
    }),
    iamPolicyToGroup: await provider.makeIamPolicy({
      name: policyNameToGroup,
      dependencies: { iamGroup },
      properties: () => ({
        PolicyDocument,
        Description: "Allow ec2:Describe",
      }),
    }),
    iamRole,
    iamInstanceProfile,
  };
};
exports.createResources = createResources;

exports.createStack = async ({ config }) => {
  // Create a AWS provider
  const provider = await AwsProvider({ name: "aws", config });

  const keyPair = await provider.useKeyPair({
    name: "kp",
  });

  provider.register({
    resources: await createResources({ provider, resources: { keyPair } }),
  });

  return {
    provider,
  };
};
