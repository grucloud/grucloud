module.exports = ({ stage }) => ({
  projectName: "@grucloud/example-aws-iam",
  iam: {
    Policy: {
      amazonEksWorkerNodePolicy: {
        name: "AmazonEKSWorkerNodePolicy",
        properties: {
          Arn: "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy",
        },
      },
      lambdaPolicy: {
        name: "lambda-policy",
        properties: {
          PolicyName: "lambda-policy",
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Action: ["logs:*"],
                Effect: "Allow",
                Resource: "*",
              },
            ],
          },
          Path: "/",
          Description: "Allow logs",
        },
      },
      myPolicyToGroup: {
        name: "myPolicy-to-group",
        properties: {
          PolicyName: "myPolicy-to-group",
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Action: ["s3:*"],
                Effect: "Allow",
                Resource: "*",
              },
            ],
          },
          Path: "/",
          Description: "Allow ec2:Describe",
        },
      },
      myPolicyToRole: {
        name: "myPolicy-to-role",
        properties: {
          PolicyName: "myPolicy-to-role",
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Action: ["s3:*"],
                Effect: "Allow",
                Resource: "*",
              },
            ],
          },
          Path: "/",
          Description: "Allow ec2:Describe",
        },
      },
      myPolicyToUser: {
        name: "myPolicy-to-user",
        properties: {
          PolicyName: "myPolicy-to-user",
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Action: ["s3:*"],
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
    User: {
      alice: {
        name: "Alice",
        properties: {
          UserName: "Alice",
          Path: "/",
        },
      },
    },
    Group: {
      admin: {
        name: "Admin",
        properties: {
          GroupName: "Admin",
          Path: "/",
        },
      },
    },
    Role: {
      lambdaRole: {
        name: "lambda-role",
        properties: {
          RoleName: "lambda-role",
          Path: "/",
          AssumeRolePolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Sid: "",
                Effect: "Allow",
                Principal: {
                  Service: "lambda.amazonaws.com",
                },
                Action: "sts:AssumeRole",
              },
            ],
          },
        },
      },
      roleAllowAssumeRole: {
        name: "role-allow-assume-role",
        properties: {
          RoleName: "role-allow-assume-role",
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
    InstanceProfile: {
      myProfile: {
        name: "my-profile",
      },
    },
  },
  ec2: {
    Instance: {
      webIam: {
        name: "web-iam",
        properties: {
          InstanceType: "t2.micro",
          ImageId: "ami-084a1f89b0bb0f729",
        },
      },
    },
  },
});
