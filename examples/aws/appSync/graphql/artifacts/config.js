module.exports = ({ stage }) => ({
  projectName: "aws-appsync-graphql",
  IAM: {
    Role: {
      appsyncCdkAppStackApilambdaDatasourceServiceRole2Spl5Onobew5M: {
        name: "AppsyncCdkAppStack-ApilambdaDatasourceServiceRole2-SPL5ONOBEW5M",
        properties: {
          RoleName:
            "AppsyncCdkAppStack-ApilambdaDatasourceServiceRole2-SPL5ONOBEW5M",
          Path: "/",
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
      appsyncCdkAppStackAppSyncNotesHandlerServiceRole3Ut2Snth19J61: {
        name: "AppsyncCdkAppStack-AppSyncNotesHandlerServiceRole3-UT2SNTH19J61",
        properties: {
          RoleName:
            "AppsyncCdkAppStack-AppSyncNotesHandlerServiceRole3-UT2SNTH19J61",
          Path: "/",
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
        },
      },
    },
  },
  DynamoDB: {
    Table: {
      appsyncCdkAppStackCdkNotesTable254A7Fd1_1Ju7Cih9Eiq5K: {
        name: "AppsyncCdkAppStack-CDKNotesTable254A7FD1-1JU7CIH9EIQ5K",
        properties: {
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "S",
            },
          ],
          KeySchema: [
            {
              AttributeName: "id",
              KeyType: "HASH",
            },
          ],
          BillingMode: "PAY_PER_REQUEST",
        },
      },
      appsyncCdkAppStackCdkNotesTable254A7Fd1C0My46Ehk3Ac: {
        name: "AppsyncCdkAppStack-CDKNotesTable254A7FD1-C0MY46EHK3AC",
        properties: {
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "S",
            },
          ],
          KeySchema: [
            {
              AttributeName: "id",
              KeyType: "HASH",
            },
          ],
          BillingMode: "PAY_PER_REQUEST",
        },
      },
    },
  },
  AppSync: {
    GraphqlApi: {
      cdkNotesAppsyncApi: {
        name: "cdk-notes-appsync-api",
        properties: {
          authenticationType: "API_KEY",
          xrayEnabled: true,
          schema:
            'schema {\n  query: Query\n  mutation: Mutation\n  subscription: Subscription\n}\n\ntype Mutation {\n  createNote(note: NoteInput!): Note\n  deleteNote(noteId: String!): String\n  updateNote(note: UpdateNoteInput!): Note\n}\n\ntype Note {\n  completed: Boolean!\n  id: ID!\n  name: String!\n}\n\ntype Query {\n  getNoteById(noteId: String!): Note\n  listNotes: [Note]\n}\n\ntype Subscription {\n  onCreateNote: Note @aws_subscribe(mutations : ["createNote"])\n  onDeleteNote: String @aws_subscribe(mutations : ["deleteNote"])\n  onUpdateNote: Note @aws_subscribe(mutations : ["updateNote"])\n}\n\ninput NoteInput {\n  completed: Boolean!\n  id: ID!\n  name: String!\n}\n\ninput UpdateNoteInput {\n  completed: Boolean\n  id: ID!\n  name: String\n}\n',
        },
      },
    },
    ApiKey: {
      da2Ouijmdxdircnfjbxgbxwtboyfy: {
        name: "da2-ouijmdxdircnfjbxgbxwtboyfy",
      },
    },
    Resolver: {
      mutationCreateNote: {
        name: "Mutation-createNote",
        properties: {
          typeName: "Mutation",
          fieldName: "createNote",
          kind: "UNIT",
        },
      },
      mutationDeleteNote: {
        name: "Mutation-deleteNote",
        properties: {
          typeName: "Mutation",
          fieldName: "deleteNote",
          kind: "UNIT",
        },
      },
      mutationUpdateNote: {
        name: "Mutation-updateNote",
        properties: {
          typeName: "Mutation",
          fieldName: "updateNote",
          kind: "UNIT",
        },
      },
      queryGetNoteById: {
        name: "Query-getNoteById",
        properties: {
          typeName: "Query",
          fieldName: "getNoteById",
          kind: "UNIT",
        },
      },
      queryListNotes: {
        name: "Query-listNotes",
        properties: {
          typeName: "Query",
          fieldName: "listNotes",
          kind: "UNIT",
        },
      },
    },
    DataSource: {
      lambdaDatasource: {
        name: "lambdaDatasource",
        properties: {
          type: "AWS_LAMBDA",
        },
      },
    },
  },
  Lambda: {
    Function: {
      appsyncCdkAppStackAppSyncNotesHandler4B870A76AaX1nitpx2Y4: {
        name: "AppsyncCdkAppStack-AppSyncNotesHandler4B870A76-AaX1nitpx2Y4",
        properties: {
          FunctionName:
            "AppsyncCdkAppStack-AppSyncNotesHandler4B870A76-AaX1nitpx2Y4",
          Handler: "main.handler",
          PackageType: "Zip",
          Runtime: "nodejs12.x",
          Description: "",
          Timeout: 3,
          MemorySize: 1024,
        },
      },
    },
  },
});
