"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[29387],{3905:(e,a,n)=>{n.d(a,{Zo:()=>u,kt:()=>d});var t=n(67294);function r(e,a,n){return a in e?Object.defineProperty(e,a,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[a]=n,e}function s(e,a){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);a&&(t=t.filter((function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable}))),n.push.apply(n,t)}return n}function c(e){for(var a=1;a<arguments.length;a++){var n=null!=arguments[a]?arguments[a]:{};a%2?s(Object(n),!0).forEach((function(a){r(e,a,n[a])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(a){Object.defineProperty(e,a,Object.getOwnPropertyDescriptor(n,a))}))}return e}function l(e,a){if(null==e)return{};var n,t,r=function(e,a){if(null==e)return{};var n,t,r={},s=Object.keys(e);for(t=0;t<s.length;t++)n=s[t],a.indexOf(n)>=0||(r[n]=e[n]);return r}(e,a);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(t=0;t<s.length;t++)n=s[t],a.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var o=t.createContext({}),i=function(e){var a=t.useContext(o),n=a;return e&&(n="function"==typeof e?e(a):c(c({},a),e)),n},u=function(e){var a=i(e.components);return t.createElement(o.Provider,{value:a},e.children)},p={inlineCode:"code",wrapper:function(e){var a=e.children;return t.createElement(t.Fragment,{},a)}},m=t.forwardRef((function(e,a){var n=e.components,r=e.mdxType,s=e.originalType,o=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),m=i(n),d=r,h=m["".concat(o,".").concat(d)]||m[d]||p[d]||s;return n?t.createElement(h,c(c({ref:a},u),{},{components:n})):t.createElement(h,c({ref:a},u))}));function d(e,a){var n=arguments,r=a&&a.mdxType;if("string"==typeof e||r){var s=n.length,c=new Array(s);c[0]=m;var l={};for(var o in a)hasOwnProperty.call(a,o)&&(l[o]=a[o]);l.originalType=e,l.mdxType="string"==typeof e?e:r,c[1]=l;for(var i=2;i<s;i++)c[i]=n[i];return t.createElement.apply(null,c)}return t.createElement.apply(null,n)}m.displayName="MDXCreateElement"},71224:(e,a,n)=>{n.r(a),n.d(a,{assets:()=>o,contentTitle:()=>c,default:()=>p,frontMatter:()=>s,metadata:()=>l,toc:()=>i});var t=n(87462),r=(n(67294),n(3905));const s={id:"CacheCluster",title:"Cache Cluster"},c=void 0,l={unversionedId:"aws/resources/ElastiCache/CacheCluster",id:"aws/resources/ElastiCache/CacheCluster",title:"Cache Cluster",description:"Manages an ElastiCache Cluster.",source:"@site/docs/aws/resources/ElastiCache/CacheCluster.md",sourceDirName:"aws/resources/ElastiCache",slug:"/aws/resources/ElastiCache/CacheCluster",permalink:"/docs/aws/resources/ElastiCache/CacheCluster",draft:!1,tags:[],version:"current",frontMatter:{id:"CacheCluster",title:"Cache Cluster"},sidebar:"docs",previous:{title:"Application",permalink:"/docs/aws/resources/EMRServerless/Application"},next:{title:"CacheParameterGroup",permalink:"/docs/aws/resources/ElastiCache/CacheParameterGroup"}},o={},i=[{value:"Sample code",id:"sample-code",level:2},{value:"Properties",id:"properties",level:2},{value:"Dependencies",id:"dependencies",level:2},{value:"Full Examples",id:"full-examples",level:2},{value:"List",id:"list",level:2}],u={toc:i};function p(e){let{components:a,...n}=e;return(0,r.kt)("wrapper",(0,t.Z)({},u,n,{components:a,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"Manages an ",(0,r.kt)("a",{parentName:"p",href:"https://console.aws.amazon.com/elasticache/home#/"},"ElastiCache Cluster"),"."),(0,r.kt)("h2",{id:"sample-code"},"Sample code"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},"exports.createResources = () => [];\n")),(0,r.kt)("h2",{id:"properties"},"Properties"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-elasticache/interfaces/createcacheclustercommandinput.html"},"CreateCacheClusterCommandInput"))),(0,r.kt)("h2",{id:"dependencies"},"Dependencies"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/CloudWatchLogs/LogGroup"},"CloudWatchLogs LogGroup")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/SecurityGroup"},"EC2 Security Group")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/ElastiCache/CacheParameterGroup"},"ElastiCache Parameter Group")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/ElastiCache/CacheSubnetGroup"},"ElastiCache Subnet Group")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/Firehose/DeliveryStream"},"Firehose Delivery Stream")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/SNS/SNSTopic"},"SNS Topic"))),(0,r.kt)("h2",{id:"full-examples"},"Full Examples"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/ElastiCache/elasticache-memcached"},"elasticache memcached"))),(0,r.kt)("h2",{id:"list"},"List"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t ElastiCache::Cluster\n")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-txt"},'Listing resources on 1 provider: aws\n\u2713 aws us-east-1\n  \u2713 Initialising\n  \u2713 Listing 1/1\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 3 ElastiCache::CacheCluster from aws                                                    \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: my-cluster-001                                                                    \u2502\n\u2502 managedByUs: Yes                                                                        \u2502\n\u2502 live:                                                                                   \u2502\n\u2502   CacheClusterId: my-cluster-001                                                        \u2502\n\u2502   ClientDownloadLandingPage: https://console.aws.amazon.com/elasticache/home#client-do\u2026 \u2502\n\u2502   CacheNodeType: cache.t2.micro                                                         \u2502\n\u2502   Engine: redis                                                                         \u2502\n\u2502   EngineVersion: 6.2.6                                                                  \u2502\n\u2502   CacheClusterStatus: available                                                         \u2502\n\u2502   NumCacheNodes: 1                                                                      \u2502\n\u2502   PreferredAvailabilityZone: us-east-1b                                                 \u2502\n\u2502   CacheClusterCreateTime: 2022-10-27T21:28:11.858Z                                      \u2502\n\u2502   PreferredMaintenanceWindow: mon:06:00-mon:07:00                                       \u2502\n\u2502   PendingModifiedValues:                                                                \u2502\n\u2502   CacheParameterGroup:                                                                  \u2502\n\u2502     CacheParameterGroupName: my-parameter-group                                         \u2502\n\u2502     ParameterApplyStatus: in-sync                                                       \u2502\n\u2502     CacheNodeIdsToReboot: []                                                            \u2502\n\u2502   CacheSubnetGroupName: my-subnet-group                                                 \u2502\n\u2502   AutoMinorVersionUpgrade: true                                                         \u2502\n\u2502   SecurityGroups:                                                                       \u2502\n\u2502     - SecurityGroupId: sg-0cc06c2c929f673a0                                             \u2502\n\u2502       Status: active                                                                    \u2502\n\u2502   ReplicationGroupId: my-cluster                                                        \u2502\n\u2502   SnapshotRetentionLimit: 0                                                             \u2502\n\u2502   SnapshotWindow: 10:00-11:00                                                           \u2502\n\u2502   AuthTokenEnabled: false                                                               \u2502\n\u2502   TransitEncryptionEnabled: false                                                       \u2502\n\u2502   AtRestEncryptionEnabled: false                                                        \u2502\n\u2502   ARN: arn:aws:elasticache:us-east-1:840541460064:cluster:my-cluster-001                \u2502\n\u2502   ReplicationGroupLogDeliveryEnabled: true                                              \u2502\n\u2502   Tags:                                                                                 \u2502\n\u2502     - Key: gc-created-by-provider                                                       \u2502\n\u2502       Value: aws                                                                        \u2502\n\u2502     - Key: gc-managed-by                                                                \u2502\n\u2502       Value: grucloud                                                                   \u2502\n\u2502     - Key: gc-project-name                                                              \u2502\n\u2502       Value: elasticache-redis                                                          \u2502\n\u2502     - Key: gc-stage                                                                     \u2502\n\u2502       Value: dev                                                                        \u2502\n\u2502     - Key: mykey                                                                        \u2502\n\u2502       Value: myvalue                                                                    \u2502\n\u2502     - Key: Name                                                                         \u2502\n\u2502       Value: my-cluster-001                                                             \u2502\n\u2502                                                                                         \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: my-cluster-002                                                                    \u2502\n\u2502 managedByUs: Yes                                                                        \u2502\n\u2502 live:                                                                                   \u2502\n\u2502   CacheClusterId: my-cluster-002                                                        \u2502\n\u2502   ClientDownloadLandingPage: https://console.aws.amazon.com/elasticache/home#client-do\u2026 \u2502\n\u2502   CacheNodeType: cache.t2.micro                                                         \u2502\n\u2502   Engine: redis                                                                         \u2502\n\u2502   EngineVersion: 6.2.6                                                                  \u2502\n\u2502   CacheClusterStatus: available                                                         \u2502\n\u2502   NumCacheNodes: 1                                                                      \u2502\n\u2502   PreferredAvailabilityZone: us-east-1a                                                 \u2502\n\u2502   CacheClusterCreateTime: 2022-10-27T21:28:11.858Z                                      \u2502\n\u2502   PreferredMaintenanceWindow: mon:06:00-mon:07:00                                       \u2502\n\u2502   PendingModifiedValues:                                                                \u2502\n\u2502   CacheParameterGroup:                                                                  \u2502\n\u2502     CacheParameterGroupName: my-parameter-group                                         \u2502\n\u2502     ParameterApplyStatus: in-sync                                                       \u2502\n\u2502     CacheNodeIdsToReboot: []                                                            \u2502\n\u2502   CacheSubnetGroupName: my-subnet-group                                                 \u2502\n\u2502   AutoMinorVersionUpgrade: true                                                         \u2502\n\u2502   SecurityGroups:                                                                       \u2502\n\u2502     - SecurityGroupId: sg-0cc06c2c929f673a0                                             \u2502\n\u2502       Status: active                                                                    \u2502\n\u2502   ReplicationGroupId: my-cluster                                                        \u2502\n\u2502   SnapshotRetentionLimit: 1                                                             \u2502\n\u2502   SnapshotWindow: 10:00-11:00                                                           \u2502\n\u2502   AuthTokenEnabled: false                                                               \u2502\n\u2502   TransitEncryptionEnabled: false                                                       \u2502\n\u2502   AtRestEncryptionEnabled: false                                                        \u2502\n\u2502   ARN: arn:aws:elasticache:us-east-1:840541460064:cluster:my-cluster-002                \u2502\n\u2502   ReplicationGroupLogDeliveryEnabled: true                                              \u2502\n\u2502   Tags:                                                                                 \u2502\n\u2502     - Key: gc-created-by-provider                                                       \u2502\n\u2502       Value: aws                                                                        \u2502\n\u2502     - Key: gc-managed-by                                                                \u2502\n\u2502       Value: grucloud                                                                   \u2502\n\u2502     - Key: gc-project-name                                                              \u2502\n\u2502       Value: elasticache-redis                                                          \u2502\n\u2502     - Key: gc-stage                                                                     \u2502\n\u2502       Value: dev                                                                        \u2502\n\u2502     - Key: mykey                                                                        \u2502\n\u2502       Value: myvalue                                                                    \u2502\n\u2502     - Key: Name                                                                         \u2502\n\u2502       Value: my-cluster-002                                                             \u2502\n\u2502                                                                                         \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: my-cluster-003                                                                    \u2502\n\u2502 managedByUs: Yes                                                                        \u2502\n\u2502 live:                                                                                   \u2502\n\u2502   CacheClusterId: my-cluster-003                                                        \u2502\n\u2502   ClientDownloadLandingPage: https://console.aws.amazon.com/elasticache/home#client-do\u2026 \u2502\n\u2502   CacheNodeType: cache.t2.micro                                                         \u2502\n\u2502   Engine: redis                                                                         \u2502\n\u2502   EngineVersion: 6.2.6                                                                  \u2502\n\u2502   CacheClusterStatus: deleting                                                          \u2502\n\u2502   NumCacheNodes: 1                                                                      \u2502\n\u2502   PreferredAvailabilityZone: us-east-1a                                                 \u2502\n\u2502   CacheClusterCreateTime: 2022-10-27T21:28:11.858Z                                      \u2502\n\u2502   PreferredMaintenanceWindow: mon:06:00-mon:07:00                                       \u2502\n\u2502   PendingModifiedValues:                                                                \u2502\n\u2502   CacheParameterGroup:                                                                  \u2502\n\u2502     CacheParameterGroupName: my-parameter-group                                         \u2502\n\u2502     ParameterApplyStatus: in-sync                                                       \u2502\n\u2502     CacheNodeIdsToReboot: []                                                            \u2502\n\u2502   CacheSubnetGroupName: my-subnet-group                                                 \u2502\n\u2502   AutoMinorVersionUpgrade: true                                                         \u2502\n\u2502   SecurityGroups:                                                                       \u2502\n\u2502     - SecurityGroupId: sg-0cc06c2c929f673a0                                             \u2502\n\u2502       Status: active                                                                    \u2502\n\u2502   ReplicationGroupId: my-cluster                                                        \u2502\n\u2502   SnapshotRetentionLimit: 0                                                             \u2502\n\u2502   SnapshotWindow: 10:00-11:00                                                           \u2502\n\u2502   AuthTokenEnabled: false                                                               \u2502\n\u2502   TransitEncryptionEnabled: false                                                       \u2502\n\u2502   AtRestEncryptionEnabled: false                                                        \u2502\n\u2502   ARN: arn:aws:elasticache:us-east-1:840541460064:cluster:my-cluster-003                \u2502\n\u2502   ReplicationGroupLogDeliveryEnabled: true                                              \u2502\n\u2502   Tags: []                                                                              \u2502\n\u2502                                                                                         \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\nList Summary:\nProvider: aws\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 aws                                                                                    \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 ElastiCache::CacheCluster \u2502 my-cluster-001                                             \u2502\n\u2502                           \u2502 my-cluster-002                                             \u2502\n\u2502                           \u2502 my-cluster-003                                             \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n3 resources, 1 type, 1 provider\nCommand "gc l -t ElastiCache::CacheCluster" executed in 3s, 107 MB\n')))}p.isMDXComponent=!0}}]);