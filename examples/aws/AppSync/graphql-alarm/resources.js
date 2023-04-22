// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "DataSource",
    group: "AppSync",
    properties: ({ config }) => ({
      description: "DynamoDB table backing the MyModelType object type.",
      dynamodbConfig: {
        awsRegion: `${config.region}`,
        tableName: "MyModelTypeTable",
        useCallerCredentials: false,
        versioned: false,
      },
      name: "MyModelTypeTable",
      type: "AMAZON_DYNAMODB",
    }),
    dependencies: ({}) => ({
      graphqlApi: "My AppSync App",
      serviceRole: "appsync-ds-ddb-f7ekj4-MyModelTypeTable",
      dynamoDbTable: "MyModelTypeTable",
    }),
  },
  {
    type: "GraphqlApi",
    group: "AppSync",
    properties: ({}) => ({
      name: "My AppSync App",
      authenticationType: "API_KEY",
      xrayEnabled: false,
      apiKeys: [{}],
      schemaFile: "My AppSync App.graphql",
    }),
  },
  {
    type: "Resolver",
    group: "AppSync",
    properties: ({}) => ({
      fieldName: "createMyModelType",
      kind: "UNIT",
      requestMappingTemplate: `{
  "version": "2017-02-28",
  "operation": "PutItem",
  "key": {
    "id": $util.dynamodb.toDynamoDBJson($util.autoId()),
  },
  "attributeValues": $util.dynamodb.toMapValuesJson($ctx.args.input),
  "condition": {
    "expression": "attribute_not_exists(#id)",
    "expressionNames": {
      "#id": "id",
    },
  },
}`,
      responseMappingTemplate: "$util.toJson($context.result)",
      typeName: "Mutation",
    }),
    dependencies: ({}) => ({
      dataSource: "MyModelTypeTable",
      graphqlApi: "My AppSync App",
    }),
  },
  {
    type: "Resolver",
    group: "AppSync",
    properties: ({}) => ({
      fieldName: "deleteMyModelType",
      kind: "UNIT",
      requestMappingTemplate: `{
  "version": "2017-02-28",
  "operation": "DeleteItem",
  "key": {
    "id": $util.dynamodb.toDynamoDBJson($ctx.args.input.id),
  },
}`,
      responseMappingTemplate: "$util.toJson($context.result)",
      typeName: "Mutation",
    }),
    dependencies: ({}) => ({
      dataSource: "MyModelTypeTable",
      graphqlApi: "My AppSync App",
    }),
  },
  {
    type: "Resolver",
    group: "AppSync",
    properties: ({ multiline }) => ({
      fieldName: "updateMyModelType",
      kind: "UNIT",
      requestMappingTemplate: multiline(() => {
        /*
{
  "version": "2017-02-28",
  "operation": "UpdateItem",
  "key": {
    "id": $util.dynamodb.toDynamoDBJson($ctx.args.input.id),
  },

  ## Set up some space to keep track of things we're updating **
  #set( $expNames  = {} )
  #set( $expValues = {} )
  #set( $expSet = {} )
  #set( $expAdd = {} )
  #set( $expRemove = [] )

  ## Iterate through each argument, skipping keys **
  #foreach( $entry in $util.map.copyAndRemoveAllKeys($ctx.args.input, ["id"]).entrySet() )
    #if( $util.isNull($entry.value) )
      ## If the argument is set to "null", then remove that attribute from the item in DynamoDB **

      #set( $discard = ${expRemove.add("#${entry.key}")} )
      $!{expNames.put("#${entry.key}", "${entry.key}")}
    #else
      ## Otherwise set (or update) the attribute on the item in DynamoDB **

      $!{expSet.put("#${entry.key}", ":${entry.key}")}
      $!{expNames.put("#${entry.key}", "${entry.key}")}
      $!{expValues.put(":${entry.key}", $util.dynamodb.toDynamoDB($entry.value))}
    #end
  #end

  ## Start building the update expression, starting with attributes we're going to SET **
  #set( $expression = "" )
  #if( !${expSet.isEmpty()} )
    #set( $expression = "SET" )
    #foreach( $entry in $expSet.entrySet() )
      #set( $expression = "${expression} ${entry.key} = ${entry.value}" )
      #if ( $foreach.hasNext )
        #set( $expression = "${expression}," )
      #end
    #end
  #end

  ## Continue building the update expression, adding attributes we're going to ADD **
  #if( !${expAdd.isEmpty()} )
    #set( $expression = "${expression} ADD" )
    #foreach( $entry in $expAdd.entrySet() )
      #set( $expression = "${expression} ${entry.key} ${entry.value}" )
      #if ( $foreach.hasNext )
        #set( $expression = "${expression}," )
      #end
    #end
  #end

  ## Continue building the update expression, adding attributes we're going to REMOVE **
  #if( !${expRemove.isEmpty()} )
    #set( $expression = "${expression} REMOVE" )

    #foreach( $entry in $expRemove )
      #set( $expression = "${expression} ${entry}" )
      #if ( $foreach.hasNext )
        #set( $expression = "${expression}," )
      #end
    #end
  #end

  ## Finally, write the update expression into the document, along with any expressionNames and expressionValues **
  "update": {
    "expression": "${expression}",
    #if( !${expNames.isEmpty()} )
      "expressionNames": $utils.toJson($expNames),
    #end
    #if( !${expValues.isEmpty()} )
      "expressionValues": $utils.toJson($expValues),
    #end
  },

  "condition": {
    "expression": "attribute_exists(#id)",
    "expressionNames": {
      "#id": "id",
    },
  }
}
*/
      }),
      responseMappingTemplate: "$util.toJson($context.result)",
      typeName: "Mutation",
    }),
    dependencies: ({}) => ({
      dataSource: "MyModelTypeTable",
      graphqlApi: "My AppSync App",
    }),
  },
  {
    type: "Resolver",
    group: "AppSync",
    properties: ({}) => ({
      fieldName: "getMyModelType",
      kind: "UNIT",
      requestMappingTemplate: `{
  "version": "2017-02-28",
  "operation": "GetItem",
  "key": {
    "id": $util.dynamodb.toDynamoDBJson($ctx.args.id),
  },
}`,
      responseMappingTemplate: "$util.toJson($context.result)",
      typeName: "Query",
    }),
    dependencies: ({}) => ({
      dataSource: "MyModelTypeTable",
      graphqlApi: "My AppSync App",
    }),
  },
  {
    type: "Resolver",
    group: "AppSync",
    properties: ({}) => ({
      fieldName: "listMyModelTypes",
      kind: "UNIT",
      requestMappingTemplate: `{
  "version": "2017-02-28",
  "operation": "Scan",
  "filter": #if($context.args.filter) $util.transform.toDynamoDBFilterExpression($ctx.args.filter) #else null #end,
  "limit": $util.defaultIfNull($ctx.args.limit, 20),
  "nextToken": $util.toJson($util.defaultIfNullOrEmpty($ctx.args.nextToken, null)),
}`,
      responseMappingTemplate: "$util.toJson($context.result)",
      typeName: "Query",
    }),
    dependencies: ({}) => ({
      dataSource: "MyModelTypeTable",
      graphqlApi: "My AppSync App",
    }),
  },
  {
    type: "MetricAlarm",
    group: "CloudWatch",
    properties: ({ config, getId }) => ({
      AlarmName: "alarm-graphql-400",
      AlarmActions: [
        `arn:aws:sns:${
          config.region
        }:${config.accountId()}:Default_CloudWatch_Alarms_Topic`,
      ],
      MetricName: "4XXError",
      Namespace: "AWS/AppSync",
      Statistic: "Average",
      Dimensions: [
        {
          Value: `${getId({
            type: "GraphqlApi",
            group: "AppSync",
            name: "My AppSync App",
          })}`,
          Name: "GraphQLAPIId",
        },
      ],
      Period: 300,
      EvaluationPeriods: 1,
      DatapointsToAlarm: 1,
      Threshold: 2,
      ComparisonOperator: "GreaterThanThreshold",
      TreatMissingData: "missing",
    }),
    dependencies: ({}) => ({
      snsTopic: "Default_CloudWatch_Alarms_Topic",
      appSyncGraphqlApi: "My AppSync App",
    }),
  },
  {
    type: "Table",
    group: "DynamoDB",
    properties: ({}) => ({
      TableName: "MyModelTypeTable",
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
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    properties: ({ config }) => ({
      PolicyName: "appsync-ds-ddb-f7ekj4-MyModelTypeTable",
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
              `arn:aws:dynamodb:${
                config.region
              }:${config.accountId()}:table/MyModelTypeTable`,
              `arn:aws:dynamodb:${
                config.region
              }:${config.accountId()}:table/MyModelTypeTable/*`,
            ],
          },
        ],
      },
      Path: "/service-role/",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "appsync-ds-ddb-f7ekj4-MyModelTypeTable",
      Description: "Allows the AWS AppSync service to access your data source.",
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
    }),
    dependencies: ({}) => ({
      policies: ["appsync-ds-ddb-f7ekj4-MyModelTypeTable"],
    }),
  },
  { type: "Topic", group: "SNS", name: "Default_CloudWatch_Alarms_Topic" },
];
