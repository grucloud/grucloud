"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[6448],{3905:function(e,t,n){n.d(t,{Zo:function(){return i},kt:function(){return b}});var r=n(67294);function u(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){u(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,u=function(e,t){if(null==e)return{};var n,r,u={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(u[n]=e[n]);return u}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(u[n]=e[n])}return u}var p=r.createContext({}),l=function(e){var t=r.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},i=function(e){var t=l(e.components);return r.createElement(p.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,u=e.mdxType,a=e.originalType,p=e.parentName,i=s(e,["components","mdxType","originalType","parentName"]),d=l(n),b=u,m=d["".concat(p,".").concat(b)]||d[b]||c[b]||a;return n?r.createElement(m,o(o({ref:t},i),{},{components:n})):r.createElement(m,o({ref:t},i))}));function b(e,t){var n=arguments,u=t&&t.mdxType;if("string"==typeof e||u){var a=n.length,o=new Array(a);o[0]=d;var s={};for(var p in t)hasOwnProperty.call(t,p)&&(s[p]=t[p]);s.originalType=e,s.mdxType="string"==typeof e?e:u,o[1]=s;for(var l=2;l<a;l++)o[l]=n[l];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},75811:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return s},contentTitle:function(){return p},metadata:function(){return l},toc:function(){return i},default:function(){return d}});var r=n(87462),u=n(63366),a=(n(67294),n(3905)),o=["components"],s={id:"DBSubnetGroup",title:"DB Subnet Group"},p=void 0,l={unversionedId:"aws/resources/RDS/DBSubnetGroup",id:"aws/resources/RDS/DBSubnetGroup",isDocsHomePage:!1,title:"DB Subnet Group",description:"Manages a DB Subnet Group.",source:"@site/docs/aws/resources/RDS/DBSubnetGroup.md",sourceDirName:"aws/resources/RDS",slug:"/aws/resources/RDS/DBSubnetGroup",permalink:"/docs/aws/resources/RDS/DBSubnetGroup",tags:[],version:"current",frontMatter:{id:"DBSubnetGroup",title:"DB Subnet Group"},sidebar:"docs",previous:{title:"DB Instance",permalink:"/docs/aws/resources/RDS/DBInstance"},next:{title:"Hosted Zone",permalink:"/docs/aws/resources/Route53/HostedZone"}},i=[{value:"Example",id:"example",children:[],level:2},{value:"Code Examples",id:"code-examples",children:[],level:2},{value:"Properties",id:"properties",children:[],level:2},{value:"Used By",id:"used-by",children:[],level:2},{value:"List",id:"list",children:[],level:2}],c={toc:i};function d(e){var t=e.components,n=(0,u.Z)(e,o);return(0,a.kt)("wrapper",(0,r.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Manages a ",(0,a.kt)("a",{parentName:"p",href:"https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html"},"DB Subnet Group"),"."),(0,a.kt)("h2",{id:"example"},"Example"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "DBSubnetGroup",\n    group: "RDS",\n    name: "subnet-group-postgres",\n    properties: ({}) => ({\n      DBSubnetGroupDescription: "db subnet group",\n    }),\n    dependencies: () => ({\n      subnets: ["subnet-1", "subnet-2"],\n    }),\n  },\n];\n')),(0,a.kt)("h2",{id:"code-examples"},"Code Examples"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/RDS/postgres-stateless"},"stateless postgres"))),(0,a.kt)("h2",{id:"properties"},"Properties"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#createDBSubnetGroup-property"},"properties list"))),(0,a.kt)("h2",{id:"used-by"},"Used By"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/aws/resources/RDS/DBCluster"},"DB Cluster"))),(0,a.kt)("h2",{id:"list"},"List"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t DBSubnetGroup\n")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-txt"},'Listing resources on 1 provider: aws\n\u2713 aws\n  \u2713 Initialising\n  \u2713 Listing 1/1\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 1 RDS::DBSubnetGroup from aws                                          \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: subnet-group-postgres                                            \u2502\n\u2502 managedByUs: Yes                                                       \u2502\n\u2502 live:                                                                  \u2502\n\u2502   DBSubnetGroupName: subnet-group-postgres                             \u2502\n\u2502   DBSubnetGroupDescription: db subnet group                            \u2502\n\u2502   VpcId: vpc-0d5b0c96f249946d7                                         \u2502\n\u2502   SubnetGroupStatus: Complete                                          \u2502\n\u2502   Subnets:                                                             \u2502\n\u2502     - SubnetIdentifier: subnet-0ffb0ef569d4a8716                       \u2502\n\u2502       SubnetAvailabilityZone:                                          \u2502\n\u2502         Name: us-east-1a                                               \u2502\n\u2502       SubnetOutpost:                                                   \u2502\n\u2502       SubnetStatus: Active                                             \u2502\n\u2502     - SubnetIdentifier: subnet-0fa8cee733fa0d508                       \u2502\n\u2502       SubnetAvailabilityZone:                                          \u2502\n\u2502         Name: us-east-1b                                               \u2502\n\u2502       SubnetOutpost:                                                   \u2502\n\u2502       SubnetStatus: Active                                             \u2502\n\u2502   DBSubnetGroupArn: arn:aws:rds:us-east-1:840541460064:subgrp:subnet-\u2026 \u2502\n\u2502   Tags:                                                                \u2502\n\u2502     - Key: gc-created-by-provider                                      \u2502\n\u2502       Value: aws                                                       \u2502\n\u2502     - Key: gc-managed-by                                               \u2502\n\u2502       Value: grucloud                                                  \u2502\n\u2502     - Key: gc-project-name                                             \u2502\n\u2502       Value: @grucloud/example-aws-rds-postgres                        \u2502\n\u2502     - Key: gc-stage                                                    \u2502\n\u2502       Value: dev                                                       \u2502\n\u2502     - Key: mykey2                                                      \u2502\n\u2502       Value: myvalue                                                   \u2502\n\u2502     - Key: Name                                                        \u2502\n\u2502       Value: subnet-group-postgres                                     \u2502\n\u2502                                                                        \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\nList Summary:\nProvider: aws\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 aws                                                                   \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 RDS::DBSubnetGroup \u2502 subnet-group-postgres                            \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n1 resource, 1 type, 1 provider\nCommand "gc l -t DBSubnetGroup" executed in 4s, 216 MB\n')))}d.isMDXComponent=!0}}]);