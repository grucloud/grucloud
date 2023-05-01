"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[84219],{3905:(e,r,n)=>{n.d(r,{Zo:()=>i,kt:()=>m});var t=n(67294);function s(e,r,n){return r in e?Object.defineProperty(e,r,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[r]=n,e}function a(e,r){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);r&&(t=t.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),n.push.apply(n,t)}return n}function o(e){for(var r=1;r<arguments.length;r++){var n=null!=arguments[r]?arguments[r]:{};r%2?a(Object(n),!0).forEach((function(r){s(e,r,n[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))}))}return e}function u(e,r){if(null==e)return{};var n,t,s=function(e,r){if(null==e)return{};var n,t,s={},a=Object.keys(e);for(t=0;t<a.length;t++)n=a[t],r.indexOf(n)>=0||(s[n]=e[n]);return s}(e,r);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(t=0;t<a.length;t++)n=a[t],r.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(s[n]=e[n])}return s}var p=t.createContext({}),l=function(e){var r=t.useContext(p),n=r;return e&&(n="function"==typeof e?e(r):o(o({},r),e)),n},i=function(e){var r=l(e.components);return t.createElement(p.Provider,{value:r},e.children)},c="mdxType",d={inlineCode:"code",wrapper:function(e){var r=e.children;return t.createElement(t.Fragment,{},r)}},g=t.forwardRef((function(e,r){var n=e.components,s=e.mdxType,a=e.originalType,p=e.parentName,i=u(e,["components","mdxType","originalType","parentName"]),c=l(n),g=s,m=c["".concat(p,".").concat(g)]||c[g]||d[g]||a;return n?t.createElement(m,o(o({ref:r},i),{},{components:n})):t.createElement(m,o({ref:r},i))}));function m(e,r){var n=arguments,s=r&&r.mdxType;if("string"==typeof e||s){var a=n.length,o=new Array(a);o[0]=g;var u={};for(var p in r)hasOwnProperty.call(r,p)&&(u[p]=r[p]);u.originalType=e,u[c]="string"==typeof e?e:s,o[1]=u;for(var l=2;l<a;l++)o[l]=n[l];return t.createElement.apply(null,o)}return t.createElement.apply(null,n)}g.displayName="MDXCreateElement"},30305:(e,r,n)=>{n.r(r),n.d(r,{assets:()=>p,contentTitle:()=>o,default:()=>d,frontMatter:()=>a,metadata:()=>u,toc:()=>l});var t=n(87462),s=(n(67294),n(3905));const a={title:"SecurityGroupRuleEgress"},o=void 0,u={unversionedId:"aws/resources/EC2/SecurityGroupRuleEgress",id:"aws/resources/EC2/SecurityGroupRuleEgress",title:"SecurityGroupRuleEgress",description:"Manages a security group egress rule.",source:"@site/docs/aws/resources/EC2/SecurityGroupRuleEgress.md",sourceDirName:"aws/resources/EC2",slug:"/aws/resources/EC2/SecurityGroupRuleEgress",permalink:"/docs/aws/resources/EC2/SecurityGroupRuleEgress",draft:!1,tags:[],version:"current",frontMatter:{title:"SecurityGroupRuleEgress"},sidebar:"docs",previous:{title:"Security Group",permalink:"/docs/aws/resources/EC2/SecurityGroup"},next:{title:"SecurityGroupRuleIngress",permalink:"/docs/aws/resources/EC2/SecurityGroupRuleIngress"}},p={},l=[{value:"Ingress rule for SSH",id:"ingress-rule-for-ssh",level:2},{value:"Dependencies",id:"dependencies",level:3},{value:"Listing",id:"listing",level:2}],i={toc:l},c="wrapper";function d(e){let{components:r,...n}=e;return(0,s.kt)(c,(0,t.Z)({},i,n,{components:r,mdxType:"MDXLayout"}),(0,s.kt)("p",null,"Manages a security group egress rule."),(0,s.kt)("h1",{id:"example"},"Example"),(0,s.kt)("h2",{id:"ingress-rule-for-ssh"},"Ingress rule for SSH"),(0,s.kt)("p",null,"The following example creates a security rule to allow egress traffic."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "SecurityGroupRuleEgress",\n    group: "EC2",\n    properties: ({}) => ({\n      IpProtocol: "tcp",\n      FromPort: 1024,\n      ToPort: 65535,\n      IpRanges: [\n        {\n          CidrIp: "0.0.0.0/0",\n        },\n      ],\n      Ipv6Ranges: [\n        {\n          CidrIpv6: "::/0",\n        },\n      ],\n    }),\n    dependencies: () => ({\n      securityGroup: "sg::Vpc::security-group-cluster-test",\n    }),\n  },\n];\n')),(0,s.kt)("h3",{id:"dependencies"},"Dependencies"),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/SecurityGroup"},"EC2 SecurityGroup")),(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/ManagedPrefixList"},"EC2 ManagedPrefixList"))),(0,s.kt)("h2",{id:"listing"},"Listing"),(0,s.kt)("p",null,"List only the ingress rules with the filter ",(0,s.kt)("inlineCode",{parentName:"p"},"SecurityGroupRuleEgress")),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t EC2::SecurityGroupRuleEgress\n")),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-txt"},'Listing resources on 1 provider: aws\n\u2713 aws us-east-1\n  \u2713 Initialising\n  \u2713 Listing 3/3\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 4 EC2::SecurityGroupRuleEgress from aws                                                  \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: sg::vpclink-ex-vpc::default-rule-egress-all                                        \u2502\n\u2502 managedByUs: NO                                                                          \u2502\n\u2502 live:                                                                                    \u2502\n\u2502   GroupId: sg-0807ac732d3e193d3                                                          \u2502\n\u2502   GroupName: default                                                                     \u2502\n\u2502   IpProtocol: -1                                                                         \u2502\n\u2502   IpRanges:                                                                              \u2502\n\u2502     - CidrIp: 0.0.0.0/0                                                                  \u2502\n\u2502   UserIdGroupPairs: []                                                                   \u2502\n\u2502                                                                                          \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: sg::vpclink-ex-vpc::sam-app-ECSSecurityGroup-1FYEJS4ML4TYJ-rule-egress-all         \u2502\n\u2502 managedByUs: NO                                                                          \u2502\n\u2502 live:                                                                                    \u2502\n\u2502   GroupId: sg-0ed32b4daab4b0d89                                                          \u2502\n\u2502   GroupName: sam-app-ECSSecurityGroup-1FYEJS4ML4TYJ                                      \u2502\n\u2502   IpProtocol: -1                                                                         \u2502\n\u2502   IpRanges:                                                                              \u2502\n\u2502     - CidrIp: 0.0.0.0/0                                                                  \u2502\n\u2502   UserIdGroupPairs: []                                                                   \u2502\n\u2502                                                                                          \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: sg::vpclink-ex-vpc::sam-app-LoadBalancerSG-10GJVKU6RNTZ4-rule-egress-all           \u2502\n\u2502 managedByUs: NO                                                                          \u2502\n\u2502 live:                                                                                    \u2502\n\u2502   GroupId: sg-0d33d0925a8df9124                                                          \u2502\n\u2502   GroupName: sam-app-LoadBalancerSG-10GJVKU6RNTZ4                                        \u2502\n\u2502   IpProtocol: -1                                                                         \u2502\n\u2502   IpRanges:                                                                              \u2502\n\u2502     - CidrIp: 0.0.0.0/0                                                                  \u2502\n\u2502   UserIdGroupPairs: []                                                                   \u2502\n\u2502                                                                                          \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: sg::vpclink-ex-vpc::sam-app-LoadBalancerSG-10GJVKU6RNTZ4-rule-egress-tcp-80        \u2502\n\u2502 managedByUs: NO                                                                          \u2502\n\u2502 live:                                                                                    \u2502\n\u2502   GroupId: sg-0d33d0925a8df9124                                                          \u2502\n\u2502   GroupName: sam-app-LoadBalancerSG-10GJVKU6RNTZ4                                        \u2502\n\u2502   FromPort: 80                                                                           \u2502\n\u2502   IpProtocol: tcp                                                                        \u2502\n\u2502   ToPort: 80                                                                             \u2502\n\u2502   UserIdGroupPairs:                                                                      \u2502\n\u2502     -                                                                                    \u2502\n\u2502       GroupId: sg-0ed32b4daab4b0d89                                                      \u2502\n\u2502       UserId: 840541460064                                                               \u2502\n\u2502                                                                                          \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\nList Summary:\nProvider: aws\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 aws                                                                                     \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 EC2::SecurityGroupRuleEgress \u2502 sg::vpclink-ex-vpc::default-rule-egress-all              \u2502\n\u2502                              \u2502 sg::vpclink-ex-vpc::sam-app-ECSSecurityGroup-1FYEJS4ML4\u2026 \u2502\n\u2502                              \u2502 sg::vpclink-ex-vpc::sam-app-LoadBalancerSG-10GJVKU6RNTZ\u2026 \u2502\n\u2502                              \u2502 sg::vpclink-ex-vpc::sam-app-LoadBalancerSG-10GJVKU6RNTZ\u2026 \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n4 resources, 1 type, 1 provider\nCommand "gc l -t EC2::SecurityGroupRuleEgress" executed in 4s, 106 MB\n')))}d.isMDXComponent=!0}}]);