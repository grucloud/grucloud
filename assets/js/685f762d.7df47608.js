"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[33121],{3905:function(e,r,t){t.d(r,{Zo:function(){return p},kt:function(){return m}});var n=t(67294);function o(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function a(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function i(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?a(Object(t),!0).forEach((function(r){o(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function c(e,r){if(null==e)return{};var t,n,o=function(e,r){if(null==e)return{};var t,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)t=a[n],r.indexOf(t)>=0||(o[t]=e[t]);return o}(e,r);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)t=a[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var s=n.createContext({}),l=function(e){var r=n.useContext(s),t=r;return e&&(t="function"==typeof e?e(r):i(i({},r),e)),t},p=function(e){var r=l(e.components);return n.createElement(s.Provider,{value:r},e.children)},u={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},y=n.forwardRef((function(e,r){var t=e.components,o=e.mdxType,a=e.originalType,s=e.parentName,p=c(e,["components","mdxType","originalType","parentName"]),y=l(t),m=o,f=y["".concat(s,".").concat(m)]||y[m]||u[m]||a;return t?n.createElement(f,i(i({ref:r},p),{},{components:t})):n.createElement(f,i({ref:r},p))}));function m(e,r){var t=arguments,o=r&&r.mdxType;if("string"==typeof e||o){var a=t.length,i=new Array(a);i[0]=y;var c={};for(var s in r)hasOwnProperty.call(r,s)&&(c[s]=r[s]);c.originalType=e,c.mdxType="string"==typeof e?e:o,i[1]=c;for(var l=2;l<a;l++)i[l]=t[l];return n.createElement.apply(null,i)}return n.createElement.apply(null,t)}y.displayName="MDXCreateElement"},24093:function(e,r,t){t.r(r),t.d(r,{frontMatter:function(){return c},contentTitle:function(){return s},metadata:function(){return l},toc:function(){return p},default:function(){return y}});var n=t(87462),o=t(63366),a=(t(67294),t(3905)),i=["components"],c={id:"Repository",title:"Repository"},s=void 0,l={unversionedId:"aws/resources/ECR/Repository",id:"aws/resources/ECR/Repository",isDocsHomePage:!1,title:"Repository",description:"Manages a Docker Repository",source:"@site/docs/aws/resources/ECR/Repository.md",sourceDirName:"aws/resources/ECR",slug:"/aws/resources/ECR/Repository",permalink:"/docs/aws/resources/ECR/Repository",tags:[],version:"current",frontMatter:{id:"Repository",title:"Repository"},sidebar:"docs",previous:{title:"Registry",permalink:"/docs/aws/resources/ECR/Registry"},next:{title:"CapacityProvider",permalink:"/docs/aws/resources/ECS/CapacityProvider"}},p=[{value:"Sample Code",id:"sample-code",children:[{value:"Full Examples",id:"full-examples",children:[],level:3},{value:"Properties",id:"properties",children:[],level:3}],level:2}],u={toc:p};function y(e){var r=e.components,t=(0,o.Z)(e,i);return(0,a.kt)("wrapper",(0,n.Z)({},u,t,{components:r,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Manages a ",(0,a.kt)("a",{parentName:"p",href:"https://console.aws.amazon.com/ecr/home"},"Docker Repository")),(0,a.kt)("h2",{id:"sample-code"},"Sample Code"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Repository",\n    group: "ECR",\n    name: "starhackit/lb",\n    properties: ({ config }) => ({\n      imageTagMutability: "MUTABLE",\n      imageScanningConfiguration: {\n        scanOnPush: false,\n      },\n      encryptionConfiguration: {\n        encryptionType: "AES256",\n      },\n      policyText: {\n        Version: "2008-10-17",\n        Statement: [\n          {\n            Sid: "AllowPushPull",\n            Effect: "Allow",\n            Principal: {\n              AWS: `arn:aws:iam::${config.accountId()}:root`,\n            },\n            Action: [\n              "ecr:GetDownloadUrlForLayer",\n              "ecr:BatchGetImage",\n              "ecr:BatchCheckLayerAvailability",\n              "ecr:PutImage",\n              "ecr:InitiateLayerUpload",\n              "ecr:UploadLayerPart",\n              "ecr:CompleteLayerUpload",\n            ],\n          },\n        ],\n      },\n      lifecyclePolicyText: {\n        rules: [\n          {\n            rulePriority: 1,\n            description: "Expire images older than 14 days",\n            selection: {\n              tagStatus: "untagged",\n              countType: "sinceImagePushed",\n              countUnit: "days",\n              countNumber: 14,\n            },\n            action: {\n              type: "expire",\n            },\n          },\n        ],\n      },\n    }),\n  },\n];\n')),(0,a.kt)("h3",{id:"full-examples"},"Full Examples"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/ECR/repository"},"Registry and Repository"))),(0,a.kt)("h3",{id:"properties"},"Properties"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECR.html#createRepository-property"},"properties list"))))}y.isMDXComponent=!0}}]);