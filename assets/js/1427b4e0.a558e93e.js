"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[22886],{3905:(e,t,r)=>{r.d(t,{Zo:()=>u,kt:()=>d});var n=r(67294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var s=n.createContext({}),p=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},u=function(e){var t=p(e.components);return n.createElement(s.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,s=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),m=p(r),d=a,y=m["".concat(s,".").concat(d)]||m[d]||c[d]||o;return r?n.createElement(y,i(i({ref:t},u),{},{components:r})):n.createElement(y,i({ref:t},u))}));function d(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,i=new Array(o);i[0]=m;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:a,i[1]=l;for(var p=2;p<o;p++)i[p]=r[p];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},79807:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>s,contentTitle:()=>i,default:()=>c,frontMatter:()=>o,metadata:()=>l,toc:()=>p});var n=r(87462),a=(r(67294),r(3905));const o={id:"Authorizer",title:"Authorizer"},i=void 0,l={unversionedId:"aws/resources/APIGateway/Authorizer",id:"aws/resources/APIGateway/Authorizer",title:"Authorizer",description:"Manages an API Gateway Authorizer.",source:"@site/docs/aws/resources/APIGateway/Authorizer.md",sourceDirName:"aws/resources/APIGateway",slug:"/aws/resources/APIGateway/Authorizer",permalink:"/docs/aws/resources/APIGateway/Authorizer",draft:!1,tags:[],version:"current",frontMatter:{id:"Authorizer",title:"Authorizer"},sidebar:"docs",previous:{title:"ApiKey",permalink:"/docs/aws/resources/APIGateway/ApiKey"},next:{title:"Integration",permalink:"/docs/aws/resources/APIGateway/Integration"}},s={},p=[{value:"Sample code",id:"sample-code",level:2},{value:"Properties",id:"properties",level:2},{value:"Dependencies",id:"dependencies",level:2},{value:"Full Examples",id:"full-examples",level:2},{value:"List",id:"list",level:2}],u={toc:p};function c(e){let{components:t,...r}=e;return(0,a.kt)("wrapper",(0,n.Z)({},u,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Manages an ",(0,a.kt)("a",{parentName:"p",href:"https://console.aws.amazon.com/apigateway/main/apis"},"API Gateway Authorizer"),"."),(0,a.kt)("h2",{id:"sample-code"},"Sample code"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "RestApi",\n    group: "APIGateway",\n    name: "PetStore",\n    properties: ({}) => ({\n      apiKeySource: "HEADER",\n      endpointConfiguration: {\n        types: ["REGIONAL"],\n      },\n      schemaFile: "PetStore.oas30.json",\n      deployment: {\n        stageName: "dev",\n      },\n    }),\n  },\n  {\n    type: "Authorizer",\n    group: "APIGateway",\n    name: "my-authorizer-stage-dev",\n    dependencies: () => ({\n      restApi: "PetStore",\n    }),\n    properties: ({}) => ({}),\n  },\n];\n')),(0,a.kt)("h2",{id:"properties"},"Properties"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-api-gateway/interfaces/createauthorizercommandinput.html"},"CreateAuthorizerCommandInput"))),(0,a.kt)("h2",{id:"dependencies"},"Dependencies"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/aws/resources/APIGateway/RestApi"},"RestAPI"))),(0,a.kt)("h2",{id:"full-examples"},"Full Examples"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/APIGateway/restapi-lambda"},"RestAPI with Lambda"))),(0,a.kt)("h2",{id:"list"},"List"),(0,a.kt)("p",null,"The authorizers can be filtered with the ",(0,a.kt)("em",{parentName:"p"},"Authorizer")," type:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t Authorizer\n")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-txt"},"")))}c.isMDXComponent=!0}}]);