"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[31602],{3905:(e,t,r)=>{r.d(t,{Zo:()=>p,kt:()=>m});var n=r(67294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function c(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var s=n.createContext({}),l=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},p=function(e){var t=l(e.components);return n.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,a=e.originalType,s=e.parentName,p=c(e,["components","mdxType","originalType","parentName"]),d=l(r),m=o,f=d["".concat(s,".").concat(m)]||d[m]||u[m]||a;return r?n.createElement(f,i(i({ref:t},p),{},{components:r})):n.createElement(f,i({ref:t},p))}));function m(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=r.length,i=new Array(a);i[0]=d;var c={};for(var s in t)hasOwnProperty.call(t,s)&&(c[s]=t[s]);c.originalType=e,c.mdxType="string"==typeof e?e:o,i[1]=c;for(var l=2;l<a;l++)i[l]=r[l];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},54346:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>s,contentTitle:()=>i,default:()=>u,frontMatter:()=>a,metadata:()=>c,toc:()=>l});var n=r(87462),o=(r(67294),r(3905));const a={id:"OpenIDConnectProvider",title:"OpenIDConnectProvider"},i=void 0,c={unversionedId:"aws/resources/IAM/OpenIDConnectProvider",id:"aws/resources/IAM/OpenIDConnectProvider",title:"OpenIDConnectProvider",description:"Provides an Iam Open ID Connect Provider.",source:"@site/docs/aws/resources/IAM/OpenIDConnectProvider.md",sourceDirName:"aws/resources/IAM",slug:"/aws/resources/IAM/OpenIDConnectProvider",permalink:"/docs/aws/resources/IAM/OpenIDConnectProvider",draft:!1,tags:[],version:"current",frontMatter:{id:"OpenIDConnectProvider",title:"OpenIDConnectProvider"},sidebar:"docs",previous:{title:"Instance Profile",permalink:"/docs/aws/resources/IAM/InstanceProfile"},next:{title:"Policy",permalink:"/docs/aws/resources/IAM/Policy"}},s={},l=[{value:"Examples",id:"examples",level:3},{value:"Properties",id:"properties",level:3},{value:"Dependencies",id:"dependencies",level:3},{value:"Aws Docs",id:"aws-docs",level:3}],p={toc:l};function u(e){let{components:t,...r}=e;return(0,o.kt)("wrapper",(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Provides an Iam Open ID Connect Provider."),(0,o.kt)("p",null,"The following example creates a Open ID Connect Provider for an EKS Cluster."),(0,o.kt)("p",null,"Upon creation, the SSL certicate chain is fetched from the ",(0,o.kt)("inlineCode",{parentName:"p"},"identity.oidc.issuer")," URL provided by the EKS cluster. The thumbprint of the last certificate is formatted, it is required as an input for the creation of the OpenIDConnectProvider resource."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "OpenIDConnectProvider",\n    group: "IAM",\n    name: "oidp-eks",\n    dependencies: () => ({ cluster: "my-cluster" }),\n  },\n];\n')),(0,o.kt)("h3",{id:"examples"},"Examples"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/packages/modules/aws/load-balancer-controller"},"load balancer controller module"))),(0,o.kt)("h3",{id:"properties"},"Properties"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-iam/interfaces/createopenidconnectprovidercommandinput.html"},"CreateOpenIDConnectProviderCommandInput"))),(0,o.kt)("h3",{id:"dependencies"},"Dependencies"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/aws/resources/EKS/Cluster"},"EKS Cluster"))),(0,o.kt)("h3",{id:"aws-docs"},"Aws Docs"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc.html"},"Creating OpenID Connect (OIDC) identity providers")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/eks/latest/userguide/enable-iam-roles-for-service-accounts.html"},"Create an IAM OIDC provider for your cluster")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc_verify-thumbprint.html"},"Obtaining the root CA thumbprint for an OpenID Connect Identity Provider"))))}u.isMDXComponent=!0}}]);