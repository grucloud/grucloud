"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[97338],{3905:(e,t,a)=>{a.d(t,{Zo:()=>u,kt:()=>m});var r=a(67294);function n(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function o(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function l(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?o(Object(a),!0).forEach((function(t){n(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function s(e,t){if(null==e)return{};var a,r,n=function(e,t){if(null==e)return{};var a,r,n={},o=Object.keys(e);for(r=0;r<o.length;r++)a=o[r],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)a=o[r],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var i=r.createContext({}),c=function(e){var t=r.useContext(i),a=t;return e&&(a="function"==typeof e?e(t):l(l({},t),e)),a},u=function(e){var t=c(e.components);return r.createElement(i.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var a=e.components,n=e.mdxType,o=e.originalType,i=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),d=c(a),m=n,y=d["".concat(i,".").concat(m)]||d[m]||p[m]||o;return a?r.createElement(y,l(l({ref:t},u),{},{components:a})):r.createElement(y,l({ref:t},u))}));function m(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var o=a.length,l=new Array(o);l[0]=d;var s={};for(var i in t)hasOwnProperty.call(t,i)&&(s[i]=t[i]);s.originalType=e,s.mdxType="string"==typeof e?e:n,l[1]=s;for(var c=2;c<o;c++)l[c]=a[c];return r.createElement.apply(null,l)}return r.createElement.apply(null,a)}d.displayName="MDXCreateElement"},49276:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>i,contentTitle:()=>l,default:()=>p,frontMatter:()=>o,metadata:()=>s,toc:()=>c});var r=a(87462),n=(a(67294),a(3905));const o={id:"Route",title:"Route"},l=void 0,s={unversionedId:"aws/resources/EC2/Route",id:"aws/resources/EC2/Route",title:"Route",description:"Create a route and associate it to an internet gateway or NAT gateway.",source:"@site/docs/aws/resources/EC2/Route.md",sourceDirName:"aws/resources/EC2",slug:"/aws/resources/EC2/Route",permalink:"/docs/aws/resources/EC2/Route",draft:!1,tags:[],version:"current",frontMatter:{id:"Route",title:"Route"},sidebar:"docs",previous:{title:"Network Access Control List",permalink:"/docs/aws/resources/EC2/NetworkAcl"},next:{title:"Route Table",permalink:"/docs/aws/resources/EC2/RouteTable"}},i={},c=[{value:"Example code",id:"example-code",level:2},{value:"Attach a route to an internet gateway",id:"attach-a-route-to-an-internet-gateway",level:3},{value:"Attach a route to a NAT gateway",id:"attach-a-route-to-a-nat-gateway",level:3},{value:"Attach a route to a VPC Endpoint",id:"attach-a-route-to-a-vpc-endpoint",level:3},{value:"Examples",id:"examples",level:2},{value:"Properties",id:"properties",level:2},{value:"Dependencies",id:"dependencies",level:2}],u={toc:c};function p(e){let{components:t,...a}=e;return(0,n.kt)("wrapper",(0,r.Z)({},u,a,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("p",null,"Create a route and associate it to an internet gateway or NAT gateway."),(0,n.kt)("h2",{id:"example-code"},"Example code"),(0,n.kt)("h3",{id:"attach-a-route-to-an-internet-gateway"},"Attach a route to an internet gateway"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Route",\n    group: "EC2",\n    properties: ({}) => ({\n      DestinationCidrBlock: "0.0.0.0/0",\n    }),\n    dependencies: () => ({\n      routeTable: "route-table",\n      ig: "ig",\n    }),\n  },\n];\n')),(0,n.kt)("h3",{id:"attach-a-route-to-a-nat-gateway"},"Attach a route to a NAT gateway"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Route",\n    group: "EC2",\n    properties: ({}) => ({\n      DestinationCidrBlock: "0.0.0.0/0",\n    }),\n    dependencies: () => ({\n      routeTable: "PrivateRouteTableUSEAST1D",\n      natGateway: "NATGateway",\n    }),\n  },\n];\n')),(0,n.kt)("h3",{id:"attach-a-route-to-a-vpc-endpoint"},"Attach a route to a VPC Endpoint"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Route",\n    group: "EC2",\n    dependencies: () => ({\n      routeTable: "project-vpc-endpoint-rtb-private1-us-east-1a",\n      vpcEndpoint: "project-vpc-endpoint-vpce-s3",\n    }),\n  },\n];\n')),(0,n.kt)("h2",{id:"examples"},"Examples"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/ec2-vpc"},"simple example")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/vpc-endpoint"},"vpc endpoint")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/transit-gateway"},"transit gateway")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/egress-only-internet-gateway"},"egress-only-internet-gateway"))),(0,n.kt)("h2",{id:"properties"},"Properties"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/createroutecommandinput.html"},"CreateRouteCommandInput"))),(0,n.kt)("h2",{id:"dependencies"},"Dependencies"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/RouteTable"},"Route Table")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/InternetGateway"},"Internet Gateway")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/NatGateway"},"Nat Gateway")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/VpcEndpoint"},"Vpc Endpoint")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/TransitGateway"},"Transit Gateway")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/EgressOnlyInternetGateway"},"EgressOnlyInternetGateway"))))}p.isMDXComponent=!0}}]);