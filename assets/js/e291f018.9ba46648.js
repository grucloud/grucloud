"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[5744],{3905:function(e,t,n){n.d(t,{Zo:function(){return l},kt:function(){return m}});var r=n(67294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?s(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},s=Object.keys(e);for(r=0;r<s.length;r++)n=s[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(r=0;r<s.length;r++)n=s[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var p=r.createContext({}),i=function(e){var t=r.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},l=function(e){var t=i(e.components);return r.createElement(p.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,s=e.originalType,p=e.parentName,l=o(e,["components","mdxType","originalType","parentName"]),d=i(n),m=a,f=d["".concat(p,".").concat(m)]||d[m]||u[m]||s;return n?r.createElement(f,c(c({ref:t},l),{},{components:n})):r.createElement(f,c({ref:t},l))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var s=n.length,c=new Array(s);c[0]=d;var o={};for(var p in t)hasOwnProperty.call(t,p)&&(o[p]=t[p]);o.originalType=e,o.mdxType="string"==typeof e?e:a,c[1]=o;for(var i=2;i<s;i++)c[i]=n[i];return r.createElement.apply(null,c)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},51921:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return o},contentTitle:function(){return p},metadata:function(){return i},toc:function(){return l},default:function(){return d}});var r=n(87462),a=n(63366),s=(n(67294),n(3905)),c=["components"],o={id:"Vpc",title:"Vpc"},p=void 0,i={unversionedId:"aws/resources/EC2/Vpc",id:"aws/resources/EC2/Vpc",isDocsHomePage:!1,title:"Vpc",description:"Provide a Virtual Private Cloud:",source:"@site/docs/aws/resources/EC2/Vpc.md",sourceDirName:"aws/resources/EC2",slug:"/aws/resources/EC2/Vpc",permalink:"/docs/aws/resources/EC2/Vpc",tags:[],version:"current",frontMatter:{id:"Vpc",title:"Vpc"},sidebar:"docs",previous:{title:"Volume Attachment",permalink:"/docs/aws/resources/EC2/VolumeAttachment"},next:{title:"Vpc Endpoint",permalink:"/docs/aws/resources/EC2/VpcEndpoint"}},l=[{value:"Examples",id:"examples",children:[{value:"Simple Vpc",id:"simple-vpc",children:[],level:3},{value:"Vpc with Tags",id:"vpc-with-tags",children:[],level:3},{value:"Vpc with DnsHostnames and DnsSupport",id:"vpc-with-dnshostnames-and-dnssupport",children:[],level:3}],level:2},{value:"Code Examples",id:"code-examples",children:[],level:2},{value:"Used By",id:"used-by",children:[],level:2},{value:"List",id:"list",children:[],level:2}],u={toc:l};function d(e){var t=e.components,n=(0,a.Z)(e,c);return(0,s.kt)("wrapper",(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,s.kt)("p",null,"Provide a Virtual Private Cloud:"),(0,s.kt)("h2",{id:"examples"},"Examples"),(0,s.kt)("h3",{id:"simple-vpc"},"Simple Vpc"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Vpc",\n    group: "EC2",\n    name: "Vpc",\n    properties: ({}) => ({\n      CidrBlock: "10.0.0.0/16",\n      DnsHostnames: true,\n    }),\n  },\n];\n')),(0,s.kt)("h3",{id:"vpc-with-tags"},"Vpc with Tags"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js"},'const clusterName = "cluster";\n\nexports.createResources = () => [\n  {\n    type: "Vpc",\n    group: "EC2",\n    name: "Vpc",\n    properties: ({}) => ({\n      CidrBlock: "10.0.0.0/16",\n      DnsHostnames: true,\n      Tags: [{ Key: `kubernetes.io/cluster/${clusterName}`, Value: "shared" }],\n    }),\n  },\n];\n')),(0,s.kt)("h3",{id:"vpc-with-dnshostnames-and-dnssupport"},"Vpc with DnsHostnames and DnsSupport"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Vpc",\n    group: "EC2",\n    name: "Vpc",\n    properties: ({}) => ({\n      DnsHostnames: true,\n      DnsSupport: true,\n      CidrBlock: "10.1.0.0/16",\n    }),\n  },\n];\n\nconst vpc = provider.EC2.makeVpc({\n  name: "vpc",\n  properties: () => ({\n    DnsHostnames: true,\n    DnsSupport: true,\n    CidrBlock: "10.1.0.0/16",\n  }),\n});\n')),(0,s.kt)("h2",{id:"code-examples"},"Code Examples"),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/ec2-vpc/resources.js"},"simple example"))),(0,s.kt)("p",null,"##\xa0Properties"),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/createvpccommandinput.html"},"CreateVpcCommandInput"))),(0,s.kt)("h2",{id:"used-by"},"Used By"),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/Subnet"},"Subnet")),(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/SecurityGroup"},"Security Group")),(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/InternetGatewayAttachment"},"Internet Gateway Attachment")),(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/DhcpOptionsAssociation"},"Dhcp Options Association"))),(0,s.kt)("h2",{id:"list"},"List"),(0,s.kt)("p",null,"List the vpcs with the ",(0,s.kt)("em",{parentName:"p"},"Vpc")," filter:"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-sh"},"gc list -t Vpc\n")),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-txt"},'Listing resources on 1 provider: aws\n\u2713 aws\n  \u2713 Initialising\n  \u2713 Listing 3/3\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 1 EC2::Vpc from aws                                                    \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: vpc-default                                                      \u2502\n\u2502 managedByUs: NO                                                        \u2502\n\u2502 live:                                                                  \u2502\n\u2502   CidrBlock: 172.31.0.0/16                                             \u2502\n\u2502   DhcpOptionsId: dopt-036a6462c18e0cce0                                \u2502\n\u2502   State: available                                                     \u2502\n\u2502   VpcId: vpc-0860f958ca006c083                                         \u2502\n\u2502   OwnerId: 548529576214                                                \u2502\n\u2502   InstanceTenancy: default                                             \u2502\n\u2502   CidrBlockAssociationSet:                                             \u2502\n\u2502     - AssociationId: vpc-cidr-assoc-0ee57c3c5e6485f3c                  \u2502\n\u2502       CidrBlock: 172.31.0.0/16                                         \u2502\n\u2502       CidrBlockState:                                                  \u2502\n\u2502         State: associated                                              \u2502\n\u2502   IsDefault: true                                                      \u2502\n\u2502   DnsSupport: true                                                     \u2502\n\u2502   DnsHostnames: true                                                   \u2502\n\u2502                                                                        \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\nList Summary:\nProvider: aws\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 aws                                                                   \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 EC2::Vpc \u2502 vpc-default                                                \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n1 resource, 1 type, 1 provider\nCommand "gc l -t Vpc" executed in 4s, 173 MB\n')))}d.isMDXComponent=!0}}]);