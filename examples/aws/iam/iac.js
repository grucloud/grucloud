const { AwsProvider } = require("@grucloud/core");

const createResources = async ({ provider }) => {
  const userName = "Alice";
  const roleName = "role-allow-assume-role";
  const policyNameToUser = "myPolicy-to-user";
  const policyNameToRole = "myPolicy-to-role";

  const iamInstanceProfileName = "my-profile";

  const PolicyDocument = JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Action: ["ec2:Describe*"],
        Effect: "Allow",
        Resource: "*",
      },
    ],
  });

  const iamUser = await provider.makeIamUser({
    name: userName,
    properties: () => ({}),
  });

  const iamRole = await provider.makeIamRole({
    name: roleName,
    properties: () => ({
      Path: "/",
      AssumeRolePolicyDocument: JSON.stringify({
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
      }),
    }),
  });

  return {
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
    iamRole,
    iamInstanceProfile: await provider.makeIamInstanceProfile({
      name: iamInstanceProfileName,
      dependencies: { iamRole },
      properties: () => ({
        Path: "/",
      }),
    }),
  };
};
exports.createResources = createResources;

exports.createStack = async ({ config }) => {
  // Create a AWS provider
  const provider = await AwsProvider({ name: "aws", config });

  provider.register({
    resources: await createResources({ provider, resources: {} }),
  });

  return {
    providers: [provider],
  };
};
