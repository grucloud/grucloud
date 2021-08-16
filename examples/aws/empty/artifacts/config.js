module.exports = ({ stage }) => ({
  projectName: "example-grucloud-infra-aws",
  ecr: {
    Registry: {
      default: {
        name: "default",
        properties: {
          policyText: {
            Version: "2012-10-17",
            Statement: [
              {
                Sid: "stis-2",
                Effect: "Allow",
                Principal: {
                  AWS: "arn:aws:iam::840541460064:root",
                },
                Action: ["ecr:CreateRepository", "ecr:ReplicateImage"],
                Resource: "arn:aws:ecr:eu-west-2:840541460064:repository/*",
              },
            ],
          },
          replicationConfiguration: {
            rules: [
              {
                destinations: [
                  {
                    region: "us-east-2",
                    registryId: "840541460064",
                  },
                ],
              },
            ],
          },
        },
      },
    },
  },
});
