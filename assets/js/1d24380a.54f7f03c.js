"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[75283],{3905:function(e,t,a){a.d(t,{Zo:function(){return l},kt:function(){return d}});var n=a(67294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function i(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?i(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):i(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function s(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},i=Object.keys(e);for(n=0;n<i.length;n++)a=i[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)a=i[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var c=n.createContext({}),u=function(e){var t=n.useContext(c),a=t;return e&&(a="function"==typeof e?e(t):o(o({},t),e)),a},l=function(e){var t=u(e.components);return n.createElement(c.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,i=e.originalType,c=e.parentName,l=s(e,["components","mdxType","originalType","parentName"]),m=u(a),d=r,w=m["".concat(c,".").concat(d)]||m[d]||p[d]||i;return a?n.createElement(w,o(o({ref:t},l),{},{components:a})):n.createElement(w,o({ref:t},l))}));function d(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=a.length,o=new Array(i);o[0]=m;var s={};for(var c in t)hasOwnProperty.call(t,c)&&(s[c]=t[c]);s.originalType=e,s.mdxType="string"==typeof e?e:r,o[1]=s;for(var u=2;u<i;u++)o[u]=a[u];return n.createElement.apply(null,o)}return n.createElement.apply(null,a)}m.displayName="MDXCreateElement"},24022:function(e,t,a){a.r(t),a.d(t,{frontMatter:function(){return s},contentTitle:function(){return c},metadata:function(){return u},toc:function(){return l},default:function(){return m}});var n=a(87462),r=a(63366),i=(a(67294),a(3905)),o=["components"],s={id:"TransitGatewayRoute",title:"Transit Gateway Route"},c=void 0,u={unversionedId:"aws/resources/EC2/TransitGatewayRoute",id:"aws/resources/EC2/TransitGatewayRoute",isDocsHomePage:!1,title:"Transit Gateway Route",description:"Provides a Transit Gateway Route",source:"@site/docs/aws/resources/EC2/TransitGatewayRoute.md",sourceDirName:"aws/resources/EC2",slug:"/aws/resources/EC2/TransitGatewayRoute",permalink:"/docs/aws/resources/EC2/TransitGatewayRoute",tags:[],version:"current",frontMatter:{id:"TransitGatewayRoute",title:"Transit Gateway Route"},sidebar:"docs",previous:{title:"TransitGatewayPeeringAttachment",permalink:"/docs/aws/resources/EC2/TransitGatewayPeeringAttachment"},next:{title:"Transit Gateway Route Table",permalink:"/docs/aws/resources/EC2/TransitGatewayRouteTable"}},l=[{value:"Examples",id:"examples",children:[],level:3},{value:"Dependencies",id:"dependencies",children:[],level:3},{value:"List",id:"list",children:[],level:3}],p={toc:l};function m(e){var t=e.components,a=(0,r.Z)(e,o);return(0,i.kt)("wrapper",(0,n.Z)({},p,a,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Provides a ",(0,i.kt)("a",{parentName:"p",href:"https://console.aws.amazon.com/vpc/home?#TransitGatewayRouteTables:"},"Transit Gateway Route")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "TransitGatewayRoute",\n    group: "EC2",\n    properties: ({}) => ({\n      DestinationCidrBlock: "0.0.0.0/0",\n    }),\n    dependencies: ({}) => ({\n      transitGatewayRouteTable: "tgw-rtb-transit-gateway-default",\n      transitGatewayVpcAttachment: "tgw-attachment",\n    }),\n  },\n];\n')),(0,i.kt)("h3",{id:"examples"},"Examples"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/transit-gateway"},"transit gateway")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/hub-and-spoke-with-inspection-vpc"},"hub-and-spoke-with-inspection-vpc"))),(0,i.kt)("p",null,"###\xa0Properties"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/createtransitgatewayroutecommandinput.html"},"CreateTransitGatewayRouteCommandInput"))),(0,i.kt)("h3",{id:"dependencies"},"Dependencies"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/TransitGatewayVpcAttachment"},"TransitGatewayVpcAttachment")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/TransitGatewayRouteTable"},"TransitGatewayRouteTable"))),(0,i.kt)("h3",{id:"list"},"List"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t EC2::TransitGatewayRoute\n")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-sh"},"Listing resources on 1 provider: aws\n\u2713 aws\n  \u2713 Initialising\n  \u2713 Listing 3/3\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 1 EC2::TransitGatewayRoute from aws                               \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: tgw-route::tgw-attachment::tgw-rtb--default::0.0.0.0/0      \u2502\n\u2502 managedByUs: NO                                                   \u2502\n\u2502 live:                                                             \u2502\n\u2502   DestinationCidrBlock: 0.0.0.0/0                                 \u2502\n\u2502   State: active                                                   \u2502\n\u2502   TransitGatewayRouteTableId: tgw-rtb-01e2e0a273b7d2ac3           \u2502\n\u2502   TransitGatewayAttachmentId: tgw-attach-02d27b501d16b7c68        \u2502\n\u2502                                                                   \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n")))}m.isMDXComponent=!0}}]);