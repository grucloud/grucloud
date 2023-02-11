// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "DataSource",
    group: "AppSync",
    properties: ({ config }) => ({
      name: "NotesDataSource",
      description: "The Notes Table AppSync Data Source",
      type: "AMAZON_DYNAMODB",
      dynamodbConfig: {
        awsRegion: `${config.region}`,
        tableName: "sam-app-DynamoDBNotesTable-8JRUXR2K56WX",
        useCallerCredentials: false,
        versioned: false,
      },
    }),
    dependencies: ({}) => ({
      graphqlApi: "NotesApi",
      serviceRole: "sam-app-DynamoDBRole-19GU17WZ4BTM3",
      dynamoDbTable: "sam-app-DynamoDBNotesTable-8JRUXR2K56WX",
    }),
  },
  {
    type: "GraphqlApi",
    group: "AppSync",
    properties: ({}) => ({
      name: "NotesApi",
      authenticationType: "API_KEY",
      xrayEnabled: true,
      apiKeys: [{}],
      schemaFile: "NotesApi.graphql",
    }),
  },
  {
    type: "Resolver",
    group: "AppSync",
    properties: ({}) => ({
      fieldName: "deleteNote",
      kind: "UNIT",
      requestMappingTemplate: `{
  "version": "2018-05-29",
  "operation": "DeleteItem",
  "key": {
    "NoteId": $util.dynamodb.toDynamoDBJson($ctx.args.NoteId)
  }
}
`,
      responseMappingTemplate: "$util.toJson($ctx.result)",
      typeName: "Mutation",
    }),
    dependencies: ({}) => ({
      dataSource: "NotesDataSource",
      graphqlApi: "NotesApi",
    }),
  },
  {
    type: "Resolver",
    group: "AppSync",
    properties: ({}) => ({
      fieldName: "saveNote",
      kind: "UNIT",
      requestMappingTemplate: `{
  "version": "2018-05-29",
  "operation": "PutItem",
  "key": {
    "NoteId": $util.dynamodb.toDynamoDBJson($ctx.args.NoteId)
  },
  "attributeValues": {
    "title": $util.dynamodb.toDynamoDBJson($ctx.args.title),
    "content": $util.dynamodb.toDynamoDBJson($ctx.args.content)
  }
}
`,
      responseMappingTemplate: "$util.toJson($ctx.result)",
      typeName: "Mutation",
    }),
    dependencies: ({}) => ({
      dataSource: "NotesDataSource",
      graphqlApi: "NotesApi",
    }),
  },
  {
    type: "Resolver",
    group: "AppSync",
    properties: ({ multiline }) => ({
      fieldName: "allNotes",
      kind: "UNIT",
      requestMappingTemplate: multiline(() => {
        /*
{
  "version": "2017-02-28",
  "operation": "Scan",
  "limit": $util.defaultIfNull(${ctx.args.limit},20),
  "nextToken": $util.toJson(${ctx.args.nextToken})
}

*/
      }),
      responseMappingTemplate: multiline(() => {
        /*
{
  "notes": $util.toJson($ctx.result.items),
  "nextToken": $util.toJson(${ctx.args.nextToken})
}

*/
      }),
      typeName: "Query",
    }),
    dependencies: ({}) => ({
      dataSource: "NotesDataSource",
      graphqlApi: "NotesApi",
    }),
  },
  {
    type: "Resolver",
    group: "AppSync",
    properties: ({}) => ({
      fieldName: "getNote",
      kind: "UNIT",
      requestMappingTemplate: `{
  "version": "2018-05-29",
  "operation": "GetItem",
  "key": {
    "NoteId": $util.dynamodb.toDynamoDBJson($ctx.args.NoteId)
  }
}
`,
      responseMappingTemplate: "$util.toJson($ctx.result)",
      typeName: "Query",
    }),
    dependencies: ({}) => ({
      dataSource: "NotesDataSource",
      graphqlApi: "NotesApi",
    }),
  },
  {
    type: "Table",
    group: "DynamoDB",
    properties: ({}) => ({
      TableName: "sam-app-DynamoDBNotesTable-8JRUXR2K56WX",
      AttributeDefinitions: [
        {
          AttributeName: "NoteId",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "NoteId",
          KeyType: "HASH",
        },
      ],
      BillingMode: "PAY_PER_REQUEST",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName: "sam-app-DynamoDBRole-19GU17WZ4BTM3",
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
      Policies: [
        {
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Action: [
                  "dynamodb:GetItem",
                  "dynamodb:PutItem",
                  "dynamodb:DeleteItem",
                  "dynamodb:UpdateItem",
                  "dynamodb:Query",
                  "dynamodb:Scan",
                ],
                Resource: `arn:aws:dynamodb:${
                  config.region
                }:${config.accountId()}:table/sam-app-DynamoDBNotesTable-8JRUXR2K56WX`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "DDBAccess",
        },
      ],
    }),
  },
];
