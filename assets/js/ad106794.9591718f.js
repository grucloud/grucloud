"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[20052],{3905:function(e,r,t){t.d(r,{Zo:function(){return i},kt:function(){return d}});var n=t(67294);function a(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function o(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function s(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?o(Object(t),!0).forEach((function(r){a(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function p(e,r){if(null==e)return{};var t,n,a=function(e,r){if(null==e)return{};var t,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)t=o[n],r.indexOf(t)>=0||(a[t]=e[t]);return a}(e,r);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)t=o[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var c=n.createContext({}),l=function(e){var r=n.useContext(c),t=r;return e&&(t="function"==typeof e?e(r):s(s({},r),e)),t},i=function(e){var r=l(e.components);return n.createElement(c.Provider,{value:r},e.children)},u={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},m=n.forwardRef((function(e,r){var t=e.components,a=e.mdxType,o=e.originalType,c=e.parentName,i=p(e,["components","mdxType","originalType","parentName"]),m=l(t),d=a,y=m["".concat(c,".").concat(d)]||m[d]||u[d]||o;return t?n.createElement(y,s(s({ref:r},i),{},{components:t})):n.createElement(y,s({ref:r},i))}));function d(e,r){var t=arguments,a=r&&r.mdxType;if("string"==typeof e||a){var o=t.length,s=new Array(o);s[0]=m;var p={};for(var c in r)hasOwnProperty.call(r,c)&&(p[c]=r[c]);p.originalType=e,p.mdxType="string"==typeof e?e:a,s[1]=p;for(var l=2;l<o;l++)s[l]=t[l];return n.createElement.apply(null,s)}return n.createElement.apply(null,t)}m.displayName="MDXCreateElement"},89930:function(e,r,t){t.r(r),t.d(r,{frontMatter:function(){return p},contentTitle:function(){return c},metadata:function(){return l},toc:function(){return i},default:function(){return m}});var n=t(87462),a=t(63366),o=(t(67294),t(3905)),s=["components"],p={id:"DBProxy",title:"DB Proxy"},c=void 0,l={unversionedId:"aws/resources/RDS/DBProxy",id:"aws/resources/RDS/DBProxy",isDocsHomePage:!1,title:"DB Proxy",description:"Manages a DB Proxy.",source:"@site/docs/aws/resources/RDS/DBProxy.md",sourceDirName:"aws/resources/RDS",slug:"/aws/resources/RDS/DBProxy",permalink:"/docs/aws/resources/RDS/DBProxy",tags:[],version:"current",frontMatter:{id:"DBProxy",title:"DB Proxy"},sidebar:"docs",previous:{title:"DB Instance",permalink:"/docs/aws/resources/RDS/DBInstance"},next:{title:"DB Proxy Target Group",permalink:"/docs/aws/resources/RDS/DBProxyTargetGroup"}},i=[{value:"Example",id:"example",children:[],level:2},{value:"Code Examples",id:"code-examples",children:[],level:2},{value:"Properties",id:"properties",children:[],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"List",id:"list",children:[],level:2}],u={toc:i};function m(e){var r=e.components,t=(0,a.Z)(e,s);return(0,o.kt)("wrapper",(0,n.Z)({},u,t,{components:r,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Manages a ",(0,o.kt)("a",{parentName:"p",href:"https://console.aws.amazon.com/rds/home?#databases:"},"DB Proxy"),"."),(0,o.kt)("h2",{id:"example"},"Example"),(0,o.kt)("p",null,"Deploy a DB Proxy:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "DBProxy",\n    group: "RDS",\n    name: "rds-proxy",\n    properties: ({ getId }) => ({\n      EngineFamily: "MYSQL",\n      Auth: [\n        {\n          AuthScheme: "SECRETS",\n          SecretArn: `${getId({\n            type: "Secret",\n            group: "SecretsManager",\n            name: "sam-app-cluster-secret",\n          })}`,\n          IAMAuth: "REQUIRED",\n        },\n      ],\n      RequireTLS: true,\n      IdleClientTimeout: 120,\n      DebugLogging: false,\n    }),\n    dependencies: ({}) => ({\n      subnets: [\n        "sam-app-vpc::sam-app-prv-sub-1",\n        "sam-app-vpc::sam-app-prv-sub-2",\n        "sam-app-vpc::sam-app-prv-sub-3",\n      ],\n      securityGroups: ["sg::sam-app-vpc::sam-app-database-sg"],\n      secret: ["sam-app-cluster-secret"],\n      role: "sam-app-dbProxyRole-1BMIN3H39UUK3",\n    }),\n  },\n];\n')),(0,o.kt)("h2",{id:"code-examples"},"Code Examples"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/apigw-http-api-lambda-rds-proxy"},"apigw-http-api-lambda-rds-proxy"))),(0,o.kt)("h2",{id:"properties"},"Properties"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-rds/interfaces/createdbproxycommandinput.html"},"CreateDBProxyCommandInput"))),(0,o.kt)("h2",{id:"dependencies"},"Dependencies"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/aws/resources/RDS/DBSubnetGroup"},"DB Subnet Group")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/SecurityGroup"},"Security Group")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/aws/resources/SecretsManager/Secret"},"Secret")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/aws/resources/IAM/Role"},"Role"))),(0,o.kt)("h2",{id:"list"},"List"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t DBProxy\n")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-txt"},"")))}m.isMDXComponent=!0}}]);