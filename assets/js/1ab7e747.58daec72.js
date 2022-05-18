"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[8702],{3905:function(e,n,r){r.d(n,{Zo:function(){return i},kt:function(){return m}});var t=r(67294);function a(e,n,r){return n in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}function o(e,n){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),r.push.apply(r,t)}return r}function s(e){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?o(Object(r),!0).forEach((function(n){a(e,n,r[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))}))}return e}function l(e,n){if(null==e)return{};var r,t,a=function(e,n){if(null==e)return{};var r,t,a={},o=Object.keys(e);for(t=0;t<o.length;t++)r=o[t],n.indexOf(r)>=0||(a[r]=e[r]);return a}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(t=0;t<o.length;t++)r=o[t],n.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var u=t.createContext({}),c=function(e){var n=t.useContext(u),r=n;return e&&(r="function"==typeof e?e(n):s(s({},n),e)),r},i=function(e){var n=c(e.components);return t.createElement(u.Provider,{value:n},e.children)},p={inlineCode:"code",wrapper:function(e){var n=e.children;return t.createElement(t.Fragment,{},n)}},d=t.forwardRef((function(e,n){var r=e.components,a=e.mdxType,o=e.originalType,u=e.parentName,i=l(e,["components","mdxType","originalType","parentName"]),d=c(r),m=a,g=d["".concat(u,".").concat(m)]||d[m]||p[m]||o;return r?t.createElement(g,s(s({ref:n},i),{},{components:r})):t.createElement(g,s({ref:n},i))}));function m(e,n){var r=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var o=r.length,s=new Array(o);s[0]=d;var l={};for(var u in n)hasOwnProperty.call(n,u)&&(l[u]=n[u]);l.originalType=e,l.mdxType="string"==typeof e?e:a,s[1]=l;for(var c=2;c<o;c++)s[c]=r[c];return t.createElement.apply(null,s)}return t.createElement.apply(null,r)}d.displayName="MDXCreateElement"},13044:function(e,n,r){r.r(n),r.d(n,{frontMatter:function(){return l},contentTitle:function(){return u},metadata:function(){return c},toc:function(){return i},default:function(){return d}});var t=r(87462),a=r(63366),o=(r(67294),r(3905)),s=["components"],l={id:"NodeGroup",title:"Node Group"},u=void 0,c={unversionedId:"aws/resources/EKS/NodeGroup",id:"aws/resources/EKS/NodeGroup",isDocsHomePage:!1,title:"Node Group",description:"Provides an EKS Node Group.",source:"@site/docs/aws/resources/EKS/NodeGroup.md",sourceDirName:"aws/resources/EKS",slug:"/aws/resources/EKS/NodeGroup",permalink:"/docs/aws/resources/EKS/NodeGroup",tags:[],version:"current",frontMatter:{id:"NodeGroup",title:"Node Group"},sidebar:"docs",previous:{title:"Cluster",permalink:"/docs/aws/resources/EKS/Cluster"},next:{title:"Listener",permalink:"/docs/aws/resources/ELBv2/Listener"}},i=[{value:"Examples",id:"examples",children:[{value:"Create a Node Group",id:"create-a-node-group",children:[],level:3}],level:2},{value:"Source Code Examples",id:"source-code-examples",children:[],level:2},{value:"Properties",id:"properties",children:[],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"Listing",id:"listing",children:[],level:2}],p={toc:i};function d(e){var n=e.components,r=(0,a.Z)(e,s);return(0,o.kt)("wrapper",(0,t.Z)({},p,r,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Provides an ",(0,o.kt)("a",{parentName:"p",href:"https://docs.aws.amazon.com/eks/latest/userguide/managed-node-groups.html"},"EKS Node Group"),"."),(0,o.kt)("h2",{id:"examples"},"Examples"),(0,o.kt)("h3",{id:"create-a-node-group"},"Create a Node Group"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "NodeGroup",\n    group: "EKS",\n    name: "ng-1",\n    properties: ({}) => ({\n      capacityType: "ON_DEMAND",\n      scalingConfig: {\n        minSize: 1,\n        maxSize: 1,\n        desiredSize: 1,\n      },\n      labels: {\n        "alpha.eksctl.io/cluster-name": "my-cluster",\n        "alpha.eksctl.io/nodegroup-name": "ng-1",\n      },\n    }),\n    dependencies: () => ({\n      cluster: "my-cluster",\n      subnets: ["SubnetPublicUSEAST1D", "SubnetPublicUSEAST1F"],\n      role: "eksctl-my-cluster-nodegroup-ng-1-NodeInstanceRole-1LT5OVYUG2SEI",\n      launchTemplate: "eksctl-my-cluster-nodegroup-ng-1",\n    }),\n  },\n];\n')),(0,o.kt)("h2",{id:"source-code-examples"},"Source Code Examples"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/EKS/eks-simple"},"eks simple")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/EKS/eks-load-balancer"},"eks with load balancer"))),(0,o.kt)("h2",{id:"properties"},"Properties"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-eks/interfaces/createnodegroupcommandinput.html"},"CreateNodegroupCommandInput"))),(0,o.kt)("h2",{id:"dependencies"},"Dependencies"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/aws/resources/EKS/Cluster"},"Cluster")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/Subnet"},"Subnet")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/LaunchTemplate"},"LaunchTemplate")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/aws/resources/IAM/Role"},"Role"))),(0,o.kt)("h2",{id:"listing"},"Listing"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t EKS::NodeGroup\n")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-sh"},'Listing resources on 1 provider: aws\n\u2713 aws\n  \u2713 Initialising\n  \u2713 Listing 19/19\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 1 EKS::NodeGroup from aws                                                                 \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: ng-1                                                                                \u2502\n\u2502 managedByUs: Yes                                                                          \u2502\n\u2502 live:                                                                                     \u2502\n\u2502   nodegroupName: ng-1                                                                     \u2502\n\u2502   nodegroupArn: arn:aws:eks:us-east-1:1234567890:nodegroup/my-cluster/ng-1/eabe56e1-9a\u2026 \u2502\n\u2502   clusterName: my-cluster                                                                 \u2502\n\u2502   version: 1.20                                                                           \u2502\n\u2502   releaseVersion: 1.20.10-20211013                                                        \u2502\n\u2502   createdAt: 2021-10-23T15:27:06.791Z                                                     \u2502\n\u2502   modifiedAt: 2021-10-23T15:38:20.659Z                                                    \u2502\n\u2502   status: ACTIVE                                                                          \u2502\n\u2502   capacityType: ON_DEMAND                                                                 \u2502\n\u2502   scalingConfig:                                                                          \u2502\n\u2502     minSize: 1                                                                            \u2502\n\u2502     maxSize: 1                                                                            \u2502\n\u2502     desiredSize: 1                                                                        \u2502\n\u2502   instanceTypes:                                                                          \u2502\n\u2502     - "t3.medium"                                                                         \u2502\n\u2502   subnets:                                                                                \u2502\n\u2502     - "subnet-054f90a7bcd3875b8"                                                          \u2502\n\u2502     - "subnet-0666abe5c8cb6dc15"                                                          \u2502\n\u2502   amiType: AL2_x86_64                                                                     \u2502\n\u2502   nodeRole: arn:aws:iam::1234567890:role/eksctl-my-cluster-nodegroup-ng-1-NodeInstance\u2026 \u2502\n\u2502   labels:                                                                                 \u2502\n\u2502     alpha.eksctl.io/cluster-name: my-cluster                                              \u2502\n\u2502     alpha.eksctl.io/nodegroup-name: ng-1                                                  \u2502\n\u2502   resources:                                                                              \u2502\n\u2502     autoScalingGroups:                                                                    \u2502\n\u2502       - name: eks-eabe56e1-9ac4-c7f0-26bf-90bf1bcc66bc                                    \u2502\n\u2502     remoteAccessSecurityGroup: null                                                       \u2502\n\u2502   diskSize: null                                                                          \u2502\n\u2502   health:                                                                                 \u2502\n\u2502     issues: []                                                                            \u2502\n\u2502   updateConfig:                                                                           \u2502\n\u2502     maxUnavailable: 1                                                                     \u2502\n\u2502     maxUnavailablePercentage: null                                                        \u2502\n\u2502   launchTemplate:                                                                         \u2502\n\u2502     name: eksctl-my-cluster-nodegroup-ng-1                                                \u2502\n\u2502     version: 1                                                                            \u2502\n\u2502     id: lt-0045f65b3d11014b2                                                              \u2502\n\u2502   tags:                                                                                   \u2502\n\u2502     gc-managed-by: grucloud                                                               \u2502\n\u2502     gc-project-name: ex-eks-mod                                                           \u2502\n\u2502     gc-stage: dev                                                                         \u2502\n\u2502     gc-created-by-provider: aws                                                           \u2502\n\u2502     Name: ng-1                                                                            \u2502\n\u2502                                                                                           \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\nList Summary:\nProvider: aws\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 aws                                                                                      \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 EKS::NodeGroup \u2502 ng-1                                                                    \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n1 resource, 1 type, 1 provider\nCommand "gc l -t NodeGroup" executed in 11s\n')))}d.isMDXComponent=!0}}]);