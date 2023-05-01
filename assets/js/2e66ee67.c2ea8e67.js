"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[82843],{3905:(e,n,t)=>{t.d(n,{Zo:()=>l,kt:()=>d});var a=t(67294);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function c(e,n){if(null==e)return{};var t,a,r=function(e,n){if(null==e)return{};var t,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)t=o[a],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)t=o[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var s=a.createContext({}),u=function(e){var n=a.useContext(s),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},l=function(e){var n=u(e.components);return a.createElement(s.Provider,{value:n},e.children)},p="mdxType",m={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},f=a.forwardRef((function(e,n){var t=e.components,r=e.mdxType,o=e.originalType,s=e.parentName,l=c(e,["components","mdxType","originalType","parentName"]),p=u(t),f=r,d=p["".concat(s,".").concat(f)]||p[f]||m[f]||o;return t?a.createElement(d,i(i({ref:n},l),{},{components:t})):a.createElement(d,i({ref:n},l))}));function d(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var o=t.length,i=new Array(o);i[0]=f;var c={};for(var s in n)hasOwnProperty.call(n,s)&&(c[s]=n[s]);c.originalType=e,c[p]="string"==typeof e?e:r,i[1]=c;for(var u=2;u<o;u++)i[u]=t[u];return a.createElement.apply(null,i)}return a.createElement.apply(null,t)}f.displayName="MDXCreateElement"},48247:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>s,contentTitle:()=>i,default:()=>m,frontMatter:()=>o,metadata:()=>c,toc:()=>u});var a=t(87462),r=(t(67294),t(3905));const o={id:"LaunchConfiguration",title:"Launch Configuration"},i=void 0,c={unversionedId:"aws/resources/AutoScaling/LaunchConfiguration",id:"aws/resources/AutoScaling/LaunchConfiguration",title:"Launch Configuration",description:"Manages an Launch Configuration.",source:"@site/docs/aws/resources/AutoScaling/LaunchConfiguration.md",sourceDirName:"aws/resources/AutoScaling",slug:"/aws/resources/AutoScaling/LaunchConfiguration",permalink:"/docs/aws/resources/AutoScaling/LaunchConfiguration",draft:!1,tags:[],version:"current",frontMatter:{id:"LaunchConfiguration",title:"Launch Configuration"},sidebar:"docs",previous:{title:"AutoScaling Group",permalink:"/docs/aws/resources/AutoScaling/AutoScalingGroup"},next:{title:"BackupPlan",permalink:"/docs/aws/resources/Backup/BackupPlan"}},s={},u=[{value:"Example",id:"example",level:2},{value:"Properties",id:"properties",level:2},{value:"Dependencies",id:"dependencies",level:2},{value:"Used By",id:"used-by",level:2},{value:"Example",id:"example-1",level:2},{value:"List",id:"list",level:2}],l={toc:u},p="wrapper";function m(e){let{components:n,...t}=e;return(0,r.kt)(p,(0,a.Z)({},l,t,{components:n,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"Manages an ",(0,r.kt)("a",{parentName:"p",href:"https://console.aws.amazon.com/ec2/v2/home?#LaunchConfigurations"},"Launch Configuration"),"."),(0,r.kt)("h2",{id:"example"},"Example"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "LaunchConfiguration",\n    group: "AutoScaling",\n    properties: ({}) => ({\n      LaunchConfigurationName:\n        "amazon-ecs-cli-setup-my-cluster-EcsInstanceLc-S7O7EVIS98IV",\n      InstanceType: "t2.small",\n      ImageId: "ami-0e43fd2a4ef14f476",\n      UserData:\n        \'Content-Type: multipart/mixed; boundary="1f15191e3fe7ebb2094282e32ea108217183e16f27f6e8aa0b886ee04ec3"\\nMIME-Version: 1.0\\n\\n--1f15191e3fe7ebb2094282e32ea108217183e16f27f6e8aa0b886ee04ec3\\nContent-Type: text/text/x-shellscript; charset="utf-8"\\nMime-Version: 1.0\\n\\n\\n#!/bin/bash\\necho ECS_CLUSTER=my-cluster >> /etc/ecs/ecs.config\\necho \\\'ECS_CONTAINER_INSTANCE_TAGS={"my-tag":"my-value"}\\\' >> /etc/ecs/ecs.config\\n--1f15191e3fe7ebb2094282e32ea108217183e16f27f6e8aa0b886ee04ec3--\',\n      InstanceMonitoring: {\n        Enabled: true,\n      },\n      BlockDeviceMappings: [],\n      EbsOptimized: false,\n      AssociatePublicIpAddress: true,\n    }),\n    dependencies: () => ({\n      instanceProfile:\n        "amazon-ecs-cli-setup-my-cluster-EcsInstanceProfile-ESJBS99JRKVK",\n      securityGroups: ["EcsSecurityGroup"],\n    }),\n  },\n  {\n    type: "SecurityGroup",\n    group: "EC2",\n    name: "EcsSecurityGroup",\n    properties: ({}) => ({\n      Description: "ECS Allowed Ports",\n      Tags: [\n        {\n          Key: "my-tag",\n          Value: "my-value",\n        },\n      ],\n    }),\n    dependencies: () => ({\n      vpc: "Vpc",\n    }),\n  },\n  {\n    type: "Role",\n    group: "IAM",\n    name: "amazon-ecs-cli-setup-my-cluster-EcsInstanceRole-14B4COKG08FT6",\n    properties: ({}) => ({\n      Path: "/",\n      AssumeRolePolicyDocument: {\n        Version: "2012-10-17",\n        Statement: [\n          {\n            Effect: "Allow",\n            Principal: {\n              Service: "ec2.amazonaws.com",\n            },\n            Action: "sts:AssumeRole",\n          },\n        ],\n      },\n      Tags: [\n        {\n          Key: "my-tag",\n          Value: "my-value",\n        },\n      ],\n    }),\n    dependencies: () => ({\n      policies: ["AmazonEC2ContainerServiceforEC2Role"],\n    }),\n  },\n  {\n    type: "Policy",\n    group: "IAM",\n    name: "AmazonEC2ContainerServiceforEC2Role",\n    readOnly: true,\n    properties: ({}) => ({\n      Arn: "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role",\n    }),\n  },\n  {\n    type: "InstanceProfile",\n    group: "IAM",\n    name: "amazon-ecs-cli-setup-my-cluster-EcsInstanceProfile-ESJBS99JRKVK",\n    dependencies: () => ({\n      roles: ["amazon-ecs-cli-setup-my-cluster-EcsInstanceRole-14B4COKG08FT6"],\n    }),\n  },\n];\n')),(0,r.kt)("h2",{id:"properties"},"Properties"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-auto-scaling/interfaces/createlaunchconfigurationcommandinput.html"},"CreateLaunchConfigurationCommandInput"))),(0,r.kt)("h2",{id:"dependencies"},"Dependencies"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/IAM/InstanceProfile"},"InstanceProfile")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/KeyPair"},"KeyPair")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/Image"},"Image")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/SecurityGroup"},"SecurityGroup"))),(0,r.kt)("h2",{id:"used-by"},"Used By"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/AutoScaling/AutoScalingGroup"},"AutoScaling Group"))),(0,r.kt)("h2",{id:"example-1"},"Example"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/ECS/ecs-simple"},"Simple ECS"))),(0,r.kt)("h2",{id:"list"},"List"),(0,r.kt)("p",null,"The Launch Configuration can be filtered with the ",(0,r.kt)("em",{parentName:"p"},"LaunchConfiguration")," type:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-sh"},"gc list --types LaunchConfiguration\n")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-txt"},'Listing resources on 1 provider: aws\n\u2713 aws\n  \u2713 Initialising\n  \u2713 Listing 9/9\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 1 AutoScaling::LaunchConfiguration from aws                                    \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: amazon-ecs-cli-setup-my-cluster-EcsInstanceLc-S7O7EVIS98IV               \u2502\n\u2502 managedByUs: Yes                                                               \u2502\n\u2502 live:                                                                          \u2502\n\u2502   LaunchConfigurationName: amazon-ecs-cli-setup-my-cluster-EcsInstanceLc-S7O7\u2026 \u2502\n\u2502   LaunchConfigurationARN: arn:aws:autoscaling:us-east-1:840541460064:launchCo\u2026 \u2502\n\u2502   ImageId: ami-0e43fd2a4ef14f476                                               \u2502\n\u2502   KeyName:                                                                     \u2502\n\u2502   SecurityGroups:                                                              \u2502\n\u2502     - "sg-03502c1a2fb9d142d"                                                   \u2502\n\u2502   ClassicLinkVPCSecurityGroups: []                                             \u2502\n\u2502   UserData: Q29udGVudC1UeXBlOiBtdWx0aXBhcnQvbWl4ZWQ7IGJvdW5kYXJ5PSIxZjE1MTkxZ\u2026 \u2502\n\u2502   InstanceType: t2.small                                                       \u2502\n\u2502   KernelId:                                                                    \u2502\n\u2502   RamdiskId:                                                                   \u2502\n\u2502   BlockDeviceMappings: []                                                      \u2502\n\u2502   InstanceMonitoring:                                                          \u2502\n\u2502     Enabled: true                                                              \u2502\n\u2502   IamInstanceProfile: amazon-ecs-cli-setup-my-cluster-EcsInstanceProfile-ESJB\u2026 \u2502\n\u2502   CreatedTime: 2021-10-31T20:17:49.588Z                                        \u2502\n\u2502   EbsOptimized: false                                                          \u2502\n\u2502   AssociatePublicIpAddress: true                                               \u2502\n\u2502                                                                                \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\nList Summary:\nProvider: aws\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 aws                                                                           \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 AutoScaling::LaunchConfiguration \u2502 amazon-ecs-cli-setup-my-cluster-EcsInstan\u2026 \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n1 resource, 1 type, 1 provider\nCommand "gc l -t LaunchConfiguration" executed in 7s\n')))}m.isMDXComponent=!0}}]);