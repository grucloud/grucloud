"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[7100],{3905:function(e,n,r){r.d(n,{Zo:function(){return c},kt:function(){return m}});var t=r(67294);function o(e,n,r){return n in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}function a(e,n){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),r.push.apply(r,t)}return r}function l(e){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?a(Object(r),!0).forEach((function(n){o(e,n,r[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))}))}return e}function s(e,n){if(null==e)return{};var r,t,o=function(e,n){if(null==e)return{};var r,t,o={},a=Object.keys(e);for(t=0;t<a.length;t++)r=a[t],n.indexOf(r)>=0||(o[r]=e[r]);return o}(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(t=0;t<a.length;t++)r=a[t],n.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var u=t.createContext({}),i=function(e){var n=t.useContext(u),r=n;return e&&(r="function"==typeof e?e(n):l(l({},n),e)),r},c=function(e){var n=i(e.components);return t.createElement(u.Provider,{value:n},e.children)},p={inlineCode:"code",wrapper:function(e){var n=e.children;return t.createElement(t.Fragment,{},n)}},d=t.forwardRef((function(e,n){var r=e.components,o=e.mdxType,a=e.originalType,u=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),d=i(r),m=o,f=d["".concat(u,".").concat(m)]||d[m]||p[m]||a;return r?t.createElement(f,l(l({ref:n},c),{},{components:r})):t.createElement(f,l({ref:n},c))}));function m(e,n){var r=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var a=r.length,l=new Array(a);l[0]=d;var s={};for(var u in n)hasOwnProperty.call(n,u)&&(s[u]=n[u]);s.originalType=e,s.mdxType="string"==typeof e?e:o,l[1]=s;for(var i=2;i<a;i++)l[i]=r[i];return t.createElement.apply(null,l)}return t.createElement.apply(null,r)}d.displayName="MDXCreateElement"},36261:function(e,n,r){r.r(n),r.d(n,{frontMatter:function(){return s},contentTitle:function(){return u},metadata:function(){return i},toc:function(){return c},default:function(){return d}});var t=r(87462),o=r(63366),a=(r(67294),r(3905)),l=["components"],s={id:"RuleGroup",title:"Rule Group"},u=void 0,i={unversionedId:"aws/resources/NetworkFirewall/RuleGroup",id:"aws/resources/NetworkFirewall/RuleGroup",isDocsHomePage:!1,title:"Rule Group",description:"Provides a Network Firewall Policy",source:"@site/docs/aws/resources/NetworkFirewall/RuleGroup.md",sourceDirName:"aws/resources/NetworkFirewall",slug:"/aws/resources/NetworkFirewall/RuleGroup",permalink:"/docs/aws/resources/NetworkFirewall/RuleGroup",tags:[],version:"current",frontMatter:{id:"RuleGroup",title:"Rule Group"},sidebar:"docs",previous:{title:"Logging Configuration",permalink:"/docs/aws/resources/NetworkFirewall/LoggingConfiguration"},next:{title:"Queue",permalink:"/docs/aws/resources/SQS/Queue"}},c=[{value:"Stateful rule",id:"stateful-rule",children:[],level:4},{value:"Stateless rule",id:"stateless-rule",children:[],level:4},{value:"Examples",id:"examples",children:[],level:3},{value:"Used By",id:"used-by",children:[],level:3},{value:"List",id:"list",children:[],level:3}],p={toc:c};function d(e){var n=e.components,r=(0,o.Z)(e,l);return(0,a.kt)("wrapper",(0,t.Z)({},p,r,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Provides a ",(0,a.kt)("a",{parentName:"p",href:"https://console.aws.amazon.com/vpc/home?#NetworkFirewallRuleGroups:"},"Network Firewall Policy")),(0,a.kt)("p",null,"###\xa0Sample Code"),(0,a.kt)("h4",{id:"stateful-rule"},"Stateful rule"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "RuleGroup",\n    group: "NetworkFirewall",\n    properties: ({}) => ({\n      RuleGroup: {\n        RuleVariables: {\n          IPSets: {\n            HOME_NET: {\n              Definition: ["10.11.0.0/16", "10.12.0.0/16"],\n            },\n          },\n        },\n        RulesSource: {\n          RulesSourceList: {\n            GeneratedRulesType: "DENYLIST",\n            TargetTypes: ["HTTP_HOST", "TLS_SNI"],\n            Targets: [".twitter.com", ".facebook.com"],\n          },\n        },\n      },\n      Capacity: 100,\n      RuleGroupName: "block-domains",\n      Type: "STATEFUL",\n    }),\n  },\n];\n')),(0,a.kt)("h4",{id:"stateless-rule"},"Stateless rule"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "RuleGroup",\n    group: "NetworkFirewall",\n    properties: ({}) => ({\n      RuleGroup: {\n        RulesSource: {\n          StatelessRulesAndCustomActions: {\n            StatelessRules: [\n              {\n                Priority: 1,\n                RuleDefinition: {\n                  Actions: ["aws:drop"],\n                  MatchAttributes: {\n                    Destinations: [\n                      {\n                        AddressDefinition: "0.0.0.0/0",\n                      },\n                    ],\n                    Protocols: [1],\n                    Sources: [\n                      {\n                        AddressDefinition: "0.0.0.0/0",\n                      },\n                    ],\n                  },\n                },\n              },\n            ],\n          },\n        },\n      },\n      Capacity: 1,\n      RuleGroupName: "drop-icmp",\n      Type: "STATELESS",\n    }),\n  },\n];\n')),(0,a.kt)("h3",{id:"examples"},"Examples"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/hub-and-spoke-with-inspection-vpc"},"hub-and-spoke-with-inspection-vpc"))),(0,a.kt)("p",null,"###\xa0Properties"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-network-firewall/interfaces/createrulegroupcommandinput.html"},"CreateRuleGroupCommandInput"))),(0,a.kt)("h3",{id:"used-by"},"Used By"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/aws/resources/NetworkFirewall/NetworkFirewallPolicy"},"Firewall Policy"))),(0,a.kt)("h3",{id:"list"},"List"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t NetworkFirewall::RuleGroup\n")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-txt"},'Listing resources on 1 provider: aws\n\u2713 aws\n  \u2713 Initialising\n  \u2713 Listing 1/1\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 3 NetworkFirewall::RuleGroup from aws                                              \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: block-domains                                                                \u2502\n\u2502 managedByUs: Yes                                                                   \u2502\n\u2502 live:                                                                              \u2502\n\u2502   RuleGroup:                                                                       \u2502\n\u2502     RuleVariables:                                                                 \u2502\n\u2502       IPSets:                                                                      \u2502\n\u2502         HOME_NET:                                                                  \u2502\n\u2502           Definition:                                                              \u2502\n\u2502             - "10.11.0.0/16"                                                       \u2502\n\u2502             - "10.12.0.0/16"                                                       \u2502\n\u2502     RulesSource:                                                                   \u2502\n\u2502       RulesSourceList:                                                             \u2502\n\u2502         GeneratedRulesType: DENYLIST                                               \u2502\n\u2502         TargetTypes:                                                               \u2502\n\u2502           - "HTTP_HOST"                                                            \u2502\n\u2502           - "TLS_SNI"                                                              \u2502\n\u2502         Targets:                                                                   \u2502\n\u2502           - ".twitter.com"                                                         \u2502\n\u2502           - ".facebook.com"                                                        \u2502\n\u2502   Capacity: 100                                                                    \u2502\n\u2502   ConsumedCapacity: 5                                                              \u2502\n\u2502   EncryptionConfiguration:                                                         \u2502\n\u2502     KeyId: AWS_OWNED_KMS_KEY                                                       \u2502\n\u2502     Type: AWS_OWNED_KMS_KEY                                                        \u2502\n\u2502   LastModifiedTime: 2022-05-03T22:37:27.432Z                                       \u2502\n\u2502   NumberOfAssociations: 1                                                          \u2502\n\u2502   RuleGroupArn: arn:aws:network-firewall:us-east-1:840541460064:stateful-rulegrou\u2026 \u2502\n\u2502   RuleGroupId: 9089adc6-4ac7-47cb-bd3d-4ed633d1b4c9                                \u2502\n\u2502   RuleGroupName: block-domains                                                     \u2502\n\u2502   RuleGroupStatus: ACTIVE                                                          \u2502\n\u2502   Tags: []                                                                         \u2502\n\u2502   Type: STATEFUL                                                                   \u2502\n\u2502                                                                                    \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: drop-icmp                                                                    \u2502\n\u2502 managedByUs: Yes                                                                   \u2502\n\u2502 live:                                                                              \u2502\n\u2502   RuleGroup:                                                                       \u2502\n\u2502     RulesSource:                                                                   \u2502\n\u2502       StatelessRulesAndCustomActions:                                              \u2502\n\u2502         StatelessRules:                                                            \u2502\n\u2502           - Priority: 1                                                            \u2502\n\u2502             RuleDefinition:                                                        \u2502\n\u2502               Actions:                                                             \u2502\n\u2502                 - "aws:drop"                                                       \u2502\n\u2502               MatchAttributes:                                                     \u2502\n\u2502                 Destinations:                                                      \u2502\n\u2502                   - AddressDefinition: 0.0.0.0/0                                   \u2502\n\u2502                 Protocols:                                                         \u2502\n\u2502                   - 1                                                              \u2502\n\u2502                 Sources:                                                           \u2502\n\u2502                   - AddressDefinition: 0.0.0.0/0                                   \u2502\n\u2502   Capacity: 1                                                                      \u2502\n\u2502   ConsumedCapacity: 1                                                              \u2502\n\u2502   EncryptionConfiguration:                                                         \u2502\n\u2502     KeyId: AWS_OWNED_KMS_KEY                                                       \u2502\n\u2502     Type: AWS_OWNED_KMS_KEY                                                        \u2502\n\u2502   LastModifiedTime: 2022-05-03T22:37:27.015Z                                       \u2502\n\u2502   NumberOfAssociations: 1                                                          \u2502\n\u2502   RuleGroupArn: arn:aws:network-firewall:us-east-1:840541460064:stateless-rulegro\u2026 \u2502\n\u2502   RuleGroupId: 17fc6274-f2b3-40cf-963b-f9636534ee8e                                \u2502\n\u2502   RuleGroupName: drop-icmp                                                         \u2502\n\u2502   RuleGroupStatus: ACTIVE                                                          \u2502\n\u2502   Tags: []                                                                         \u2502\n\u2502   Type: STATELESS                                                                  \u2502\n\u2502                                                                                    \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: drop-ssh-between-spokes                                                      \u2502\n\u2502 managedByUs: Yes                                                                   \u2502\n\u2502 live:                                                                              \u2502\n\u2502   RuleGroup:                                                                       \u2502\n\u2502     RuleVariables:                                                                 \u2502\n\u2502       IPSets:                                                                      \u2502\n\u2502         SPOKE_VPCS:                                                                \u2502\n\u2502           Definition:                                                              \u2502\n\u2502             - "10.11.0.0/16"                                                       \u2502\n\u2502             - "10.12.0.0/16"                                                       \u2502\n\u2502     RulesSource:                                                                   \u2502\n\u2502       RulesString:       drop tcp $SPOKE_VPCS any <> $SPOKE_VPCS 22 (msg:"Blocked\u2026 \u2502\n\u2502                                                                                    \u2502\n\u2502   Capacity: 100                                                                    \u2502\n\u2502   ConsumedCapacity: 1                                                              \u2502\n\u2502   EncryptionConfiguration:                                                         \u2502\n\u2502     KeyId: AWS_OWNED_KMS_KEY                                                       \u2502\n\u2502     Type: AWS_OWNED_KMS_KEY                                                        \u2502\n\u2502   LastModifiedTime: 2022-05-03T22:37:28.684Z                                       \u2502\n\u2502   NumberOfAssociations: 1                                                          \u2502\n\u2502   RuleGroupArn: arn:aws:network-firewall:us-east-1:840541460064:stateful-rulegrou\u2026 \u2502\n\u2502   RuleGroupId: 882cb665-5bb9-4aa7-bdc4-49c10deac13e                                \u2502\n\u2502   RuleGroupName: drop-ssh-between-spokes                                           \u2502\n\u2502   RuleGroupStatus: ACTIVE                                                          \u2502\n\u2502   Tags: []                                                                         \u2502\n\u2502   Type: STATEFUL                                                                   \u2502\n\u2502                                                                                    \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\nList Summary:\nProvider: aws\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 aws                                                                               \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 NetworkFirewall::RuleGroup \u2502 block-domains                                        \u2502\n\u2502                            \u2502 drop-icmp                                            \u2502\n\u2502                            \u2502 drop-ssh-between-spokes                              \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n3 resources, 1 type, 1 provider\nCommand "gc l -t RuleGroup" executed in 12s, 114 MB\n')))}d.isMDXComponent=!0}}]);