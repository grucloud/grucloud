"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[34496],{3905:(e,t,a)=>{a.d(t,{Zo:()=>c,kt:()=>y});var n=a(67294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function s(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?s(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):s(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function i(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},s=Object.keys(e);for(n=0;n<s.length;n++)a=s[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(n=0;n<s.length;n++)a=s[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var l=n.createContext({}),u=function(e){var t=n.useContext(l),a=t;return e&&(a="function"==typeof e?e(t):o(o({},t),e)),a},c=function(e){var t=u(e.components);return n.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,s=e.originalType,l=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),d=u(a),y=r,b=d["".concat(l,".").concat(y)]||d[y]||p[y]||s;return a?n.createElement(b,o(o({ref:t},c),{},{components:a})):n.createElement(b,o({ref:t},c))}));function y(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var s=a.length,o=new Array(s);o[0]=d;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i.mdxType="string"==typeof e?e:r,o[1]=i;for(var u=2;u<s;u++)o[u]=a[u];return n.createElement.apply(null,o)}return n.createElement.apply(null,a)}d.displayName="MDXCreateElement"},64908:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>l,contentTitle:()=>o,default:()=>p,frontMatter:()=>s,metadata:()=>i,toc:()=>u});var n=a(87462),r=(a(67294),a(3905));const s={id:"TransitGatewayRouteTable",title:"Transit Gateway Route Table"},o=void 0,i={unversionedId:"aws/resources/EC2/TransitGatewayRouteTable",id:"aws/resources/EC2/TransitGatewayRouteTable",title:"Transit Gateway Route Table",description:"Provides a Transit Gateway Route Table",source:"@site/docs/aws/resources/EC2/TransitGatewayRouteTable.md",sourceDirName:"aws/resources/EC2",slug:"/aws/resources/EC2/TransitGatewayRouteTable",permalink:"/docs/aws/resources/EC2/TransitGatewayRouteTable",draft:!1,tags:[],version:"current",frontMatter:{id:"TransitGatewayRouteTable",title:"Transit Gateway Route Table"},sidebar:"docs",previous:{title:"Transit Gateway Route",permalink:"/docs/aws/resources/EC2/TransitGatewayRoute"},next:{title:"Transit Gateway Route Table Association",permalink:"/docs/aws/resources/EC2/TransitGatewayRouteTableAssociation"}},l={},u=[{value:"Examples",id:"examples",level:3},{value:"Properties",id:"properties",level:3},{value:"Dependencies",id:"dependencies",level:3},{value:"Used By",id:"used-by",level:3},{value:"List",id:"list",level:3}],c={toc:u};function p(e){let{components:t,...a}=e;return(0,r.kt)("wrapper",(0,n.Z)({},c,a,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"Provides a ",(0,r.kt)("a",{parentName:"p",href:"https://console.aws.amazon.com/vpc/home?#TransitGatewayRouteTables:"},"Transit Gateway Route Table")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "TransitGatewayRouteTable",\n    group: "EC2",\n    name: "tgw-rtb-transit-gateway-default",\n    readOnly: true,\n    properties: ({}) => ({\n      DefaultAssociationRouteTable: true,\n      DefaultPropagationRouteTable: true,\n    }),\n    dependencies: () => ({\n      transitGateway: "transit-gateway",\n    }),\n  },\n];\n')),(0,r.kt)("h3",{id:"examples"},"Examples"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/TransitGateway/transit-gateway"},"transit gateway")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/aws-samples/hub-and-spoke-with-inspection-vpc"},"hub-and-spoke-with-inspection-vpc"))),(0,r.kt)("h3",{id:"properties"},"Properties"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/createtransitgatewayroutetablecommandinput.html"},"CreateTransitGatewayRouteTableCommandInput"))),(0,r.kt)("h3",{id:"dependencies"},"Dependencies"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/TransitGateway"},"TransitGateway"))),(0,r.kt)("h3",{id:"used-by"},"Used By"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/TransitGatewayRouteTableAssociation"},"TransitGatewayRouteTableAssociation"))),(0,r.kt)("h3",{id:"list"},"List"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t EC2::TransitGatewayRouteTable\n")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-sh"},'Listing resources on 1 provider: aws\n\u2713 aws\n  \u2713 Initialising\n  \u2713 Listing 1/1\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 2 EC2::TransitGatewayRouteTable from aws                                   \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: Inspection_VPC_Route_Table                                           \u2502\n\u2502 managedByUs: Yes                                                           \u2502\n\u2502 live:                                                                      \u2502\n\u2502   TransitGatewayRouteTableId: tgw-rtb-0b8c3178242478505                    \u2502\n\u2502   TransitGatewayId: tgw-0253874e089f68280                                  \u2502\n\u2502   State: available                                                         \u2502\n\u2502   DefaultAssociationRouteTable: false                                      \u2502\n\u2502   DefaultPropagationRouteTable: false                                      \u2502\n\u2502   CreationTime: 2022-05-02T13:42:42.000Z                                   \u2502\n\u2502   Tags:                                                                    \u2502\n\u2502     - Key: gc-created-by-provider                                          \u2502\n\u2502       Value: aws                                                           \u2502\n\u2502     - Key: gc-managed-by                                                   \u2502\n\u2502       Value: grucloud                                                      \u2502\n\u2502     - Key: gc-project-name                                                 \u2502\n\u2502       Value: hub-and-spoke-with-inspection-vpc                             \u2502\n\u2502     - Key: gc-stage                                                        \u2502\n\u2502       Value: dev                                                           \u2502\n\u2502     - Key: Name                                                            \u2502\n\u2502       Value: Inspection_VPC_Route_Table                                    \u2502\n\u2502                                                                            \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: Spoke_VPC_Route_Table                                                \u2502\n\u2502 managedByUs: Yes                                                           \u2502\n\u2502 live:                                                                      \u2502\n\u2502   TransitGatewayRouteTableId: tgw-rtb-00c4b3773b8d82089                    \u2502\n\u2502   TransitGatewayId: tgw-0253874e089f68280                                  \u2502\n\u2502   State: available                                                         \u2502\n\u2502   DefaultAssociationRouteTable: false                                      \u2502\n\u2502   DefaultPropagationRouteTable: false                                      \u2502\n\u2502   CreationTime: 2022-05-02T13:42:42.000Z                                   \u2502\n\u2502   Tags:                                                                    \u2502\n\u2502     - Key: gc-created-by-provider                                          \u2502\n\u2502       Value: aws                                                           \u2502\n\u2502     - Key: gc-managed-by                                                   \u2502\n\u2502       Value: grucloud                                                      \u2502\n\u2502     - Key: gc-project-name                                                 \u2502\n\u2502       Value: hub-and-spoke-with-inspection-vpc                             \u2502\n\u2502     - Key: gc-stage                                                        \u2502\n\u2502       Value: dev                                                           \u2502\n\u2502     - Key: Name                                                            \u2502\n\u2502       Value: Spoke_VPC_Route_Table                                         \u2502\n\u2502                                                                            \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\nList Summary:\nProvider: aws\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 aws                                                                       \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 EC2::TransitGatewayRouteTable \u2502 Inspection_VPC_Route_Table                \u2502\n\u2502                               \u2502 Spoke_VPC_Route_Table                     \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n2 resources, 1 type, 1 provider\nCommand "gc l -t EC2::TransitGatewayRouteTable" executed in 4s, 165 MB\n')))}p.isMDXComponent=!0}}]);