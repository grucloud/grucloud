"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[33121],{3905:(e,n,t)=>{t.d(n,{Zo:()=>p,kt:()=>d});var r=t(67294);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){a(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function l(e,n){if(null==e)return{};var t,r,a=function(e,n){if(null==e)return{};var t,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var s=r.createContext({}),c=function(e){var n=r.useContext(s),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},p=function(e){var n=c(e.components);return r.createElement(s.Provider,{value:n},e.children)},u="mdxType",m={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},y=r.forwardRef((function(e,n){var t=e.components,a=e.mdxType,o=e.originalType,s=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),u=c(t),y=a,d=u["".concat(s,".").concat(y)]||u[y]||m[y]||o;return t?r.createElement(d,i(i({ref:n},p),{},{components:t})):r.createElement(d,i({ref:n},p))}));function d(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var o=t.length,i=new Array(o);i[0]=y;var l={};for(var s in n)hasOwnProperty.call(n,s)&&(l[s]=n[s]);l.originalType=e,l[u]="string"==typeof e?e:a,i[1]=l;for(var c=2;c<o;c++)i[c]=t[c];return r.createElement.apply(null,i)}return r.createElement.apply(null,t)}y.displayName="MDXCreateElement"},24093:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>s,contentTitle:()=>i,default:()=>m,frontMatter:()=>o,metadata:()=>l,toc:()=>c});var r=t(87462),a=(t(67294),t(3905));const o={id:"Repository",title:"Repository"},i=void 0,l={unversionedId:"aws/resources/ECR/Repository",id:"aws/resources/ECR/Repository",title:"Repository",description:"Manages a ECR Docker Repository",source:"@site/docs/aws/resources/ECR/Repository.md",sourceDirName:"aws/resources/ECR",slug:"/aws/resources/ECR/Repository",permalink:"/docs/aws/resources/ECR/Repository",draft:!1,tags:[],version:"current",frontMatter:{id:"Repository",title:"Repository"},sidebar:"docs",previous:{title:"Registry",permalink:"/docs/aws/resources/ECR/Registry"},next:{title:"CapacityProvider",permalink:"/docs/aws/resources/ECS/CapacityProvider"}},s={},c=[{value:"Sample Code",id:"sample-code",level:2},{value:"Dependencies",id:"dependencies",level:3},{value:"Used By",id:"used-by",level:3},{value:"Full Examples",id:"full-examples",level:3},{value:"Properties",id:"properties",level:3},{value:"List",id:"list",level:3}],p={toc:c},u="wrapper";function m(e){let{components:n,...t}=e;return(0,a.kt)(u,(0,r.Z)({},p,t,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Manages a ",(0,a.kt)("a",{parentName:"p",href:"https://console.aws.amazon.com/ecr/home"},"ECR Docker Repository")),(0,a.kt)("h2",{id:"sample-code"},"Sample Code"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Repository",\n    group: "ECR",\n    name: "starhackit/lb",\n    properties: ({ config }) => ({\n      imageTagMutability: "MUTABLE",\n      imageScanningConfiguration: {\n        scanOnPush: false,\n      },\n      encryptionConfiguration: {\n        encryptionType: "AES256",\n      },\n      policyText: {\n        Version: "2008-10-17",\n        Statement: [\n          {\n            Sid: "AllowPushPull",\n            Effect: "Allow",\n            Principal: {\n              AWS: `arn:aws:iam::${config.accountId()}:root`,\n            },\n            Action: [\n              "ecr:GetDownloadUrlForLayer",\n              "ecr:BatchGetImage",\n              "ecr:BatchCheckLayerAvailability",\n              "ecr:PutImage",\n              "ecr:InitiateLayerUpload",\n              "ecr:UploadLayerPart",\n              "ecr:CompleteLayerUpload",\n            ],\n          },\n        ],\n      },\n      lifecyclePolicyText: {\n        rules: [\n          {\n            rulePriority: 1,\n            description: "Expire images older than 14 days",\n            selection: {\n              tagStatus: "untagged",\n              countType: "sinceImagePushed",\n              countUnit: "days",\n              countNumber: 14,\n            },\n            action: {\n              type: "expire",\n            },\n          },\n        ],\n      },\n    }),\n  },\n];\n')),(0,a.kt)("h3",{id:"dependencies"},"Dependencies"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/aws/resources/KMS/Key"},"KMS Key"))),(0,a.kt)("h3",{id:"used-by"},"Used By"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/aws/resources/CodePipeline/Pipeline"},"CodePipeline Pipeline"))),(0,a.kt)("h3",{id:"full-examples"},"Full Examples"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/ECR/repository"},"Registry and Repository")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/CodePipeline/code-pipeline-ecr"},"Code Pipeline")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/AppRunner/apprunner-simple"},"App Runner"))),(0,a.kt)("h3",{id:"properties"},"Properties"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},(0,a.kt)("a",{parentName:"p",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ecr/interfaces/setrepositorypolicycommandinput.html"},"SetRepositoryPolicyCommandInput"))),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},(0,a.kt)("a",{parentName:"p",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ecr/interfaces/putlifecyclepolicycommandinput.html"},"PutLifecyclePolicyCommandInput")))),(0,a.kt)("h3",{id:"list"},"List"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t ECR::Repository\n")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-txt"},'Listing resources on 1 provider: aws\n\u2713 aws us-east-1\n  \u2713 Initialising\n  \u2713 Listing 1/1\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 1 ECR::Repository from aws                                                            \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: starhackit/lb                                                                   \u2502\n\u2502 managedByUs: Yes                                                                      \u2502\n\u2502 live:                                                                                 \u2502\n\u2502   createdAt: 2022-07-30T11:08:11.000Z                                                 \u2502\n\u2502   encryptionConfiguration:                                                            \u2502\n\u2502     encryptionType: AES256                                                            \u2502\n\u2502   imageScanningConfiguration:                                                         \u2502\n\u2502     scanOnPush: false                                                                 \u2502\n\u2502   imageTagMutability: MUTABLE                                                         \u2502\n\u2502   registryId: 840541460064                                                            \u2502\n\u2502   repositoryArn: arn:aws:ecr:us-east-1:840541460064:repository/starhackit/lb          \u2502\n\u2502   repositoryName: starhackit/lb                                                       \u2502\n\u2502   repositoryUri: 840541460064.dkr.ecr.us-east-1.amazonaws.com/starhackit/lb           \u2502\n\u2502   lifecyclePolicyText:                                                                \u2502\n\u2502     rules:                                                                            \u2502\n\u2502       - rulePriority: 1                                                               \u2502\n\u2502         description: Expire images older than 14 days                                 \u2502\n\u2502         selection:                                                                    \u2502\n\u2502           tagStatus: untagged                                                         \u2502\n\u2502           countType: sinceImagePushed                                                 \u2502\n\u2502           countUnit: days                                                             \u2502\n\u2502           countNumber: 14                                                             \u2502\n\u2502         action:                                                                       \u2502\n\u2502           type: expire                                                                \u2502\n\u2502   tags:                                                                               \u2502\n\u2502     - Key: gc-created-by-provider                                                     \u2502\n\u2502       Value: aws                                                                      \u2502\n\u2502     - Key: gc-managed-by                                                              \u2502\n\u2502       Value: grucloud                                                                 \u2502\n\u2502     - Key: gc-project-name                                                            \u2502\n\u2502       Value: aws-ecr-repository                                                       \u2502\n\u2502     - Key: gc-stage                                                                   \u2502\n\u2502       Value: dev                                                                      \u2502\n\u2502     - Key: Name                                                                       \u2502\n\u2502       Value: starhackit/lb                                                            \u2502\n\u2502   policyText:                                                                         \u2502\n\u2502     Version: 2008-10-17                                                               \u2502\n\u2502     Statement:                                                                        \u2502\n\u2502       - Sid: AllowPushPull                                                            \u2502\n\u2502         Effect: Allow                                                                 \u2502\n\u2502         Principal:                                                                    \u2502\n\u2502           AWS: arn:aws:iam::840541460064:root                                         \u2502\n\u2502         Action:                                                                       \u2502\n\u2502           - "ecr:GetDownloadUrlForLayer"                                              \u2502\n\u2502           - "ecr:BatchGetImage"                                                       \u2502\n\u2502           - "ecr:BatchCheckLayerAvailability"                                         \u2502\n\u2502           - "ecr:PutImage"                                                            \u2502\n\u2502           - "ecr:InitiateLayerUpload"                                                 \u2502\n\u2502           - "ecr:UploadLayerPart"                                                     \u2502\n\u2502           - "ecr:CompleteLayerUpload"                                                 \u2502\n\u2502                                                                                       \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\nList Summary:\nProvider: aws\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 aws                                                                                  \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 ECR::Repository \u2502 starhackit/lb                                                      \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n1 resource, 1 type, 1 provider\nCommand "gc l -t ECR::Repository" executed in 5s, 114 MB\n')))}m.isMDXComponent=!0}}]);