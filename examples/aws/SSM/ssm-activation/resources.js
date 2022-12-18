// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "AmazonEC2RunCommandRoleForManagedInstances",
      Description: "EC2 role for SSM",
      Path: "/service-role/",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "ssm.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      AttachedPolicies: [
        {
          PolicyName: "AmazonSSMDirectoryServiceAccess",
          PolicyArn: "arn:aws:iam::aws:policy/AmazonSSMDirectoryServiceAccess",
        },
        {
          PolicyName: "AmazonSSMManagedInstanceCore",
          PolicyArn: "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore",
        },
      ],
    }),
  },
  {
    type: "Activation",
    group: "SSM",
    properties: ({}) => ({
      Description: "my-activation",
    }),
    dependencies: ({}) => ({
      iamRole: "AmazonEC2RunCommandRoleForManagedInstances",
    }),
  },
];
