"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[86088],{3905:(e,t,a)=>{a.d(t,{Zo:()=>p,kt:()=>y});var n=a(67294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function s(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function l(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?s(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):s(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function i(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},s=Object.keys(e);for(n=0;n<s.length;n++)a=s[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(n=0;n<s.length;n++)a=s[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var o=n.createContext({}),c=function(e){var t=n.useContext(o),a=t;return e&&(a="function"==typeof e?e(t):l(l({},t),e)),a},p=function(e){var t=c(e.components);return n.createElement(o.Provider,{value:t},e.children)},u="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,s=e.originalType,o=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),u=c(a),m=r,y=u["".concat(o,".").concat(m)]||u[m]||d[m]||s;return a?n.createElement(y,l(l({ref:t},p),{},{components:a})):n.createElement(y,l({ref:t},p))}));function y(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var s=a.length,l=new Array(s);l[0]=m;var i={};for(var o in t)hasOwnProperty.call(t,o)&&(i[o]=t[o]);i.originalType=e,i[u]="string"==typeof e?e:r,l[1]=i;for(var c=2;c<s;c++)l[c]=a[c];return n.createElement.apply(null,l)}return n.createElement.apply(null,a)}m.displayName="MDXCreateElement"},55119:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>o,contentTitle:()=>l,default:()=>d,frontMatter:()=>s,metadata:()=>i,toc:()=>c});var n=a(87462),r=(a(67294),a(3905));const s={id:"NatGateway",title:"Nat Gateway"},l=void 0,i={unversionedId:"aws/resources/EC2/NatGateway",id:"aws/resources/EC2/NatGateway",title:"Nat Gateway",description:"Provides an Nat Gateway",source:"@site/docs/aws/resources/EC2/NatGateway.md",sourceDirName:"aws/resources/EC2",slug:"/aws/resources/EC2/NatGateway",permalink:"/docs/aws/resources/EC2/NatGateway",draft:!1,tags:[],version:"current",frontMatter:{id:"NatGateway",title:"Nat Gateway"},sidebar:"docs",previous:{title:"Managed Prefix List",permalink:"/docs/aws/resources/EC2/ManagedPrefixList"},next:{title:"Network Access Control List",permalink:"/docs/aws/resources/EC2/NetworkAcl"}},o={},c=[{value:"Examples",id:"examples",level:3},{value:"Properties",id:"properties",level:3},{value:"Dependencies",id:"dependencies",level:3},{value:"Used By",id:"used-by",level:3},{value:"List",id:"list",level:3}],p={toc:c},u="wrapper";function d(e){let{components:t,...a}=e;return(0,r.kt)(u,(0,n.Z)({},p,a,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"Provides an ",(0,r.kt)("a",{parentName:"p",href:"https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html"},"Nat Gateway")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "NatGateway",\n    group: "EC2",\n    name: "nat-gateway",\n    properties: ({}) => ({\n      PrivateIpAddressIndex: 826,\n    }),\n    dependencies: () => ({\n      subnet: "subnet-public-a",\n      eip: "eip",\n    }),\n  },\n];\n')),(0,r.kt)("h3",{id:"examples"},"Examples"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/NatGateway/nat-gateway-private-ip"},"nat-gateway-private-ip"))),(0,r.kt)("h3",{id:"properties"},"Properties"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/createnatgatewaycommandinput.html"},"CreateNatGatewayCommandInput"))),(0,r.kt)("h3",{id:"dependencies"},"Dependencies"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/ElasticIpAddress"},"ElasticIpAddress")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/Subnet"},"Subnet"))),(0,r.kt)("h3",{id:"used-by"},"Used By"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/RouteTable"},"RouteTable"))),(0,r.kt)("h3",{id:"list"},"List"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t NatGateway\n")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-sh"},'Listing resources on 1 provider: aws\n\u2713 aws\n  \u2713 Initialising\n  \u2713 Listing 1/1\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 1 EC2::NatGateway from aws                                     \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: nat-gateway                                              \u2502\n\u2502 managedByUs: Yes                                               \u2502\n\u2502 live:                                                          \u2502\n\u2502   CreateTime: 2022-02-19T05:51:47.000Z                         \u2502\n\u2502   NatGatewayAddresses:                                         \u2502\n\u2502     - AllocationId: eipalloc-0f1ae0002f1d00a01                 \u2502\n\u2502       NetworkInterfaceId: eni-0dae115001a68f8e0                \u2502\n\u2502       PrivateIp: 192.168.17.249                                \u2502\n\u2502       PublicIp: 54.162.250.104                                 \u2502\n\u2502   NatGatewayId: nat-054c80ea67bbdea71                          \u2502\n\u2502   State: available                                             \u2502\n\u2502   SubnetId: subnet-0cffca87fe74ee14b                           \u2502\n\u2502   VpcId: vpc-0e4bf3af536917eac                                 \u2502\n\u2502   Tags:                                                        \u2502\n\u2502     - Key: gc-created-by-provider                              \u2502\n\u2502       Value: aws                                               \u2502\n\u2502     - Key: gc-managed-by                                       \u2502\n\u2502       Value: grucloud                                          \u2502\n\u2502     - Key: gc-project-name                                     \u2502\n\u2502       Value: @grucloud/example-aws-vpc                         \u2502\n\u2502     - Key: gc-stage                                            \u2502\n\u2502       Value: dev                                               \u2502\n\u2502     - Key: Name                                                \u2502\n\u2502       Value: nat-gateway                                       \u2502\n\u2502   ConnectivityType: public                                     \u2502\n\u2502                                                                \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\nList Summary:\nProvider: aws\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 aws                                                           \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 EC2::NatGateway \u2502 nat-gateway                                 \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n1 resource, 1 type, 1 provider\nCommand "gc l -t NatGateway" executed in 2s\n')))}d.isMDXComponent=!0}}]);