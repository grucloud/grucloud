"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[52834],{3905:(e,n,r)=>{r.d(n,{Zo:()=>u,kt:()=>m});var t=r(67294);function a(e,n,r){return n in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}function l(e,n){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),r.push.apply(r,t)}return r}function o(e){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?l(Object(r),!0).forEach((function(n){a(e,n,r[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):l(Object(r)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))}))}return e}function i(e,n){if(null==e)return{};var r,t,a=function(e,n){if(null==e)return{};var r,t,a={},l=Object.keys(e);for(t=0;t<l.length;t++)r=l[t],n.indexOf(r)>=0||(a[r]=e[r]);return a}(e,n);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(t=0;t<l.length;t++)r=l[t],n.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var s=t.createContext({}),c=function(e){var n=t.useContext(s),r=n;return e&&(r="function"==typeof e?e(n):o(o({},n),e)),r},u=function(e){var n=c(e.components);return t.createElement(s.Provider,{value:n},e.children)},p={inlineCode:"code",wrapper:function(e){var n=e.children;return t.createElement(t.Fragment,{},n)}},d=t.forwardRef((function(e,n){var r=e.components,a=e.mdxType,l=e.originalType,s=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),d=c(r),m=a,g=d["".concat(s,".").concat(m)]||d[m]||p[m]||l;return r?t.createElement(g,o(o({ref:n},u),{},{components:r})):t.createElement(g,o({ref:n},u))}));function m(e,n){var r=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var l=r.length,o=new Array(l);o[0]=d;var i={};for(var s in n)hasOwnProperty.call(n,s)&&(i[s]=n[s]);i.originalType=e,i.mdxType="string"==typeof e?e:a,o[1]=i;for(var c=2;c<l;c++)o[c]=r[c];return t.createElement.apply(null,o)}return t.createElement.apply(null,r)}d.displayName="MDXCreateElement"},64156:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>s,contentTitle:()=>o,default:()=>p,frontMatter:()=>l,metadata:()=>i,toc:()=>c});var t=r(87462),a=(r(67294),r(3905));const l={id:"RoleBinding",title:"Role Binding"},o=void 0,i={unversionedId:"k8s/resources/RoleBinding",id:"k8s/resources/RoleBinding",title:"Role Binding",description:"Provides a Kubernetes Cluster Role Binding",source:"@site/docs/k8s/resources/RoleBinding.md",sourceDirName:"k8s/resources",slug:"/k8s/resources/RoleBinding",permalink:"/docs/k8s/resources/RoleBinding",draft:!1,tags:[],version:"current",frontMatter:{id:"RoleBinding",title:"Role Binding"},sidebar:"docs",previous:{title:"Role",permalink:"/docs/k8s/resources/Role"},next:{title:"Secret",permalink:"/docs/k8s/resources/Secret"}},s={},c=[{value:"Examples",id:"examples",level:2},{value:"Create a Role Binding",id:"create-a-role-binding",level:3},{value:"Source Code Examples",id:"source-code-examples",level:2},{value:"Used By",id:"used-by",level:2},{value:"Listing",id:"listing",level:2}],u={toc:c};function p(e){let{components:n,...r}=e;return(0,a.kt)("wrapper",(0,t.Z)({},u,r,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Provides a ",(0,a.kt)("a",{parentName:"p",href:"https://kubernetes.io/docs/reference/access-authn-authz/rbac/"},"Kubernetes Cluster Role Binding")),(0,a.kt)("h2",{id:"examples"},"Examples"),(0,a.kt)("h3",{id:"create-a-role-binding"},"Create a Role Binding"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'const roleBinding = provider.makeClusterRoleBinding({\n  properties: () => ({\n    metadata: {\n      name: "aws-load-balancer-controller-rolebinding",\n      labels: {\n        "app.kubernetes.io/name": "aws-load-balancer-controller",\n      },\n    },\n    roleRef: {\n      apiGroup: "rbac.authorization.k8s.io",\n      kind: "ClusterRole",\n      name: "aws-load-balancer-controller-role",\n    },\n    subjects: [\n      {\n        kind: "ServiceAccount",\n        name: "aws-load-balancer-controller",\n        namespace: "kube-system",\n      },\n    ],\n  }),\n});\n')),(0,a.kt)("h2",{id:"source-code-examples"},"Source Code Examples"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/packages/modules/k8s/aws-load-balancer/resources.js#L478"},"Role Binding for the aws load balancer"))),(0,a.kt)("h2",{id:"used-by"},"Used By"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"./Role"},"Role"))),(0,a.kt)("h2",{id:"listing"},"Listing"),(0,a.kt)("p",null,"The following commands list the ",(0,a.kt)("strong",{parentName:"p"},"RoleBinding")," type:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-sh"},"gc list --types RoleBinding\n")),(0,a.kt)("p",null,"Short version:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t RoleBinding\n")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-sh"},"")))}p.isMDXComponent=!0}}]);