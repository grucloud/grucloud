"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[4223],{3905:(e,r,t)=>{t.d(r,{Zo:()=>p,kt:()=>d});var a=t(67294);function n(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function s(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);r&&(a=a.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,a)}return t}function o(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?s(Object(t),!0).forEach((function(r){n(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):s(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function l(e,r){if(null==e)return{};var t,a,n=function(e,r){if(null==e)return{};var t,a,n={},s=Object.keys(e);for(a=0;a<s.length;a++)t=s[a],r.indexOf(t)>=0||(n[t]=e[t]);return n}(e,r);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(a=0;a<s.length;a++)t=s[a],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(n[t]=e[t])}return n}var u=a.createContext({}),i=function(e){var r=a.useContext(u),t=r;return e&&(t="function"==typeof e?e(r):o(o({},r),e)),t},p=function(e){var r=i(e.components);return a.createElement(u.Provider,{value:r},e.children)},c={inlineCode:"code",wrapper:function(e){var r=e.children;return a.createElement(a.Fragment,{},r)}},m=a.forwardRef((function(e,r){var t=e.components,n=e.mdxType,s=e.originalType,u=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),m=i(t),d=n,f=m["".concat(u,".").concat(d)]||m[d]||c[d]||s;return t?a.createElement(f,o(o({ref:r},p),{},{components:t})):a.createElement(f,o({ref:r},p))}));function d(e,r){var t=arguments,n=r&&r.mdxType;if("string"==typeof e||n){var s=t.length,o=new Array(s);o[0]=m;var l={};for(var u in r)hasOwnProperty.call(r,u)&&(l[u]=r[u]);l.originalType=e,l.mdxType="string"==typeof e?e:n,o[1]=l;for(var i=2;i<s;i++)o[i]=t[i];return a.createElement.apply(null,o)}return a.createElement.apply(null,t)}m.displayName="MDXCreateElement"},9114:(e,r,t)=>{t.r(r),t.d(r,{assets:()=>u,contentTitle:()=>o,default:()=>c,frontMatter:()=>s,metadata:()=>l,toc:()=>i});var a=t(87462),n=(t(67294),t(3905));const s={id:"ClusterParameterGroup",title:"Cluster Parameter Group"},o=void 0,l={unversionedId:"aws/resources/Redshift/ClusterParameterGroup",id:"aws/resources/Redshift/ClusterParameterGroup",title:"Cluster Parameter Group",description:"Manages a Redshift Cluster Parameter Group.",source:"@site/docs/aws/resources/Redshift/ClusterParameterGroup.md",sourceDirName:"aws/resources/Redshift",slug:"/aws/resources/Redshift/ClusterParameterGroup",permalink:"/docs/aws/resources/Redshift/ClusterParameterGroup",draft:!1,tags:[],version:"current",frontMatter:{id:"ClusterParameterGroup",title:"Cluster Parameter Group"},sidebar:"docs",previous:{title:"Cluster",permalink:"/docs/aws/resources/Redshift/Cluster"},next:{title:"Cluster Subnet Group",permalink:"/docs/aws/resources/Redshift/ClusterSubnetGroup"}},u={},i=[{value:"Example",id:"example",level:2},{value:"Code Examples",id:"code-examples",level:2},{value:"Properties",id:"properties",level:2},{value:"Used By",id:"used-by",level:2},{value:"List",id:"list",level:2}],p={toc:i};function c(e){let{components:r,...t}=e;return(0,n.kt)("wrapper",(0,a.Z)({},p,t,{components:r,mdxType:"MDXLayout"}),(0,n.kt)("p",null,"Manages a ",(0,n.kt)("a",{parentName:"p",href:"https://docs.aws.amazon.com/redshift/latest/mgmt/welcome.html"},"Redshift Cluster Parameter Group"),"."),(0,n.kt)("h2",{id:"example"},"Example"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "ClusterParameterGroup",\n    group: "Redshift",\n    properties: ({}) => ({\n      ParameterGroupName: "group-1",\n      ParameterGroupFamily: "redshift-1.0",\n      Description: "group 1",\n    }),\n  },\n];\n')),(0,n.kt)("h2",{id:"code-examples"},"Code Examples"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/Redshift/redshift-simple"},"redshift simple"))),(0,n.kt)("h2",{id:"properties"},"Properties"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-redshift/interfaces/createclusterparametergroupcommandinput.html"},"CreateClusterParameterGroupCommandInput"))),(0,n.kt)("h2",{id:"used-by"},"Used By"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"/docs/aws/resources/Redshift/Cluster"},"Redshift Cluster"))),(0,n.kt)("h2",{id:"list"},"List"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t ClusterParameterGroup\n")),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-txt"},'Listing resources on 1 provider: aws\n\u2713 aws us-east-1\n  \u2713 Initialising\n  \u2713 Listing 1/1\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 2 Redshift::ClusterParameterGroup from aws                                        \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: default.redshift-1.0                                                        \u2502\n\u2502 managedByUs: NO                                                                   \u2502\n\u2502 live:                                                                             \u2502\n\u2502   ParameterGroupName: default.redshift-1.0                                        \u2502\n\u2502   ParameterGroupFamily: redshift-1.0                                              \u2502\n\u2502   Description: Default parameter group for redshift-1.0                           \u2502\n\u2502   Tags:                                                                           \u2502\n\u2502     - Key: gc-created-by-provider                                                 \u2502\n\u2502       Value: aws                                                                  \u2502\n\u2502     - Key: gc-managed-by                                                          \u2502\n\u2502       Value: grucloud                                                             \u2502\n\u2502     - Key: gc-project-name                                                        \u2502\n\u2502       Value: redshift-simple                                                      \u2502\n\u2502     - Key: gc-stage                                                               \u2502\n\u2502       Value: dev                                                                  \u2502\n\u2502     - Key: Name                                                                   \u2502\n\u2502       Value: default.redshift-1.0                                                 \u2502\n\u2502                                                                                   \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: group-1                                                                     \u2502\n\u2502 managedByUs: Yes                                                                  \u2502\n\u2502 live:                                                                             \u2502\n\u2502   ParameterGroupName: group-1                                                     \u2502\n\u2502   ParameterGroupFamily: redshift-1.0                                              \u2502\n\u2502   Description: group 1                                                            \u2502\n\u2502   Tags:                                                                           \u2502\n\u2502     - Key: gc-created-by-provider                                                 \u2502\n\u2502       Value: aws                                                                  \u2502\n\u2502     - Key: gc-managed-by                                                          \u2502\n\u2502       Value: grucloud                                                             \u2502\n\u2502     - Key: gc-project-name                                                        \u2502\n\u2502       Value: redshift-simple                                                      \u2502\n\u2502     - Key: gc-stage                                                               \u2502\n\u2502       Value: dev                                                                  \u2502\n\u2502     - Key: Name                                                                   \u2502\n\u2502       Value: group-1                                                              \u2502\n\u2502                                                                                   \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\nList Summary:\nProvider: aws\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 aws                                                                              \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 Redshift::ClusterParameterGroup \u2502 default.redshift-1.0                           \u2502\n\u2502                                 \u2502 group-1                                        \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n2 resources, 1 type, 1 provider\nCommand "gc l -t ClusterParameterGroup" executed in 3s, 98 MB\n')))}c.isMDXComponent=!0}}]);