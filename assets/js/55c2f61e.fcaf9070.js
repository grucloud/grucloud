"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[40713],{3905:(e,t,a)=>{a.d(t,{Zo:()=>p,kt:()=>d});var r=a(67294);function n(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function s(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function l(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?s(Object(a),!0).forEach((function(t){n(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):s(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function u(e,t){if(null==e)return{};var a,r,n=function(e,t){if(null==e)return{};var a,r,n={},s=Object.keys(e);for(r=0;r<s.length;r++)a=s[r],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(r=0;r<s.length;r++)a=s[r],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var i=r.createContext({}),c=function(e){var t=r.useContext(i),a=t;return e&&(a="function"==typeof e?e(t):l(l({},t),e)),a},p=function(e){var t=c(e.components);return r.createElement(i.Provider,{value:t},e.children)},o={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var a=e.components,n=e.mdxType,s=e.originalType,i=e.parentName,p=u(e,["components","mdxType","originalType","parentName"]),m=c(a),d=n,g=m["".concat(i,".").concat(d)]||m[d]||o[d]||s;return a?r.createElement(g,l(l({ref:t},p),{},{components:a})):r.createElement(g,l({ref:t},p))}));function d(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var s=a.length,l=new Array(s);l[0]=m;var u={};for(var i in t)hasOwnProperty.call(t,i)&&(u[i]=t[i]);u.originalType=e,u.mdxType="string"==typeof e?e:n,l[1]=u;for(var c=2;c<s;c++)l[c]=a[c];return r.createElement.apply(null,l)}return r.createElement.apply(null,a)}m.displayName="MDXCreateElement"},90833:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>i,contentTitle:()=>l,default:()=>o,frontMatter:()=>s,metadata:()=>u,toc:()=>c});var r=a(87462),n=(a(67294),a(3905));const s={id:"Cluster",title:"Cluster"},l=void 0,u={unversionedId:"aws/resources/ECS/Cluster",id:"aws/resources/ECS/Cluster",title:"Cluster",description:"Manages an ECS Cluster.",source:"@site/docs/aws/resources/ECS/Cluster.md",sourceDirName:"aws/resources/ECS",slug:"/aws/resources/ECS/Cluster",permalink:"/docs/aws/resources/ECS/Cluster",draft:!1,tags:[],version:"current",frontMatter:{id:"Cluster",title:"Cluster"},sidebar:"docs",previous:{title:"CapacityProvider",permalink:"/docs/aws/resources/ECS/CapacityProvider"},next:{title:"Service",permalink:"/docs/aws/resources/ECS/Service"}},i={},c=[{value:"Sample code",id:"sample-code",level:2},{value:"Properties",id:"properties",level:2},{value:"Dependencies",id:"dependencies",level:2},{value:"Used By",id:"used-by",level:2},{value:"Full Examples",id:"full-examples",level:2},{value:"List",id:"list",level:2}],p={toc:c};function o(e){let{components:t,...a}=e;return(0,n.kt)("wrapper",(0,r.Z)({},p,a,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("p",null,"Manages an ",(0,n.kt)("a",{parentName:"p",href:"https://console.aws.amazon.com/ecs/home?#/clusters"},"ECS Cluster"),"."),(0,n.kt)("h2",{id:"sample-code"},"Sample code"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Cluster",\n    group: "ECS",\n    name: "cluster",\n    properties: () => ({\n      settings: [\n        {\n          name: "containerInsights",\n          value: "disabled",\n        },\n      ],\n    }),\n    dependencies: () => ({\n      capacityProviders: ["cp"],\n    }),\n  },\n];\n')),(0,n.kt)("h2",{id:"properties"},"Properties"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ecs/interfaces/createclustercommandinput.html"},"CreateClusterCommandInput"))),(0,n.kt)("h2",{id:"dependencies"},"Dependencies"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"/docs/aws/resources/ECS/CapacityProvider"},"Capacity Provider")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"/docs/aws/resources/KMS/Key"},"KMS Key"))),(0,n.kt)("h2",{id:"used-by"},"Used By"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"/docs/aws/resources/CodeDeploy/DeploymentGroup"},"CodeDeploy DeploymentGroup"))),(0,n.kt)("h2",{id:"full-examples"},"Full Examples"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("p",{parentName:"li"},(0,n.kt)("a",{parentName:"p",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/ECS/ecs-simple"},"Simple example"))),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("p",{parentName:"li"},"[aws-cdk-examples/application-load-balancer-fargate-service]","((",(0,n.kt)("a",{parentName:"p",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/aws-cdk-examples/application-load-balancer-fargate-service"},"https://github.com/grucloud/grucloud/tree/main/examples/aws/aws-cdk-examples/application-load-balancer-fargate-service"),")")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("p",{parentName:"li"},"[serverless-patterns/apigw-fargate-cdk]","((",(0,n.kt)("a",{parentName:"p",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/apigw-fargate-cdk"},"https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/apigw-fargate-cdk"),")")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("p",{parentName:"li"},"[serverless-patterns/apigw-vpclink-pvt-alb]","((",(0,n.kt)("a",{parentName:"p",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/apigw-vpclink-pvt-alb"},"https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/apigw-vpclink-pvt-alb"),")")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("p",{parentName:"li"},"[serverless-patterns/fargate-aurora-serverless-cdk]","((",(0,n.kt)("a",{parentName:"p",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/fargate-aurora-serverless-cdk"},"https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/fargate-aurora-serverless-cdk"),")")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("p",{parentName:"li"},"[serverless-patterns/fargate-eventbridge]","((",(0,n.kt)("a",{parentName:"p",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/fargate-eventbridge"},"https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/fargate-eventbridge"),")"))),(0,n.kt)("h2",{id:"list"},"List"),(0,n.kt)("p",null,"The clusters can be filtered with the ",(0,n.kt)("em",{parentName:"p"},"ECS::Cluster")," type:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t ECS::Cluster\n")),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-txt"},'Listing resources on 1 provider: aws\n\u2713 aws\n  \u2713 Initialising\n  \u2713 Listing 23/23\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 1 ECS::Cluster from aws                                                       \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: cluster                                                                 \u2502\n\u2502 managedByUs: Yes                                                              \u2502\n\u2502 live:                                                                         \u2502\n\u2502   clusterArn: arn:aws:ecs:eu-west-2:840541460064:cluster/cluster              \u2502\n\u2502   clusterName: cluster                                                        \u2502\n\u2502   status: ACTIVE                                                              \u2502\n\u2502   registeredContainerInstancesCount: 1                                        \u2502\n\u2502   runningTasksCount: 1                                                        \u2502\n\u2502   pendingTasksCount: 0                                                        \u2502\n\u2502   activeServicesCount: 1                                                      \u2502\n\u2502   statistics:                                                                 \u2502\n\u2502     - name: runningEC2TasksCount                                              \u2502\n\u2502       value: 1                                                                \u2502\n\u2502     - name: runningFargateTasksCount                                          \u2502\n\u2502       value: 0                                                                \u2502\n\u2502     - name: pendingEC2TasksCount                                              \u2502\n\u2502       value: 0                                                                \u2502\n\u2502     - name: pendingFargateTasksCount                                          \u2502\n\u2502       value: 0                                                                \u2502\n\u2502     - name: runningExternalTasksCount                                         \u2502\n\u2502       value: 0                                                                \u2502\n\u2502     - name: pendingExternalTasksCount                                         \u2502\n\u2502       value: 0                                                                \u2502\n\u2502     - name: activeEC2ServiceCount                                             \u2502\n\u2502       value: 1                                                                \u2502\n\u2502     - name: activeFargateServiceCount                                         \u2502\n\u2502       value: 0                                                                \u2502\n\u2502     - name: drainingEC2ServiceCount                                           \u2502\n\u2502       value: 0                                                                \u2502\n\u2502     - name: drainingFargateServiceCount                                       \u2502\n\u2502       value: 0                                                                \u2502\n\u2502     - name: activeExternalServiceCount                                        \u2502\n\u2502       value: 0                                                                \u2502\n\u2502     - name: drainingExternalServiceCount                                      \u2502\n\u2502       value: 0                                                                \u2502\n\u2502   tags:                                                                       \u2502\n\u2502     - key: gc-created-by-provider                                             \u2502\n\u2502       value: aws                                                              \u2502\n\u2502     - key: gc-managed-by                                                      \u2502\n\u2502       value: grucloud                                                         \u2502\n\u2502     - key: gc-project-name                                                    \u2502\n\u2502       value: example-grucloud-ecs-simple                                      \u2502\n\u2502     - key: gc-stage                                                           \u2502\n\u2502       value: dev                                                              \u2502\n\u2502     - key: Name                                                               \u2502\n\u2502       value: cluster                                                          \u2502\n\u2502   settings:                                                                   \u2502\n\u2502     - name: containerInsights                                                 \u2502\n\u2502       value: enabled                                                          \u2502\n\u2502   capacityProviders:                                                          \u2502\n\u2502     - "cp"                                                                    \u2502\n\u2502   defaultCapacityProviderStrategy: []                                         \u2502\n\u2502   attachments:                                                                \u2502\n\u2502     - id: 8c350eb4-7aa6-4881-8336-54abaeb534c1                                \u2502\n\u2502       type: asp                                                               \u2502\n\u2502       status: CREATED                                                         \u2502\n\u2502       details:                                                                \u2502\n\u2502         - name: capacityProviderName                                          \u2502\n\u2502           value: cp                                                           \u2502\n\u2502         - name: scalingPlanName                                               \u2502\n\u2502           value: ECSManagedAutoScalingPlan-3124ced1-b8c9-4225-bd28-0df041bed\u2026 \u2502\n\u2502   attachmentsStatus: UPDATE_COMPLETE                                          \u2502\n\u2502                                                                               \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\nList Summary:\nProvider: aws\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 aws                                                                      \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 ECS::Cluster                   \u2502 cluster                                 \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n1 resource, 1 type, 1 provider\n')))}o.isMDXComponent=!0}}]);