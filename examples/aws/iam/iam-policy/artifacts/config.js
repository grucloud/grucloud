module.exports = ({ stage }) => ({
  projectName: "@grucloud/example-aws-iam-policy",
  IAM: {
    Policy: {
      amazonEksWorkerNodePolicy: {
        name: "AmazonEKSWorkerNodePolicy",
        properties: {
          Arn: "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy",
        },
      },
      policyAllowEc2: {
        name: "policy-allow-ec2",
        properties: {
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
        },
      },
    },
    Role: {
      role_4Policies: {
        name: "role-4-policies",
        properties: {
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
        },
      },
    },
  },
});
