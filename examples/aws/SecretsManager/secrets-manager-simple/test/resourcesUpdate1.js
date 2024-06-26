// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "ResourcePolicy",
    group: "SecretsManager",
    properties: ({}) => ({
      ResourcePolicy: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "EnableAnotherAWSAccountToReadTheSecret",
            Effect: "Allow",
            Principal: {
              AWS: `arn:aws:iam::548529576214:root`,
            },
            Action: "secretsmanager:GetSecretValue",
            Resource: `*`,
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      secret: "prod/myapp/db",
    }),
  },
];
