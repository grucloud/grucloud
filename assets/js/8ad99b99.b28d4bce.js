"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[53283],{3905:(e,n,t)=>{t.d(n,{Zo:()=>u,kt:()=>b});var a=t(67294);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function l(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function s(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?l(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):l(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function i(e,n){if(null==e)return{};var t,a,r=function(e,n){if(null==e)return{};var t,a,r={},l=Object.keys(e);for(a=0;a<l.length;a++)t=l[a],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)t=l[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var o=a.createContext({}),c=function(e){var n=a.useContext(o),t=n;return e&&(t="function"==typeof e?e(n):s(s({},n),e)),t},u=function(e){var n=c(e.components);return a.createElement(o.Provider,{value:n},e.children)},p={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},m=a.forwardRef((function(e,n){var t=e.components,r=e.mdxType,l=e.originalType,o=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),m=c(t),b=r,d=m["".concat(o,".").concat(b)]||m[b]||p[b]||l;return t?a.createElement(d,s(s({ref:n},u),{},{components:t})):a.createElement(d,s({ref:n},u))}));function b(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var l=t.length,s=new Array(l);s[0]=m;var i={};for(var o in n)hasOwnProperty.call(n,o)&&(i[o]=n[o]);i.originalType=e,i.mdxType="string"==typeof e?e:r,s[1]=i;for(var c=2;c<l;c++)s[c]=t[c];return a.createElement.apply(null,s)}return a.createElement.apply(null,t)}m.displayName="MDXCreateElement"},13160:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>o,contentTitle:()=>s,default:()=>p,frontMatter:()=>l,metadata:()=>i,toc:()=>c});var a=t(87462),r=(t(67294),t(3905));const l={id:"WebACL",title:"WebACL"},s=void 0,i={unversionedId:"aws/resources/WAFv2/WebACL",id:"aws/resources/WAFv2/WebACL",title:"WebACL",description:"Manage a WAFv2 WebACL.",source:"@site/docs/aws/resources/WAFv2/WebACL.md",sourceDirName:"aws/resources/WAFv2",slug:"/aws/resources/WAFv2/WebACL",permalink:"/docs/aws/resources/WAFv2/WebACL",draft:!1,tags:[],version:"current",frontMatter:{id:"WebACL",title:"WebACL"},sidebar:"docs",previous:{title:"State Machine",permalink:"/docs/aws/resources/StepFunctions/StateMachine"},next:{title:"WebACL   Association",permalink:"/docs/aws/resources/WAFv2/WebACLAssociation"}},o={},c=[{value:"Example",id:"example",level:2},{value:"Code Examples",id:"code-examples",level:2},{value:"Used By",id:"used-by",level:2},{value:"Properties",id:"properties",level:2},{value:"List",id:"list",level:2}],u={toc:c};function p(e){let{components:n,...t}=e;return(0,r.kt)("wrapper",(0,a.Z)({},u,t,{components:n,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"Manage a ",(0,r.kt)("a",{parentName:"p",href:"https://console.aws.amazon.com/wafv2/homev2/web-acls"},"WAFv2 WebACL"),"."),(0,r.kt)("h2",{id:"example"},"Example"),(0,r.kt)("p",null,"Create a WebACL:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "WebACL",\n    group: "WAFv2",\n    properties: ({}) => ({\n      Capacity: 1,\n      DefaultAction: {\n        Allow: {},\n      },\n      ManagedByFirewallManager: false,\n      Name: "my-waf",\n      Rules: [\n        {\n          Action: {\n            Block: {},\n          },\n          Name: "russia",\n          Priority: 0,\n          Statement: {\n            GeoMatchStatement: {\n              CountryCodes: ["RU"],\n            },\n          },\n          VisibilityConfig: {\n            CloudWatchMetricsEnabled: true,\n            MetricName: "russia",\n            SampledRequestsEnabled: true,\n          },\n        },\n      ],\n      VisibilityConfig: {\n        CloudWatchMetricsEnabled: true,\n        MetricName: "my-waf",\n        SampledRequestsEnabled: true,\n      },\n      Scope: "REGIONAL",\n    }),\n  },\n];\n')),(0,r.kt)("h2",{id:"code-examples"},"Code Examples"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/WAFv2/wafv2-apigateway-rest"},"WebACL with REST Api Gateway")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/WAFv2/wafv2-graphql"},"WebACL with Graphql")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/WAFv2/wafv2-loadbalancer"},"WebACL with Load Balancer"))),(0,r.kt)("h2",{id:"used-by"},"Used By"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/WAFv2/WebACLAssociation"},"WebACLAssociation"))),(0,r.kt)("h2",{id:"properties"},"Properties"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-wafv2/interfaces/createwebaclcommandinput.html"},"CreateWebACLCommandInput"))),(0,r.kt)("h2",{id:"list"},"List"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t WAFv2::WebACL\n")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-txt"},'Listing resources on 1 provider: aws\n\u2713 aws us-east-1\n  \u2713 Initialising\n  \u2713 Listing 1/1\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 1 WAFv2::WebACL from aws                                                                  \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: my-webacl                                                                           \u2502\n\u2502 managedByUs: Yes                                                                          \u2502\n\u2502 live:                                                                                     \u2502\n\u2502   ARN: arn:aws:wafv2:us-east-1:840541460064:regional/webacl/my-webacl/3d58abea-cbb3-47b6\u2026 \u2502\n\u2502   Capacity: 1                                                                             \u2502\n\u2502   DefaultAction:                                                                          \u2502\n\u2502     Allow:                                                                                \u2502\n\u2502   Description:                                                                            \u2502\n\u2502   Id: 3d58abea-cbb3-47b6-8619-b413c133561f                                                \u2502\n\u2502   LabelNamespace: awswaf:840541460064:webacl:my-webacl:                                   \u2502\n\u2502   ManagedByFirewallManager: false                                                         \u2502\n\u2502   Name: my-webacl                                                                         \u2502\n\u2502   Rules:                                                                                  \u2502\n\u2502     - Action:                                                                             \u2502\n\u2502         Block:                                                                            \u2502\n\u2502       Name: russia                                                                        \u2502\n\u2502       Priority: 0                                                                         \u2502\n\u2502       Statement:                                                                          \u2502\n\u2502         GeoMatchStatement:                                                                \u2502\n\u2502           CountryCodes:                                                                   \u2502\n\u2502             - "RU"                                                                        \u2502\n\u2502       VisibilityConfig:                                                                   \u2502\n\u2502         CloudWatchMetricsEnabled: true                                                    \u2502\n\u2502         MetricName: russia                                                                \u2502\n\u2502         SampledRequestsEnabled: true                                                      \u2502\n\u2502   VisibilityConfig:                                                                       \u2502\n\u2502     CloudWatchMetricsEnabled: true                                                        \u2502\n\u2502     MetricName: my-webacl                                                                 \u2502\n\u2502     SampledRequestsEnabled: true                                                          \u2502\n\u2502   Tags:                                                                                   \u2502\n\u2502     - Key: gc-created-by-provider                                                         \u2502\n\u2502       Value: aws                                                                          \u2502\n\u2502     - Key: gc-managed-by                                                                  \u2502\n\u2502       Value: grucloud                                                                     \u2502\n\u2502     - Key: gc-project-name                                                                \u2502\n\u2502       Value: wafv2-apigateway-rest                                                        \u2502\n\u2502     - Key: gc-stage                                                                       \u2502\n\u2502       Value: dev                                                                          \u2502\n\u2502     - Key: Name                                                                           \u2502\n\u2502       Value: my-webacl                                                                    \u2502\n\u2502   Scope: REGIONAL                                                                         \u2502\n\u2502   LockToken: 946d0498-82aa-459c-b6a4-7ea528c7273b                                         \u2502\n\u2502                                                                                           \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\nList Summary:\nProvider: aws\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 aws                                                                                      \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 WAFv2::WebACL \u2502 my-webacl                                                                \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n1 resource, 1 type, 1 provider\nCommand "gc l -t WAFv2::WebACL" executed in 5s, 111 MB\n')))}p.isMDXComponent=!0}}]);