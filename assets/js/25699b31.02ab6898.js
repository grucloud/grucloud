"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[33973],{3905:(e,n,a)=>{a.d(n,{Zo:()=>l,kt:()=>m});var t=a(67294);function r(e,n,a){return n in e?Object.defineProperty(e,n,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[n]=a,e}function p(e,n){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),a.push.apply(a,t)}return a}function o(e){for(var n=1;n<arguments.length;n++){var a=null!=arguments[n]?arguments[n]:{};n%2?p(Object(a),!0).forEach((function(n){r(e,n,a[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):p(Object(a)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(a,n))}))}return e}function s(e,n){if(null==e)return{};var a,t,r=function(e,n){if(null==e)return{};var a,t,r={},p=Object.keys(e);for(t=0;t<p.length;t++)a=p[t],n.indexOf(a)>=0||(r[a]=e[a]);return r}(e,n);if(Object.getOwnPropertySymbols){var p=Object.getOwnPropertySymbols(e);for(t=0;t<p.length;t++)a=p[t],n.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var i=t.createContext({}),c=function(e){var n=t.useContext(i),a=n;return e&&(a="function"==typeof e?e(n):o(o({},n),e)),a},l=function(e){var n=c(e.components);return t.createElement(i.Provider,{value:n},e.children)},d={inlineCode:"code",wrapper:function(e){var n=e.children;return t.createElement(t.Fragment,{},n)}},u=t.forwardRef((function(e,n){var a=e.components,r=e.mdxType,p=e.originalType,i=e.parentName,l=s(e,["components","mdxType","originalType","parentName"]),u=c(a),m=r,y=u["".concat(i,".").concat(m)]||u[m]||d[m]||p;return a?t.createElement(y,o(o({ref:n},l),{},{components:a})):t.createElement(y,o({ref:n},l))}));function m(e,n){var a=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var p=a.length,o=new Array(p);o[0]=u;var s={};for(var i in n)hasOwnProperty.call(n,i)&&(s[i]=n[i]);s.originalType=e,s.mdxType="string"==typeof e?e:r,o[1]=s;for(var c=2;c<p;c++)o[c]=a[c];return t.createElement.apply(null,o)}return t.createElement.apply(null,a)}u.displayName="MDXCreateElement"},46374:(e,n,a)=>{a.r(n),a.d(n,{assets:()=>i,contentTitle:()=>o,default:()=>d,frontMatter:()=>p,metadata:()=>s,toc:()=>c});var t=a(87462),r=(a(67294),a(3905));const p={id:"Resolver",title:"Resolver"},o=void 0,s={unversionedId:"aws/resources/AppSync/Resolver",id:"aws/resources/AppSync/Resolver",title:"Resolver",description:"Manages an AppSync Resolver.",source:"@site/docs/aws/resources/AppSync/Resolver.md",sourceDirName:"aws/resources/AppSync",slug:"/aws/resources/AppSync/Resolver",permalink:"/docs/aws/resources/AppSync/Resolver",draft:!1,tags:[],version:"current",frontMatter:{id:"Resolver",title:"Resolver"},sidebar:"docs",previous:{title:"GraphqlApi",permalink:"/docs/aws/resources/AppSync/GraphqlApi"},next:{title:"AutoScaling Attachment",permalink:"/docs/aws/resources/AutoScaling/AutoScalingAttachment"}},i={},c=[{value:"Sample code",id:"sample-code",level:2},{value:"Properties",id:"properties",level:2},{value:"Dependencies",id:"dependencies",level:2},{value:"Full Examples",id:"full-examples",level:2},{value:"List",id:"list",level:2}],l={toc:c};function d(e){let{components:n,...a}=e;return(0,r.kt)("wrapper",(0,t.Z)({},l,a,{components:n,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"Manages an ",(0,r.kt)("a",{parentName:"p",href:"https://console.aws.amazon.com/appsync/home?#/apis"},"AppSync Resolver"),"."),(0,r.kt)("h2",{id:"sample-code"},"Sample code"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "GraphqlApi",\n    group: "AppSync",\n    name: "cdk-notes-appsync-api",\n    properties: ({}) => ({\n      authenticationType: "API_KEY",\n      xrayEnabled: true,\n      apiKeys: [\n        {\n          description: "Graphql Api Keys",\n        },\n      ],\n      schemaFile: "cdk-notes-appsync-api.graphql",\n    }),\n  },\n  {\n    type: "DataSource",\n    group: "AppSync",\n    name: "lambdaDatasource",\n    properties: ({}) => ({\n      type: "AWS_LAMBDA",\n    }),\n    dependencies: () => ({\n      graphqlApi: "cdk-notes-appsync-api",\n      serviceRole:\n        "AppsyncCdkAppStack-ApilambdaDatasourceServiceRole2-1BX1MTO4H3KAG",\n      lambdaFunction: "lambda-fns",\n    }),\n  },\n  {\n    type: "Resolver",\n    group: "AppSync",\n    properties: ({}) => ({\n      typeName: "Mutation",\n      fieldName: "createNote",\n      kind: "UNIT",\n    }),\n    dependencies: () => ({\n      graphqlApi: "cdk-notes-appsync-api",\n      dataSource: "lambdaDatasource",\n    }),\n  },\n  {\n    type: "Resolver",\n    group: "AppSync",\n    properties: ({}) => ({\n      typeName: "Mutation",\n      fieldName: "deleteNote",\n      kind: "UNIT",\n    }),\n    dependencies: () => ({\n      graphqlApi: "cdk-notes-appsync-api",\n      dataSource: "lambdaDatasource",\n    }),\n  },\n  {\n    type: "Resolver",\n    group: "AppSync",\n    properties: ({}) => ({\n      typeName: "Mutation",\n      fieldName: "updateNote",\n      kind: "UNIT",\n    }),\n    dependencies: () => ({\n      graphqlApi: "cdk-notes-appsync-api",\n      dataSource: "lambdaDatasource",\n    }),\n  },\n  {\n    type: "Resolver",\n    group: "AppSync",\n    properties: ({}) => ({\n      typeName: "Query",\n      fieldName: "getNoteById",\n      kind: "UNIT",\n    }),\n    dependencies: () => ({\n      graphqlApi: "cdk-notes-appsync-api",\n      dataSource: "lambdaDatasource",\n    }),\n  },\n  {\n    type: "Resolver",\n    group: "AppSync",\n    properties: ({}) => ({\n      typeName: "Query",\n      fieldName: "listNotes",\n      kind: "UNIT",\n    }),\n    dependencies: () => ({\n      graphqlApi: "cdk-notes-appsync-api",\n      dataSource: "lambdaDatasource",\n    }),\n  },\n  {\n    type: "Role",\n    group: "IAM",\n    name: "AppsyncCdkAppStack-ApilambdaDatasourceServiceRole2-1BX1MTO4H3KAG",\n    properties: ({ config }) => ({\n      Path: "/",\n      AssumeRolePolicyDocument: {\n        Version: "2012-10-17",\n        Statement: [\n          {\n            Effect: "Allow",\n            Principal: {\n              Service: "appsync.amazonaws.com",\n            },\n            Action: "sts:AssumeRole",\n          },\n        ],\n      },\n      Policies: [\n        {\n          PolicyDocument: {\n            Version: "2012-10-17",\n            Statement: [\n              {\n                Action: "lambda:InvokeFunction",\n                Resource: `arn:aws:lambda:${\n                  config.region\n                }:${config.accountId()}:function:lambda-fns`,\n                Effect: "Allow",\n              },\n            ],\n          },\n          PolicyName: "ApilambdaDatasourceServiceRoleDefaultPolicy3A97E34D",\n        },\n      ],\n    }),\n  },\n  {\n    type: "Role",\n    group: "IAM",\n    name: "AppsyncCdkAppStack-AppSyncNotesHandlerServiceRole3-V8HWDRIU57TV",\n    properties: ({ config }) => ({\n      Path: "/",\n      AssumeRolePolicyDocument: {\n        Version: "2012-10-17",\n        Statement: [\n          {\n            Effect: "Allow",\n            Principal: {\n              Service: "lambda.amazonaws.com",\n            },\n            Action: "sts:AssumeRole",\n          },\n        ],\n      },\n      Policies: [\n        {\n          PolicyDocument: {\n            Version: "2012-10-17",\n            Statement: [\n              {\n                Action: "dynamodb:*",\n                Resource: [\n                  `arn:aws:dynamodb:${\n                    config.region\n                  }:${config.accountId()}:table/AppsyncCdkAppStack-CDKNotesTable254A7FD1-1K1O8M7V6LS1R`,\n                ],\n                Effect: "Allow",\n              },\n            ],\n          },\n          PolicyName: "AppSyncNotesHandlerServiceRoleDefaultPolicy12C70C4F",\n        },\n      ],\n    }),\n    dependencies: () => ({\n      policies: ["AWSLambdaBasicExecutionRole"],\n    }),\n  },\n  {\n    type: "Policy",\n    group: "IAM",\n    name: "AWSLambdaBasicExecutionRole",\n    readOnly: true,\n    properties: ({}) => ({\n      Arn: "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",\n    }),\n  },\n  {\n    type: "Function",\n    group: "Lambda",\n    name: "lambda-fns",\n    properties: ({}) => ({\n      Handler: "main.handler",\n      PackageType: "Zip",\n      Runtime: "nodejs12.x",\n      Description: "",\n      Timeout: 3,\n      MemorySize: 1024,\n      Environment: {\n        Variables: {\n          NOTES_TABLE: "AppsyncCdkAppStack-CDKNotesTable254A7FD1-1K1O8M7V6LS1R",\n        },\n      },\n    }),\n    dependencies: () => ({\n      role: "AppsyncCdkAppStack-AppSyncNotesHandlerServiceRole3-V8HWDRIU57TV",\n    }),\n  },\n];\n')),(0,r.kt)("h2",{id:"properties"},"Properties"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-appsync/interfaces/createresolvercommandinput.html"},"create properties"))),(0,r.kt)("h2",{id:"dependencies"},"Dependencies"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/AppSync/GraphqlApi"},"GraphqlApi")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/AppSync/DataSource"},"DataSource"))),(0,r.kt)("h2",{id:"full-examples"},"Full Examples"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/AppSync/graphql"},"Simple example"))),(0,r.kt)("h2",{id:"list"},"List"),(0,r.kt)("p",null,"The resolvers can be filtered with the ",(0,r.kt)("em",{parentName:"p"},"Resolver")," type:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t Resolver\n")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-txt"},'Listing resources on 1 provider: aws\n\u2713 aws\n  \u2713 Initialising\n  \u2713 Listing 5/5\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 5 AppSync::Resolver from aws                                              \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: Mutation-createMyModelType                                          \u2502\n\u2502 managedByUs: Yes                                                          \u2502\n\u2502 live:                                                                     \u2502\n\u2502   typeName: Mutation                                                      \u2502\n\u2502   fieldName: createMyModelType                                            \u2502\n\u2502   dataSourceName: MyModelTypeTable                                        \u2502\n\u2502   resolverArn: arn:aws:appsync:eu-west-2:840541460064:apis/7xsgpgf4hjef7\u2026 \u2502\n\u2502   requestMappingTemplate: {                                               \u2502\n\u2502   "version": "2017-02-28",                                                \u2502\n\u2502   "operation": "PutItem",                                                 \u2502\n\u2502   "key": {                                                                \u2502\n\u2502     "id": $util.dynamodb.toDynamoDBJson($util.autoId()),                  \u2502\n\u2502   },                                                                      \u2502\n\u2502   "attributeValues": $util.dynamodb.toMapValuesJson($ctx.args.input),     \u2502\n\u2502   "condition": {                                                          \u2502\n\u2502     "expression": "attribute_not_exists(#id)",                            \u2502\n\u2502     "expressionNames": {                                                  \u2502\n\u2502       "#id": "id",                                                        \u2502\n\u2502     },                                                                    \u2502\n\u2502   },                                                                      \u2502\n\u2502 }                                                                         \u2502\n\u2502   responseMappingTemplate: $util.toJson($context.result)                  \u2502\n\u2502   kind: UNIT                                                              \u2502\n\u2502   apiId: 7xsgpgf4hjef7f5higuiifiapm                                       \u2502\n\u2502   tags:                                                                   \u2502\n\u2502     gc-api-key-da2-obteoqfenja6dnmmfiuhb223dq: da2-wbuvlxl5cfapbifytstbz\u2026 \u2502\n\u2502     gc-project-name: aws-appsync-graphql                                  \u2502\n\u2502     gc-api-key-da2-5dhrxdmt75f5naje6soej3dkja: da2-kyhuzrhyvbcadm6geay6g\u2026 \u2502\n\u2502     gc-managed-by: grucloud                                               \u2502\n\u2502     gc-stage: dev                                                         \u2502\n\u2502     gc-created-by-provider: aws                                           \u2502\n\u2502     gc-data-source-MyModelTypeTable: MyModelTypeTable                     \u2502\n\u2502     Name: My AppSync App                                                  \u2502\n\u2502                                                                           \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: Mutation-deleteMyModelType                                          \u2502\n\u2502 managedByUs: Yes                                                          \u2502\n\u2502 live:                                                                     \u2502\n\u2502   typeName: Mutation                                                      \u2502\n\u2502   fieldName: deleteMyModelType                                            \u2502\n\u2502   dataSourceName: MyModelTypeTable                                        \u2502\n\u2502   resolverArn: arn:aws:appsync:eu-west-2:840541460064:apis/7xsgpgf4hjef7\u2026 \u2502\n\u2502   requestMappingTemplate: {                                               \u2502\n\u2502   "version": "2017-02-28",                                                \u2502\n\u2502   "operation": "DeleteItem",                                              \u2502\n\u2502   "key": {                                                                \u2502\n\u2502     "id": $util.dynamodb.toDynamoDBJson($ctx.args.input.id),              \u2502\n\u2502   },                                                                      \u2502\n\u2502 }                                                                         \u2502\n\u2502   responseMappingTemplate: $util.toJson($context.result)                  \u2502\n\u2502   kind: UNIT                                                              \u2502\n\u2502   apiId: 7xsgpgf4hjef7f5higuiifiapm                                       \u2502\n\u2502   tags:                                                                   \u2502\n\u2502     gc-api-key-da2-obteoqfenja6dnmmfiuhb223dq: da2-wbuvlxl5cfapbifytstbz\u2026 \u2502\n\u2502     gc-project-name: aws-appsync-graphql                                  \u2502\n\u2502     gc-api-key-da2-5dhrxdmt75f5naje6soej3dkja: da2-kyhuzrhyvbcadm6geay6g\u2026 \u2502\n\u2502     gc-managed-by: grucloud                                               \u2502\n\u2502     gc-stage: dev                                                         \u2502\n\u2502     gc-created-by-provider: aws                                           \u2502\n\u2502     gc-data-source-MyModelTypeTable: MyModelTypeTable                     \u2502\n\u2502     Name: My AppSync App                                                  \u2502\n\u2502                                                                           \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n')))}d.isMDXComponent=!0}}]);