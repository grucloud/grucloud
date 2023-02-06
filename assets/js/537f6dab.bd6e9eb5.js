"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[35801],{3905:(e,r,a)=>{a.d(r,{Zo:()=>u,kt:()=>d});var n=a(67294);function t(e,r,a){return r in e?Object.defineProperty(e,r,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[r]=a,e}function o(e,r){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),a.push.apply(a,n)}return a}function l(e){for(var r=1;r<arguments.length;r++){var a=null!=arguments[r]?arguments[r]:{};r%2?o(Object(a),!0).forEach((function(r){t(e,r,a[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(a,r))}))}return e}function s(e,r){if(null==e)return{};var a,n,t=function(e,r){if(null==e)return{};var a,n,t={},o=Object.keys(e);for(n=0;n<o.length;n++)a=o[n],r.indexOf(a)>=0||(t[a]=e[a]);return t}(e,r);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)a=o[n],r.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(t[a]=e[a])}return t}var i=n.createContext({}),c=function(e){var r=n.useContext(i),a=r;return e&&(a="function"==typeof e?e(r):l(l({},r),e)),a},u=function(e){var r=c(e.components);return n.createElement(i.Provider,{value:r},e.children)},p={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},m=n.forwardRef((function(e,r){var a=e.components,t=e.mdxType,o=e.originalType,i=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),m=c(a),d=t,y=m["".concat(i,".").concat(d)]||m[d]||p[d]||o;return a?n.createElement(y,l(l({ref:r},u),{},{components:a})):n.createElement(y,l({ref:r},u))}));function d(e,r){var a=arguments,t=r&&r.mdxType;if("string"==typeof e||t){var o=a.length,l=new Array(o);l[0]=m;var s={};for(var i in r)hasOwnProperty.call(r,i)&&(s[i]=r[i]);s.originalType=e,s.mdxType="string"==typeof e?e:t,l[1]=s;for(var c=2;c<o;c++)l[c]=a[c];return n.createElement.apply(null,l)}return n.createElement.apply(null,a)}m.displayName="MDXCreateElement"},90398:(e,r,a)=>{a.r(r),a.d(r,{assets:()=>i,contentTitle:()=>l,default:()=>p,frontMatter:()=>o,metadata:()=>s,toc:()=>c});var n=a(87462),t=(a(67294),a(3905));const o={id:"Layer",title:"Layer"},l=void 0,s={unversionedId:"aws/resources/Lambda/Layer",id:"aws/resources/Lambda/Layer",title:"Layer",description:"Provides an Lambda Layer",source:"@site/docs/aws/resources/Lambda/Layer.md",sourceDirName:"aws/resources/Lambda",slug:"/aws/resources/Lambda/Layer",permalink:"/docs/aws/resources/Lambda/Layer",draft:!1,tags:[],version:"current",frontMatter:{id:"Layer",title:"Layer"},sidebar:"docs",previous:{title:"Function",permalink:"/docs/aws/resources/Lambda/Function"},next:{title:"Broker",permalink:"/docs/aws/resources/MQ/Broker"}},i={},c=[{value:"Examples",id:"examples",level:2},{value:"Create a Layer for a Function",id:"create-a-layer-for-a-function",level:3},{value:"Source Code Examples",id:"source-code-examples",level:2},{value:"Properties",id:"properties",level:2},{value:"UsedBy",id:"usedby",level:2},{value:"List",id:"list",level:2}],u={toc:c};function p(e){let{components:r,...a}=e;return(0,t.kt)("wrapper",(0,n.Z)({},u,a,{components:r,mdxType:"MDXLayout"}),(0,t.kt)("p",null,"Provides an ",(0,t.kt)("a",{parentName:"p",href:"https://console.aws.amazon.com/lambda/home?/layers"},"Lambda Layer")),(0,t.kt)("h2",{id:"examples"},"Examples"),(0,t.kt)("h3",{id:"create-a-layer-for-a-function"},"Create a Layer for a Function"),(0,t.kt)("pre",null,(0,t.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Layer",\n    group: "Lambda",\n    properties: ({}) => ({\n      LayerName: "lambda-layer",\n      Description: "My Layer",\n      CompatibleRuntimes: ["nodejs"],\n    }),\n  },\n];\n')),(0,t.kt)("h2",{id:"source-code-examples"},"Source Code Examples"),(0,t.kt)("ul",null,(0,t.kt)("li",{parentName:"ul"},(0,t.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/Lambda/nodejs/helloworld"},"hello world lambda")),(0,t.kt)("li",{parentName:"ul"},(0,t.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/lambda-layer-terraform"},"serverless-patterns lamdba-layer-terraform"))),(0,t.kt)("h2",{id:"properties"},"Properties"),(0,t.kt)("ul",null,(0,t.kt)("li",{parentName:"ul"},(0,t.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-lambda/interfaces/publishlayerversioncommandinput.html"},"PublishLayerVersionCommandInput"))),(0,t.kt)("h2",{id:"usedby"},"UsedBy"),(0,t.kt)("ul",null,(0,t.kt)("li",{parentName:"ul"},(0,t.kt)("a",{parentName:"li",href:"/docs/aws/resources/Lambda/Function"},"Lambda Function"))),(0,t.kt)("h2",{id:"list"},"List"),(0,t.kt)("p",null,"The list of layers can be displayed and filtered with the type ",(0,t.kt)("strong",{parentName:"p"},"Layer"),":"),(0,t.kt)("pre",null,(0,t.kt)("code",{parentName:"pre",className:"language-sh"},"gc list -t Layer\n")),(0,t.kt)("pre",null,(0,t.kt)("code",{parentName:"pre",className:"language-txt"},'Listing resources on 1 provider: aws\n\u2713 aws\n  \u2713 Initialising\n  \u2713 Listing 1/1\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 1 Lambda::Layer from aws                                     \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: lambda-layer                                           \u2502\n\u2502 managedByUs: Yes                                             \u2502\n\u2502 live:                                                        \u2502\n\u2502   LayerVersionArn: arn:aws:lambda:us-east-1:840541460064:la\u2026 \u2502\n\u2502   Version: 76                                                \u2502\n\u2502   Description: My Layer                                      \u2502\n\u2502   CreatedDate: 2022-02-20T04:43:59.382+0000                  \u2502\n\u2502   CompatibleRuntimes:                                        \u2502\n\u2502     - "nodejs"                                               \u2502\n\u2502   LicenseInfo: null                                          \u2502\n\u2502   LayerName: lambda-layer                                    \u2502\n\u2502   LayerArn: arn:aws:lambda:us-east-1:840541460064:layer:lam\u2026 \u2502\n\u2502   Tags:                                                      \u2502\n\u2502     Name: lambda-layer                                       \u2502\n\u2502     gc-managed-by: grucloud                                  \u2502\n\u2502     gc-created-by-provider: aws                              \u2502\n\u2502     gc-stage: dev                                            \u2502\n\u2502     gc-project-name: @grucloud/example-aws-lambda-nodejs-he\u2026 \u2502\n\u2502   Content:                                                   \u2502\n\u2502     Location: https://prod-04-2014-layers.s3.us-east-1.amaz\u2026 \u2502\n\u2502     CodeSha256: m0OVorKW9quIKFgQSOX3h27KIi2ckpGG3W1T6pqByYc= \u2502\n\u2502     CodeSize: 145                                            \u2502\n\u2502     SigningProfileVersionArn: null                           \u2502\n\u2502     SigningJobArn: null                                      \u2502\n\u2502                                                              \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\nList Summary:\nProvider: aws\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 aws                                                         \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 Lambda::Layer \u2502 lambda-layer                                \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n1 resource, 1 type, 1 provider\nCommand "gc list -t Layer" executed in 3s\n')))}p.isMDXComponent=!0}}]);