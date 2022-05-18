"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[5848],{3905:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return m}});var a=n(67294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?s(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},s=Object.keys(e);for(a=0;a<s.length;a++)n=s[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(a=0;a<s.length;a++)n=s[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var c=a.createContext({}),l=function(e){var t=a.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},p=function(e){var t=l(e.components);return a.createElement(c.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},u=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,s=e.originalType,c=e.parentName,p=o(e,["components","mdxType","originalType","parentName"]),u=l(n),m=r,g=u["".concat(c,".").concat(m)]||u[m]||d[m]||s;return n?a.createElement(g,i(i({ref:t},p),{},{components:n})):a.createElement(g,i({ref:t},p))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var s=n.length,i=new Array(s);i[0]=u;var o={};for(var c in t)hasOwnProperty.call(t,c)&&(o[c]=t[c]);o.originalType=e,o.mdxType="string"==typeof e?e:r,i[1]=o;for(var l=2;l<s;l++)i[l]=n[l];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}u.displayName="MDXCreateElement"},79217:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return o},contentTitle:function(){return c},metadata:function(){return l},toc:function(){return p},default:function(){return u}});var a=n(87462),r=n(63366),s=(n(67294),n(3905)),i=["components"],o={id:"Stage",title:"Stage"},c=void 0,l={unversionedId:"aws/resources/APIGateway/Stage",id:"aws/resources/APIGateway/Stage",isDocsHomePage:!1,title:"Stage",description:"Manages an API Gateway Stage.",source:"@site/docs/aws/resources/APIGateway/Stage.md",sourceDirName:"aws/resources/APIGateway",slug:"/aws/resources/APIGateway/Stage",permalink:"/docs/aws/resources/APIGateway/Stage",tags:[],version:"current",frontMatter:{id:"Stage",title:"Stage"},sidebar:"docs",previous:{title:"RestApi",permalink:"/docs/aws/resources/APIGateway/RestApi"},next:{title:"Api",permalink:"/docs/aws/resources/ApiGatewayV2/Api"}},p=[{value:"Sample code",id:"sample-code",children:[],level:2},{value:"Properties",id:"properties",children:[],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"Full Examples",id:"full-examples",children:[],level:2},{value:"List",id:"list",children:[],level:2}],d={toc:p};function u(e){var t=e.components,n=(0,r.Z)(e,i);return(0,s.kt)("wrapper",(0,a.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,s.kt)("p",null,"Manages an ",(0,s.kt)("a",{parentName:"p",href:"https://console.aws.amazon.com/apigateway/main/apis"},"API Gateway Stage"),"."),(0,s.kt)("h2",{id:"sample-code"},"Sample code"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "RestApi",\n    group: "APIGateway",\n    name: "PetStore",\n    properties: ({}) => ({\n      apiKeySource: "HEADER",\n      endpointConfiguration: {\n        types: ["REGIONAL"],\n      },\n      schemaFile: "PetStore.oas30.json",\n      deployment: {\n        stageName: "dev",\n      },\n    }),\n  },\n  {\n    type: "Stage",\n    group: "APIGateway",\n    name: "dev",\n    properties: ({}) => ({\n      description: "dev",\n      methodSettings: {\n        "*/*": {\n          metricsEnabled: false,\n          dataTraceEnabled: false,\n          throttlingBurstLimit: 5000,\n          throttlingRateLimit: 10000,\n          cachingEnabled: false,\n          cacheTtlInSeconds: 300,\n          cacheDataEncrypted: false,\n          requireAuthorizationForCacheControl: true,\n          unauthorizedCacheControlHeaderStrategy:\n            "SUCCEED_WITH_RESPONSE_HEADER",\n        },\n      },\n      cacheClusterEnabled: false,\n      cacheClusterSize: "0.5",\n      tracingEnabled: false,\n    }),\n    dependencies: () => ({\n      restApi: "PetStore",\n    }),\n  },\n  {\n    type: "Stage",\n    group: "APIGateway",\n    name: "prod",\n    properties: ({}) => ({\n      description: "prod",\n      cacheClusterEnabled: false,\n      tracingEnabled: false,\n    }),\n    dependencies: () => ({\n      restApi: "PetStore",\n    }),\n  },\n];\n')),(0,s.kt)("h2",{id:"properties"},"Properties"),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-api-gateway/interfaces/createstagecommandinput.html"},"CreateStageCommandInput"))),(0,s.kt)("h2",{id:"dependencies"},"Dependencies"),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/APIGateway/RestApi"},"RestAPI"))),(0,s.kt)("h2",{id:"full-examples"},"Full Examples"),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/APIGateway/restapi-lambda"},"RestAPI with Lambda"))),(0,s.kt)("h2",{id:"list"},"List"),(0,s.kt)("p",null,"The Stages can be filtered with the ",(0,s.kt)("em",{parentName:"p"},"Stage")," type:"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t Stage\n")),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-txt"},'Listing resources on 1 provider: aws\n\u2713 aws\n  \u2713 Initialising\n  \u2713 Listing 2/2\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 2 APIGateway::Stage from aws                               \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: dev                                                  \u2502\n\u2502 managedByUs: Yes                                           \u2502\n\u2502 live:                                                      \u2502\n\u2502   cacheClusterEnabled: false                               \u2502\n\u2502   cacheClusterSize: 0.5                                    \u2502\n\u2502   cacheClusterStatus: NOT_AVAILABLE                        \u2502\n\u2502   createdDate: 2022-03-10T02:54:35.000Z                    \u2502\n\u2502   deploymentId: 2f1hv2                                     \u2502\n\u2502   description: dev                                         \u2502\n\u2502   lastUpdatedDate: 2022-03-10T02:54:36.000Z                \u2502\n\u2502   methodSettings:                                          \u2502\n\u2502     */*:                                                   \u2502\n\u2502       cacheDataEncrypted: false                            \u2502\n\u2502       cacheTtlInSeconds: 300                               \u2502\n\u2502       cachingEnabled: false                                \u2502\n\u2502       dataTraceEnabled: false                              \u2502\n\u2502       metricsEnabled: false                                \u2502\n\u2502       requireAuthorizationForCacheControl: true            \u2502\n\u2502       throttlingBurstLimit: 5000                           \u2502\n\u2502       throttlingRateLimit: 10000                           \u2502\n\u2502       unauthorizedCacheControlHeaderStrategy: SUCCEED_WIT\u2026 \u2502\n\u2502   stageName: dev                                           \u2502\n\u2502   tags:                                                    \u2502\n\u2502     Name: dev                                              \u2502\n\u2502     gc-created-by-provider: aws                            \u2502\n\u2502     gc-managed-by: grucloud                                \u2502\n\u2502     gc-project-name: @grucloud/example-aws-api-gateway-re\u2026 \u2502\n\u2502     gc-stage: dev                                          \u2502\n\u2502     mykey1: myvalue1                                       \u2502\n\u2502   tracingEnabled: false                                    \u2502\n\u2502   restApiId: dfc2hu0zti                                    \u2502\n\u2502                                                            \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: prod                                                 \u2502\n\u2502 managedByUs: Yes                                           \u2502\n\u2502 live:                                                      \u2502\n\u2502   cacheClusterEnabled: false                               \u2502\n\u2502   cacheClusterStatus: NOT_AVAILABLE                        \u2502\n\u2502   createdDate: 2022-03-10T02:54:35.000Z                    \u2502\n\u2502   deploymentId: 2f1hv2                                     \u2502\n\u2502   description: prod                                        \u2502\n\u2502   lastUpdatedDate: 2022-03-10T02:54:36.000Z                \u2502\n\u2502   methodSettings:                                          \u2502\n\u2502   stageName: prod                                          \u2502\n\u2502   tags:                                                    \u2502\n\u2502     Name: prod                                             \u2502\n\u2502     gc-created-by-provider: aws                            \u2502\n\u2502     gc-managed-by: grucloud                                \u2502\n\u2502     gc-project-name: @grucloud/example-aws-api-gateway-re\u2026 \u2502\n\u2502     gc-stage: dev                                          \u2502\n\u2502   tracingEnabled: false                                    \u2502\n\u2502   restApiId: dfc2hu0zti                                    \u2502\n\u2502                                                            \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\nList Summary:\nProvider: aws\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 aws                                                       \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 APIGateway::Stage \u2502 dev                                   \u2502\n\u2502                   \u2502 prod                                  \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n2 resources, 1 type, 1 provider\nCommand "gc l -t APIGateway::Stage" executed in 5s, 136 MB\n')))}u.isMDXComponent=!0}}]);