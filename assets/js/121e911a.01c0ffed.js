"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[68296],{3905:(e,t,r)=>{r.d(t,{Zo:()=>p,kt:()=>f});var a=r(67294);function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function s(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?s(Object(r),!0).forEach((function(t){n(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):s(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function o(e,t){if(null==e)return{};var r,a,n=function(e,t){if(null==e)return{};var r,a,n={},s=Object.keys(e);for(a=0;a<s.length;a++)r=s[a],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(a=0;a<s.length;a++)r=s[a],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}var i=a.createContext({}),c=function(e){var t=a.useContext(i),r=t;return e&&(r="function"==typeof e?e(t):l(l({},t),e)),r},p=function(e){var t=c(e.components);return a.createElement(i.Provider,{value:t},e.children)},d="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,s=e.originalType,i=e.parentName,p=o(e,["components","mdxType","originalType","parentName"]),d=c(r),m=n,f=d["".concat(i,".").concat(m)]||d[m]||u[m]||s;return r?a.createElement(f,l(l({ref:t},p),{},{components:r})):a.createElement(f,l({ref:t},p))}));function f(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var s=r.length,l=new Array(s);l[0]=m;var o={};for(var i in t)hasOwnProperty.call(t,i)&&(o[i]=t[i]);o.originalType=e,o[d]="string"==typeof e?e:n,l[1]=o;for(var c=2;c<s;c++)l[c]=r[c];return a.createElement.apply(null,l)}return a.createElement.apply(null,r)}m.displayName="MDXCreateElement"},95044:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>i,contentTitle:()=>l,default:()=>u,frontMatter:()=>s,metadata:()=>o,toc:()=>c});var a=r(87462),n=(r(67294),r(3905));const s={id:"ElasticIpAddress",title:"Elastic Ip Address"},l=void 0,o={unversionedId:"aws/resources/EC2/ElasticIpAddress",id:"aws/resources/EC2/ElasticIpAddress",title:"Elastic Ip Address",description:"Provides an Elastic Ip Address to be associated to an EC2 instance",source:"@site/docs/aws/resources/EC2/ElasticIpAddress.md",sourceDirName:"aws/resources/EC2",slug:"/aws/resources/EC2/ElasticIpAddress",permalink:"/docs/aws/resources/EC2/ElasticIpAddress",draft:!1,tags:[],version:"current",frontMatter:{id:"ElasticIpAddress",title:"Elastic Ip Address"},sidebar:"docs",previous:{title:"Egress Only Internet Gateway",permalink:"/docs/aws/resources/EC2/EgressOnlyInternetGateway"},next:{title:"Elastic Ip Address Association",permalink:"/docs/aws/resources/EC2/ElasticIpAddressAssociation"}},i={},c=[{value:"Properties",id:"properties",level:3},{value:"Examples",id:"examples",level:3},{value:"Used By",id:"used-by",level:3},{value:"Listing",id:"listing",level:2}],p={toc:c},d="wrapper";function u(e){let{components:t,...r}=e;return(0,n.kt)(d,(0,a.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("p",null,"Provides an ",(0,n.kt)("a",{parentName:"p",href:"https://console.aws.amazon.com/ec2/v2/home?#Addresses:"},"Elastic Ip Address")," to be associated to an EC2 instance"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "ElasticIpAddress",\n    group: "EC2",\n    name: "eip",\n    properties: ({}) => ({\n      Tags: [\n        {\n          Key: "mykey",\n          Value: "myvalue",\n        },\n      ],\n    }),\n  },\n];\n')),(0,n.kt)("h3",{id:"properties"},"Properties"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/allocateaddresscommandinput.html"},"AllocateAddressCommandInput"))),(0,n.kt)("h3",{id:"examples"},"Examples"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("p",{parentName:"li"},(0,n.kt)("a",{parentName:"p",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/Instance/ec2/resources.js"},"simple example"))),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("p",{parentName:"li"},(0,n.kt)("a",{parentName:"p",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/Instance/ec2-vpc/resources.js"},"example with internet gateway and routing table"))),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("p",{parentName:"li"},(0,n.kt)("a",{parentName:"p",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/Route53/dns-record-ip-address"},"ip address dns record")))),(0,n.kt)("h3",{id:"used-by"},"Used By"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/ElasticIpAddressAssociation"},"EC2 Elastic Ip Address Association")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/NatGateway"},"EC2 Nat Gateway")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"/docs/aws/resources/GlobalAccelerator/EndpointGroup"},"GlobalAccelerator Endpoint Group")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"/docs/aws/resources/Route53/Record"},"Route53 Record"))),(0,n.kt)("h2",{id:"listing"},"Listing"),(0,n.kt)("p",null,"List only the elastic IP address with the ",(0,n.kt)("em",{parentName:"p"},"ElasticIpAddress")," filter:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t ElasticIpAddress\n")),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-txt"},'Listing resources on 1 provider: aws\n\u2713 aws\n  \u2713 Initialising\n  \u2713 Listing 2/2\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 1 EC2::ElasticIpAddress from aws                                        \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: eip                                                               \u2502\n\u2502 managedByUs: Yes                                                        \u2502\n\u2502 live:                                                                   \u2502\n\u2502   InstanceId: i-079dbd606096303f2                                       \u2502\n\u2502   PublicIp: 3.228.154.164                                               \u2502\n\u2502   AllocationId: eipalloc-0993474ac0c7bf743                              \u2502\n\u2502   AssociationId: eipassoc-0faab88f5a5103704                             \u2502\n\u2502   Domain: vpc                                                           \u2502\n\u2502   NetworkInterfaceId: eni-092b69907be24f463                             \u2502\n\u2502   NetworkInterfaceOwnerId: 840541460064                                 \u2502\n\u2502   PrivateIpAddress: 172.31.92.153                                       \u2502\n\u2502   Tags:                                                                 \u2502\n\u2502     - Key: gc-created-by-provider                                       \u2502\n\u2502       Value: aws                                                        \u2502\n\u2502     - Key: gc-managed-by                                                \u2502\n\u2502       Value: grucloud                                                   \u2502\n\u2502     - Key: gc-project-name                                              \u2502\n\u2502       Value: @grucloud/example-aws-ec2                                  \u2502\n\u2502     - Key: gc-stage                                                     \u2502\n\u2502       Value: dev                                                        \u2502\n\u2502     - Key: Name                                                         \u2502\n\u2502       Value: eip                                                        \u2502\n\u2502   PublicIpv4Pool: amazon                                                \u2502\n\u2502   NetworkBorderGroup: us-east-1                                         \u2502\n\u2502                                                                         \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\nList Summary:\nProvider: aws\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 aws                                                                    \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 EC2::ElasticIpAddress \u2502 eip                                            \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n1 resource, 1 type, 1 provider\nCommand "gc list -t ElasticIpAddress" executed in 6s, 164 MB\n')))}u.isMDXComponent=!0}}]);