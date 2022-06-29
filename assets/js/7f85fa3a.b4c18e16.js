"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[22854],{3905:(e,r,t)=>{t.d(r,{Zo:()=>p,kt:()=>y});var n=t(67294);function s(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function u(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function o(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?u(Object(t),!0).forEach((function(r){s(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):u(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function a(e,r){if(null==e)return{};var t,n,s=function(e,r){if(null==e)return{};var t,n,s={},u=Object.keys(e);for(n=0;n<u.length;n++)t=u[n],r.indexOf(t)>=0||(s[t]=e[t]);return s}(e,r);if(Object.getOwnPropertySymbols){var u=Object.getOwnPropertySymbols(e);for(n=0;n<u.length;n++)t=u[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(s[t]=e[t])}return s}var c=n.createContext({}),i=function(e){var r=n.useContext(c),t=r;return e&&(t="function"==typeof e?e(r):o(o({},r),e)),t},p=function(e){var r=i(e.components);return n.createElement(c.Provider,{value:r},e.children)},l={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},d=n.forwardRef((function(e,r){var t=e.components,s=e.mdxType,u=e.originalType,c=e.parentName,p=a(e,["components","mdxType","originalType","parentName"]),d=i(t),y=s,m=d["".concat(c,".").concat(y)]||d[y]||l[y]||u;return t?n.createElement(m,o(o({ref:r},p),{},{components:t})):n.createElement(m,o({ref:r},p))}));function y(e,r){var t=arguments,s=r&&r.mdxType;if("string"==typeof e||s){var u=t.length,o=new Array(u);o[0]=d;var a={};for(var c in r)hasOwnProperty.call(r,c)&&(a[c]=r[c]);a.originalType=e,a.mdxType="string"==typeof e?e:s,o[1]=a;for(var i=2;i<u;i++)o[i]=t[i];return n.createElement.apply(null,o)}return n.createElement.apply(null,t)}d.displayName="MDXCreateElement"},16309:(e,r,t)=>{t.r(r),t.d(r,{assets:()=>c,contentTitle:()=>o,default:()=>l,frontMatter:()=>u,metadata:()=>a,toc:()=>i});var n=t(87462),s=(t(67294),t(3905));const u={id:"SecurityGroup",title:"Security Group"},o=void 0,a={unversionedId:"aws/resources/EC2/SecurityGroup",id:"aws/resources/EC2/SecurityGroup",title:"Security Group",description:"Create a security group, used to restrict network access to the EC2 instances.",source:"@site/docs/aws/resources/EC2/SecurityGroup.md",sourceDirName:"aws/resources/EC2",slug:"/aws/resources/EC2/SecurityGroup",permalink:"/docs/aws/resources/EC2/SecurityGroup",draft:!1,tags:[],version:"current",frontMatter:{id:"SecurityGroup",title:"Security Group"},sidebar:"docs",previous:{title:"Route Table Association",permalink:"/docs/aws/resources/EC2/RouteTableAssociation"},next:{title:"SecurityGroupRuleEgress",permalink:"/docs/aws/resources/EC2/SecurityGroupRuleEgress"}},c={},i=[{value:"Examples",id:"examples",level:3},{value:"Properties",id:"properties",level:3},{value:"Dependencies",id:"dependencies",level:3},{value:"Used By",id:"used-by",level:3}],p={toc:i};function l(e){let{components:r,...t}=e;return(0,s.kt)("wrapper",(0,n.Z)({},p,t,{components:r,mdxType:"MDXLayout"}),(0,s.kt)("p",null,"Create a security group, used to restrict network access to the EC2 instances."),(0,s.kt)("p",null,"Add new ingress and egress rules with ",(0,s.kt)("a",{parentName:"p",href:"./SecurityGroupRuleIngress"},"SecurityGroupRuleIngress")," and ",(0,s.kt)("a",{parentName:"p",href:"./SecurityGroupRuleEgress"},"SecurityGroupRuleEgress")),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "SecurityGroup",\n    group: "EC2",\n    properties: ({}) => ({\n      GroupName: "EcsSecurityGroup"\n      Description: "Managed By GruCloud",\n    }),\n    dependencies: () => ({\n      vpc: "Vpc",\n    }),\n  },\n];\n')),(0,s.kt)("h3",{id:"examples"},"Examples"),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/ec2-vpc"},"ec2-vpc"))),(0,s.kt)("h3",{id:"properties"},"Properties"),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/authorizesecuritygroupingresscommandinput.html"},"AuthorizeSecurityGroupIngressCommandInput"))),(0,s.kt)("h3",{id:"dependencies"},"Dependencies"),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/Vpc"},"Vpc"))),(0,s.kt)("h3",{id:"used-by"},"Used By"),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/EC2"},"EC2")),(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/SecurityGroupRuleIngress"},"SecurityGroupRuleIngress")),(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/SecurityGroupRuleEgress"},"SecurityGroupRuleEgress"))))}l.isMDXComponent=!0}}]);