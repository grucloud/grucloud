"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[2834],{3905:function(e,n,r){r.d(n,{Zo:function(){return u},kt:function(){return m}});var t=r(67294);function o(e,n,r){return n in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}function l(e,n){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),r.push.apply(r,t)}return r}function a(e){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?l(Object(r),!0).forEach((function(n){o(e,n,r[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):l(Object(r)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))}))}return e}function i(e,n){if(null==e)return{};var r,t,o=function(e,n){if(null==e)return{};var r,t,o={},l=Object.keys(e);for(t=0;t<l.length;t++)r=l[t],n.indexOf(r)>=0||(o[r]=e[r]);return o}(e,n);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(t=0;t<l.length;t++)r=l[t],n.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var s=t.createContext({}),c=function(e){var n=t.useContext(s),r=n;return e&&(r="function"==typeof e?e(n):a(a({},n),e)),r},u=function(e){var n=c(e.components);return t.createElement(s.Provider,{value:n},e.children)},p={inlineCode:"code",wrapper:function(e){var n=e.children;return t.createElement(t.Fragment,{},n)}},d=t.forwardRef((function(e,n){var r=e.components,o=e.mdxType,l=e.originalType,s=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),d=c(r),m=o,g=d["".concat(s,".").concat(m)]||d[m]||p[m]||l;return r?t.createElement(g,a(a({ref:n},u),{},{components:r})):t.createElement(g,a({ref:n},u))}));function m(e,n){var r=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var l=r.length,a=new Array(l);a[0]=d;var i={};for(var s in n)hasOwnProperty.call(n,s)&&(i[s]=n[s]);i.originalType=e,i.mdxType="string"==typeof e?e:o,a[1]=i;for(var c=2;c<l;c++)a[c]=r[c];return t.createElement.apply(null,a)}return t.createElement.apply(null,r)}d.displayName="MDXCreateElement"},64156:function(e,n,r){r.r(n),r.d(n,{frontMatter:function(){return i},contentTitle:function(){return s},metadata:function(){return c},toc:function(){return u},default:function(){return d}});var t=r(87462),o=r(63366),l=(r(67294),r(3905)),a=["components"],i={id:"RoleBinding",title:"Role Binding"},s=void 0,c={unversionedId:"k8s/resources/RoleBinding",id:"k8s/resources/RoleBinding",isDocsHomePage:!1,title:"Role Binding",description:"Provides a Kubernetes Cluster Role Binding",source:"@site/docs/k8s/resources/RoleBinding.md",sourceDirName:"k8s/resources",slug:"/k8s/resources/RoleBinding",permalink:"/docs/k8s/resources/RoleBinding",tags:[],version:"current",frontMatter:{id:"RoleBinding",title:"Role Binding"},sidebar:"docs",previous:{title:"Role",permalink:"/docs/k8s/resources/Role"},next:{title:"Secret",permalink:"/docs/k8s/resources/Secret"}},u=[{value:"Examples",id:"examples",children:[{value:"Create a Role Binding",id:"create-a-role-binding",children:[],level:3}],level:2},{value:"Source Code Examples",id:"source-code-examples",children:[],level:2},{value:"Used By",id:"used-by",children:[],level:2},{value:"Listing",id:"listing",children:[],level:2}],p={toc:u};function d(e){var n=e.components,r=(0,o.Z)(e,a);return(0,l.kt)("wrapper",(0,t.Z)({},p,r,{components:n,mdxType:"MDXLayout"}),(0,l.kt)("p",null,"Provides a ",(0,l.kt)("a",{parentName:"p",href:"https://kubernetes.io/docs/reference/access-authn-authz/rbac/"},"Kubernetes Cluster Role Binding")),(0,l.kt)("h2",{id:"examples"},"Examples"),(0,l.kt)("h3",{id:"create-a-role-binding"},"Create a Role Binding"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-js"},'const roleBinding = provider.makeClusterRoleBinding({\n  properties: () => ({\n    metadata: {\n      name: "aws-load-balancer-controller-rolebinding",\n      labels: {\n        "app.kubernetes.io/name": "aws-load-balancer-controller",\n      },\n    },\n    roleRef: {\n      apiGroup: "rbac.authorization.k8s.io",\n      kind: "ClusterRole",\n      name: "aws-load-balancer-controller-role",\n    },\n    subjects: [\n      {\n        kind: "ServiceAccount",\n        name: "aws-load-balancer-controller",\n        namespace: "kube-system",\n      },\n    ],\n  }),\n});\n')),(0,l.kt)("h2",{id:"source-code-examples"},"Source Code Examples"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/packages/modules/k8s/aws-load-balancer/resources.js#L478"},"Role Binding for the aws load balancer"))),(0,l.kt)("h2",{id:"used-by"},"Used By"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"./Role"},"Role"))),(0,l.kt)("h2",{id:"listing"},"Listing"),(0,l.kt)("p",null,"The following commands list the ",(0,l.kt)("strong",{parentName:"p"},"RoleBinding")," type:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-sh"},"gc list --types RoleBinding\n")),(0,l.kt)("p",null,"Short version:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t RoleBinding\n")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-sh"},"")))}d.isMDXComponent=!0}}]);