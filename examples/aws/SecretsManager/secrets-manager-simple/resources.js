// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Secret",
    group: "SecretsManager",
    properties: ({ generatePassword }) => ({
      Name: "prod/myapp/db",
      SecretString: {
        password: generatePassword({ length: 32 }),
        username: "demousername",
      },
      Description: "access postgres",
      Tags: [
        {
          Key: "mykey",
          Value: "myvalue",
        },
      ],
    }),
  },
  {
    type: "ResourcePolicy",
    group: "SecretsManager",
    properties: ({}) => ({
      ResourcePolicy: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "EnableAnotherAccountToReadTheSecret",
            Effect: "Allow",
            Principal: {
              AWS: "arn:aws:iam::548529576214:root",
            },
            Action: "secretsmanager:GetSecretValue",
            Resource: "*",
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      secret: "prod/myapp/db",
    }),
  },
];
