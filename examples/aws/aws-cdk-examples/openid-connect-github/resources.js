// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "OpenIDConnectProvider",
    group: "IAM",
    properties: ({}) => ({
      ClientIDList: ["sts.amazonaws.com"],
      Url: "token.actions.githubusercontent.com",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ getId }) => ({
      RoleName: "exampleGitHubDeployRole",
      Description:
        "This role is used via GitHub Actions to deploy with AWS CDK or Terraform on the target AWS account",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Federated: `${getId({
                type: "OpenIDConnectProvider",
                group: "IAM",
                name: "oidp::token.actions.githubusercontent.com",
              })}`,
            },
            Action: "sts:AssumeRoleWithWebIdentity",
            Condition: {
              StringLike: {
                [`${getId({
                  type: "OpenIDConnectProvider",
                  group: "IAM",
                  name: "oidp::token.actions.githubusercontent.com",
                  path: "live.Url",
                })}:sub`]: [
                  "repo:dannysteenman/aws-cdk-examples:*",
                  "repo:dannysteenman/aws-toolbox:main",
                ],
              },
            },
          },
        ],
      },
      AttachedPolicies: [
        {
          PolicyArn: "arn:aws:iam::aws:policy/AdministratorAccess",
          PolicyName: "AdministratorAccess",
        },
      ],
    }),
    dependencies: ({}) => ({
      openIdConnectProvider: "oidp::token.actions.githubusercontent.com",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName:
        "GitHubOpenIDConnect-CustomAWSCDKOpenIdConnectProvi-1BLXJG12N1Q77",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "lambda.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      Policies: [
        {
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Action: [
                  "iam:CreateOpenIDConnectProvider",
                  "iam:DeleteOpenIDConnectProvider",
                  "iam:UpdateOpenIDConnectProviderThumbprint",
                  "iam:AddClientIDToOpenIDConnectProvider",
                  "iam:RemoveClientIDFromOpenIDConnectProvider",
                ],
                Resource: "*",
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "Inline",
        },
      ],
      AttachedPolicies: [
        {
          PolicyArn:
            "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
          PolicyName: "AWSLambdaBasicExecutionRole",
        },
      ],
    }),
  },
];
