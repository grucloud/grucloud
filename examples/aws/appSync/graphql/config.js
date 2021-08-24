module.exports = ({ stage }) => ({
  projectName: "aws-appsync-graphql",
  iam: {
    Policy: {
      appsyncDsDdbKq4ygeMyModelTypeDemoTable: {
        name: "appsync-ds-ddb-kq4yge-MyModelTypeDemoTable",
        properties: {
          PolicyName: "appsync-ds-ddb-kq4yge-MyModelTypeDemoTable",
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Action: [
                  "dynamodb:DeleteItem",
                  "dynamodb:GetItem",
                  "dynamodb:PutItem",
                  "dynamodb:Query",
                  "dynamodb:Scan",
                  "dynamodb:UpdateItem",
                ],
                Resource: [
                  "arn:aws:dynamodb:eu-west-2:840541460064:table/MyModelTypeDemoTable",
                  "arn:aws:dynamodb:eu-west-2:840541460064:table/MyModelTypeDemoTable/*",
                ],
              },
            ],
          },
          Path: "/service-role/",
        },
      },
    },
    Role: {
      appsyncDsDdbKq4ygeMyModelTypeDemoTable: {
        name: "appsync-ds-ddb-kq4yge-MyModelTypeDemoTable",
        properties: {
          RoleName: "appsync-ds-ddb-kq4yge-MyModelTypeDemoTable",
          Path: "/service-role/",
          AssumeRolePolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Principal: {
                  Service: "appsync.amazonaws.com",
                },
                Action: "sts:AssumeRole",
              },
            ],
          },
        },
      },
    },
  },
  appSync: {
    GraphqlApi: {
      myAppSyncApp: {
        name: "My AppSync App",
        properties: {
          authenticationType: "API_KEY",
          xrayEnabled: false,
        },
      },
    },
    ApiKey: {
      da2Wbuvlxl5cfapbifytstbzthsxy: {
        name: "da2-wbuvlxl5cfapbifytstbzthsxy",
        properties: {},
      },
    },
    DataSource: {
      datasource: {
        name: "datasource",
        properties: {
          description: "Data source created by the console.",
          type: "NONE",
        },
      },
    },
  },
});
