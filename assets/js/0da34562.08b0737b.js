"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[66898],{3905:(e,r,n)=>{n.d(r,{Zo:()=>p,kt:()=>d});var t=n(67294);function o(e,r,n){return r in e?Object.defineProperty(e,r,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[r]=n,e}function a(e,r){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);r&&(t=t.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),n.push.apply(n,t)}return n}function l(e){for(var r=1;r<arguments.length;r++){var n=null!=arguments[r]?arguments[r]:{};r%2?a(Object(n),!0).forEach((function(r){o(e,r,n[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))}))}return e}function s(e,r){if(null==e)return{};var n,t,o=function(e,r){if(null==e)return{};var n,t,o={},a=Object.keys(e);for(t=0;t<a.length;t++)n=a[t],r.indexOf(n)>=0||(o[n]=e[n]);return o}(e,r);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(t=0;t<a.length;t++)n=a[t],r.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var i=t.createContext({}),u=function(e){var r=t.useContext(i),n=r;return e&&(n="function"==typeof e?e(r):l(l({},r),e)),n},p=function(e){var r=u(e.components);return t.createElement(i.Provider,{value:r},e.children)},c={inlineCode:"code",wrapper:function(e){var r=e.children;return t.createElement(t.Fragment,{},r)}},m=t.forwardRef((function(e,r){var n=e.components,o=e.mdxType,a=e.originalType,i=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),m=u(n),d=o,b=m["".concat(i,".").concat(d)]||m[d]||c[d]||a;return n?t.createElement(b,l(l({ref:r},p),{},{components:n})):t.createElement(b,l({ref:r},p))}));function d(e,r){var n=arguments,o=r&&r.mdxType;if("string"==typeof e||o){var a=n.length,l=new Array(a);l[0]=m;var s={};for(var i in r)hasOwnProperty.call(r,i)&&(s[i]=r[i]);s.originalType=e,s.mdxType="string"==typeof e?e:o,l[1]=s;for(var u=2;u<a;u++)l[u]=n[u];return t.createElement.apply(null,l)}return t.createElement.apply(null,n)}m.displayName="MDXCreateElement"},65756:(e,r,n)=>{n.r(r),n.d(r,{assets:()=>i,contentTitle:()=>l,default:()=>c,frontMatter:()=>a,metadata:()=>s,toc:()=>u});var t=n(87462),o=(n(67294),n(3905));const a={id:"Job",title:"Job"},l=void 0,s={unversionedId:"aws/resources/Glue/Job",id:"aws/resources/Glue/Job",title:"Job",description:"Manages an Glue Job.",source:"@site/docs/aws/resources/Glue/Job.md",sourceDirName:"aws/resources/Glue",slug:"/aws/resources/Glue/Job",permalink:"/docs/aws/resources/Glue/Job",draft:!1,tags:[],version:"current",frontMatter:{id:"Job",title:"Job"},sidebar:"docs",previous:{title:"DeliveryStream",permalink:"/docs/aws/resources/Firehose/DeliveryStream"},next:{title:"Group",permalink:"/docs/aws/resources/IAM/Group"}},i={},u=[{value:"Sample code",id:"sample-code",level:2},{value:"Properties",id:"properties",level:2},{value:"Dependencies",id:"dependencies",level:2},{value:"Full Examples",id:"full-examples",level:2},{value:"List",id:"list",level:2}],p={toc:u};function c(e){let{components:r,...n}=e;return(0,o.kt)("wrapper",(0,t.Z)({},p,n,{components:r,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Manages an ",(0,o.kt)("a",{parentName:"p",href:"https://console.aws.amazon.com/gluestudio/home?#/jobs"},"Glue Job"),"."),(0,o.kt)("h2",{id:"sample-code"},"Sample code"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Job",\n    group: "Glue",\n    properties: ({}) => ({\n      Command: {\n        Name: "glueetl",\n        PythonVersion: "3",\n        ScriptLocation:\n          "s3://sample-bucket-glue-scripts-terraform-840541460064/glue_script.py",\n      },\n      DefaultArguments: {\n        "--TempDir":\n          "s3://sample-bucket-glue-scripts-terraform-840541460064/tmp/",\n        "--job-bookmark-option": "job-bookmark-disable",\n        "--job-language": "python",\n      },\n      Description: "AWS Glue Job terraform example",\n      ExecutionProperty: {\n        MaxConcurrentRuns: 5,\n      },\n      GlueVersion: "3.0",\n      MaxRetries: 0,\n      Name: "sample-glue-job-terraform",\n      NumberOfWorkers: 2,\n      Timeout: 2880,\n      WorkerType: "G.1X",\n    }),\n    dependencies: ({}) => ({\n      role: "sample-glue-role",\n    }),\n  },\n];\n')),(0,o.kt)("h2",{id:"properties"},"Properties"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest//clients/client-glue/interfaces/createjobcommandinput.html"},"CreateJobCommandInput"))),(0,o.kt)("h2",{id:"dependencies"},"Dependencies"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/aws/resources/IAM/Role"},"IAM Role"))),(0,o.kt)("h2",{id:"full-examples"},"Full Examples"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/sfn-glue"},"Step function invoking a Glue job"))),(0,o.kt)("h2",{id:"list"},"List"),(0,o.kt)("p",null,"The jobs can be filtered with the ",(0,o.kt)("em",{parentName:"p"},"Job")," type:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t Job\n")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-txt"},'Listing resources on 1 provider: aws\n\u2713 aws us-east-1\n  \u2713 Initialising\n  \u2713 Listing 1/1\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 1 Glue::Job from aws                                                         \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: sample-glue-job-terraform                                              \u2502\n\u2502 managedByUs: Yes                                                             \u2502\n\u2502 live:                                                                        \u2502\n\u2502   AllocatedCapacity: 2                                                       \u2502\n\u2502   Command:                                                                   \u2502\n\u2502     Name: glueetl                                                            \u2502\n\u2502     PythonVersion: 3                                                         \u2502\n\u2502     ScriptLocation: s3://sample-bucket-glue-scripts-terraform-840541460064/\u2026 \u2502\n\u2502   CreatedOn: 2022-07-13T10:22:38.257Z                                        \u2502\n\u2502   DefaultArguments:                                                          \u2502\n\u2502     --TempDir: s3://sample-bucket-glue-scripts-terraform-840541460064/tmp/   \u2502\n\u2502     --job-bookmark-option: job-bookmark-disable                              \u2502\n\u2502     --job-language: python                                                   \u2502\n\u2502   Description: AWS Glue Job terraform example                                \u2502\n\u2502   ExecutionProperty:                                                         \u2502\n\u2502     MaxConcurrentRuns: 5                                                     \u2502\n\u2502   GlueVersion: 3.0                                                           \u2502\n\u2502   LastModifiedOn: 2022-07-13T10:22:38.257Z                                   \u2502\n\u2502   MaxCapacity: 2                                                             \u2502\n\u2502   MaxRetries: 0                                                              \u2502\n\u2502   Name: sample-glue-job-terraform                                            \u2502\n\u2502   NumberOfWorkers: 2                                                         \u2502\n\u2502   Role: arn:aws:iam::840541460064:role/sample-glue-role                      \u2502\n\u2502   Timeout: 2880                                                              \u2502\n\u2502   WorkerType: G.1X                                                           \u2502\n\u2502   Tags:                                                                      \u2502\n\u2502     Name: sample-glue-job-terraform                                          \u2502\n\u2502     gc-created-by-provider: aws                                              \u2502\n\u2502     gc-managed-by: grucloud                                                  \u2502\n\u2502     gc-project-name: sfn-glue                                                \u2502\n\u2502     gc-stage: dev                                                            \u2502\n\u2502                                                                              \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\nList Summary:\nProvider: aws\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 aws                                                                         \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 Glue::Job \u2502 sample-glue-job-terraform                                       \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n1 resource, 1 type, 1 provider\nCommand "gc l -t Job" executed in 5s, 121 MB\n')))}c.isMDXComponent=!0}}]);