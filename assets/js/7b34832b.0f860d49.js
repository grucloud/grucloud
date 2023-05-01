"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[81056],{3905:(e,r,t)=>{t.d(r,{Zo:()=>l,kt:()=>y});var n=t(67294);function i(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function a(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function s(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?a(Object(t),!0).forEach((function(r){i(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function o(e,r){if(null==e)return{};var t,n,i=function(e,r){if(null==e)return{};var t,n,i={},a=Object.keys(e);for(n=0;n<a.length;n++)t=a[n],r.indexOf(t)>=0||(i[t]=e[t]);return i}(e,r);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)t=a[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var u=n.createContext({}),p=function(e){var r=n.useContext(u),t=r;return e&&(t="function"==typeof e?e(r):s(s({},r),e)),t},l=function(e){var r=p(e.components);return n.createElement(u.Provider,{value:r},e.children)},c="mdxType",d={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},m=n.forwardRef((function(e,r){var t=e.components,i=e.mdxType,a=e.originalType,u=e.parentName,l=o(e,["components","mdxType","originalType","parentName"]),c=p(t),m=i,y=c["".concat(u,".").concat(m)]||c[m]||d[m]||a;return t?n.createElement(y,s(s({ref:r},l),{},{components:t})):n.createElement(y,s({ref:r},l))}));function y(e,r){var t=arguments,i=r&&r.mdxType;if("string"==typeof e||i){var a=t.length,s=new Array(a);s[0]=m;var o={};for(var u in r)hasOwnProperty.call(r,u)&&(o[u]=r[u]);o.originalType=e,o[c]="string"==typeof e?e:i,s[1]=o;for(var p=2;p<a;p++)s[p]=t[p];return n.createElement.apply(null,s)}return n.createElement.apply(null,t)}m.displayName="MDXCreateElement"},47837:(e,r,t)=>{t.r(r),t.d(r,{assets:()=>u,contentTitle:()=>s,default:()=>d,frontMatter:()=>a,metadata:()=>o,toc:()=>p});var n=t(87462),i=(t(67294),t(3905));const a={id:"BuildStep",title:"BuildStep"},s=void 0,o={unversionedId:"azure/resources/ContainerRegistry/BuildStep",id:"azure/resources/ContainerRegistry/BuildStep",title:"BuildStep",description:"Provides a BuildStep from the ContainerRegistry group",source:"@site/docs/azure/resources/ContainerRegistry/BuildStep.md",sourceDirName:"azure/resources/ContainerRegistry",slug:"/azure/resources/ContainerRegistry/BuildStep",permalink:"/docs/azure/resources/ContainerRegistry/BuildStep",draft:!1,tags:[],version:"current",frontMatter:{id:"BuildStep",title:"BuildStep"},sidebar:"docs",previous:{title:"AgentPool",permalink:"/docs/azure/resources/ContainerRegistry/AgentPool"},next:{title:"BuildTask",permalink:"/docs/azure/resources/ContainerRegistry/BuildTask"}},u={},p=[{value:"Examples",id:"examples",level:2},{value:"BuildSteps_Create",id:"buildsteps_create",level:3},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],l={toc:p},c="wrapper";function d(e){let{components:r,...t}=e;return(0,i.kt)(c,(0,n.Z)({},l,t,{components:r,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Provides a ",(0,i.kt)("strong",{parentName:"p"},"BuildStep")," from the ",(0,i.kt)("strong",{parentName:"p"},"ContainerRegistry")," group"),(0,i.kt)("h2",{id:"examples"},"Examples"),(0,i.kt)("h3",{id:"buildsteps_create"},"BuildSteps_Create"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "BuildStep",\n    group: "ContainerRegistry",\n    name: "myBuildStep",\n    properties: () => ({\n      properties: {\n        type: "Docker",\n        imageNames: ["azurerest:testtag"],\n        dockerFilePath: "subfolder/Dockerfile",\n        contextPath: "dockerfiles",\n        isPushEnabled: true,\n        noCache: true,\n        buildArguments: [\n          {\n            type: "DockerBuildArgument",\n            name: "mytestargument",\n            value: "mytestvalue",\n            isSecret: false,\n          },\n          {\n            type: "DockerBuildArgument",\n            name: "mysecrettestargument",\n            value: "mysecrettestvalue",\n            isSecret: true,\n          },\n        ],\n      },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      registry: "myRegistry",\n      buildTask: "myBuildTask",\n    }),\n  },\n];\n\n')),(0,i.kt)("h2",{id:"dependencies"},"Dependencies"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/ContainerRegistry/Registry"},"Registry")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/ContainerRegistry/BuildTask"},"BuildTask"))),(0,i.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"{\n  description: 'Build step resource properties',\n  type: 'object',\n  allOf: [\n    {\n      description: 'The resource model definition for a ARM proxy resource. It will have everything other than required location and tags.',\n      properties: {\n        id: {\n          description: 'The resource ID.',\n          type: 'string',\n          readOnly: true\n        },\n        name: {\n          description: 'The name of the resource.',\n          type: 'string',\n          readOnly: true\n        },\n        type: {\n          description: 'The type of the resource.',\n          type: 'string',\n          readOnly: true\n        }\n      },\n      'x-ms-azure-resource': true\n    }\n  ],\n  properties: {\n    properties: {\n      description: 'The properties of a build step.',\n      type: 'object',\n      properties: {\n        provisioningState: {\n          description: 'The provisioning state of the build step.',\n          enum: [\n            'Creating',\n            'Updating',\n            'Deleting',\n            'Succeeded',\n            'Failed',\n            'Canceled'\n          ],\n          type: 'string',\n          readOnly: true,\n          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }\n        },\n        type: {\n          description: 'The type of the step.',\n          enum: [ 'Docker' ],\n          type: 'string',\n          readOnly: true,\n          'x-ms-enum': { name: 'BuildStepType', modelAsString: true }\n        }\n      },\n      discriminator: 'type'\n    }\n  }\n}\n")),(0,i.kt)("h2",{id:"misc"},"Misc"),(0,i.kt)("p",null,"The resource version is ",(0,i.kt)("inlineCode",{parentName:"p"},"2018-02-01-preview"),"."),(0,i.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerregistry/resource-manager/Microsoft.ContainerRegistry/preview/2018-02-01-preview/containerregistry_build.json"},"here"),"."))}d.isMDXComponent=!0}}]);