"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[26159],{3905:(e,t,r)=>{r.d(t,{Zo:()=>c,kt:()=>f});var n=r(67294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function s(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?s(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):s(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function u(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},s=Object.keys(e);for(n=0;n<s.length;n++)r=s[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(n=0;n<s.length;n++)r=s[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var i=n.createContext({}),o=function(e){var t=n.useContext(i),r=t;return e&&(r="function"==typeof e?e(t):l(l({},t),e)),r},c=function(e){var t=o(e.components);return n.createElement(i.Provider,{value:t},e.children)},p="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,s=e.originalType,i=e.parentName,c=u(e,["components","mdxType","originalType","parentName"]),p=o(r),m=a,f=p["".concat(i,".").concat(m)]||p[m]||d[m]||s;return r?n.createElement(f,l(l({ref:t},c),{},{components:r})):n.createElement(f,l({ref:t},c))}));function f(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var s=r.length,l=new Array(s);l[0]=m;var u={};for(var i in t)hasOwnProperty.call(t,i)&&(u[i]=t[i]);u.originalType=e,u[p]="string"==typeof e?e:a,l[1]=u;for(var o=2;o<s;o++)l[o]=r[o];return n.createElement.apply(null,l)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},31910:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>i,contentTitle:()=>l,default:()=>d,frontMatter:()=>s,metadata:()=>u,toc:()=>o});var n=r(87462),a=(r(67294),r(3905));const s={id:"Cluster",title:"Cluster"},l=void 0,u={unversionedId:"aws/resources/Redshift/Cluster",id:"aws/resources/Redshift/Cluster",title:"Cluster",description:"Manages a Redshift Cluster.",source:"@site/docs/aws/resources/Redshift/Cluster.md",sourceDirName:"aws/resources/Redshift",slug:"/aws/resources/Redshift/Cluster",permalink:"/docs/aws/resources/Redshift/Cluster",draft:!1,tags:[],version:"current",frontMatter:{id:"Cluster",title:"Cluster"},sidebar:"docs",previous:{title:"DB Subnet Group",permalink:"/docs/aws/resources/RDS/DBSubnetGroup"},next:{title:"Cluster Parameter Group",permalink:"/docs/aws/resources/Redshift/ClusterParameterGroup"}},i={},o=[{value:"Example",id:"example",level:2},{value:"Code Examples",id:"code-examples",level:2},{value:"Properties",id:"properties",level:2},{value:"Dependencies",id:"dependencies",level:2},{value:"List",id:"list",level:2}],c={toc:o},p="wrapper";function d(e){let{components:t,...r}=e;return(0,a.kt)(p,(0,n.Z)({},c,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Manages a ",(0,a.kt)("a",{parentName:"p",href:"https://docs.aws.amazon.com/redshift/latest/mgmt/welcome.html"},"Redshift Cluster"),"."),(0,a.kt)("h2",{id:"example"},"Example"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Cluster",\n    group: "Redshift",\n    properties: ({}) => ({\n      ClusterIdentifier: "redshift-cluster-1",\n      NodeType: "dc2.large",\n      ClusterParameterGroups: [\n        {\n          ParameterGroupName: "group-1",\n        },\n      ],\n      ClusterSubnetGroupName: "cluster-subnet-group-1",\n      NumberOfNodes: 2,\n      EnhancedVpcRouting: true,\n      TotalStorageCapacityInMegaBytes: 400000,\n      MasterUserPassword: process.env.REDSHIFT_CLUSTER_1_MASTER_USER_PASSWORD,\n    }),\n    dependencies: ({}) => ({\n      clusterSubnetGroup: "cluster-subnet-group-1",\n      clusterParameterGroups: ["group-1"],\n      vpcSecurityGroups: ["sg::vpc::default"],\n    }),\n  },\n];\n')),(0,a.kt)("h2",{id:"code-examples"},"Code Examples"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/Redshift/redshift-simple"},"redshift simple"))),(0,a.kt)("h2",{id:"properties"},"Properties"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-redshift/interfaces/createclustercommandinput.html"},"CreateClusterCommandInput"))),(0,a.kt)("h2",{id:"dependencies"},"Dependencies"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/SecurityGroup"},"EC2 Security Group")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/aws/resources/IAM/Role"},"IAM Role")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/aws/resources/KMS/Key"},"KMS Key")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/aws/resources/Redshift/ClusterSubnetGroup"},"Redshift Cluster Subnet Group"))),(0,a.kt)("h2",{id:"list"},"List"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t Redshift::Cluster\n")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-txt"},'Listing resources on 1 provider: aws\n\u2713 aws us-east-1\n  \u2713 Initialising\n  \u2713 Listing 1/1\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 1 Redshift::Cluster from aws                                                      \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: redshift-cluster-1                                                          \u2502\n\u2502 managedByUs: Yes                                                                  \u2502\n\u2502 live:                                                                             \u2502\n\u2502   ClusterIdentifier: redshift-cluster-1                                           \u2502\n\u2502   NodeType: dc2.large                                                             \u2502\n\u2502   ClusterStatus: available                                                        \u2502\n\u2502   ClusterAvailabilityStatus: Available                                            \u2502\n\u2502   MasterUsername: awsuser                                                         \u2502\n\u2502   DBName: dev                                                                     \u2502\n\u2502   Endpoint:                                                                       \u2502\n\u2502     Address: redshift-cluster-1.ck96afkwnpca.us-east-1.redshift.amazonaws.com     \u2502\n\u2502     Port: 5439                                                                    \u2502\n\u2502   ClusterCreateTime: 2022-10-10T19:42:10.383Z                                     \u2502\n\u2502   AutomatedSnapshotRetentionPeriod: 1                                             \u2502\n\u2502   ManualSnapshotRetentionPeriod: -1                                               \u2502\n\u2502   ClusterSecurityGroups: []                                                       \u2502\n\u2502   VpcSecurityGroups:                                                              \u2502\n\u2502     - VpcSecurityGroupId: sg-0ff054653b90879a7                                    \u2502\n\u2502       Status: active                                                              \u2502\n\u2502   ClusterParameterGroups:                                                         \u2502\n\u2502     - ParameterGroupName: default.redshift-1.0                                    \u2502\n\u2502       ParameterApplyStatus: in-sync                                               \u2502\n\u2502   ClusterSubnetGroupName: cluster-subnet-group-1                                  \u2502\n\u2502   VpcId: vpc-0d760bcfee953174e                                                    \u2502\n\u2502   AvailabilityZone: us-east-1a                                                    \u2502\n\u2502   PreferredMaintenanceWindow: wed:04:30-wed:05:00                                 \u2502\n\u2502   PendingModifiedValues:                                                          \u2502\n\u2502   ClusterVersion: 1.0                                                             \u2502\n\u2502   AllowVersionUpgrade: true                                                       \u2502\n\u2502   NumberOfNodes: 2                                                                \u2502\n\u2502   PubliclyAccessible: false                                                       \u2502\n\u2502   Encrypted: false                                                                \u2502\n\u2502   ClusterPublicKey: ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCgevle0Nu2lIbPdSNJPi7i\u2026 \u2502\n\u2502                                                                                   \u2502\n\u2502   ClusterNodes:                                                                   \u2502\n\u2502     - NodeRole: LEADER                                                            \u2502\n\u2502       PrivateIPAddress: 10.0.141.9                                                \u2502\n\u2502     - NodeRole: COMPUTE-0                                                         \u2502\n\u2502       PrivateIPAddress: 10.0.142.229                                              \u2502\n\u2502     - NodeRole: COMPUTE-1                                                         \u2502\n\u2502       PrivateIPAddress: 10.0.133.48                                               \u2502\n\u2502   ClusterRevisionNumber: 41881                                                    \u2502\n\u2502   Tags:                                                                           \u2502\n\u2502     - Key: gc-created-by-provider                                                 \u2502\n\u2502       Value: aws                                                                  \u2502\n\u2502     - Key: gc-managed-by                                                          \u2502\n\u2502       Value: grucloud                                                             \u2502\n\u2502     - Key: gc-project-name                                                        \u2502\n\u2502       Value: redshift-simple                                                      \u2502\n\u2502     - Key: gc-stage                                                               \u2502\n\u2502       Value: dev                                                                  \u2502\n\u2502     - Key: Name                                                                   \u2502\n\u2502       Value: redshift-cluster-1                                                   \u2502\n\u2502   EnhancedVpcRouting: true                                                        \u2502\n\u2502   IamRoles: []                                                                    \u2502\n\u2502   MaintenanceTrackName: current                                                   \u2502\n\u2502   ElasticResizeNumberOfNodeOptions: [4]                                           \u2502\n\u2502   DeferredMaintenanceWindows: []                                                  \u2502\n\u2502   NextMaintenanceWindowStartTime: 2022-10-12T04:30:00.000Z                        \u2502\n\u2502   AvailabilityZoneRelocationStatus: disabled                                      \u2502\n\u2502   ClusterNamespaceArn: arn:aws:redshift:us-east-1:840541460064:namespace:70d80ac\u2026 \u2502\n\u2502   AquaConfiguration:                                                              \u2502\n\u2502     AquaStatus: disabled                                                          \u2502\n\u2502     AquaConfigurationStatus: auto                                                 \u2502\n\u2502                                                                                   \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\nList Summary:\nProvider: aws\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 aws                                                                              \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 Redshift::Cluster \u2502 redshift-cluster-1                                           \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n1 resource, 1 type, 1 provider\nCommand "gc l -t Redshift::Cluster" executed in 4s, 98 MB\n')))}d.isMDXComponent=!0}}]);