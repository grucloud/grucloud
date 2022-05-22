"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[55830],{3905:function(e,n,t){t.d(n,{Zo:function(){return c},kt:function(){return m}});var r=t(67294);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function s(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function o(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?s(Object(t),!0).forEach((function(n){a(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):s(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function l(e,n){if(null==e)return{};var t,r,a=function(e,n){if(null==e)return{};var t,r,a={},s=Object.keys(e);for(r=0;r<s.length;r++)t=s[r],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(r=0;r<s.length;r++)t=s[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var u=r.createContext({}),i=function(e){var n=r.useContext(u),t=n;return e&&(t="function"==typeof e?e(n):o(o({},n),e)),t},c=function(e){var n=i(e.components);return r.createElement(u.Provider,{value:n},e.children)},p={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},d=r.forwardRef((function(e,n){var t=e.components,a=e.mdxType,s=e.originalType,u=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),d=i(t),m=a,f=d["".concat(u,".").concat(m)]||d[m]||p[m]||s;return t?r.createElement(f,o(o({ref:n},c),{},{components:t})):r.createElement(f,o({ref:n},c))}));function m(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var s=t.length,o=new Array(s);o[0]=d;var l={};for(var u in n)hasOwnProperty.call(n,u)&&(l[u]=n[u]);l.originalType=e,l.mdxType="string"==typeof e?e:a,o[1]=l;for(var i=2;i<s;i++)o[i]=t[i];return r.createElement.apply(null,o)}return r.createElement.apply(null,t)}d.displayName="MDXCreateElement"},69570:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return l},contentTitle:function(){return u},metadata:function(){return i},toc:function(){return c},default:function(){return d}});var r=t(87462),a=t(63366),s=(t(67294),t(3905)),o=["components"],l={id:"DBCluster",title:"DB Cluster"},u=void 0,i={unversionedId:"aws/resources/RDS/DBCluster",id:"aws/resources/RDS/DBCluster",isDocsHomePage:!1,title:"DB Cluster",description:"Manages a DB Cluster.",source:"@site/docs/aws/resources/RDS/DBCluster.md",sourceDirName:"aws/resources/RDS",slug:"/aws/resources/RDS/DBCluster",permalink:"/docs/aws/resources/RDS/DBCluster",tags:[],version:"current",frontMatter:{id:"DBCluster",title:"DB Cluster"},sidebar:"docs",previous:{title:"Record",permalink:"/docs/aws/resources/Route53/Record"},next:{title:"DB Instance",permalink:"/docs/aws/resources/RDS/DBInstance"}},c=[{value:"Example",id:"example",children:[],level:2},{value:"Code Examples",id:"code-examples",children:[],level:2},{value:"Properties",id:"properties",children:[],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"List",id:"list",children:[],level:2}],p={toc:c};function d(e){var n=e.components,t=(0,a.Z)(e,o);return(0,s.kt)("wrapper",(0,r.Z)({},p,t,{components:n,mdxType:"MDXLayout"}),(0,s.kt)("p",null,"Manages a ",(0,s.kt)("a",{parentName:"p",href:"https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html"},"DB Cluster"),"."),(0,s.kt)("h2",{id:"example"},"Example"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "DBCluster",\n    group: "RDS",\n    name: "cluster-postgres-stateless",\n    properties: ({ config }) => ({\n      DatabaseName: "dev",\n      Engine: "aurora-postgresql",\n      EngineVersion: "10.14",\n      EngineMode: "serverless",\n      Port: 5432,\n      PreferredBackupWindow: "01:39-02:09",\n      PreferredMaintenanceWindow: "sun:00:47-sun:01:17",\n      ScalingConfiguration: {\n        MinCapacity: 2,\n        MaxCapacity: 4,\n        AutoPause: true,\n        SecondsUntilAutoPause: 300,\n        TimeoutAction: "RollbackCapacityChange",\n        SecondsBeforeTimeout: 300,\n      },\n      MasterUsername: process.env.CLUSTER_POSTGRES_STATELESS_MASTER_USERNAME,\n      MasterUserPassword:\n        process.env.CLUSTER_POSTGRES_STATELESS_MASTER_USER_PASSWORD,\n      AvailabilityZones: [`${config.region}a`, `${config.region}b`],\n    }),\n    dependencies: () => ({\n      dbSubnetGroup: "subnet-group-postgres-stateless",\n      securityGroups: ["security-group-postgres"],\n    }),\n  },\n];\n')),(0,s.kt)("h2",{id:"code-examples"},"Code Examples"),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/RDS/postgres-stateless/resources.js"},"stateless postgres"))),(0,s.kt)("h2",{id:"properties"},"Properties"),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-rds/interfaces/createdbclustercommandinput.html"},"CreateDBClusterCommandInput"))),(0,s.kt)("h2",{id:"dependencies"},"Dependencies"),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/RDS/DBSubnetGroup"},"DB Subnet Group")),(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/SecurityGroup"},"Security Group")),(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"../SecretsManager/Secret.md"},"Secret"))),(0,s.kt)("h2",{id:"list"},"List"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t DBCluster\n")),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-txt"},'Listing resources on 1 provider: aws\n\u2713 aws\n  \u2713 Initialising\n  \u2713 Listing 8/8\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 1 DBClu\u2026 \u2502                                                                                                  \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 Name     \u2502 Data                                                                                      \u2502 Our  \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253c\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 cluster  \u2502 AllocatedStorage: 1                                                                       \u2502 Yes  \u2502\n\u2502          \u2502 AvailabilityZones:                                                                        \u2502      \u2502\n\u2502          \u2502   - "eu-west-2c"                                                                          \u2502      \u2502\n\u2502          \u2502   - "eu-west-2a"                                                                          \u2502      \u2502\n\u2502          \u2502   - "eu-west-2b"                                                                          \u2502      \u2502\n\u2502          \u2502 BackupRetentionPeriod: 1                                                                  \u2502      \u2502\n\u2502          \u2502 DatabaseName: dev                                                                         \u2502      \u2502\n\u2502          \u2502 DBClusterIdentifier: cluster                                                              \u2502      \u2502\n\u2502          \u2502 DBClusterParameterGroup: default.aurora-postgresql10                                      \u2502      \u2502\n\u2502          \u2502 DBSubnetGroup: db-subnet-group                                                            \u2502      \u2502\n\u2502          \u2502 Status: available                                                                         \u2502      \u2502\n\u2502          \u2502 EarliestRestorableTime: 2021-06-10T09:08:16.767Z                                          \u2502      \u2502\n\u2502          \u2502 Endpoint: cluster.cluster-cwzy9iilw73e.eu-west-2.rds.amazonaws.com                        \u2502      \u2502\n\u2502          \u2502 CustomEndpoints: []                                                                       \u2502      \u2502\n\u2502          \u2502 MultiAZ: false                                                                            \u2502      \u2502\n\u2502          \u2502 Engine: aurora-postgresql                                                                 \u2502      \u2502\n\u2502          \u2502 EngineVersion: 10.14                                                                      \u2502      \u2502\n\u2502          \u2502 LatestRestorableTime: 2021-06-10T09:14:04.485Z                                            \u2502      \u2502\n\u2502          \u2502 Port: 5432                                                                                \u2502      \u2502\n\u2502          \u2502 MasterUsername: postgres                                                                  \u2502      \u2502\n\u2502          \u2502 DBClusterOptionGroupMemberships: []                                                       \u2502      \u2502\n\u2502          \u2502 PreferredBackupWindow: 04:57-05:27                                                        \u2502      \u2502\n\u2502          \u2502 PreferredMaintenanceWindow: sat:23:14-sat:23:44                                           \u2502      \u2502\n\u2502          \u2502 ReadReplicaIdentifiers: []                                                                \u2502      \u2502\n\u2502          \u2502 DBClusterMembers: []                                                                      \u2502      \u2502\n\u2502          \u2502 VpcSecurityGroups:                                                                        \u2502      \u2502\n\u2502          \u2502   - VpcSecurityGroupId: sg-01e30cdc63fda9c17                                              \u2502      \u2502\n\u2502          \u2502     Status: active                                                                        \u2502      \u2502\n\u2502          \u2502 HostedZoneId: Z1TTGA775OQIYO                                                              \u2502      \u2502\n\u2502          \u2502 StorageEncrypted: true                                                                    \u2502      \u2502\n\u2502          \u2502 KmsKeyId: arn:aws:kms:eu-west-2:840541460064:key/53a82424-5abc-48b8-a20f-9d1904aa4d99     \u2502      \u2502\n\u2502          \u2502 DbClusterResourceId: cluster-E7N5BIRMABN23D573BYMHILEOE                                   \u2502      \u2502\n\u2502          \u2502 DBClusterArn: arn:aws:rds:eu-west-2:840541460064:cluster:cluster                          \u2502      \u2502\n\u2502          \u2502 AssociatedRoles: []                                                                       \u2502      \u2502\n\u2502          \u2502 IAMDatabaseAuthenticationEnabled: false                                                   \u2502      \u2502\n\u2502          \u2502 ClusterCreateTime: 2021-06-10T09:07:12.114Z                                               \u2502      \u2502\n\u2502          \u2502 EnabledCloudwatchLogsExports: []                                                          \u2502      \u2502\n\u2502          \u2502 Capacity: 0                                                                               \u2502      \u2502\n\u2502          \u2502 EngineMode: serverless                                                                    \u2502      \u2502\n\u2502          \u2502 ScalingConfigurationInfo:                                                                 \u2502      \u2502\n\u2502          \u2502   MinCapacity: 2                                                                          \u2502      \u2502\n\u2502          \u2502   MaxCapacity: 4                                                                          \u2502      \u2502\n\u2502          \u2502   AutoPause: true                                                                         \u2502      \u2502\n\u2502          \u2502   SecondsUntilAutoPause: 300                                                              \u2502      \u2502\n\u2502          \u2502   TimeoutAction: RollbackCapacityChange                                                   \u2502      \u2502\n\u2502          \u2502 DeletionProtection: false                                                                 \u2502      \u2502\n\u2502          \u2502 HttpEndpointEnabled: false                                                                \u2502      \u2502\n\u2502          \u2502 ActivityStreamStatus: stopped                                                             \u2502      \u2502\n\u2502          \u2502 CopyTagsToSnapshot: false                                                                 \u2502      \u2502\n\u2502          \u2502 CrossAccountClone: false                                                                  \u2502      \u2502\n\u2502          \u2502 DomainMemberships: []                                                                     \u2502      \u2502\n\u2502          \u2502 TagList:                                                                                  \u2502      \u2502\n\u2502          \u2502   - Key: ManagedBy                                                                        \u2502      \u2502\n\u2502          \u2502     Value: GruCloud                                                                       \u2502      \u2502\n\u2502          \u2502   - Key: stage                                                                            \u2502      \u2502\n\u2502          \u2502     Value: dev                                                                            \u2502      \u2502\n\u2502          \u2502   - Key: projectName                                                                      \u2502      \u2502\n\u2502          \u2502     Value: rds-example                                                                    \u2502      \u2502\n\u2502          \u2502   - Key: CreatedByProvider                                                                \u2502      \u2502\n\u2502          \u2502     Value: aws                                                                            \u2502      \u2502\n\u2502          \u2502   - Key: Name                                                                             \u2502      \u2502\n\u2502          \u2502     Value: cluster                                                                        \u2502      \u2502\n\u2502          \u2502                                                                                           \u2502      \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\nList Summary:\nProvider: aws\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 aws                                                                                                        \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 DBCluster          \u2502 cluster                                                                               \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n1 resource, 5 types, 1 provider\nCommand "gc l -t DBCluster" executed in 3s\n')))}d.isMDXComponent=!0}}]);