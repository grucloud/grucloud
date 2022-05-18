"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[1875],{3905:function(e,t,n){n.d(t,{Zo:function(){return c},kt:function(){return d}});var r=n(67294);function s(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){s(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function a(e,t){if(null==e)return{};var n,r,s=function(e,t){if(null==e)return{};var n,r,s={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(s[n]=e[n]);return s}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(s[n]=e[n])}return s}var l=r.createContext({}),u=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},c=function(e){var t=u(e.components);return r.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,s=e.mdxType,o=e.originalType,l=e.parentName,c=a(e,["components","mdxType","originalType","parentName"]),m=u(n),d=s,f=m["".concat(l,".").concat(d)]||m[d]||p[d]||o;return n?r.createElement(f,i(i({ref:t},c),{},{components:n})):r.createElement(f,i({ref:t},c))}));function d(e,t){var n=arguments,s=t&&t.mdxType;if("string"==typeof e||s){var o=n.length,i=new Array(o);i[0]=m;var a={};for(var l in t)hasOwnProperty.call(t,l)&&(a[l]=t[l]);a.originalType=e,a.mdxType="string"==typeof e?e:s,i[1]=a;for(var u=2;u<o;u++)i[u]=n[u];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},50653:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return a},contentTitle:function(){return l},metadata:function(){return u},toc:function(){return c},default:function(){return m}});var r=n(87462),s=n(63366),o=(n(67294),n(3905)),i=["components"],a={id:"PersistentVolumeClaim",title:"Persistent Volume Claim"},l=void 0,u={unversionedId:"k8s/resources/PersistentVolumeClaim",id:"k8s/resources/PersistentVolumeClaim",isDocsHomePage:!1,title:"Persistent Volume Claim",description:"Manages a Kubernetes Persistent Volume Claim",source:"@site/docs/k8s/resources/PersistentVolumeClaim.md",sourceDirName:"k8s/resources",slug:"/k8s/resources/PersistentVolumeClaim",permalink:"/docs/k8s/resources/PersistentVolumeClaim",tags:[],version:"current",frontMatter:{id:"PersistentVolumeClaim",title:"Persistent Volume Claim"},sidebar:"docs",previous:{title:"PersistentVolume",permalink:"/docs/k8s/resources/PersistentVolume"},next:{title:"Role",permalink:"/docs/k8s/resources/Role"}},c=[{value:"List",id:"list",children:[],level:2},{value:"UsedBy",id:"usedby",children:[],level:2}],p={toc:c};function m(e){var t=e.components,n=(0,s.Z)(e,i);return(0,o.kt)("wrapper",(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Manages a ",(0,o.kt)("a",{parentName:"p",href:"https://kubernetes.io/docs/concepts/storage/persistent-volumes/"},"Kubernetes Persistent Volume Claim")),(0,o.kt)("h2",{id:"list"},"List"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-sh"},"gc list --types PersistentVolumeClaim\n")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-sh"},'Listing resources on 1 provider: k8s\n\u2713 k8s\n  \u2713 Initialising\n  \u2713 Listing 4/4\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 1 PersistentVolumeClaim from k8s                                               \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 Name             \u2502 Data                                                 \u2502 Our  \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253c\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 pv-db-postgres-0 \u2502 metadata:                                            \u2502 NO   \u2502\n\u2502                  \u2502   name: pv-db-postgres-0                             \u2502      \u2502\n\u2502                  \u2502   namespace: default                                 \u2502      \u2502\n\u2502                  \u2502   selfLink: /api/v1/namespaces/default/persistentvo\u2026 \u2502      \u2502\n\u2502                  \u2502   uid: 414be8cc-d38b-43ba-a1b6-6e1a96f4ac55          \u2502      \u2502\n\u2502                  \u2502   resourceVersion: 118331                            \u2502      \u2502\n\u2502                  \u2502   creationTimestamp: 2021-03-23T15:36:24Z            \u2502      \u2502\n\u2502                  \u2502   labels:                                            \u2502      \u2502\n\u2502                  \u2502     app: db                                          \u2502      \u2502\n\u2502                  \u2502   annotations:                                       \u2502      \u2502\n\u2502                  \u2502     pv.kubernetes.io/bind-completed: yes             \u2502      \u2502\n\u2502                  \u2502     pv.kubernetes.io/bound-by-controller: yes        \u2502      \u2502\n\u2502                  \u2502     volume.beta.kubernetes.io/storage-provisioner: \u2026 \u2502      \u2502\n\u2502                  \u2502     volume.kubernetes.io/selected-node: ip-192-168-\u2026 \u2502      \u2502\n\u2502                  \u2502   finalizers:                                        \u2502      \u2502\n\u2502                  \u2502     - "kubernetes.io/pvc-protection"                 \u2502      \u2502\n\u2502                  \u2502 spec:                                                \u2502      \u2502\n\u2502                  \u2502   accessModes:                                       \u2502      \u2502\n\u2502                  \u2502     - "ReadWriteOnce"                                \u2502      \u2502\n\u2502                  \u2502   resources:                                         \u2502      \u2502\n\u2502                  \u2502     requests:                                        \u2502      \u2502\n\u2502                  \u2502       storage: 1Gi                                   \u2502      \u2502\n\u2502                  \u2502   volumeName: pvc-414be8cc-d38b-43ba-a1b6-6e1a96f4a\u2026 \u2502      \u2502\n\u2502                  \u2502   storageClassName: gp2                              \u2502      \u2502\n\u2502                  \u2502   volumeMode: Filesystem                             \u2502      \u2502\n\u2502                  \u2502 status:                                              \u2502      \u2502\n\u2502                  \u2502   phase: Bound                                       \u2502      \u2502\n\u2502                  \u2502   accessModes:                                       \u2502      \u2502\n\u2502                  \u2502     - "ReadWriteOnce"                                \u2502      \u2502\n\u2502                  \u2502   capacity:                                          \u2502      \u2502\n\u2502                  \u2502     storage: 1Gi                                     \u2502      \u2502\n\u2502                  \u2502                                                      \u2502      \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\nList Summary:\nProvider: k8s\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 k8s                                                                           \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 PersistentVolumeC\u2026 \u2502 pv-db-postgres-0                                         \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n1 resource, 1 type, 1 provider\nCommand "gc list --types PersistentVolumeClaim" executed in 2s\n')),(0,o.kt)("h2",{id:"usedby"},"UsedBy"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"./PersistentVolume"},"PersistentVolume"))))}m.isMDXComponent=!0}}]);