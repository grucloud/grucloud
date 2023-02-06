"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[85828],{3905:(e,n,r)=>{r.d(n,{Zo:()=>l,kt:()=>m});var t=r(67294);function o(e,n,r){return n in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}function c(e,n){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),r.push.apply(r,t)}return r}function i(e){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?c(Object(r),!0).forEach((function(n){o(e,n,r[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):c(Object(r)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))}))}return e}function a(e,n){if(null==e)return{};var r,t,o=function(e,n){if(null==e)return{};var r,t,o={},c=Object.keys(e);for(t=0;t<c.length;t++)r=c[t],n.indexOf(r)>=0||(o[r]=e[r]);return o}(e,n);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(t=0;t<c.length;t++)r=c[t],n.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var s=t.createContext({}),p=function(e){var n=t.useContext(s),r=n;return e&&(r="function"==typeof e?e(n):i(i({},n),e)),r},l=function(e){var n=p(e.components);return t.createElement(s.Provider,{value:n},e.children)},u={inlineCode:"code",wrapper:function(e){var n=e.children;return t.createElement(t.Fragment,{},n)}},d=t.forwardRef((function(e,n){var r=e.components,o=e.mdxType,c=e.originalType,s=e.parentName,l=a(e,["components","mdxType","originalType","parentName"]),d=p(r),m=o,g=d["".concat(s,".").concat(m)]||d[m]||u[m]||c;return r?t.createElement(g,i(i({ref:n},l),{},{components:r})):t.createElement(g,i({ref:n},l))}));function m(e,n){var r=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var c=r.length,i=new Array(c);i[0]=d;var a={};for(var s in n)hasOwnProperty.call(n,s)&&(a[s]=n[s]);a.originalType=e,a.mdxType="string"==typeof e?e:o,i[1]=a;for(var p=2;p<c;p++)i[p]=r[p];return t.createElement.apply(null,i)}return t.createElement.apply(null,r)}d.displayName="MDXCreateElement"},86115:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>s,contentTitle:()=>i,default:()=>u,frontMatter:()=>c,metadata:()=>a,toc:()=>p});var t=r(87462),o=(r(67294),r(3905));const c={id:"VpcPeeringConnection",title:"Vpc Peering Connection"},i=void 0,a={unversionedId:"aws/resources/EC2/VpcPeeringConnection",id:"aws/resources/EC2/VpcPeeringConnection",title:"Vpc Peering Connection",description:"Provides a Vpc Peering Connection",source:"@site/docs/aws/resources/EC2/VpcPeeringConnection.md",sourceDirName:"aws/resources/EC2",slug:"/aws/resources/EC2/VpcPeeringConnection",permalink:"/docs/aws/resources/EC2/VpcPeeringConnection",draft:!1,tags:[],version:"current",frontMatter:{id:"VpcPeeringConnection",title:"Vpc Peering Connection"},sidebar:"docs",previous:{title:"Vpc Endpoint",permalink:"/docs/aws/resources/EC2/VpcEndpoint"},next:{title:"Vpc Peering Connection Accepter",permalink:"/docs/aws/resources/EC2/VpcPeeringConnectionAccepter"}},s={},p=[{value:"Sample",id:"sample",level:3},{value:"Examples",id:"examples",level:3},{value:"Dependencies",id:"dependencies",level:3},{value:"Used By",id:"used-by",level:3},{value:"List",id:"list",level:3}],l={toc:p};function u(e){let{components:n,...r}=e;return(0,o.kt)("wrapper",(0,t.Z)({},l,r,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Provides a ",(0,o.kt)("a",{parentName:"p",href:"https://console.aws.amazon.com/vpc/home?#PeeringConnections:"},"Vpc Peering Connection")),(0,o.kt)("h3",{id:"sample"},"Sample"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "VpcPeeringConnection",\n    group: "EC2",\n    properties: ({ config }) => ({\n      AccepterVpcInfo: {\n        CidrBlock: "10.1.0.0/16",\n        CidrBlockSet: [\n          {\n            CidrBlock: "10.1.0.0/16",\n          },\n        ],\n        OwnerId: `${config.accountId()}`,\n        PeeringOptions: {\n          AllowDnsResolutionFromRemoteVpc: false,\n          AllowEgressFromLocalClassicLinkToRemoteVpc: false,\n          AllowEgressFromLocalVpcToRemoteClassicLink: false,\n        },\n        Region: config.regionSecondary,\n      },\n      RequesterVpcInfo: {\n        OwnerId: `${config.accountId()}`,\n        Region: config.region,\n      },\n    }),\n    dependencies: ({}) => ({\n      vpc: "my-vpc",\n      vpcPeer: "vpc-peer",\n    }),\n  },\n];\n')),(0,o.kt)("h3",{id:"examples"},"Examples"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/vpc-peering"},"vpc-peering"))),(0,o.kt)("p",null,"###\xa0Properties"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/createvpcpeeringconnectioncommandinput.html"},"CreateVpcPeeringConnectionCommandInput"))),(0,o.kt)("h3",{id:"dependencies"},"Dependencies"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/Vpc"},"Vpc"))),(0,o.kt)("h3",{id:"used-by"},"Used By"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/VpcPeeringConnectionAccepter"},"VpcPeeringConnectionAccepter"))),(0,o.kt)("h3",{id:"list"},"List"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t EC2::VpcPeeringConnection\n")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-sh"},'Listing resources on 2 providers: aws-primary, aws-secondary\n\u2713 aws-primary us-east-1 regionA\n  \u2713 Initialising\n  \u2713 Listing 2/2\n\u2713 aws-secondary us-west-2 regionB\n  \u2713 Initialising\n  \u2713 Listing 2/2\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 1 EC2::VpcPeeringConnection from aws-primary                                           \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: vpc-peering::my-vpc::vpc-peer                                                    \u2502\n\u2502 managedByUs: Yes                                                                       \u2502\n\u2502 live:                                                                                  \u2502\n\u2502   AccepterVpcInfo:                                                                     \u2502\n\u2502     CidrBlock: 10.1.0.0/16                                                             \u2502\n\u2502     CidrBlockSet:                                                                      \u2502\n\u2502       - CidrBlock: 10.1.0.0/16                                                         \u2502\n\u2502     OwnerId: 840541460064                                                              \u2502\n\u2502     PeeringOptions:                                                                    \u2502\n\u2502       AllowDnsResolutionFromRemoteVpc: false                                           \u2502\n\u2502       AllowEgressFromLocalClassicLinkToRemoteVpc: false                                \u2502\n\u2502       AllowEgressFromLocalVpcToRemoteClassicLink: false                                \u2502\n\u2502     VpcId: vpc-0dbe3000cd501841f                                                       \u2502\n\u2502     Region: us-west-2                                                                  \u2502\n\u2502   RequesterVpcInfo:                                                                    \u2502\n\u2502     CidrBlock: 10.0.0.0/16                                                             \u2502\n\u2502     CidrBlockSet:                                                                      \u2502\n\u2502       - CidrBlock: 10.0.0.0/16                                                         \u2502\n\u2502     OwnerId: 840541460064                                                              \u2502\n\u2502     PeeringOptions:                                                                    \u2502\n\u2502       AllowDnsResolutionFromRemoteVpc: false                                           \u2502\n\u2502       AllowEgressFromLocalClassicLinkToRemoteVpc: false                                \u2502\n\u2502       AllowEgressFromLocalVpcToRemoteClassicLink: false                                \u2502\n\u2502     VpcId: vpc-07177689fb2b89baa                                                       \u2502\n\u2502     Region: us-east-1                                                                  \u2502\n\u2502   Status:                                                                              \u2502\n\u2502     Code: active                                                                       \u2502\n\u2502     Message: Active                                                                    \u2502\n\u2502   Tags:                                                                                \u2502\n\u2502     - Key: gc-created-by-provider                                                      \u2502\n\u2502       Value: aws-primary                                                               \u2502\n\u2502     - Key: gc-managed-by                                                               \u2502\n\u2502       Value: grucloud                                                                  \u2502\n\u2502     - Key: gc-project-name                                                             \u2502\n\u2502       Value: vpc-peering                                                               \u2502\n\u2502     - Key: gc-stage                                                                    \u2502\n\u2502       Value: dev                                                                       \u2502\n\u2502   VpcPeeringConnectionId: pcx-0e7232624e04c731f                                        \u2502\n\u2502                                                                                        \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\nList Summary:\nProvider: aws-primary\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 aws-primary                                                                           \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 EC2::VpcPeeringConnection \u2502 vpc-peering::my-vpc::vpc-peer                             \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\nProvider: aws-secondary\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 aws-secondary                                                                         \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n1 resource, 1 type, 2 providers\nCommand "gc l -t EC2::VpcPeeringConnection" executed in 8s, 102 MB\n\n')))}u.isMDXComponent=!0}}]);