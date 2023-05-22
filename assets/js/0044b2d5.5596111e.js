"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[26671],{3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>y});var a=n(67294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function p(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?p(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):p(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},p=Object.keys(e);for(a=0;a<p.length;a++)n=p[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var p=Object.getOwnPropertySymbols(e);for(a=0;a<p.length;a++)n=p[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var o=a.createContext({}),i=function(e){var t=a.useContext(o),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},c=function(e){var t=i(e.components);return a.createElement(o.Provider,{value:t},e.children)},u="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},d=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,p=e.originalType,o=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),u=i(n),d=r,y=u["".concat(o,".").concat(d)]||u[d]||m[d]||p;return n?a.createElement(y,s(s({ref:t},c),{},{components:n})):a.createElement(y,s({ref:t},c))}));function y(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var p=n.length,s=new Array(p);s[0]=d;var l={};for(var o in t)hasOwnProperty.call(t,o)&&(l[o]=t[o]);l.originalType=e,l[u]="string"==typeof e?e:r,s[1]=l;for(var i=2;i<p;i++)s[i]=n[i];return a.createElement.apply(null,s)}return a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},38319:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>o,contentTitle:()=>s,default:()=>m,frontMatter:()=>p,metadata:()=>l,toc:()=>i});var a=n(87462),r=(n(67294),n(3905));const p={id:"GraphqlApi",title:"GraphqlApi"},s=void 0,l={unversionedId:"aws/resources/AppSync/GraphqlApi",id:"aws/resources/AppSync/GraphqlApi",title:"GraphqlApi",description:"Manages an AppSync GraphqlApi.",source:"@site/docs/aws/resources/AppSync/GraphqlApi.md",sourceDirName:"aws/resources/AppSync",slug:"/aws/resources/AppSync/GraphqlApi",permalink:"/docs/aws/resources/AppSync/GraphqlApi",draft:!1,tags:[],version:"current",frontMatter:{id:"GraphqlApi",title:"GraphqlApi"},sidebar:"docs",previous:{title:"DataSource",permalink:"/docs/aws/resources/AppSync/DataSource"},next:{title:"Resolver",permalink:"/docs/aws/resources/AppSync/Resolver"}},o={},i=[{value:"Sample code",id:"sample-code",level:2},{value:"Properties",id:"properties",level:2},{value:"Used By",id:"used-by",level:2},{value:"Full Examples",id:"full-examples",level:2},{value:"List",id:"list",level:2}],c={toc:i},u="wrapper";function m(e){let{components:t,...n}=e;return(0,r.kt)(u,(0,a.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"Manages an ",(0,r.kt)("a",{parentName:"p",href:"https://console.aws.amazon.com/appsync/home?#/apis"},"AppSync GraphqlApi"),"."),(0,r.kt)("h2",{id:"sample-code"},"Sample code"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "GraphqlApi",\n    group: "AppSync",\n    properties: ({}) => ({\n      name: "cdk-notes-appsync-api",\n      authenticationType: "API_KEY",\n      xrayEnabled: true,\n      apiKeys: [\n        {\n          description: "Graphql Api Keys",\n        },\n      ],\n      schemaFile: "cdk-notes-appsync-api.graphql",\n    }),\n  },\n];\n')),(0,r.kt)("h2",{id:"properties"},"Properties"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-appsync/interfaces/creategraphqlapicommandinput.html"},"create properties"))),(0,r.kt)("h2",{id:"used-by"},"Used By"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/AppSync/Resolver"},"Resolver")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/AppSync/DataSource"},"Data Source")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/CloudWatch/MetricAlarm"},"CloudWatch MetricAlarm")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/WAFv2/WebACLAssociation"},"WAFv2 WebACLAssociation"))),(0,r.kt)("h2",{id:"full-examples"},"Full Examples"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/AppSync/graphql"},"Simple example")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/appsync-eventbridge"},"serverless-patterns appsync-eventbridge")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/appsync-sqs"},"serverless-patterns appsync-sqs")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/cdk-lambda-appsync"},"serverless-patterns cdk-lambda-appsync")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/WAFv2/wafv2-graphql"},"wafv2-graphql"))),(0,r.kt)("h2",{id:"list"},"List"),(0,r.kt)("p",null,"The grpahql api can be filtered with the ",(0,r.kt)("em",{parentName:"p"},"GraphqlApi")," type:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t GraphqlApi\n")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-txt"},'Listing resources on 1 provider: aws\n\u2713 aws\n  \u2713 Initialising\n  \u2713 Listing 1/1\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 1 AppSync::GraphqlApi from aws                                                    \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: cdk-notes-appsync-api                                                       \u2502\n\u2502 managedByUs: Yes                                                                  \u2502\n\u2502 live:                                                                             \u2502\n\u2502   name: cdk-notes-appsync-api                                                     \u2502\n\u2502   apiId: memv4evddfe6lotdew4gewoyzm                                               \u2502\n\u2502   authenticationType: API_KEY                                                     \u2502\n\u2502   arn: arn:aws:appsync:eu-west-2:840541460064:apis/memv4evddfe6lotdew4gewoyzm     \u2502\n\u2502   uris:                                                                           \u2502\n\u2502     REALTIME: wss://f3zefikzkfgx3n3tzaj7wcr2aq.appsync-realtime-api.eu-west-2.am\u2026 \u2502\n\u2502     GRAPHQL: https://f3zefikzkfgx3n3tzaj7wcr2aq.appsync-api.eu-west-2.amazonaws.\u2026 \u2502\n\u2502   tags:                                                                           \u2502\n\u2502     gc-managed-by: grucloud                                                       \u2502\n\u2502     gc-project-name: aws-appsync-graphql                                          \u2502\n\u2502     gc-data-source-lambdaDatasource: lambdaDatasource                             \u2502\n\u2502     gc-stage: dev                                                                 \u2502\n\u2502     gc-created-by-provider: aws                                                   \u2502\n\u2502     Name: cdk-notes-appsync-api                                                   \u2502\n\u2502   xrayEnabled: true                                                               \u2502\n\u2502   wafWebAclArn: null                                                              \u2502\n\u2502   schema: schema {                                                                \u2502\n\u2502   query: Query                                                                    \u2502\n\u2502   mutation: Mutation                                                              \u2502\n\u2502   subscription: Subscription                                                      \u2502\n\u2502 }                                                                                 \u2502\n\u2502                                                                                   \u2502\n\u2502 type Mutation {                                                                   \u2502\n\u2502   createNote(note: NoteInput!): Note                                              \u2502\n\u2502   deleteNote(noteId: String!): String                                             \u2502\n\u2502   updateNote(note: UpdateNoteInput!): Note                                        \u2502\n\u2502 }                                                                                 \u2502\n\u2502                                                                                   \u2502\n\u2502 type Note {                                                                       \u2502\n\u2502   completed: Boolean!                                                             \u2502\n\u2502   id: ID!                                                                         \u2502\n\u2502   name: String!                                                                   \u2502\n\u2502   title: String                                                                   \u2502\n\u2502 }                                                                                 \u2502\n\u2502                                                                                   \u2502\n\u2502 type Query {                                                                      \u2502\n\u2502   getNoteById(noteId: String!): Note                                              \u2502\n\u2502   listNotes: [Note]                                                               \u2502\n\u2502 }                                                                                 \u2502\n\u2502                                                                                   \u2502\n\u2502 type Subscription {                                                               \u2502\n\u2502   onCreateNote: Note @aws_subscribe(mutations : ["createNote"])                   \u2502\n\u2502   onDeleteNote: String @aws_subscribe(mutations : ["deleteNote"])                 \u2502\n\u2502   onUpdateNote: Note @aws_subscribe(mutations : ["updateNote"])                   \u2502\n\u2502 }                                                                                 \u2502\n\u2502                                                                                   \u2502\n\u2502 input NoteInput {                                                                 \u2502\n\u2502   completed: Boolean!                                                             \u2502\n\u2502   id: ID!                                                                         \u2502\n\u2502   name: String!                                                                   \u2502\n\u2502 }                                                                                 \u2502\n\u2502                                                                                   \u2502\n\u2502 input UpdateNoteInput {                                                           \u2502\n\u2502   completed: Boolean                                                              \u2502\n\u2502   id: ID!                                                                         \u2502\n\u2502   name: String                                                                    \u2502\n\u2502 }                                                                                 \u2502\n\u2502                                                                                   \u2502\n\u2502   apiKeys:                                                                        \u2502\n\u2502     - id: da2-xohuctlwfnhsxeu5gesxqkfl7e                                          \u2502\n\u2502       description: Graphql Api Keys                                               \u2502\n\u2502       expires: 1635004800                                                         \u2502\n\u2502       deletes: 1640188800                                                         \u2502\n\u2502                                                                                   \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\nList Summary:\nProvider: aws\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 aws                                                                              \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 AppSync::GraphqlApi \u2502 cdk-notes-appsync-api                                      \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n1 resource, 1 type, 1 provider\nCommand "gc l -t GraphqlApi" executed in 5s\n')))}m.isMDXComponent=!0}}]);