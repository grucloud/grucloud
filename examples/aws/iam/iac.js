const { AwsProvider } = require("@grucloud/core");

const createResources = async ({ provider }) => {
  const userName = "Alice";
  const roleName = "role-allow-assume-role";
  const policyName = "myPolicy";

  const iamUser = await provider.makeIamUser({
    name: userName,
    properties: () => ({}),
  });

  return {
    iamPolicy: await provider.makeIamPolicy({
      name: policyName,
      dependencies: { iamUser },
      properties: () => ({
        PolicyName: policyName,
        PolicyDocument: JSON.stringify({
          Version: "2012-10-17",
          Statement: [
            {
              Action: ["ec2:Describe*"],
              Effect: "Allow",
              Resource: "*",
            },
          ],
        }),
        Description: "Allow ec2:Describe",
        Path: "/",
      }),
    }),
    iamRole: await provider.makeIamRole({
      name: roleName,
      properties: () => ({
        RoleName: roleName,
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
