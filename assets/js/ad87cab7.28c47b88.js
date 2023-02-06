"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[36901],{3905:(e,r,a)=>{a.d(r,{Zo:()=>p,kt:()=>d});var n=a(67294);function t(e,r,a){return r in e?Object.defineProperty(e,r,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[r]=a,e}function s(e,r){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),a.push.apply(a,n)}return a}function i(e){for(var r=1;r<arguments.length;r++){var a=null!=arguments[r]?arguments[r]:{};r%2?s(Object(a),!0).forEach((function(r){t(e,r,a[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):s(Object(a)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(a,r))}))}return e}function o(e,r){if(null==e)return{};var a,n,t=function(e,r){if(null==e)return{};var a,n,t={},s=Object.keys(e);for(n=0;n<s.length;n++)a=s[n],r.indexOf(a)>=0||(t[a]=e[a]);return t}(e,r);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(n=0;n<s.length;n++)a=s[n],r.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(t[a]=e[a])}return t}var c=n.createContext({}),l=function(e){var r=n.useContext(c),a=r;return e&&(a="function"==typeof e?e(r):i(i({},r),e)),a},p=function(e){var r=l(e.components);return n.createElement(c.Provider,{value:r},e.children)},u={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},m=n.forwardRef((function(e,r){var a=e.components,t=e.mdxType,s=e.originalType,c=e.parentName,p=o(e,["components","mdxType","originalType","parentName"]),m=l(a),d=t,f=m["".concat(c,".").concat(d)]||m[d]||u[d]||s;return a?n.createElement(f,i(i({ref:r},p),{},{components:a})):n.createElement(f,i({ref:r},p))}));function d(e,r){var a=arguments,t=r&&r.mdxType;if("string"==typeof e||t){var s=a.length,i=new Array(s);i[0]=m;var o={};for(var c in r)hasOwnProperty.call(r,c)&&(o[c]=r[c]);o.originalType=e,o.mdxType="string"==typeof e?e:t,i[1]=o;for(var l=2;l<s;l++)i[l]=a[l];return n.createElement.apply(null,i)}return n.createElement.apply(null,a)}m.displayName="MDXCreateElement"},93712:(e,r,a)=>{a.r(r),a.d(r,{assets:()=>c,contentTitle:()=>i,default:()=>u,frontMatter:()=>s,metadata:()=>o,toc:()=>l});var n=a(87462),t=(a(67294),a(3905));const s={id:"PrincipalAssociation",title:"Principal Association"},i=void 0,o={unversionedId:"aws/resources/RAM/PrincipalAssociation",id:"aws/resources/RAM/PrincipalAssociation",title:"Principal Association",description:"Provides a RAM Principal Association",source:"@site/docs/aws/resources/RAM/PrincipalAssociation.md",sourceDirName:"aws/resources/RAM",slug:"/aws/resources/RAM/PrincipalAssociation",permalink:"/docs/aws/resources/RAM/PrincipalAssociation",draft:!1,tags:[],version:"current",frontMatter:{id:"PrincipalAssociation",title:"Principal Association"},sidebar:"docs",previous:{title:"Root",permalink:"/docs/aws/resources/Organisations/Root"},next:{title:"Resource Association",permalink:"/docs/aws/resources/RAM/ResourceAssociation"}},c={},l=[{value:"Examples",id:"examples",level:3},{value:"Properties",id:"properties",level:3},{value:"Dependencies",id:"dependencies",level:3},{value:"Used By",id:"used-by",level:3},{value:"List",id:"list",level:3}],p={toc:l};function u(e){let{components:r,...a}=e;return(0,t.kt)("wrapper",(0,n.Z)({},p,a,{components:r,mdxType:"MDXLayout"}),(0,t.kt)("p",null,"Provides a ",(0,t.kt)("a",{parentName:"p",href:"https://console.aws.amazon.com/ram/home?#Home:"},"RAM Principal Association")),(0,t.kt)("pre",null,(0,t.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "PrincipalAssociation",\n    group: "RAM",\n    properties: ({}) => ({\n      external: false,\n    }),\n    dependencies: ({}) => ({\n      resourceShare: "ipam-org-share",\n      organisation: "fred@mail.com",\n    }),\n  },\n];\n')),(0,t.kt)("h3",{id:"examples"},"Examples"),(0,t.kt)("ul",null,(0,t.kt)("li",{parentName:"ul"},(0,t.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/RAM/resource-share"},"simple example")),(0,t.kt)("li",{parentName:"ul"},(0,t.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/aws-samples/aws-network-hub-for-terraform"},"aws-network-hub"))),(0,t.kt)("h3",{id:"properties"},"Properties"),(0,t.kt)("ul",null,(0,t.kt)("li",{parentName:"ul"},(0,t.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ram/interfaces/associateresourcesharecommandinput.html"},"AssociateResourceShareCommandInput"))),(0,t.kt)("h3",{id:"dependencies"},"Dependencies"),(0,t.kt)("ul",null,(0,t.kt)("li",{parentName:"ul"},(0,t.kt)("a",{parentName:"li",href:"/docs/aws/resources/RAM/ResourceShare"},"RAM Resource Share")),(0,t.kt)("li",{parentName:"ul"},(0,t.kt)("a",{parentName:"li",href:"/docs/aws/resources/IAM/User"},"IAM User")),(0,t.kt)("li",{parentName:"ul"},(0,t.kt)("a",{parentName:"li",href:"/docs/aws/resources/IAM/Group"},"IAM Group")),(0,t.kt)("li",{parentName:"ul"},(0,t.kt)("a",{parentName:"li",href:"/docs/aws/resources/Organisations/Organisation"},"Organisations Organisation")),(0,t.kt)("li",{parentName:"ul"},(0,t.kt)("a",{parentName:"li",href:"/docs/aws/resources/Organisations/OrganisationalUnit"},"Organisations OrganisationalUnit"))),(0,t.kt)("h3",{id:"used-by"},"Used By"),(0,t.kt)("h3",{id:"list"},"List"),(0,t.kt)("pre",null,(0,t.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t RAM::PrincipalAssociation\n")),(0,t.kt)("pre",null,(0,t.kt)("code",{parentName:"pre",className:"language-txt"},'Listing resources on 1 provider: aws\n\u2713 aws us-east-1\n  \u2713 Initialising\n  \u2713 Listing 1/1\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 2 RAM::PrincipalAssociation from aws                                      \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: ram-principal-assoc::my-share::548529576214                         \u2502\n\u2502 managedByUs: Yes                                                          \u2502\n\u2502 live:                                                                     \u2502\n\u2502   associatedEntity: 548529576214                                          \u2502\n\u2502   associationType: PRINCIPAL                                              \u2502\n\u2502   creationTime: 2022-08-05T22:01:31.840Z                                  \u2502\n\u2502   external: false                                                         \u2502\n\u2502   lastUpdatedTime: 2022-08-05T22:01:33.319Z                               \u2502\n\u2502   resourceShareArn: arn:aws:ram:us-east-1:840541460064:resource-share/12\u2026 \u2502\n\u2502   resourceShareName: my-share                                             \u2502\n\u2502   status: ASSOCIATED                                                      \u2502\n\u2502                                                                           \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: ram-principal-assoc::my-share::arn:aws:organizations::840541460064\u2026 \u2502\n\u2502 managedByUs: NO                                                           \u2502\n\u2502 live:                                                                     \u2502\n\u2502   associatedEntity: arn:aws:organizations::840541460064:organization/o-x\u2026 \u2502\n\u2502   associationType: PRINCIPAL                                              \u2502\n\u2502   creationTime: 2022-08-05T22:01:31.799Z                                  \u2502\n\u2502   external: false                                                         \u2502\n\u2502   lastUpdatedTime: 2022-08-05T22:01:33.236Z                               \u2502\n\u2502   resourceShareArn: arn:aws:ram:us-east-1:840541460064:resource-share/12\u2026 \u2502\n\u2502   resourceShareName: my-share                                             \u2502\n\u2502   status: ASSOCIATED                                                      \u2502\n\u2502                                                                           \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\nList Summary:\nProvider: aws\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 aws                                                                      \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 RAM::PrincipalAssociation \u2502 ram-principal-assoc::my-share::548529576214  \u2502\n\u2502                           \u2502 ram-principal-assoc::my-share::arn:aws:orga\u2026 \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n2 resources, 1 type, 1 provider\nCommand "gc l -t RAM::PrincipalAssociation" executed in 4s, 104 MB\n')))}u.isMDXComponent=!0}}]);