const pkg = require("./package.json");
module.exports = ({ stage }) => ({
  projectName: pkg.name,
  ec2: {
    KeyPair: {
      kp: {
        name: "kp",
      },
    },
    Instance: {
      webIam: {
        name: "web-iam",
        properties: {
          InstanceType: "t2.micro",
          ImageId: "ami-0baa0a5cc6cd768ac",
          Placement: {
            AvailabilityZone: "eu-west-2a",
          },
        },
      },
    },
  },
  iam: {
    Policy: {
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
      amazonEksWorkerNodePolicy: {
        name: "AmazonEKSWorkerNodePolicy",
        properties: {
          Arn: "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy",
          name: "AmazonEKSWorkerNodePolicy",
        },
      },
    },
    Role: {
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
  },
});
