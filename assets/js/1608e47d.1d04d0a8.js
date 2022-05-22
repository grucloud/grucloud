"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[62019],{3905:function(e,n,t){t.d(n,{Zo:function(){return c},kt:function(){return b}});var a=t(67294);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function s(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function u(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?s(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):s(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function l(e,n){if(null==e)return{};var t,a,r=function(e,n){if(null==e)return{};var t,a,r={},s=Object.keys(e);for(a=0;a<s.length;a++)t=s[a],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(a=0;a<s.length;a++)t=s[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var i=a.createContext({}),o=function(e){var n=a.useContext(i),t=n;return e&&(t="function"==typeof e?e(n):u(u({},n),e)),t},c=function(e){var n=o(e.components);return a.createElement(i.Provider,{value:n},e.children)},p={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},d=a.forwardRef((function(e,n){var t=e.components,r=e.mdxType,s=e.originalType,i=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),d=o(t),b=r,m=d["".concat(i,".").concat(b)]||d[b]||p[b]||s;return t?a.createElement(m,u(u({ref:n},c),{},{components:t})):a.createElement(m,u({ref:n},c))}));function b(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var s=t.length,u=new Array(s);u[0]=d;var l={};for(var i in n)hasOwnProperty.call(n,i)&&(l[i]=n[i]);l.originalType=e,l.mdxType="string"==typeof e?e:r,u[1]=l;for(var o=2;o<s;o++)u[o]=t[o];return a.createElement.apply(null,u)}return a.createElement.apply(null,t)}d.displayName="MDXCreateElement"},89789:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return l},contentTitle:function(){return i},metadata:function(){return o},toc:function(){return c},default:function(){return d}});var a=t(87462),r=t(63366),s=(t(67294),t(3905)),u=["components"],l={title:"Subnet"},i=void 0,o={unversionedId:"aws/resources/EC2/Subnet",id:"aws/resources/EC2/Subnet",isDocsHomePage:!1,title:"Subnet",description:"Provides an AWS subnet:",source:"@site/docs/aws/resources/EC2/Subnet.md",sourceDirName:"aws/resources/EC2",slug:"/aws/resources/EC2/Subnet",permalink:"/docs/aws/resources/EC2/Subnet",tags:[],version:"current",frontMatter:{title:"Subnet"},sidebar:"docs",previous:{title:"SecurityGroupRuleIngress",permalink:"/docs/aws/resources/EC2/SecurityGroupRuleIngress"},next:{title:"Transit Gateway",permalink:"/docs/aws/resources/EC2/TransitGateway"}},c=[{value:"Examples",id:"examples",children:[{value:"Simple subnet",id:"simple-subnet",children:[],level:3},{value:"Subnet with attributes:",id:"subnet-with-attributes",children:[],level:3},{value:"Subnet with Tags",id:"subnet-with-tags",children:[],level:3}],level:2},{value:"Code Examples",id:"code-examples",children:[],level:2},{value:"Properties",id:"properties",children:[],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"Used By",id:"used-by",children:[],level:2},{value:"Listing",id:"listing",children:[],level:2}],p={toc:c};function d(e){var n=e.components,t=(0,r.Z)(e,u);return(0,s.kt)("wrapper",(0,a.Z)({},p,t,{components:n,mdxType:"MDXLayout"}),(0,s.kt)("p",null,"Provides an ",(0,s.kt)("a",{parentName:"p",href:"https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Subnets.html"},"AWS subnet"),":"),(0,s.kt)("h2",{id:"examples"},"Examples"),(0,s.kt)("h3",{id:"simple-subnet"},"Simple subnet"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Subnet",\n    group: "EC2",\n    name: "PubSubnetAz1",\n    properties: ({ config }) => ({\n      CidrBlock: "10.0.0.0/24",\n      AvailabilityZone: `${config.region}a`,\n    }),\n    dependencies: () => ({\n      vpc: "Vpc",\n    }),\n  },\n];\n')),(0,s.kt)("h3",{id:"subnet-with-attributes"},"Subnet with attributes:"),(0,s.kt)("p",null,"The list of attributes can found in ",(0,s.kt)("a",{parentName:"p",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/modifysubnetattributecommandinput.html"},"ModifySubnetAttributeCommandInput")," function parameter."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Subnet",\n    group: "EC2",\n    name: "PubSubnetAz1",\n    properties: ({ config }) => ({\n      CidrBlock: "10.0.0.0/24",\n      AvailabilityZone: `${config.region}a`,\n      MapPublicIpOnLaunch: true,\n    }),\n    dependencies: () => ({\n      vpc: "Vpc",\n    }),\n  },\n];\n')),(0,s.kt)("h3",{id:"subnet-with-tags"},"Subnet with Tags"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Subnet",\n    group: "EC2",\n    name: "PubSubnetAz1",\n    properties: ({ config }) => ({\n      CidrBlock: "10.0.0.0/24",\n      AvailabilityZone: `${config.region}a`,\n      MapPublicIpOnLaunch: true,\n      Tags: [{ Key: "kubernetes.io/role/elb", Value: "1" }],\n    }),\n    dependencies: () => ({\n      vpc: "Vpc",\n    }),\n  },\n];\n')),(0,s.kt)("h2",{id:"code-examples"},"Code Examples"),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/ec2-vpc"},"simple example"))),(0,s.kt)("h2",{id:"properties"},"Properties"),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/createsubnetcommandinput.html"},"CreateSubnetCommandInput"))),(0,s.kt)("h2",{id:"dependencies"},"Dependencies"),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"./Vpc"},"Vpc"))),(0,s.kt)("h2",{id:"used-by"},"Used By"),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/SecurityGroup"},"SecurityGroup")),(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/EC2"},"EC2")),(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/RouteTableAssociation"},"RouteTableAssociation")),(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/NatGateway"},"NatGateway"))),(0,s.kt)("h2",{id:"listing"},"Listing"),(0,s.kt)("p",null,"List the subnets filtering by the type ",(0,s.kt)("inlineCode",{parentName:"p"},"Subnet")),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-sh"},"gc list --types Subnet\n")),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-sh"},'Listing resources on 1 provider: aws\n\u2713 aws\n  \u2713 Initialising\n  \u2713 Listing 2/2\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 5 Subnet from aws                                                                                    \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 Name             \u2502 Data                                                                       \u2502 Our  \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253c\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 subnet-public-1  \u2502 AvailabilityZone: eu-west-2a                                               \u2502 Yes  \u2502\n\u2502                  \u2502 AvailabilityZoneId: euw2-az2                                               \u2502      \u2502\n\u2502                  \u2502 AvailableIpAddressCount: 8186                                              \u2502      \u2502\n\u2502                  \u2502 CidrBlock: 192.168.0.0/19                                                  \u2502      \u2502\n\u2502                  \u2502 DefaultForAz: false                                                        \u2502      \u2502\n\u2502                  \u2502 MapPublicIpOnLaunch: true                                                  \u2502      \u2502\n\u2502                  \u2502 MapCustomerOwnedIpOnLaunch: false                                          \u2502      \u2502\n\u2502                  \u2502 State: available                                                           \u2502      \u2502\n\u2502                  \u2502 SubnetId: subnet-0bc901f569ce3e55c                                         \u2502      \u2502\n\u2502                  \u2502 VpcId: vpc-06d8eb1ddef9ed0f1                                               \u2502      \u2502\n\u2502                  \u2502 OwnerId: 840541460064                                                      \u2502      \u2502\n\u2502                  \u2502 AssignIpv6AddressOnCreation: false                                         \u2502      \u2502\n\u2502                  \u2502 Ipv6CidrBlockAssociationSet: []                                            \u2502      \u2502\n\u2502                  \u2502 Tags:                                                                      \u2502      \u2502\n\u2502                  \u2502   - Key: kubernetes.io/role/elb                                            \u2502      \u2502\n\u2502                  \u2502     Value: 1                                                               \u2502      \u2502\n\u2502                  \u2502   - Key: ManagedBy                                                         \u2502      \u2502\n\u2502                  \u2502     Value: GruCloud                                                        \u2502      \u2502\n\u2502                  \u2502   - Key: Name                                                              \u2502      \u2502\n\u2502                  \u2502     Value: subnet-public-1                                                 \u2502      \u2502\n\u2502                  \u2502   - Key: stage                                                             \u2502      \u2502\n\u2502                  \u2502     Value: dev                                                             \u2502      \u2502\n\u2502                  \u2502   - Key: CreatedByProvider                                                 \u2502      \u2502\n\u2502                  \u2502     Value: aws                                                             \u2502      \u2502\n\u2502                  \u2502   - Key: projectName                                                       \u2502      \u2502\n\u2502                  \u2502     Value: @grucloud/example-module-aws-eks                                \u2502      \u2502\n\u2502                  \u2502   - Key: kubernetes.io/cluster/cluster                                     \u2502      \u2502\n\u2502                  \u2502     Value: shared                                                          \u2502      \u2502\n\u2502                  \u2502 SubnetArn: arn:aws:ec2:eu-west-2:840541460064:subnet/subnet-0bc901f569ce3\u2026 \u2502      \u2502\n\u2502                  \u2502                                                                            \u2502      \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253c\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 subnet-private-2 \u2502 AvailabilityZone: eu-west-2b                                               \u2502 Yes  \u2502\n\u2502                  \u2502 AvailabilityZoneId: euw2-az3                                               \u2502      \u2502\n\u2502                  \u2502 AvailableIpAddressCount: 8187                                              \u2502      \u2502\n\u2502                  \u2502 CidrBlock: 192.168.128.0/19                                                \u2502      \u2502\n\u2502                  \u2502 DefaultForAz: false                                                        \u2502      \u2502\n\u2502                  \u2502 MapPublicIpOnLaunch: false                                                 \u2502      \u2502\n\u2502                  \u2502 MapCustomerOwnedIpOnLaunch: false                                          \u2502      \u2502\n\u2502                  \u2502 State: available                                                           \u2502      \u2502\n\u2502                  \u2502 SubnetId: subnet-0335cd853ab7b2cd1                                         \u2502      \u2502\n\u2502                  \u2502 VpcId: vpc-06d8eb1ddef9ed0f1                                               \u2502      \u2502\n\u2502                  \u2502 OwnerId: 840541460064                                                      \u2502      \u2502\n\u2502                  \u2502 AssignIpv6AddressOnCreation: false                                         \u2502      \u2502\n\u2502                  \u2502 Ipv6CidrBlockAssociationSet: []                                            \u2502      \u2502\n\u2502                  \u2502 Tags:                                                                      \u2502      \u2502\n\u2502                  \u2502   - Key: ManagedBy                                                         \u2502      \u2502\n\u2502                  \u2502     Value: GruCloud                                                        \u2502      \u2502\n\u2502                  \u2502   - Key: projectName                                                       \u2502      \u2502\n\u2502                  \u2502     Value: @grucloud/example-module-aws-eks                                \u2502      \u2502\n\u2502                  \u2502   - Key: kubernetes.io/cluster/cluster                                     \u2502      \u2502\n\u2502                  \u2502     Value: shared                                                          \u2502      \u2502\n\u2502                  \u2502   - Key: CreatedByProvider                                                 \u2502      \u2502\n\u2502                  \u2502     Value: aws                                                             \u2502      \u2502\n\u2502                  \u2502   - Key: Name                                                              \u2502      \u2502\n\u2502                  \u2502     Value: subnet-private-2                                                \u2502      \u2502\n\u2502                  \u2502   - Key: kubernetes.io/role/internal-elb                                   \u2502      \u2502\n\u2502                  \u2502     Value: 1                                                               \u2502      \u2502\n\u2502                  \u2502   - Key: stage                                                             \u2502      \u2502\n\u2502                  \u2502     Value: dev                                                             \u2502      \u2502\n\u2502                  \u2502 SubnetArn: arn:aws:ec2:eu-west-2:840541460064:subnet/subnet-0335cd853ab7b\u2026 \u2502      \u2502\n\u2502                  \u2502                                                                            \u2502      \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253c\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 subnet-private-1 \u2502 AvailabilityZone: eu-west-2a                                               \u2502 Yes  \u2502\n\u2502                  \u2502 AvailabilityZoneId: euw2-az2                                               \u2502      \u2502\n\u2502                  \u2502 AvailableIpAddressCount: 8187                                              \u2502      \u2502\n\u2502                  \u2502 CidrBlock: 192.168.96.0/19                                                 \u2502      \u2502\n\u2502                  \u2502 DefaultForAz: false                                                        \u2502      \u2502\n\u2502                  \u2502 MapPublicIpOnLaunch: false                                                 \u2502      \u2502\n\u2502                  \u2502 MapCustomerOwnedIpOnLaunch: false                                          \u2502      \u2502\n\u2502                  \u2502 State: available                                                           \u2502      \u2502\n\u2502                  \u2502 SubnetId: subnet-0e600c9492fbf10c7                                         \u2502      \u2502\n\u2502                  \u2502 VpcId: vpc-06d8eb1ddef9ed0f1                                               \u2502      \u2502\n\u2502                  \u2502 OwnerId: 840541460064                                                      \u2502      \u2502\n\u2502                  \u2502 AssignIpv6AddressOnCreation: false                                         \u2502      \u2502\n\u2502                  \u2502 Ipv6CidrBlockAssociationSet: []                                            \u2502      \u2502\n\u2502                  \u2502 Tags:                                                                      \u2502      \u2502\n\u2502                  \u2502   - Key: projectName                                                       \u2502      \u2502\n\u2502                  \u2502     Value: @grucloud/example-module-aws-eks                                \u2502      \u2502\n\u2502                  \u2502   - Key: ManagedBy                                                         \u2502      \u2502\n\u2502                  \u2502     Value: GruCloud                                                        \u2502      \u2502\n\u2502                  \u2502   - Key: kubernetes.io/cluster/cluster                                     \u2502      \u2502\n\u2502                  \u2502     Value: shared                                                          \u2502      \u2502\n\u2502                  \u2502   - Key: Name                                                              \u2502      \u2502\n\u2502                  \u2502     Value: subnet-private-1                                                \u2502      \u2502\n\u2502                  \u2502   - Key: CreatedByProvider                                                 \u2502      \u2502\n\u2502                  \u2502     Value: aws                                                             \u2502      \u2502\n\u2502                  \u2502   - Key: kubernetes.io/role/internal-elb                                   \u2502      \u2502\n\u2502                  \u2502     Value: 1                                                               \u2502      \u2502\n\u2502                  \u2502   - Key: stage                                                             \u2502      \u2502\n\u2502                  \u2502     Value: dev                                                             \u2502      \u2502\n\u2502                  \u2502 SubnetArn: arn:aws:ec2:eu-west-2:840541460064:subnet/subnet-0e600c9492fbf\u2026 \u2502      \u2502\n\u2502                  \u2502                                                                            \u2502      \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253c\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 subnet-public-2  \u2502 AvailabilityZone: eu-west-2b                                               \u2502 Yes  \u2502\n\u2502                  \u2502 AvailabilityZoneId: euw2-az3                                               \u2502      \u2502\n\u2502                  \u2502 AvailableIpAddressCount: 8187                                              \u2502      \u2502\n\u2502                  \u2502 CidrBlock: 192.168.32.0/19                                                 \u2502      \u2502\n\u2502                  \u2502 DefaultForAz: false                                                        \u2502      \u2502\n\u2502                  \u2502 MapPublicIpOnLaunch: true                                                  \u2502      \u2502\n\u2502                  \u2502 MapCustomerOwnedIpOnLaunch: false                                          \u2502      \u2502\n\u2502                  \u2502 State: available                                                           \u2502      \u2502\n\u2502                  \u2502 SubnetId: subnet-0a56a7f4e874f99fc                                         \u2502      \u2502\n\u2502                  \u2502 VpcId: vpc-06d8eb1ddef9ed0f1                                               \u2502      \u2502\n\u2502                  \u2502 OwnerId: 840541460064                                                      \u2502      \u2502\n\u2502                  \u2502 AssignIpv6AddressOnCreation: false                                         \u2502      \u2502\n\u2502                  \u2502 Ipv6CidrBlockAssociationSet: []                                            \u2502      \u2502\n\u2502                  \u2502 Tags:                                                                      \u2502      \u2502\n\u2502                  \u2502   - Key: kubernetes.io/role/elb                                            \u2502      \u2502\n\u2502                  \u2502     Value: 1                                                               \u2502      \u2502\n\u2502                  \u2502   - Key: CreatedByProvider                                                 \u2502      \u2502\n\u2502                  \u2502     Value: aws                                                             \u2502      \u2502\n\u2502                  \u2502   - Key: stage                                                             \u2502      \u2502\n\u2502                  \u2502     Value: dev                                                             \u2502      \u2502\n\u2502                  \u2502   - Key: kubernetes.io/cluster/cluster                                     \u2502      \u2502\n\u2502                  \u2502     Value: shared                                                          \u2502      \u2502\n\u2502                  \u2502   - Key: projectName                                                       \u2502      \u2502\n\u2502                  \u2502     Value: @grucloud/example-module-aws-eks                                \u2502      \u2502\n\u2502                  \u2502   - Key: ManagedBy                                                         \u2502      \u2502\n\u2502                  \u2502     Value: GruCloud                                                        \u2502      \u2502\n\u2502                  \u2502   - Key: Name                                                              \u2502      \u2502\n\u2502                  \u2502     Value: subnet-public-2                                                 \u2502      \u2502\n\u2502                  \u2502 SubnetArn: arn:aws:ec2:eu-west-2:840541460064:subnet/subnet-0a56a7f4e874f\u2026 \u2502      \u2502\n\u2502                  \u2502                                                                            \u2502      \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253c\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 default          \u2502 AvailabilityZone: eu-west-2a                                               \u2502 NO   \u2502\n\u2502                  \u2502 AvailabilityZoneId: euw2-az2                                               \u2502      \u2502\n\u2502                  \u2502 AvailableIpAddressCount: 4091                                              \u2502      \u2502\n\u2502                  \u2502 CidrBlock: 172.31.0.0/20                                                   \u2502      \u2502\n\u2502                  \u2502 DefaultForAz: true                                                         \u2502      \u2502\n\u2502                  \u2502 MapPublicIpOnLaunch: true                                                  \u2502      \u2502\n\u2502                  \u2502 MapCustomerOwnedIpOnLaunch: false                                          \u2502      \u2502\n\u2502                  \u2502 State: available                                                           \u2502      \u2502\n\u2502                  \u2502 SubnetId: subnet-0f6f085fc384bf8ce                                         \u2502      \u2502\n\u2502                  \u2502 VpcId: vpc-bbbafcd3                                                        \u2502      \u2502\n\u2502                  \u2502 OwnerId: 840541460064                                                      \u2502      \u2502\n\u2502                  \u2502 AssignIpv6AddressOnCreation: false                                         \u2502      \u2502\n\u2502                  \u2502 Ipv6CidrBlockAssociationSet: []                                            \u2502      \u2502\n\u2502                  \u2502 Tags: []                                                                   \u2502      \u2502\n\u2502                  \u2502 SubnetArn: arn:aws:ec2:eu-west-2:840541460064:subnet/subnet-0f6f085fc384b\u2026 \u2502      \u2502\n\u2502                  \u2502                                                                            \u2502      \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\nList Summary:\nProvider: aws\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 aws                                                                                                 \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 Subnet             \u2502 subnet-public-1                                                                \u2502\n\u2502                    \u2502 subnet-private-2                                                               \u2502\n\u2502                    \u2502 subnet-private-1                                                               \u2502\n\u2502                    \u2502 subnet-public-2                                                                \u2502\n\u2502                    \u2502 default                                                                        \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n5 resources, 1 type, 1 provider\nCommand "gc list --types Subnet" executed in 5s\n')))}d.isMDXComponent=!0}}]);