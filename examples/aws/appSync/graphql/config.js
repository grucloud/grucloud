module.exports = ({ stage }) => ({
  projectName: "aws-appsync-graphql",
  IAM: {
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
      appsyncDsDdbM66htuMyModelTypeTable: {
        name: "appsync-ds-ddb-m66htu-MyModelTypeTable",
        properties: {
          PolicyName: "appsync-ds-ddb-m66htu-MyModelTypeTable",
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
                  "arn:aws:dynamodb:eu-west-2:840541460064:table/MyModelTypeTable",
                  "arn:aws:dynamodb:eu-west-2:840541460064:table/MyModelTypeTable/*",
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
      appsyncDsDdbM66htuMyModelTypeTable: {
        name: "appsync-ds-ddb-m66htu-MyModelTypeTable",
        properties: {
          RoleName: "appsync-ds-ddb-m66htu-MyModelTypeTable",
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
  DynamoDB: {
    Table: {
      myModelTypeTable: {
        name: "MyModelTypeTable",
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
      myAppSyncApp: {
        name: "My AppSync App",
        properties: {
          authenticationType: "API_KEY",
          xrayEnabled: false,
          schema:
            'schema {\n  query: Query\n  mutation: Mutation\n  subscription: Subscription\n}\n\ntype Mutation {\n  createMyModelType(input: CreateMyModelTypeInput!): MyModelType\n  deleteMyModelType(input: DeleteMyModelTypeInput!): MyModelType\n  updateMyModelType(input: UpdateMyModelTypeInput!): MyModelType\n}\n\ntype MyModelType {\n  id: ID!\n  title: String\n}\n\ntype MyModelTypeConnection {\n  items: [MyModelType]\n  nextToken: String\n}\n\ntype Query {\n  getMyModelType(id: ID!): MyModelType\n  listMyModelTypes(filter: TableMyModelTypeFilterInput, limit: Int, nextToken: String): MyModelTypeConnection\n}\n\ntype Subscription {\n  onCreateMyModelType(id: ID, title: String): MyModelType @aws_subscribe(mutations : ["createMyModelType"])\n  onDeleteMyModelType(id: ID, title: String): MyModelType @aws_subscribe(mutations : ["deleteMyModelType"])\n  onUpdateMyModelType(id: ID, title: String): MyModelType @aws_subscribe(mutations : ["updateMyModelType"])\n}\n\ninput CreateMyModelTypeInput {\n  title: String\n}\n\ninput CreatePostInput {\n  title: String!\n}\n\ninput DeleteMyModelTypeInput {\n  id: ID!\n}\n\ninput TableBooleanFilterInput {\n  eq: Boolean\n  ne: Boolean\n}\n\ninput TableFloatFilterInput {\n  between: [Float]\n  contains: Float\n  eq: Float\n  ge: Float\n  gt: Float\n  le: Float\n  lt: Float\n  ne: Float\n  notContains: Float\n}\n\ninput TableIDFilterInput {\n  beginsWith: ID\n  between: [ID]\n  contains: ID\n  eq: ID\n  ge: ID\n  gt: ID\n  le: ID\n  lt: ID\n  ne: ID\n  notContains: ID\n}\n\ninput TableIntFilterInput {\n  between: [Int]\n  contains: Int\n  eq: Int\n  ge: Int\n  gt: Int\n  le: Int\n  lt: Int\n  ne: Int\n  notContains: Int\n}\n\ninput TableMyModelTypeFilterInput {\n  id: TableIDFilterInput\n  title: TableStringFilterInput\n}\n\ninput TableStringFilterInput {\n  beginsWith: String\n  between: [String]\n  contains: String\n  eq: String\n  ge: String\n  gt: String\n  le: String\n  lt: String\n  ne: String\n  notContains: String\n}\n\ninput UpdateMyModelTypeInput {\n  id: ID!\n  title: String\n  name: String\n}\n',
        },
      },
    },
    ApiKey: {
      da2Kyhuzrhyvbcadm6geay6gk7eqm: {
        name: "da2-kyhuzrhyvbcadm6geay6gk7eqm",
      },
      da2Wbuvlxl5cfapbifytstbzthsxy: {
        name: "da2-wbuvlxl5cfapbifytstbzthsxy",
      },
    },
    Type: {
      createMyModelTypeInput: {
        name: "CreateMyModelTypeInput",
        properties: {
          definition: {
            name: "CreateMyModelTypeInput",
            kind: "INPUT_OBJECT",
            inputFields: [
              {
                name: "title",
                type: {
                  name: "String",
                },
              },
            ],
          },
          format: "JSON",
        },
      },
      createPostInput: {
        name: "CreatePostInput",
        properties: {
          definition: {
            name: "CreatePostInput",
            kind: "INPUT_OBJECT",
            inputFields: [
              {
                name: "title",
                type: {
                  kind: "NON_NULL",
                  ofType: {
                    name: "String",
                  },
                },
              },
            ],
          },
          format: "JSON",
        },
      },
      deleteMyModelTypeInput: {
        name: "DeleteMyModelTypeInput",
        properties: {
          definition: {
            name: "DeleteMyModelTypeInput",
            kind: "INPUT_OBJECT",
            inputFields: [
              {
                name: "id",
                type: {
                  kind: "NON_NULL",
                  ofType: {
                    name: "ID",
                  },
                },
              },
            ],
          },
          format: "JSON",
        },
      },
      mutation: {
        name: "Mutation",
        properties: {
          definition: {
            name: "Mutation",
            kind: "OBJECT",
            fields: [
              {
                name: "createMyModelType",
                type: {
                  name: "MyModelType",
                },
                args: [
                  {
                    name: "input",
                    type: {
                      kind: "NON_NULL",
                      ofType: {
                        name: "CreateMyModelTypeInput",
                      },
                    },
                  },
                ],
                directives: [],
                isDeprecated: false,
              },
              {
                name: "updateMyModelType",
                type: {
                  name: "MyModelType",
                },
                args: [
                  {
                    name: "input",
                    type: {
                      kind: "NON_NULL",
                      ofType: {
                        name: "UpdateMyModelTypeInput",
                      },
                    },
                  },
                ],
                directives: [],
                isDeprecated: false,
              },
              {
                name: "deleteMyModelType",
                type: {
                  name: "MyModelType",
                },
                args: [
                  {
                    name: "input",
                    type: {
                      kind: "NON_NULL",
                      ofType: {
                        name: "DeleteMyModelTypeInput",
                      },
                    },
                  },
                ],
                directives: [],
                isDeprecated: false,
              },
            ],
            interfaces: [],
            directives: [],
          },
          format: "JSON",
        },
      },
      myModelType: {
        name: "MyModelType",
        properties: {
          definition: {
            name: "MyModelType",
            kind: "OBJECT",
            fields: [
              {
                name: "id",
                type: {
                  kind: "NON_NULL",
                  ofType: {
                    name: "ID",
                  },
                },
                args: [],
                directives: [],
                isDeprecated: false,
              },
              {
                name: "title",
                type: {
                  name: "String",
                },
                args: [],
                directives: [],
                isDeprecated: false,
              },
            ],
            interfaces: [],
            directives: [],
          },
          format: "JSON",
        },
      },
      myModelTypeConnection: {
        name: "MyModelTypeConnection",
        properties: {
          definition: {
            name: "MyModelTypeConnection",
            kind: "OBJECT",
            fields: [
              {
                name: "items",
                type: {
                  kind: "LIST",
                  ofType: {
                    name: "MyModelType",
                  },
                },
                args: [],
                directives: [],
                isDeprecated: false,
              },
              {
                name: "nextToken",
                type: {
                  name: "String",
                },
                args: [],
                directives: [],
                isDeprecated: false,
              },
            ],
            interfaces: [],
            directives: [],
          },
          format: "JSON",
        },
      },
      query: {
        name: "Query",
        properties: {
          definition: {
            name: "Query",
            kind: "OBJECT",
            fields: [
              {
                name: "getMyModelType",
                type: {
                  name: "MyModelType",
                },
                args: [
                  {
                    name: "id",
                    type: {
                      kind: "NON_NULL",
                      ofType: {
                        name: "ID",
                      },
                    },
                  },
                ],
                directives: [],
                isDeprecated: false,
              },
              {
                name: "listMyModelTypes",
                type: {
                  name: "MyModelTypeConnection",
                },
                args: [
                  {
                    name: "filter",
                    type: {
                      name: "TableMyModelTypeFilterInput",
                    },
                  },
                  {
                    name: "limit",
                    type: {
                      name: "Int",
                    },
                  },
                  {
                    name: "nextToken",
                    type: {
                      name: "String",
                    },
                  },
                ],
                directives: [],
                isDeprecated: false,
              },
            ],
            interfaces: [],
            directives: [],
          },
          format: "JSON",
        },
      },
      subscription: {
        name: "Subscription",
        properties: {
          definition: {
            name: "Subscription",
            kind: "OBJECT",
            fields: [
              {
                name: "onCreateMyModelType",
                type: {
                  name: "MyModelType",
                },
                args: [
                  {
                    name: "id",
                    type: {
                      name: "ID",
                    },
                  },
                  {
                    name: "title",
                    type: {
                      name: "String",
                    },
                  },
                ],
                directives: [
                  {
                    name: "aws_subscribe",
                    args: [
                      {
                        name: "mutations",
                        value: ["createMyModelType"],
                      },
                    ],
                  },
                ],
                isDeprecated: false,
              },
              {
                name: "onUpdateMyModelType",
                type: {
                  name: "MyModelType",
                },
                args: [
                  {
                    name: "id",
                    type: {
                      name: "ID",
                    },
                  },
                  {
                    name: "title",
                    type: {
                      name: "String",
                    },
                  },
                ],
                directives: [
                  {
                    name: "aws_subscribe",
                    args: [
                      {
                        name: "mutations",
                        value: ["updateMyModelType"],
                      },
                    ],
                  },
                ],
                isDeprecated: false,
              },
              {
                name: "onDeleteMyModelType",
                type: {
                  name: "MyModelType",
                },
                args: [
                  {
                    name: "id",
                    type: {
                      name: "ID",
                    },
                  },
                  {
                    name: "title",
                    type: {
                      name: "String",
                    },
                  },
                ],
                directives: [
                  {
                    name: "aws_subscribe",
                    args: [
                      {
                        name: "mutations",
                        value: ["deleteMyModelType"],
                      },
                    ],
                  },
                ],
                isDeprecated: false,
              },
            ],
            interfaces: [],
            directives: [],
          },
          format: "JSON",
        },
      },
      tableBooleanFilterInput: {
        name: "TableBooleanFilterInput",
        properties: {
          definition: {
            name: "TableBooleanFilterInput",
            kind: "INPUT_OBJECT",
            inputFields: [
              {
                name: "ne",
                type: {
                  name: "Boolean",
                },
              },
              {
                name: "eq",
                type: {
                  name: "Boolean",
                },
              },
            ],
          },
          format: "JSON",
        },
      },
      tableFloatFilterInput: {
        name: "TableFloatFilterInput",
        properties: {
          definition: {
            name: "TableFloatFilterInput",
            kind: "INPUT_OBJECT",
            inputFields: [
              {
                name: "ne",
                type: {
                  name: "Float",
                },
              },
              {
                name: "eq",
                type: {
                  name: "Float",
                },
              },
              {
                name: "le",
                type: {
                  name: "Float",
                },
              },
              {
                name: "lt",
                type: {
                  name: "Float",
                },
              },
              {
                name: "ge",
                type: {
                  name: "Float",
                },
              },
              {
                name: "gt",
                type: {
                  name: "Float",
                },
              },
              {
                name: "contains",
                type: {
                  name: "Float",
                },
              },
              {
                name: "notContains",
                type: {
                  name: "Float",
                },
              },
              {
                name: "between",
                type: {
                  kind: "LIST",
                  ofType: {
                    name: "Float",
                  },
                },
              },
            ],
          },
          format: "JSON",
        },
      },
      tableIdFilterInput: {
        name: "TableIDFilterInput",
        properties: {
          definition: {
            name: "TableIDFilterInput",
            kind: "INPUT_OBJECT",
            inputFields: [
              {
                name: "ne",
                type: {
                  name: "ID",
                },
              },
              {
                name: "eq",
                type: {
                  name: "ID",
                },
              },
              {
                name: "le",
                type: {
                  name: "ID",
                },
              },
              {
                name: "lt",
                type: {
                  name: "ID",
                },
              },
              {
                name: "ge",
                type: {
                  name: "ID",
                },
              },
              {
                name: "gt",
                type: {
                  name: "ID",
                },
              },
              {
                name: "contains",
                type: {
                  name: "ID",
                },
              },
              {
                name: "notContains",
                type: {
                  name: "ID",
                },
              },
              {
                name: "between",
                type: {
                  kind: "LIST",
                  ofType: {
                    name: "ID",
                  },
                },
              },
              {
                name: "beginsWith",
                type: {
                  name: "ID",
                },
              },
            ],
          },
          format: "JSON",
        },
      },
      tableIntFilterInput: {
        name: "TableIntFilterInput",
        properties: {
          definition: {
            name: "TableIntFilterInput",
            kind: "INPUT_OBJECT",
            inputFields: [
              {
                name: "ne",
                type: {
                  name: "Int",
                },
              },
              {
                name: "eq",
                type: {
                  name: "Int",
                },
              },
              {
                name: "le",
                type: {
                  name: "Int",
                },
              },
              {
                name: "lt",
                type: {
                  name: "Int",
                },
              },
              {
                name: "ge",
                type: {
                  name: "Int",
                },
              },
              {
                name: "gt",
                type: {
                  name: "Int",
                },
              },
              {
                name: "contains",
                type: {
                  name: "Int",
                },
              },
              {
                name: "notContains",
                type: {
                  name: "Int",
                },
              },
              {
                name: "between",
                type: {
                  kind: "LIST",
                  ofType: {
                    name: "Int",
                  },
                },
              },
            ],
          },
          format: "JSON",
        },
      },
      tableMyModelTypeFilterInput: {
        name: "TableMyModelTypeFilterInput",
        properties: {
          definition: {
            name: "TableMyModelTypeFilterInput",
            kind: "INPUT_OBJECT",
            inputFields: [
              {
                name: "id",
                type: {
                  name: "TableIDFilterInput",
                },
              },
              {
                name: "title",
                type: {
                  name: "TableStringFilterInput",
                },
              },
            ],
          },
          format: "JSON",
        },
      },
      tableStringFilterInput: {
        name: "TableStringFilterInput",
        properties: {
          definition: {
            name: "TableStringFilterInput",
            kind: "INPUT_OBJECT",
            inputFields: [
              {
                name: "ne",
                type: {
                  name: "String",
                },
              },
              {
                name: "eq",
                type: {
                  name: "String",
                },
              },
              {
                name: "le",
                type: {
                  name: "String",
                },
              },
              {
                name: "lt",
                type: {
                  name: "String",
                },
              },
              {
                name: "ge",
                type: {
                  name: "String",
                },
              },
              {
                name: "gt",
                type: {
                  name: "String",
                },
              },
              {
                name: "contains",
                type: {
                  name: "String",
                },
              },
              {
                name: "notContains",
                type: {
                  name: "String",
                },
              },
              {
                name: "between",
                type: {
                  kind: "LIST",
                  ofType: {
                    name: "String",
                  },
                },
              },
              {
                name: "beginsWith",
                type: {
                  name: "String",
                },
              },
            ],
          },
          format: "JSON",
        },
      },
      updateMyModelTypeInput: {
        name: "UpdateMyModelTypeInput",
        properties: {
          definition: {
            name: "UpdateMyModelTypeInput",
            kind: "INPUT_OBJECT",
            inputFields: [
              {
                name: "id",
                type: {
                  kind: "NON_NULL",
                  ofType: {
                    name: "ID",
                  },
                },
              },
              {
                name: "title",
                type: {
                  name: "String",
                },
              },
            ],
          },
          format: "JSON",
        },
      },
    },
    Resolver: {
      mutationCreateMyModelType: {
        name: "Mutation-createMyModelType",
        properties: {
          typeName: "Mutation",
          fieldName: "createMyModelType",
          requestMappingTemplate:
            '{\n  "version": "2017-02-28",\n  "operation": "PutItem",\n  "key": {\n    "id": $util.dynamodb.toDynamoDBJson($util.autoId()),\n  },\n  "attributeValues": $util.dynamodb.toMapValuesJson($ctx.args.input),\n  "condition": {\n    "expression": "attribute_not_exists(#id)",\n    "expressionNames": {\n      "#id": "id",\n    },\n  },\n}',
          responseMappingTemplate: "$util.toJson($context.result)",
          kind: "UNIT",
        },
      },
      mutationDeleteMyModelType: {
        name: "Mutation-deleteMyModelType",
        properties: {
          typeName: "Mutation",
          fieldName: "deleteMyModelType",
          requestMappingTemplate:
            '{\n  "version": "2017-02-28",\n  "operation": "DeleteItem",\n  "key": {\n    "id": $util.dynamodb.toDynamoDBJson($ctx.args.input.id),\n  },\n}',
          responseMappingTemplate: "$util.toJson($context.result)",
          kind: "UNIT",
        },
      },
      mutationUpdateMyModelType: {
        name: "Mutation-updateMyModelType",
        properties: {
          typeName: "Mutation",
          fieldName: "updateMyModelType",
          requestMappingTemplate:
            '{\n  "version": "2017-02-28",\n  "operation": "UpdateItem",\n  "key": {\n    "id": $util.dynamodb.toDynamoDBJson($ctx.args.input.id),\n  },\n\n  ## Set up some space to keep track of things we\'re updating **\n  #set( $expNames  = {} )\n  #set( $expValues = {} )\n  #set( $expSet = {} )\n  #set( $expAdd = {} )\n  #set( $expRemove = [] )\n\n  ## Iterate through each argument, skipping keys **\n  #foreach( $entry in $util.map.copyAndRemoveAllKeys($ctx.args.input, ["id"]).entrySet() )\n    #if( $util.isNull($entry.value) )\n      ## If the argument is set to "null", then remove that attribute from the item in DynamoDB **\n\n      #set( $discard = ${expRemove.add("#${entry.key}")} )\n      $!{expNames.put("#${entry.key}", "${entry.key}")}\n    #else\n      ## Otherwise set (or update) the attribute on the item in DynamoDB **\n\n      $!{expSet.put("#${entry.key}", ":${entry.key}")}\n      $!{expNames.put("#${entry.key}", "${entry.key}")}\n      $!{expValues.put(":${entry.key}", $util.dynamodb.toDynamoDB($entry.value))}\n    #end\n  #end\n\n  ## Start building the update expression, starting with attributes we\'re going to SET **\n  #set( $expression = "" )\n  #if( !${expSet.isEmpty()} )\n    #set( $expression = "SET" )\n    #foreach( $entry in $expSet.entrySet() )\n      #set( $expression = "${expression} ${entry.key} = ${entry.value}" )\n      #if ( $foreach.hasNext )\n        #set( $expression = "${expression}," )\n      #end\n    #end\n  #end\n\n  ## Continue building the update expression, adding attributes we\'re going to ADD **\n  #if( !${expAdd.isEmpty()} )\n    #set( $expression = "${expression} ADD" )\n    #foreach( $entry in $expAdd.entrySet() )\n      #set( $expression = "${expression} ${entry.key} ${entry.value}" )\n      #if ( $foreach.hasNext )\n        #set( $expression = "${expression}," )\n      #end\n    #end\n  #end\n\n  ## Continue building the update expression, adding attributes we\'re going to REMOVE **\n  #if( !${expRemove.isEmpty()} )\n    #set( $expression = "${expression} REMOVE" )\n\n    #foreach( $entry in $expRemove )\n      #set( $expression = "${expression} ${entry}" )\n      #if ( $foreach.hasNext )\n        #set( $expression = "${expression}," )\n      #end\n    #end\n  #end\n\n  ## Finally, write the update expression into the document, along with any expressionNames and expressionValues **\n  "update": {\n    "expression": "${expression}",\n    #if( !${expNames.isEmpty()} )\n      "expressionNames": $utils.toJson($expNames),\n    #end\n    #if( !${expValues.isEmpty()} )\n      "expressionValues": $utils.toJson($expValues),\n    #end\n  },\n\n  "condition": {\n    "expression": "attribute_exists(#id)",\n    "expressionNames": {\n      "#id": "id",\n    },\n  }\n}',
          responseMappingTemplate: "$util.toJson($context.result)",
          kind: "UNIT",
        },
      },
      queryGetMyModelType: {
        name: "Query-getMyModelType",
        properties: {
          typeName: "Query",
          fieldName: "getMyModelType",
          requestMappingTemplate:
            '{\n  "version": "2017-02-28",\n  "operation": "GetItem",\n  "key": {\n    "id": $util.dynamodb.toDynamoDBJson($ctx.args.id),\n  },\n}',
          responseMappingTemplate: "$util.toJson($context.result)",
          kind: "UNIT",
        },
      },
      queryListMyModelTypes: {
        name: "Query-listMyModelTypes",
        properties: {
          typeName: "Query",
          fieldName: "listMyModelTypes",
          requestMappingTemplate:
            '{\n  "version": "2017-02-28",\n  "operation": "Scan",\n  "filter": #if($context.args.filter) $util.transform.toDynamoDBFilterExpression($ctx.args.filter) #else null #end,\n  "limit": $util.defaultIfNull($ctx.args.limit, 20),\n  "nextToken": $util.toJson($util.defaultIfNullOrEmpty($ctx.args.nextToken, null)),\n}',
          responseMappingTemplate: "$util.toJson($context.result)",
          kind: "UNIT",
        },
      },
    },
    DataSource: {
      myModelTypeTable: {
        name: "MyModelTypeTable",
        properties: {
          description: "DynamoDB table backing the MyModelType object type.",
          type: "AMAZON_DYNAMODB",
          dynamodbConfig: {
            tableName: "MyModelTypeTable",
            awsRegion: "eu-west-2",
            useCallerCredentials: false,
            versioned: false,
          },
        },
      },
    },
  },
});
