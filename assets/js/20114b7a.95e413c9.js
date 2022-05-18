"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[3450],{3905:function(e,r,n){n.d(r,{Zo:function(){return u},kt:function(){return m}});var t=n(67294);function o(e,r,n){return r in e?Object.defineProperty(e,r,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[r]=n,e}function a(e,r){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);r&&(t=t.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),n.push.apply(n,t)}return n}function l(e){for(var r=1;r<arguments.length;r++){var n=null!=arguments[r]?arguments[r]:{};r%2?a(Object(n),!0).forEach((function(r){o(e,r,n[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))}))}return e}function s(e,r){if(null==e)return{};var n,t,o=function(e,r){if(null==e)return{};var n,t,o={},a=Object.keys(e);for(t=0;t<a.length;t++)n=a[t],r.indexOf(n)>=0||(o[n]=e[n]);return o}(e,r);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(t=0;t<a.length;t++)n=a[t],r.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var c=t.createContext({}),i=function(e){var r=t.useContext(c),n=r;return e&&(n="function"==typeof e?e(r):l(l({},r),e)),n},u=function(e){var r=i(e.components);return t.createElement(c.Provider,{value:r},e.children)},p={inlineCode:"code",wrapper:function(e){var r=e.children;return t.createElement(t.Fragment,{},r)}},d=t.forwardRef((function(e,r){var n=e.components,o=e.mdxType,a=e.originalType,c=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),d=i(n),m=o,f=d["".concat(c,".").concat(m)]||d[m]||p[m]||a;return n?t.createElement(f,l(l({ref:r},u),{},{components:n})):t.createElement(f,l({ref:r},u))}));function m(e,r){var n=arguments,o=r&&r.mdxType;if("string"==typeof e||o){var a=n.length,l=new Array(a);l[0]=d;var s={};for(var c in r)hasOwnProperty.call(r,c)&&(s[c]=r[c]);s.originalType=e,s.mdxType="string"==typeof e?e:o,l[1]=s;for(var i=2;i<a;i++)l[i]=n[i];return t.createElement.apply(null,l)}return t.createElement.apply(null,n)}d.displayName="MDXCreateElement"},90102:function(e,r,n){n.r(r),n.d(r,{frontMatter:function(){return s},contentTitle:function(){return c},metadata:function(){return i},toc:function(){return u},default:function(){return d}});var t=n(87462),o=n(63366),a=(n(67294),n(3905)),l=["components"],s={id:"Role",title:"Role"},c=void 0,i={unversionedId:"k8s/resources/Role",id:"k8s/resources/Role",isDocsHomePage:!1,title:"Role",description:"Provides a Kubernetes Role",source:"@site/docs/k8s/resources/Role.md",sourceDirName:"k8s/resources",slug:"/k8s/resources/Role",permalink:"/docs/k8s/resources/Role",tags:[],version:"current",frontMatter:{id:"Role",title:"Role"},sidebar:"docs",previous:{title:"Persistent Volume Claim",permalink:"/docs/k8s/resources/PersistentVolumeClaim"},next:{title:"Role Binding",permalink:"/docs/k8s/resources/RoleBinding"}},u=[{value:"Examples",id:"examples",children:[{value:"Create a Role",id:"create-a-role",children:[],level:3}],level:2},{value:"Source Code Examples",id:"source-code-examples",children:[],level:2},{value:"Used By",id:"used-by",children:[],level:2},{value:"Listing",id:"listing",children:[],level:2}],p={toc:u};function d(e){var r=e.components,n=(0,o.Z)(e,l);return(0,a.kt)("wrapper",(0,t.Z)({},p,n,{components:r,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Provides a ",(0,a.kt)("a",{parentName:"p",href:"https://kubernetes.io/docs/reference/access-authn-authz/rbac/"},"Kubernetes Role")),(0,a.kt)("h2",{id:"examples"},"Examples"),(0,a.kt)("h3",{id:"create-a-role"},"Create a Role"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'provider.makeRole({\n  properties: () => ({\n    metadata: {\n      name: "aws-load-balancer-controller-leader-election-role",\n      namespace: "kube-system",\n      labels: {\n        "app.kubernetes.io/name": "aws-load-balancer-controller",\n      },\n    },\n    rules: [\n      {\n        apiGroups: [""],\n        resources: ["configmaps"],\n        verbs: ["create"],\n      },\n      {\n        apiGroups: [""],\n        resourceNames: ["aws-load-balancer-controller-leader"],\n        resources: ["configmaps"],\n        verbs: ["get", "update", "patch"],\n      },\n    ],\n  }),\n});\n')),(0,a.kt)("h2",{id:"source-code-examples"},"Source Code Examples"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/packages/modules/k8s/aws-load-balancer/resources.js#L373"},"Role for the aws load balancer"))),(0,a.kt)("h2",{id:"used-by"},"Used By"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"./RoleBinding"},"RoleBinding"))),(0,a.kt)("h2",{id:"listing"},"Listing"),(0,a.kt)("p",null,"The following commands list the ",(0,a.kt)("strong",{parentName:"p"},"Role")," type:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-sh"},"gc list --types Role\n")),(0,a.kt)("p",null,"Short version:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t Role\n")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-sh"},"")))}d.isMDXComponent=!0}}]);