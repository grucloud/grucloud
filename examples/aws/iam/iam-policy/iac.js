const { AwsProvider } = require("@grucloud/provider-aws");
const hook = require("./hook");

const createResources = async ({ provider }) => {
  const roleName = "role-4-policies";

  const policyName = "policy-allow-ec2";

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

  const iamPolicy = provider.iam.makePolicy({
    name: policyName,
    properties: () => ({
      PolicyDocument,
      Description: "Allow ec2:Describe",
    }),
  });

  const iamRole = provider.iam.makeRole({
    name: roleName,
    dependencies: {
      policies: [
        iamPolicy,
        "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy",
      ],
    },
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

  return { iamRole, iamPolicy };
};
exports.createResources = createResources;

exports.createStack = async ({ createProvider }) => {
  const provider = createProvider(AwsProvider, { config: require("./config") });
  const resources = await createResources({ provider });

  return {
    provider,
    resources,
    hooks: [hook],
  };
};
