"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[68911],{3905:(e,t,a)=>{a.d(t,{Zo:()=>o,kt:()=>m});var n=a(67294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function s(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function l(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?s(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):s(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function i(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},s=Object.keys(e);for(n=0;n<s.length;n++)a=s[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(n=0;n<s.length;n++)a=s[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var c=n.createContext({}),p=function(e){var t=n.useContext(c),a=t;return e&&(a="function"==typeof e?e(t):l(l({},t),e)),a},o=function(e){var t=p(e.components);return n.createElement(c.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,s=e.originalType,c=e.parentName,o=i(e,["components","mdxType","originalType","parentName"]),d=p(a),m=r,g=d["".concat(c,".").concat(m)]||d[m]||u[m]||s;return a?n.createElement(g,l(l({ref:t},o),{},{components:a})):n.createElement(g,l({ref:t},o))}));function m(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var s=a.length,l=new Array(s);l[0]=d;var i={};for(var c in t)hasOwnProperty.call(t,c)&&(i[c]=t[c]);i.originalType=e,i.mdxType="string"==typeof e?e:r,l[1]=i;for(var p=2;p<s;p++)l[p]=a[p];return n.createElement.apply(null,l)}return n.createElement.apply(null,a)}d.displayName="MDXCreateElement"},45876:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>c,contentTitle:()=>l,default:()=>u,frontMatter:()=>s,metadata:()=>i,toc:()=>p});var n=a(87462),r=(a(67294),a(3905));const s={id:"Service",title:"Service"},l=void 0,i={unversionedId:"aws/resources/ECS/Service",id:"aws/resources/ECS/Service",title:"Service",description:"Manages an ECS Service.",source:"@site/docs/aws/resources/ECS/Service.md",sourceDirName:"aws/resources/ECS",slug:"/aws/resources/ECS/Service",permalink:"/docs/aws/resources/ECS/Service",draft:!1,tags:[],version:"current",frontMatter:{id:"Service",title:"Service"},sidebar:"docs",previous:{title:"Cluster",permalink:"/docs/aws/resources/ECS/Cluster"},next:{title:"Task",permalink:"/docs/aws/resources/ECS/Task"}},c={},p=[{value:"Sample code",id:"sample-code",level:2},{value:"Properties",id:"properties",level:2},{value:"Dependencies",id:"dependencies",level:2},{value:"Used By",id:"used-by",level:2},{value:"Full Examples",id:"full-examples",level:2},{value:"List",id:"list",level:2}],o={toc:p};function u(e){let{components:t,...a}=e;return(0,r.kt)("wrapper",(0,n.Z)({},o,a,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"Manages an ",(0,r.kt)("a",{parentName:"p",href:"https://console.aws.amazon.com/ecs/home?#/clusters"},"ECS Service"),"."),(0,r.kt)("h2",{id:"sample-code"},"Sample code"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Service",\n    group: "ECS",\n    properties: () => ({\n      serviceName: "service-nginx",\n      launchType: "EC2",\n      desiredCount: 2,\n      deploymentConfiguration: {\n        deploymentCircuitBreaker: {\n          enable: false,\n          rollback: false,\n        },\n        maximumPercent: 200,\n        minimumHealthyPercent: 100,\n      },\n      placementConstraints: [],\n      placementStrategy: [\n        {\n          type: "spread",\n          field: "attribute:ecs.availability-zone",\n        },\n        {\n          type: "spread",\n          field: "instanceId",\n        },\n      ],\n      schedulingStrategy: "REPLICA",\n      enableECSManagedTags: true,\n      enableExecuteCommand: false,\n    }),\n    dependencies: () => ({\n      cluster: "cluster",\n      taskDefinition: "nginx",\n    }),\n  },\n];\n')),(0,r.kt)("h2",{id:"properties"},"Properties"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ecs/interfaces/createservicecommandinput.html"},"CreateServiceCommandInput"))),(0,r.kt)("h2",{id:"dependencies"},"Dependencies"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/ECS/Cluster"},"Cluster")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/ECS/TaskDefinition"},"TaskDefinition")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/ElasticLoadBalancingV2/TargetGroup"},"ElasticLoadBalancingV2 TargetGroup")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/SecurityGroup"},"Security Group")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/Subnet"},"Subnet"))),(0,r.kt)("h2",{id:"used-by"},"Used By"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/ApplicationAutoScaling/Target"},"ApplicationAutoScaling Target")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/CodeDeploy/DeploymentGroup"},"CodeDeploy DeploymentGroup")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/ECS/TaskSet"},"ECS TaskSet"))),(0,r.kt)("h2",{id:"full-examples"},"Full Examples"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},(0,r.kt)("a",{parentName:"p",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/ECS/ecs-simple"},"Simple example"))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"[aws-cdk-examples/application-load-balancer-fargate-service]","((",(0,r.kt)("a",{parentName:"p",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/aws-cdk-examples/application-load-balancer-fargate-service"},"https://github.com/grucloud/grucloud/tree/main/examples/aws/aws-cdk-examples/application-load-balancer-fargate-service"),")")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"[serverless-patterns/apigw-fargate-cdk]","((",(0,r.kt)("a",{parentName:"p",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/apigw-fargate-cdk"},"https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/apigw-fargate-cdk"),")")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"[serverless-patterns/apigw-vpclink-pvt-alb]","((",(0,r.kt)("a",{parentName:"p",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/apigw-vpclink-pvt-alb"},"https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/apigw-vpclink-pvt-alb"),")")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"[serverless-patterns/fargate-aurora-serverless-cdk]","((",(0,r.kt)("a",{parentName:"p",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/fargate-aurora-serverless-cdk"},"https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/fargate-aurora-serverless-cdk"),")")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"[serverless-patterns/fargate-eventbridge]","((",(0,r.kt)("a",{parentName:"p",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/fargate-eventbridge"},"https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/fargate-eventbridge"),")"))),(0,r.kt)("h2",{id:"list"},"List"),(0,r.kt)("p",null,"The ECS services can be filtered with the ",(0,r.kt)("em",{parentName:"p"},"Service")," type:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t ECS::Service\n")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-txt"},'Listing resources on 1 provider: aws\n\u2713 aws\n  \u2713 Initialising\n  \u2713 Listing 25/25\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 1 ECS::Service from aws                                                       \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: service-nginx                                                           \u2502\n\u2502 managedByUs: Yes                                                              \u2502\n\u2502 live:                                                                         \u2502\n\u2502   serviceArn: arn:aws:ecs:eu-west-2:840541460064:service/cluster/service-ngi\u2026 \u2502\n\u2502   serviceName: service-nginx                                                  \u2502\n\u2502   clusterArn: arn:aws:ecs:eu-west-2:840541460064:cluster/cluster              \u2502\n\u2502   loadBalancers: []                                                           \u2502\n\u2502   serviceRegistries: []                                                       \u2502\n\u2502   status: ACTIVE                                                              \u2502\n\u2502   desiredCount: 1                                                             \u2502\n\u2502   runningCount: 1                                                             \u2502\n\u2502   pendingCount: 0                                                             \u2502\n\u2502   launchType: EC2                                                             \u2502\n\u2502   taskDefinition: arn:aws:ecs:eu-west-2:840541460064:task-definition/nginx:47 \u2502\n\u2502   deploymentConfiguration:                                                    \u2502\n\u2502     deploymentCircuitBreaker:                                                 \u2502\n\u2502       enable: false                                                           \u2502\n\u2502       rollback: false                                                         \u2502\n\u2502     maximumPercent: 200                                                       \u2502\n\u2502     minimumHealthyPercent: 100                                                \u2502\n\u2502   deployments:                                                                \u2502\n\u2502     - id: ecs-svc/7147023744074056707                                         \u2502\n\u2502       status: PRIMARY                                                         \u2502\n\u2502       taskDefinition: arn:aws:ecs:eu-west-2:840541460064:task-definition/ngi\u2026 \u2502\n\u2502       desiredCount: 1                                                         \u2502\n\u2502       pendingCount: 0                                                         \u2502\n\u2502       runningCount: 1                                                         \u2502\n\u2502       failedTasks: 0                                                          \u2502\n\u2502       createdAt: 2021-09-03T13:41:13.681Z                                     \u2502\n\u2502       updatedAt: 2021-09-03T13:42:33.232Z                                     \u2502\n\u2502       launchType: EC2                                                         \u2502\n\u2502       rolloutState: COMPLETED                                                 \u2502\n\u2502       rolloutStateReason: ECS deployment ecs-svc/7147023744074056707 complet\u2026 \u2502\n\u2502   events:                                                                     \u2502\n\u2502     - id: 8d36c860-4f52-43e1-bf3a-5f47bbef71d4                                \u2502\n\u2502       createdAt: 2021-09-03T13:42:33.240Z                                     \u2502\n\u2502       message: (service service-nginx) has reached a steady state.            \u2502\n\u2502     - id: b05415fd-18e6-484c-bf97-342f1259e925                                \u2502\n\u2502       createdAt: 2021-09-03T13:42:33.239Z                                     \u2502\n\u2502       message: (service service-nginx) (deployment ecs-svc/71470237440740567\u2026 \u2502\n\u2502     - id: 17ca843b-e785-43c3-a4af-9b147f78dfa9                                \u2502\n\u2502       createdAt: 2021-09-03T13:42:22.559Z                                     \u2502\n\u2502       message: (service service-nginx) has started 1 tasks: (task c6cf491773\u2026 \u2502\n\u2502     - id: 59a6478b-ca2f-4b1f-acf8-3ca8ceb1eaa5                                \u2502\n\u2502       createdAt: 2021-09-03T13:41:21.065Z                                     \u2502\n\u2502       message: (service service-nginx) was unable to place a task because no\u2026 \u2502\n\u2502   createdAt: 2021-09-03T13:41:13.681Z                                         \u2502\n\u2502   placementConstraints: []                                                    \u2502\n\u2502   placementStrategy:                                                          \u2502\n\u2502     - type: spread                                                            \u2502\n\u2502       field: attribute:ecs.availability-zone                                  \u2502\n\u2502     - type: spread                                                            \u2502\n\u2502       field: instanceId                                                       \u2502\n\u2502   schedulingStrategy: REPLICA                                                 \u2502\n\u2502   tags:                                                                       \u2502\n\u2502     - key: gc-created-by-provider                                             \u2502\n\u2502       value: aws                                                              \u2502\n\u2502     - key: gc-managed-by                                                      \u2502\n\u2502       value: grucloud                                                         \u2502\n\u2502     - key: gc-project-name                                                    \u2502\n\u2502       value: example-grucloud-ecs-simple                                      \u2502\n\u2502     - key: gc-stage                                                           \u2502\n\u2502       value: dev                                                              \u2502\n\u2502     - key: Name                                                               \u2502\n\u2502       value: service-nginx                                                    \u2502\n\u2502   createdBy: arn:aws:iam::840541460064:root                                   \u2502\n\u2502   enableECSManagedTags: true                                                  \u2502\n\u2502   propagateTags: NONE                                                         \u2502\n\u2502   enableExecuteCommand: false                                                 \u2502\n\u2502                                                                               \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\nList Summary:\nProvider: aws\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 aws                                                                      \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 ECS::Service                   \u2502 service-nginx                           \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n1 resource, 1 type, 1 provider\nCommand "gc l -t Service" executed in 15s\n')))}u.isMDXComponent=!0}}]);