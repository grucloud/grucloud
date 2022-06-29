"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[25848],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>m});var a=n(67294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?s(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},s=Object.keys(e);for(a=0;a<s.length;a++)n=s[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(a=0;a<s.length;a++)n=s[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var o=a.createContext({}),c=function(e){var t=a.useContext(o),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},p=function(e){var t=c(e.components);return a.createElement(o.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},u=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,s=e.originalType,o=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),u=c(n),m=r,g=u["".concat(o,".").concat(m)]||u[m]||d[m]||s;return n?a.createElement(g,l(l({ref:t},p),{},{components:n})):a.createElement(g,l({ref:t},p))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var s=n.length,l=new Array(s);l[0]=u;var i={};for(var o in t)hasOwnProperty.call(t,o)&&(i[o]=t[o]);i.originalType=e,i.mdxType="string"==typeof e?e:r,l[1]=i;for(var c=2;c<s;c++)l[c]=n[c];return a.createElement.apply(null,l)}return a.createElement.apply(null,n)}u.displayName="MDXCreateElement"},79217:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>o,contentTitle:()=>l,default:()=>d,frontMatter:()=>s,metadata:()=>i,toc:()=>c});var a=n(87462),r=(n(67294),n(3905));const s={id:"Stage",title:"Stage"},l=void 0,i={unversionedId:"aws/resources/APIGateway/Stage",id:"aws/resources/APIGateway/Stage",title:"Stage",description:"Manages an API Gateway Stage.",source:"@site/docs/aws/resources/APIGateway/Stage.md",sourceDirName:"aws/resources/APIGateway",slug:"/aws/resources/APIGateway/Stage",permalink:"/docs/aws/resources/APIGateway/Stage",draft:!1,tags:[],version:"current",frontMatter:{id:"Stage",title:"Stage"},sidebar:"docs",previous:{title:"RestApi",permalink:"/docs/aws/resources/APIGateway/RestApi"},next:{title:"Api",permalink:"/docs/aws/resources/ApiGatewayV2/Api"}},o={},c=[{value:"Sample code",id:"sample-code",level:2},{value:"Properties",id:"properties",level:2},{value:"Dependencies",id:"dependencies",level:2},{value:"Full Examples",id:"full-examples",level:2},{value:"List",id:"list",level:2}],p={toc:c};function d(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,a.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"Manages an ",(0,r.kt)("a",{parentName:"p",href:"https://console.aws.amazon.com/apigateway/main/apis"},"API Gateway Stage"),"."),(0,r.kt)("h2",{id:"sample-code"},"Sample code"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "RestApi",\n    group: "APIGateway",\n    name: "PetStore",\n    properties: ({}) => ({\n      apiKeySource: "HEADER",\n      endpointConfiguration: {\n        types: ["REGIONAL"],\n      },\n      schemaFile: "PetStore.oas30.json",\n      deployment: {\n        stageName: "dev",\n      },\n    }),\n  },\n  {\n    type: "Stage",\n    group: "APIGateway",\n    name: "dev",\n    properties: ({}) => ({\n      description: "dev",\n      methodSettings: {\n        "*/*": {\n          metricsEnabled: false,\n          dataTraceEnabled: false,\n          throttlingBurstLimit: 5000,\n          throttlingRateLimit: 10000,\n          cachingEnabled: false,\n          cacheTtlInSeconds: 300,\n          cacheDataEncrypted: false,\n          requireAuthorizationForCacheControl: true,\n          unauthorizedCacheControlHeaderStrategy:\n            "SUCCEED_WITH_RESPONSE_HEADER",\n        },\n      },\n      cacheClusterEnabled: false,\n      cacheClusterSize: "0.5",\n      tracingEnabled: false,\n    }),\n    dependencies: () => ({\n      restApi: "PetStore",\n    }),\n  },\n  {\n    type: "Stage",\n    group: "APIGateway",\n    name: "prod",\n    properties: ({}) => ({\n      description: "prod",\n      cacheClusterEnabled: false,\n      tracingEnabled: false,\n    }),\n    dependencies: () => ({\n      restApi: "PetStore",\n    }),\n  },\n];\n')),(0,r.kt)("h2",{id:"properties"},"Properties"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-api-gateway/interfaces/createstagecommandinput.html"},"CreateStageCommandInput"))),(0,r.kt)("h2",{id:"dependencies"},"Dependencies"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/APIGateway/RestApi"},"RestAPI"))),(0,r.kt)("h2",{id:"full-examples"},"Full Examples"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/APIGateway/restapi-lambda"},"RestAPI with Lambda"))),(0,r.kt)("h2",{id:"list"},"List"),(0,r.kt)("p",null,"The Stages can be filtered with the ",(0,r.kt)("em",{parentName:"p"},"Stage")," type:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t Stage\n")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-txt"},'Listing resources on 1 provider: aws\n\u2713 aws\n  \u2713 Initialising\n  \u2713 Listing 2/2\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 2 APIGateway::Stage from aws                               \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: dev                                                  \u2502\n\u2502 managedByUs: Yes                                           \u2502\n\u2502 live:                                                      \u2502\n\u2502   cacheClusterEnabled: false                               \u2502\n\u2502   cacheClusterSize: 0.5                                    \u2502\n\u2502   cacheClusterStatus: NOT_AVAILABLE                        \u2502\n\u2502   createdDate: 2022-03-10T02:54:35.000Z                    \u2502\n\u2502   deploymentId: 2f1hv2                                     \u2502\n\u2502   description: dev                                         \u2502\n\u2502   lastUpdatedDate: 2022-03-10T02:54:36.000Z                \u2502\n\u2502   methodSettings:                                          \u2502\n\u2502     */*:                                                   \u2502\n\u2502       cacheDataEncrypted: false                            \u2502\n\u2502       cacheTtlInSeconds: 300                               \u2502\n\u2502       cachingEnabled: false                                \u2502\n\u2502       dataTraceEnabled: false                              \u2502\n\u2502       metricsEnabled: false                                \u2502\n\u2502       requireAuthorizationForCacheControl: true            \u2502\n\u2502       throttlingBurstLimit: 5000                           \u2502\n\u2502       throttlingRateLimit: 10000                           \u2502\n\u2502       unauthorizedCacheControlHeaderStrategy: SUCCEED_WIT\u2026 \u2502\n\u2502   stageName: dev                                           \u2502\n\u2502   tags:                                                    \u2502\n\u2502     Name: dev                                              \u2502\n\u2502     gc-created-by-provider: aws                            \u2502\n\u2502     gc-managed-by: grucloud                                \u2502\n\u2502     gc-project-name: @grucloud/example-aws-api-gateway-re\u2026 \u2502\n\u2502     gc-stage: dev                                          \u2502\n\u2502     mykey1: myvalue1                                       \u2502\n\u2502   tracingEnabled: false                                    \u2502\n\u2502   restApiId: dfc2hu0zti                                    \u2502\n\u2502                                                            \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: prod                                                 \u2502\n\u2502 managedByUs: Yes                                           \u2502\n\u2502 live:                                                      \u2502\n\u2502   cacheClusterEnabled: false                               \u2502\n\u2502   cacheClusterStatus: NOT_AVAILABLE                        \u2502\n\u2502   createdDate: 2022-03-10T02:54:35.000Z                    \u2502\n\u2502   deploymentId: 2f1hv2                                     \u2502\n\u2502   description: prod                                        \u2502\n\u2502   lastUpdatedDate: 2022-03-10T02:54:36.000Z                \u2502\n\u2502   methodSettings:                                          \u2502\n\u2502   stageName: prod                                          \u2502\n\u2502   tags:                                                    \u2502\n\u2502     Name: prod                                             \u2502\n\u2502     gc-created-by-provider: aws                            \u2502\n\u2502     gc-managed-by: grucloud                                \u2502\n\u2502     gc-project-name: @grucloud/example-aws-api-gateway-re\u2026 \u2502\n\u2502     gc-stage: dev                                          \u2502\n\u2502   tracingEnabled: false                                    \u2502\n\u2502   restApiId: dfc2hu0zti                                    \u2502\n\u2502                                                            \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\nList Summary:\nProvider: aws\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 aws                                                       \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 APIGateway::Stage \u2502 dev                                   \u2502\n\u2502                   \u2502 prod                                  \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n2 resources, 1 type, 1 provider\nCommand "gc l -t APIGateway::Stage" executed in 5s, 136 MB\n')))}d.isMDXComponent=!0}}]);