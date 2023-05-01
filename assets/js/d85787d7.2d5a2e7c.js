"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[18594],{3905:(e,r,t)=>{t.d(r,{Zo:()=>u,kt:()=>f});var n=t(67294);function l(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function a(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function o(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?a(Object(t),!0).forEach((function(r){l(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function i(e,r){if(null==e)return{};var t,n,l=function(e,r){if(null==e)return{};var t,n,l={},a=Object.keys(e);for(n=0;n<a.length;n++)t=a[n],r.indexOf(t)>=0||(l[t]=e[t]);return l}(e,r);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)t=a[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(l[t]=e[t])}return l}var s=n.createContext({}),c=function(e){var r=n.useContext(s),t=r;return e&&(t="function"==typeof e?e(r):o(o({},r),e)),t},u=function(e){var r=c(e.components);return n.createElement(s.Provider,{value:r},e.children)},p="mdxType",w={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},d=n.forwardRef((function(e,r){var t=e.components,l=e.mdxType,a=e.originalType,s=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),p=c(t),d=l,f=p["".concat(s,".").concat(d)]||p[d]||w[d]||a;return t?n.createElement(f,o(o({ref:r},u),{},{components:t})):n.createElement(f,o({ref:r},u))}));function f(e,r){var t=arguments,l=r&&r.mdxType;if("string"==typeof e||l){var a=t.length,o=new Array(a);o[0]=d;var i={};for(var s in r)hasOwnProperty.call(r,s)&&(i[s]=r[s]);i.originalType=e,i[p]="string"==typeof e?e:l,o[1]=i;for(var c=2;c<a;c++)o[c]=t[c];return n.createElement.apply(null,o)}return n.createElement.apply(null,t)}d.displayName="MDXCreateElement"},33677:(e,r,t)=>{t.r(r),t.d(r,{assets:()=>s,contentTitle:()=>o,default:()=>w,frontMatter:()=>a,metadata:()=>i,toc:()=>c});var n=t(87462),l=(t(67294),t(3905));const a={id:"NetworkFirewallPolicy",title:"Policy"},o=void 0,i={unversionedId:"aws/resources/NetworkFirewall/NetworkFirewallPolicy",id:"aws/resources/NetworkFirewall/NetworkFirewallPolicy",title:"Policy",description:"Provides a Network Firewall Policy",source:"@site/docs/aws/resources/NetworkFirewall/Policy.md",sourceDirName:"aws/resources/NetworkFirewall",slug:"/aws/resources/NetworkFirewall/NetworkFirewallPolicy",permalink:"/docs/aws/resources/NetworkFirewall/NetworkFirewallPolicy",draft:!1,tags:[],version:"current",frontMatter:{id:"NetworkFirewallPolicy",title:"Policy"},sidebar:"docs",previous:{title:"Logging Configuration",permalink:"/docs/aws/resources/NetworkFirewall/LoggingConfiguration"},next:{title:"Rule Group",permalink:"/docs/aws/resources/NetworkFirewall/RuleGroup"}},s={},c=[{value:"Examples",id:"examples",level:3},{value:"Properties",id:"properties",level:3},{value:"Dependencies",id:"dependencies",level:3},{value:"Used By",id:"used-by",level:3},{value:"List",id:"list",level:3}],u={toc:c},p="wrapper";function w(e){let{components:r,...t}=e;return(0,l.kt)(p,(0,n.Z)({},u,t,{components:r,mdxType:"MDXLayout"}),(0,l.kt)("p",null,"Provides a ",(0,l.kt)("a",{parentName:"p",href:"https://console.aws.amazon.com/vpc/home?#NetworkFirewallPolicies:"},"Network Firewall Policy")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Policy",\n    group: "NetworkFirewall",\n    properties: ({ getId }) => ({\n      FirewallPolicy: {\n        StatefulRuleGroupReferences: [\n          {\n            ResourceArn: `${getId({\n              type: "RuleGroup",\n              group: "NetworkFirewall",\n              name: "drop-ssh-between-spokes",\n            })}`,\n          },\n          {\n            ResourceArn: `${getId({\n              type: "RuleGroup",\n              group: "NetworkFirewall",\n              name: "block-domains",\n            })}`,\n          },\n        ],\n        StatelessDefaultActions: ["aws:forward_to_sfe"],\n        StatelessFragmentDefaultActions: ["aws:forward_to_sfe"],\n        StatelessRuleGroupReferences: [\n          {\n            Priority: 20,\n            ResourceArn: `${getId({\n              type: "RuleGroup",\n              group: "NetworkFirewall",\n              name: "drop-icmp",\n            })}`,\n          },\n        ],\n      },\n      FirewallPolicyName: "firewall-policy",\n    }),\n    dependencies: () => ({\n      ruleGroups: ["block-domains", "drop-icmp", "drop-ssh-between-spokes"],\n    }),\n  },\n];\n')),(0,l.kt)("h3",{id:"examples"},"Examples"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/aws-samples/hub-and-spoke-with-inspection-vpc"},"hub-and-spoke-with-inspection-vpc"))),(0,l.kt)("h3",{id:"properties"},"Properties"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-network-firewall/interfaces/createfirewallpolicycommandinput.html"},"CreateFirewallPolicyCommandInput"))),(0,l.kt)("h3",{id:"dependencies"},"Dependencies"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"/docs/aws/resources/NetworkFirewall/RuleGroup"},"RuleGroup"))),(0,l.kt)("h3",{id:"used-by"},"Used By"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"/docs/aws/resources/NetworkFirewall/NetworkFirewall"},"Firewall"))),(0,l.kt)("h3",{id:"list"},"List"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t NetworkFirewall::Policy\n")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-txt"},'Listing resources on 1 provider: aws\n\u2713 aws\n  \u2713 Initialising\n  \u2713 Listing 1/1\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 1 NetworkFirewall::Policy from aws                                                 \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: firewall-policy                                                              \u2502\n\u2502 managedByUs: Yes                                                                   \u2502\n\u2502 live:                                                                              \u2502\n\u2502   FirewallPolicy:                                                                  \u2502\n\u2502     StatefulRuleGroupReferences:                                                   \u2502\n\u2502       -                                                                            \u2502\n\u2502         ResourceArn: arn:aws:network-firewall:us-east-1:840541460064:stateful-rul\u2026 \u2502\n\u2502       -                                                                            \u2502\n\u2502         ResourceArn: arn:aws:network-firewall:us-east-1:840541460064:stateful-rul\u2026 \u2502\n\u2502     StatelessDefaultActions:                                                       \u2502\n\u2502       - "aws:forward_to_sfe"                                                       \u2502\n\u2502     StatelessFragmentDefaultActions:                                               \u2502\n\u2502       - "aws:forward_to_sfe"                                                       \u2502\n\u2502     StatelessRuleGroupReferences:                                                  \u2502\n\u2502       - Priority: 20                                                               \u2502\n\u2502         ResourceArn: arn:aws:network-firewall:us-east-1:840541460064:stateless-ru\u2026 \u2502\n\u2502   ConsumedStatefulRuleCapacity: 200                                                \u2502\n\u2502   ConsumedStatelessRuleCapacity: 1                                                 \u2502\n\u2502   EncryptionConfiguration:                                                         \u2502\n\u2502     KeyId: AWS_OWNED_KMS_KEY                                                       \u2502\n\u2502     Type: AWS_OWNED_KMS_KEY                                                        \u2502\n\u2502   FirewallPolicyArn: arn:aws:network-firewall:us-east-1:840541460064:firewall-pol\u2026 \u2502\n\u2502   FirewallPolicyId: ed6eb3ad-c102-48ff-abde-1381eb0ac7c6                           \u2502\n\u2502   FirewallPolicyName: firewall-policy                                              \u2502\n\u2502   FirewallPolicyStatus: ACTIVE                                                     \u2502\n\u2502   LastModifiedTime: 2022-05-03T22:37:29.883Z                                       \u2502\n\u2502   NumberOfAssociations: 1                                                          \u2502\n\u2502   Tags: []                                                                         \u2502\n\u2502                                                                                    \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\nList Summary:\nProvider: aws\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 aws                                                                               \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 NetworkFirewall::Policy \u2502 firewall-policy                                         \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n1 resource, 1 type, 1 provider\nCommand "gc l -t NetworkFirewall::Policy" executed in 7s, 171 MB\n')))}w.isMDXComponent=!0}}]);