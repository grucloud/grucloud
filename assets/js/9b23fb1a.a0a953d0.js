"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[55361],{3905:(e,t,a)=>{a.d(t,{Zo:()=>i,kt:()=>m});var o=a(67294);function n(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function r(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,o)}return a}function l(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?r(Object(a),!0).forEach((function(t){n(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):r(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function s(e,t){if(null==e)return{};var a,o,n=function(e,t){if(null==e)return{};var a,o,n={},r=Object.keys(e);for(o=0;o<r.length;o++)a=r[o],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(o=0;o<r.length;o++)a=r[o],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var c=o.createContext({}),p=function(e){var t=o.useContext(c),a=t;return e&&(a="function"==typeof e?e(t):l(l({},t),e)),a},i=function(e){var t=p(e.components);return o.createElement(c.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},g=o.forwardRef((function(e,t){var a=e.components,n=e.mdxType,r=e.originalType,c=e.parentName,i=s(e,["components","mdxType","originalType","parentName"]),g=p(a),m=n,d=g["".concat(c,".").concat(m)]||g[m]||u[m]||r;return a?o.createElement(d,l(l({ref:t},i),{},{components:a})):o.createElement(d,l({ref:t},i))}));function m(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var r=a.length,l=new Array(r);l[0]=g;var s={};for(var c in t)hasOwnProperty.call(t,c)&&(s[c]=t[c]);s.originalType=e,s.mdxType="string"==typeof e?e:n,l[1]=s;for(var p=2;p<r;p++)l[p]=a[p];return o.createElement.apply(null,l)}return o.createElement.apply(null,a)}g.displayName="MDXCreateElement"},3998:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>c,contentTitle:()=>l,default:()=>u,frontMatter:()=>r,metadata:()=>s,toc:()=>p});var o=a(87462),n=(a(67294),a(3905));const r={id:"FlowLogs",title:"FLow Logs"},l=void 0,s={unversionedId:"aws/resources/EC2/FlowLogs",id:"aws/resources/EC2/FlowLogs",title:"FLow Logs",description:"Provides a Flow Logs",source:"@site/docs/aws/resources/EC2/FlowLogs.md",sourceDirName:"aws/resources/EC2",slug:"/aws/resources/EC2/FlowLogs",permalink:"/docs/aws/resources/EC2/FlowLogs",draft:!1,tags:[],version:"current",frontMatter:{id:"FlowLogs",title:"FLow Logs"},sidebar:"docs",previous:{title:"Elastic Ip Address Association",permalink:"/docs/aws/resources/EC2/ElasticIpAddressAssociation"},next:{title:"AMI",permalink:"/docs/aws/resources/EC2/Image"}},c={},p=[{value:"FlowLogs attached to a VPC",id:"flowlogs-attached-to-a-vpc",level:3},{value:"FlowLogs attached to a subnet",id:"flowlogs-attached-to-a-subnet",level:3},{value:"FlowLogs attached to a network interface",id:"flowlogs-attached-to-a-network-interface",level:3},{value:"Examples",id:"examples",level:3},{value:"Properties",id:"properties",level:3},{value:"Dependencies",id:"dependencies",level:3},{value:"Listing",id:"listing",level:2}],i={toc:p};function u(e){let{components:t,...a}=e;return(0,n.kt)("wrapper",(0,o.Z)({},i,a,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("p",null,"Provides a ",(0,n.kt)("a",{parentName:"p",href:"https://console.aws.amazon.com/vpc/home?#vpcs:"},"Flow Logs")),(0,n.kt)("h3",{id:"flowlogs-attached-to-a-vpc"},"FlowLogs attached to a VPC"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "FlowLogs",\n    group: "EC2",\n    name: "flowlog::dns_vpc",\n    properties: ({}) => ({\n      TrafficType: "ALL",\n      MaxAggregationInterval: 600,\n    }),\n    dependencies: ({}) => ({\n      vpc: "dns_vpc",\n      iamRole: "dev_endpoint_vpc_flow_logs",\n      cloudWatchLogGroup: "dns_vpc",\n    }),\n  },\n];\n')),(0,n.kt)("h3",{id:"flowlogs-attached-to-a-subnet"},"FlowLogs attached to a subnet"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "FlowLogs",\n    group: "EC2",\n    name: "fl4vpc",\n    properties: ({}) => ({\n      TrafficType: "ALL",\n      MaxAggregationInterval: 60,\n    }),\n    dependencies: ({ config }) => ({\n      subnet: `project-vpc::project-subnet-public1-${config.region}a`,\n      iamRole: "flow-role",\n      cloudWatchLogGroup: "flowlog",\n    }),\n  },\n];\n')),(0,n.kt)("h3",{id:"flowlogs-attached-to-a-network-interface"},"FlowLogs attached to a network interface"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "FlowLogs",\n    group: "EC2",\n    name: "flowlog-interface",\n    properties: ({}) => ({\n      TrafficType: "ALL",\n      MaxAggregationInterval: 60,\n    }),\n    dependencies: ({}) => ({\n      networkInterface: "eni::machine",\n      iamRole: "flow-role",\n      cloudWatchLogGroup: "flowlog",\n    }),\n  },\n];\n')),(0,n.kt)("h3",{id:"examples"},"Examples"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("p",{parentName:"li"},(0,n.kt)("a",{parentName:"p",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/flow-logs/flow-logs-vpc"},"flow log on vpc"))),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("p",{parentName:"li"},(0,n.kt)("a",{parentName:"p",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/flow-logs/flow-logs-subnet"},"flow log on subnet"))),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("p",{parentName:"li"},(0,n.kt)("a",{parentName:"p",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/flow-logs/flow-logs-interface"},"flow log on interface"))),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("p",{parentName:"li"},(0,n.kt)("a",{parentName:"p",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/flow-logs/flow-logs-tgw"},"flow log on transit gateway"))),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("p",{parentName:"li"},(0,n.kt)("a",{parentName:"p",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/flow-logs/flow-logs-vpc-s3"},"flow log on vpc, s3 destination"))),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("p",{parentName:"li"},(0,n.kt)("a",{parentName:"p",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/aws-samples/aws-network-hub-for-terraform"},"aws-samples/aws-network-hub-for-terraform"))),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("p",{parentName:"li"},(0,n.kt)("a",{parentName:"p",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/aws-samples/hub-and-spoke-with-shared-services-vpc-terraform"},"hub-and-spoke-with-shared-services-vpc-terraform")))),(0,n.kt)("h3",{id:"properties"},"Properties"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/createflowlogscommandinput.html"},"CreateFlowLogsCommandInput"))),(0,n.kt)("h3",{id:"dependencies"},"Dependencies"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"/docs/aws/resources/CloudWatchLogs/LogGroup"},"CloudWatchLogs LogGroup")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/Vpc"},"EC2 Vpc")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/Subnet"},"EC2 Subnet")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/NetworkInterface"},"EC2 Network Interface")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/TransitGateway"},"EC2 TransitGateway")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"/docs/aws/resources/IAM/Role"},"IAM Role")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"/docs/aws/resources/S3/Bucket"},"S3 Bucket"))),(0,n.kt)("h2",{id:"listing"},"Listing"),(0,n.kt)("p",null,"List the flow logs with the ",(0,n.kt)("em",{parentName:"p"},"FlowLogs")," filter:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t FlowLogs\n")),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-txt"},'Listing resources on 1 provider: aws\n\u2713 aws us-east-1\n  \u2713 Initialising\n  \u2713 Listing 1/1\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 1 EC2::FlowLogs from aws                                                                 \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: fl4vpc                                                                             \u2502\n\u2502 managedByUs: Yes                                                                         \u2502\n\u2502 live:                                                                                    \u2502\n\u2502   CreationTime: 2022-07-13T13:36:47.622Z                                                 \u2502\n\u2502   DeliverLogsPermissionArn: arn:aws:iam::840541460064:role/flow-role                     \u2502\n\u2502   DeliverLogsStatus: SUCCESS                                                             \u2502\n\u2502   FlowLogId: fl-041f441c486dde383                                                        \u2502\n\u2502   FlowLogStatus: ACTIVE                                                                  \u2502\n\u2502   LogGroupName: flowlog                                                                  \u2502\n\u2502   ResourceId: vpc-0e407ff55068ed00e                                                      \u2502\n\u2502   TrafficType: ALL                                                                       \u2502\n\u2502   LogDestinationType: cloud-watch-logs                                                   \u2502\n\u2502   LogFormat: ${version} ${account-id} ${interface-id} ${srcaddr} ${dstaddr} ${srcport} \u2026 \u2502\n\u2502   Tags:                                                                                  \u2502\n\u2502     - Key: gc-created-by-provider                                                        \u2502\n\u2502       Value: aws                                                                         \u2502\n\u2502     - Key: gc-managed-by                                                                 \u2502\n\u2502       Value: grucloud                                                                    \u2502\n\u2502     - Key: gc-project-name                                                               \u2502\n\u2502       Value: flow-logs-vpc                                                               \u2502\n\u2502     - Key: gc-stage                                                                      \u2502\n\u2502       Value: dev                                                                         \u2502\n\u2502     - Key: Name                                                                          \u2502\n\u2502       Value: fl4vpc                                                                      \u2502\n\u2502   MaxAggregationInterval: 60                                                             \u2502\n\u2502                                                                                          \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\nList Summary:\nProvider: aws\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 aws                                                                                     \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 EC2::FlowLogs \u2502 fl4vpc                                                                  \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n1 resource, 1 type, 1 provider\nCommand "gc l -t FlowLogs" executed in 4s, 111 MB\n')))}u.isMDXComponent=!0}}]);