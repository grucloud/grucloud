"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[61849],{3905:function(e,n,t){t.d(n,{Zo:function(){return l},kt:function(){return m}});var r=t(67294);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function s(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function o(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?s(Object(t),!0).forEach((function(n){a(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):s(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function i(e,n){if(null==e)return{};var t,r,a=function(e,n){if(null==e)return{};var t,r,a={},s=Object.keys(e);for(r=0;r<s.length;r++)t=s[r],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(r=0;r<s.length;r++)t=s[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var c=r.createContext({}),u=function(e){var n=r.useContext(c),t=n;return e&&(t="function"==typeof e?e(n):o(o({},n),e)),t},l=function(e){var n=u(e.components);return r.createElement(c.Provider,{value:n},e.children)},p={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},d=r.forwardRef((function(e,n){var t=e.components,a=e.mdxType,s=e.originalType,c=e.parentName,l=i(e,["components","mdxType","originalType","parentName"]),d=u(t),m=a,f=d["".concat(c,".").concat(m)]||d[m]||p[m]||s;return t?r.createElement(f,o(o({ref:n},l),{},{components:t})):r.createElement(f,o({ref:n},l))}));function m(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var s=t.length,o=new Array(s);o[0]=d;var i={};for(var c in n)hasOwnProperty.call(n,c)&&(i[c]=n[c]);i.originalType=e,i.mdxType="string"==typeof e?e:a,o[1]=i;for(var u=2;u<s;u++)o[u]=t[u];return r.createElement.apply(null,o)}return r.createElement.apply(null,t)}d.displayName="MDXCreateElement"},99569:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return i},contentTitle:function(){return c},metadata:function(){return u},toc:function(){return l},default:function(){return d}});var r=t(87462),a=t(63366),s=(t(67294),t(3905)),o=["components"],i={id:"DBInstance",title:"DB Instance"},c=void 0,u={unversionedId:"aws/resources/RDS/DBInstance",id:"aws/resources/RDS/DBInstance",isDocsHomePage:!1,title:"DB Instance",description:"Manages a DB Instance.",source:"@site/docs/aws/resources/RDS/DBInstance.md",sourceDirName:"aws/resources/RDS",slug:"/aws/resources/RDS/DBInstance",permalink:"/docs/aws/resources/RDS/DBInstance",tags:[],version:"current",frontMatter:{id:"DBInstance",title:"DB Instance"},sidebar:"docs",previous:{title:"DB Cluster",permalink:"/docs/aws/resources/RDS/DBCluster"},next:{title:"DB Subnet Group",permalink:"/docs/aws/resources/RDS/DBSubnetGroup"}},l=[{value:"Example",id:"example",children:[],level:2},{value:"Code Examples",id:"code-examples",children:[],level:2},{value:"Properties",id:"properties",children:[],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"List",id:"list",children:[],level:2}],p={toc:l};function d(e){var n=e.components,t=(0,a.Z)(e,o);return(0,s.kt)("wrapper",(0,r.Z)({},p,t,{components:n,mdxType:"MDXLayout"}),(0,s.kt)("p",null,"Manages a ",(0,s.kt)("a",{parentName:"p",href:"https://console.aws.amazon.com/rds/home?#databases:"},"DB Instance"),"."),(0,s.kt)("h2",{id:"example"},"Example"),(0,s.kt)("p",null,"Deploy a postgres database:"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "DBInstance",\n    group: "RDS",\n    name: "db-instance",\n    properties: ({ config }) => ({\n      DBInstanceClass: "db.t3.micro",\n      Engine: "postgres",\n      EngineVersion: "12.5",\n      AllocatedStorage: 20,\n      MaxAllocatedStorage: 1000,\n      PubliclyAccessible: true,\n      PreferredBackupWindow: "22:10-22:40",\n      PreferredMaintenanceWindow: "fri:23:40-sat:00:10",\n      BackupRetentionPeriod: 1,\n      MasterUsername: process.env.DB_INSTANCE_MASTER_USERNAME,\n      MasterUserPassword: process.env.DB_INSTANCE_MASTER_USER_PASSWORD,\n    }),\n    dependencies: () => ({\n      dbSubnetGroup: "subnet-group-postgres",\n      securityGroups: ["security-group"],\n    }),\n  },\n];\n')),(0,s.kt)("h2",{id:"code-examples"},"Code Examples"),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/RDS/postgres"},"postgres"))),(0,s.kt)("h2",{id:"properties"},"Properties"),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-rds/interfaces/createdbinstancecommandinput.html"},"CreateDBInstanceCommandInput"))),(0,s.kt)("h2",{id:"dependencies"},"Dependencies"),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/RDS/DBSubnetGroup"},"DB Subnet Group")),(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/SecurityGroup"},"Security Group")),(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/KMS/Key"},"KMS Key")),(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"../SecretsManager/Secret.md"},"Secret"))),(0,s.kt)("h2",{id:"list"},"List"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t DBInstance\n")),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-txt"},'Listing resources on 1 provider: aws\n\u2713 aws\n  \u2713 Initialising\n  \u2713 Listing 1/1\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 1 RDS::DBInstance from aws                                             \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: db-instance                                                      \u2502\n\u2502 managedByUs: Yes                                                       \u2502\n\u2502 live:                                                                  \u2502\n\u2502   DBInstanceIdentifier: db-instance                                    \u2502\n\u2502   DBInstanceClass: db.t2.micro                                         \u2502\n\u2502   Engine: postgres                                                     \u2502\n\u2502   DBInstanceStatus: available                                          \u2502\n\u2502   MasterUsername: postgres                                             \u2502\n\u2502   Endpoint:                                                            \u2502\n\u2502     Address: db-instance.c8mtxauy5ngp.us-east-1.rds.amazonaws.com      \u2502\n\u2502     Port: 5432                                                         \u2502\n\u2502     HostedZoneId: Z2R2ITUGPM61AM                                       \u2502\n\u2502   AllocatedStorage: 20                                                 \u2502\n\u2502   InstanceCreateTime: 2022-03-09T20:47:12.440Z                         \u2502\n\u2502   PreferredBackupWindow: 22:10-22:40                                   \u2502\n\u2502   BackupRetentionPeriod: 1                                             \u2502\n\u2502   DBSecurityGroups: []                                                 \u2502\n\u2502   VpcSecurityGroups:                                                   \u2502\n\u2502     - VpcSecurityGroupId: sg-048ed7ed0716e19f2                         \u2502\n\u2502       Status: active                                                   \u2502\n\u2502   DBParameterGroups:                                                   \u2502\n\u2502     - DBParameterGroupName: default.postgres12                         \u2502\n\u2502       ParameterApplyStatus: in-sync                                    \u2502\n\u2502   AvailabilityZone: us-east-1a                                         \u2502\n\u2502   DBSubnetGroup:                                                       \u2502\n\u2502     DBSubnetGroupName: subnet-group-postgres                           \u2502\n\u2502     DBSubnetGroupDescription: db subnet group                          \u2502\n\u2502     VpcId: vpc-0d5b0c96f249946d7                                       \u2502\n\u2502     SubnetGroupStatus: Complete                                        \u2502\n\u2502     Subnets:                                                           \u2502\n\u2502       - SubnetIdentifier: subnet-0ffb0ef569d4a8716                     \u2502\n\u2502         SubnetAvailabilityZone:                                        \u2502\n\u2502           Name: us-east-1a                                             \u2502\n\u2502         SubnetOutpost:                                                 \u2502\n\u2502         SubnetStatus: Active                                           \u2502\n\u2502       - SubnetIdentifier: subnet-0fa8cee733fa0d508                     \u2502\n\u2502         SubnetAvailabilityZone:                                        \u2502\n\u2502           Name: us-east-1b                                             \u2502\n\u2502         SubnetOutpost:                                                 \u2502\n\u2502         SubnetStatus: Active                                           \u2502\n\u2502   PreferredMaintenanceWindow: fri:23:40-sat:00:10                      \u2502\n\u2502   PendingModifiedValues:                                               \u2502\n\u2502   LatestRestorableTime: 2022-03-09T22:04:32.000Z                       \u2502\n\u2502   MultiAZ: false                                                       \u2502\n\u2502   EngineVersion: 12.6                                                  \u2502\n\u2502   AutoMinorVersionUpgrade: true                                        \u2502\n\u2502   ReadReplicaDBInstanceIdentifiers: []                                 \u2502\n\u2502   LicenseModel: postgresql-license                                     \u2502\n\u2502   OptionGroupMemberships:                                              \u2502\n\u2502     - OptionGroupName: default:postgres-12                             \u2502\n\u2502       Status: in-sync                                                  \u2502\n\u2502   PubliclyAccessible: true                                             \u2502\n\u2502   StorageType: gp2                                                     \u2502\n\u2502   DbInstancePort: 0                                                    \u2502\n\u2502   StorageEncrypted: false                                              \u2502\n\u2502   DbiResourceId: db-CHPXAN6BYZBXLQJSNTKWT3IZ4Y                         \u2502\n\u2502   CACertificateIdentifier: rds-ca-2019                                 \u2502\n\u2502   DomainMemberships: []                                                \u2502\n\u2502   CopyTagsToSnapshot: false                                            \u2502\n\u2502   MonitoringInterval: 0                                                \u2502\n\u2502   DBInstanceArn: arn:aws:rds:us-east-1:840541460064:db:db-instance     \u2502\n\u2502   IAMDatabaseAuthenticationEnabled: false                              \u2502\n\u2502   PerformanceInsightsEnabled: false                                    \u2502\n\u2502   DeletionProtection: false                                            \u2502\n\u2502   AssociatedRoles: []                                                  \u2502\n\u2502   MaxAllocatedStorage: 1000                                            \u2502\n\u2502   CustomerOwnedIpEnabled: false                                        \u2502\n\u2502   ActivityStreamStatus: stopped                                        \u2502\n\u2502   BackupTarget: region                                                 \u2502\n\u2502   Tags:                                                                \u2502\n\u2502     - Key: gc-created-by-provider                                      \u2502\n\u2502       Value: aws                                                       \u2502\n\u2502     - Key: gc-managed-by                                               \u2502\n\u2502       Value: grucloud                                                  \u2502\n\u2502     - Key: gc-project-name                                             \u2502\n\u2502       Value: @grucloud/example-aws-rds-postgres                        \u2502\n\u2502     - Key: gc-stage                                                    \u2502\n\u2502       Value: dev                                                       \u2502\n\u2502     - Key: mykey2                                                      \u2502\n\u2502       Value: myvalue                                                   \u2502\n\u2502     - Key: Name                                                        \u2502\n\u2502       Value: db-instance                                               \u2502\n\u2502                                                                        \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\nList Summary:\nProvider: aws\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 aws                                                                   \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 RDS::DBInstance \u2502 db-instance                                         \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n1 resource, 1 type, 1 provider\nCommand "gc l -t DBInstance" executed in 4s, 216 MB\n')))}d.isMDXComponent=!0}}]);