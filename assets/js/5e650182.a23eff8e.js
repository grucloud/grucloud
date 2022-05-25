"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[24247],{3905:function(e,t,n){n.d(t,{Zo:function(){return i},kt:function(){return m}});var r=n(67294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?s(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},s=Object.keys(e);for(r=0;r<s.length;r++)n=s[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(r=0;r<s.length;r++)n=s[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var u=r.createContext({}),c=function(e){var t=r.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},i=function(e){var t=c(e.components);return r.createElement(u.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,s=e.originalType,u=e.parentName,i=o(e,["components","mdxType","originalType","parentName"]),d=c(n),m=a,k=d["".concat(u,".").concat(m)]||d[m]||p[m]||s;return n?r.createElement(k,l(l({ref:t},i),{},{components:n})):r.createElement(k,l({ref:t},i))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var s=n.length,l=new Array(s);l[0]=d;var o={};for(var u in t)hasOwnProperty.call(t,u)&&(o[u]=t[u]);o.originalType=e,o.mdxType="string"==typeof e?e:a,l[1]=o;for(var c=2;c<s;c++)l[c]=n[c];return r.createElement.apply(null,l)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},23198:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return o},contentTitle:function(){return u},metadata:function(){return c},toc:function(){return i},default:function(){return d}});var r=n(87462),a=n(63366),s=(n(67294),n(3905)),l=["components"],o={id:"Cluster",title:"Cluster"},u=void 0,c={unversionedId:"aws/resources/EKS/Cluster",id:"aws/resources/EKS/Cluster",isDocsHomePage:!1,title:"Cluster",description:"Provides an EKS Cluster.",source:"@site/docs/aws/resources/EKS/Cluster.md",sourceDirName:"aws/resources/EKS",slug:"/aws/resources/EKS/Cluster",permalink:"/docs/aws/resources/EKS/Cluster",tags:[],version:"current",frontMatter:{id:"Cluster",title:"Cluster"},sidebar:"docs",previous:{title:"Mount Target",permalink:"/docs/aws/resources/EFS/MountTarget"},next:{title:"Node Group",permalink:"/docs/aws/resources/EKS/NodeGroup"}},i=[{value:"Examples",id:"examples",children:[{value:"Create a cluster",id:"create-a-cluster",children:[],level:3}],level:2},{value:"On Deployed and On Destroyed",id:"on-deployed-and-on-destroyed",children:[{value:"On Deployed",id:"on-deployed",children:[],level:3},{value:"On Destroyed",id:"on-destroyed",children:[],level:3}],level:2},{value:"Source Code Examples",id:"source-code-examples",children:[],level:2},{value:"Properties",id:"properties",children:[],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"List",id:"list",children:[],level:2}],p={toc:i};function d(e){var t=e.components,n=(0,a.Z)(e,l);return(0,s.kt)("wrapper",(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,s.kt)("p",null,"Provides an ",(0,s.kt)("a",{parentName:"p",href:"https://aws.amazon.com/eks"},"EKS Cluster"),"."),(0,s.kt)("h2",{id:"examples"},"Examples"),(0,s.kt)("h3",{id:"create-a-cluster"},"Create a cluster"),(0,s.kt)("p",null,"In order to create an EKS Cluster, a few resources need to be created before:"),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},"a VPC"),(0,s.kt)("li",{parentName:"ul"},"an Internet Gateway"),(0,s.kt)("li",{parentName:"ul"},"at least 2 public subnet"),(0,s.kt)("li",{parentName:"ul"},"at least 2 private subnet"),(0,s.kt)("li",{parentName:"ul"},"a Nat Gateway."),(0,s.kt)("li",{parentName:"ul"},"route tables and routes."),(0,s.kt)("li",{parentName:"ul"},"a security group"),(0,s.kt)("li",{parentName:"ul"},"an Iam role"),(0,s.kt)("li",{parentName:"ul"},"a customer master key")),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Cluster",\n    group: "EKS",\n    name: "my-cluster",\n    properties: ({}) => ({\n      version: "1.20",\n    }),\n    dependencies: () => ({\n      subnets: [\n        "SubnetPrivateUSEAST1D",\n        "SubnetPrivateUSEAST1F",\n        "SubnetPublicUSEAST1D",\n        "SubnetPublicUSEAST1F",\n      ],\n      securityGroups: ["ControlPlaneSecurityGroup"],\n      role: "eksctl-my-cluster-cluster-ServiceRole-1T8YHA5ZIYVRB",\n    }),\n  },\n];\n')),(0,s.kt)("h2",{id:"on-deployed-and-on-destroyed"},"On Deployed and On Destroyed"),(0,s.kt)("h3",{id:"on-deployed"},"On Deployed"),(0,s.kt)("p",null,"When the cluster is up and running, the ",(0,s.kt)("strong",{parentName:"p"},"kubeconfig")," is updated with the new endpoint, i.e arn:aws:eks:eu-west-2:840541460064:cluster/myCluster\nUnder the hood, the ",(0,s.kt)("strong",{parentName:"p"},"aws eks update-kubeconfig")," command is invoked with the right cluster name."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre"},"aws eks update-kubeconfig --name myCluster\n")),(0,s.kt)("h3",{id:"on-destroyed"},"On Destroyed"),(0,s.kt)("p",null,"When the cluster is destroyed, the endpoint is removed from ",(0,s.kt)("strong",{parentName:"p"},"kubeconfig"),":"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre"},"kubectl config delete-cluster arn:aws:eks:eu-west-2:840541460064:cluster/myCluster\n")),(0,s.kt)("h2",{id:"source-code-examples"},"Source Code Examples"),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/EKS/eks-simple"},"eks simple")),(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/EKS/eks-load-balancer"},"eks with load balancer"))),(0,s.kt)("h2",{id:"properties"},"Properties"),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-eks/interfaces/createclustercommandinput.html"},"CreateClusterCommandInput"))),(0,s.kt)("h2",{id:"dependencies"},"Dependencies"),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/Subnet"},"Subnet")),(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/SecurityGroup"},"SecurityGroup")),(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/IAM/Role"},"Role")),(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/KMS/Key"},"Key"))),(0,s.kt)("h2",{id:"list"},"List"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t EKS::Cluster\n")),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-txt"},'Listing resources on 1 provider: aws\n\u2713 aws\n  \u2713 Initialising\n  \u2713 Listing 6/6\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 1 EKS::Cluster from aws                                                                   \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: my-cluster                                                                          \u2502\n\u2502 managedByUs: Yes                                                                          \u2502\n\u2502 live:                                                                                     \u2502\n\u2502   name: my-cluster                                                                        \u2502\n\u2502   arn: arn:aws:eks:us-east-1:1234567890:cluster/my-cluster                                \u2502\n\u2502   createdAt: 2021-10-23T15:13:54.383Z                                                     \u2502\n\u2502   version: 1.20                                                                           \u2502\n\u2502   endpoint: https://076E04BC82258CCF892CE6C7393099A2.sk1.us-east-1.eks.amazonaws.com      \u2502\n\u2502   roleArn: arn:aws:iam::1234567890:role/eksctl-my-cluster-cluster-ServiceRole-13ASK7KN\u2026   \u2502\n\u2502   resourcesVpcConfig:                                                                     \u2502\n\u2502     subnetIds:                                                                            \u2502\n\u2502       - "subnet-0d00758befedaa8c4"                                                        \u2502\n\u2502       - "subnet-0418a68064c4c57d9"                                                        \u2502\n\u2502       - "subnet-054f90a7bcd3875b8"                                                        \u2502\n\u2502       - "subnet-0666abe5c8cb6dc15"                                                        \u2502\n\u2502     securityGroupIds:                                                                     \u2502\n\u2502       - "sg-08a13c94f85fe6f4a"                                                            \u2502\n\u2502     clusterSecurityGroupId: sg-0c6cb4f616e846c91                                          \u2502\n\u2502     vpcId: vpc-04d05283d2a788120                                                          \u2502\n\u2502     endpointPublicAccess: true                                                            \u2502\n\u2502     endpointPrivateAccess: false                                                          \u2502\n\u2502     publicAccessCidrs:                                                                    \u2502\n\u2502       - "0.0.0.0/0"                                                                       \u2502\n\u2502   kubernetesNetworkConfig:                                                                \u2502\n\u2502     serviceIpv4Cidr: 10.100.0.0/16                                                        \u2502\n\u2502   logging:                                                                                \u2502\n\u2502     clusterLogging:                                                                       \u2502\n\u2502       - types:                                                                            \u2502\n\u2502           - "api"                                                                         \u2502\n\u2502           - "audit"                                                                       \u2502\n\u2502           - "authenticator"                                                               \u2502\n\u2502           - "controllerManager"                                                           \u2502\n\u2502           - "scheduler"                                                                   \u2502\n\u2502         enabled: false                                                                    \u2502\n\u2502   identity:                                                                               \u2502\n\u2502     oidc:                                                                                 \u2502\n\u2502       issuer: https://oidc.eks.us-east-1.amazonaws.com/id/076E04BC82258CCF892CE6C7393099\u2026 \u2502\n\u2502   status: ACTIVE                                                                          \u2502\n\u2502   certificateAuthority:                                                                   \u2502\n\u2502     data: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUM1ekNDQWMrZ0F3SUJBZ0lCQURBTkJna3Foa2\u2026 \u2502\n\u2502   clientRequestToken: null                                                                \u2502\n\u2502   platformVersion: eks.2                                                                  \u2502\n\u2502   tags:                                                                                   \u2502\n\u2502     gc-managed-by: grucloud                                                               \u2502\n\u2502     gc-project-name: ex-eks-mod                                                           \u2502\n\u2502     gc-stage: dev                                                                         \u2502\n\u2502     gc-created-by-provider: aws                                                           \u2502\n\u2502     Name: my-cluster                                                                      \u2502\n\u2502                                                                                           \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\nList Summary:\nProvider: aws\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 aws                                                                                      \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 EKS::Cluster \u2502 my-cluster                                                                \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n1 resource, 1 type, 1 provider\nCommand "gc l -t EKS::Cluster" executed in 11s\n')))}d.isMDXComponent=!0}}]);