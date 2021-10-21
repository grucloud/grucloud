const createResources = ({ provider }) => {
  provider.IAM.usePolicy({
    name: "AmazonEKSWorkerNodePolicy",
    properties: () => ({
      Arn: "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy",
    }),
  });

  provider.IAM.makePolicy({
    name: "policy-allow-ec2",
    properties: () => ({
      PolicyName: "policy-allow-ec2",
      PolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: ["s3:*"],
            Effect: "Allow",
            Resource: "*",
          },
          {
            Action: ["sqs:*"],
            Effect: "Allow",
            Resource: "*",
          },
        ],
      },
      Path: "/",
      Description: "Allow ec2:Describe",
    }),
  });

  provider.IAM.makeRole({
    name: "role-4-policies",
    properties: () => ({
      RoleName: "role-4-policies",
      Path: "/",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "",
            Effect: "Allow",
            Principal: {
              Service: "ec2.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
    }),
    dependencies: ({ resources }) => ({
      policies: [
        resources.IAM.Policy.amazonEksWorkerNodePolicy,
        resources.IAM.Policy.policyAllowEc2,
      ],
    }),
  });
};

exports.createResources = createResources;
