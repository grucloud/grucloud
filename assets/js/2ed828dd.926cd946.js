"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[24602],{3905:(e,r,t)=>{t.d(r,{Zo:()=>l,kt:()=>v});var n=t(67294);function a(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function s(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function o(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?s(Object(t),!0).forEach((function(r){a(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):s(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function c(e,r){if(null==e)return{};var t,n,a=function(e,r){if(null==e)return{};var t,n,a={},s=Object.keys(e);for(n=0;n<s.length;n++)t=s[n],r.indexOf(t)>=0||(a[t]=e[t]);return a}(e,r);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(n=0;n<s.length;n++)t=s[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var i=n.createContext({}),p=function(e){var r=n.useContext(i),t=r;return e&&(t="function"==typeof e?e(r):o(o({},r),e)),t},l=function(e){var r=p(e.components);return n.createElement(i.Provider,{value:r},e.children)},u="mdxType",m={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},d=n.forwardRef((function(e,r){var t=e.components,a=e.mdxType,s=e.originalType,i=e.parentName,l=c(e,["components","mdxType","originalType","parentName"]),u=p(t),d=a,v=u["".concat(i,".").concat(d)]||u[d]||m[d]||s;return t?n.createElement(v,o(o({ref:r},l),{},{components:t})):n.createElement(v,o({ref:r},l))}));function v(e,r){var t=arguments,a=r&&r.mdxType;if("string"==typeof e||a){var s=t.length,o=new Array(s);o[0]=d;var c={};for(var i in r)hasOwnProperty.call(r,i)&&(c[i]=r[i]);c.originalType=e,c[u]="string"==typeof e?e:a,o[1]=c;for(var p=2;p<s;p++)o[p]=t[p];return n.createElement.apply(null,o)}return n.createElement.apply(null,t)}d.displayName="MDXCreateElement"},58851:(e,r,t)=>{t.r(r),t.d(r,{assets:()=>i,contentTitle:()=>o,default:()=>m,frontMatter:()=>s,metadata:()=>c,toc:()=>p});var n=t(87462),a=(t(67294),t(3905));const s={id:"Service",title:"Service"},o=void 0,c={unversionedId:"k8s/resources/Service",id:"k8s/resources/Service",title:"Service",description:"Provides a Kubernetes Service",source:"@site/docs/k8s/resources/Service.md",sourceDirName:"k8s/resources",slug:"/k8s/resources/Service",permalink:"/docs/k8s/resources/Service",draft:!1,tags:[],version:"current",frontMatter:{id:"Service",title:"Service"},sidebar:"docs",previous:{title:"Secret",permalink:"/docs/k8s/resources/Secret"},next:{title:"Service Account",permalink:"/docs/k8s/resources/ServiceAccount"}},i={},p=[{value:"Examples",id:"examples",level:2},{value:"Create a NodePort service for a Deployment",id:"create-a-nodeport-service-for-a-deployment",level:3},{value:"Create a Headless Service for a StatefulSet",id:"create-a-headless-service-for-a-statefulset",level:3},{value:"Source Code Examples",id:"source-code-examples",level:2},{value:"Listing",id:"listing",level:2}],l={toc:p},u="wrapper";function m(e){let{components:r,...t}=e;return(0,a.kt)(u,(0,n.Z)({},l,t,{components:r,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Provides a ",(0,a.kt)("a",{parentName:"p",href:"https://kubernetes.io/docs/concepts/services-networking/service/"},"Kubernetes Service")),(0,a.kt)("h2",{id:"examples"},"Examples"),(0,a.kt)("h3",{id:"create-a-nodeport-service-for-a-deployment"},"Create a NodePort service for a Deployment"),(0,a.kt)("p",null,"This example creates a NodePort service for use with a Deployment:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'const appLabel = "myLabel";\n\nprovider.makeService({\n  properties: () => ({\n    metadata: {\n      name: "myService",\n      namespace: "monitoring",\n    },\n    spec: {\n      selector: {\n        app: appLabel,\n      },\n      type: "NodePort",\n      ports: [\n        {\n          protocol: "TCP",\n          port: 80,\n          targetPort: 8080,\n        },\n      ],\n    },\n  }),\n});\n')),(0,a.kt)("h3",{id:"create-a-headless-service-for-a-statefulset"},"Create a Headless Service for a StatefulSet"),(0,a.kt)("p",null,"This example creates a Headless service for use with a StatefulSet:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'const appLabel = "db";\n\nconst service = provider.makeService({\n  name: "postgres-service",\n  dependencies: { namespace },\n  properties: () => ({\n    metadata: {\n      name: "postgres-service",\n      namespace: "pg",\n    },\n    spec: {\n      selector: {\n        app: appLabel,\n      },\n      clusterIP: "None", // Headless service\n      ports: [\n        {\n          protocol: "TCP",\n          port: "5432",\n          targetPort: "5432",\n        },\n      ],\n    },\n  }),\n});\n')),(0,a.kt)("h2",{id:"source-code-examples"},"Source Code Examples"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},(0,a.kt)("a",{parentName:"p",href:"https://github.com/grucloud/grucloud/blob/main/examples/k8s/starhackit/base/charts/rest-server.js#L129"},"NodePort service for rest server"))),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},(0,a.kt)("a",{parentName:"p",href:"https://github.com/grucloud/grucloud/blob/main/examples/k8s/starhackit/base/charts/postgres.js#L144"},"Headless service for postgres")))),(0,a.kt)("h2",{id:"listing"},"Listing"),(0,a.kt)("p",null,"The following command lists only the ",(0,a.kt)("strong",{parentName:"p"},"Service")," type and services created by GruCloud:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t Service --our\n")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-sh"},"Listing resources on 2 providers: aws, k8s\n\u2713 aws\n  \u2713 Initialising\n  \u2713 Listing\n\u2713 k8s\n  \u2713 Initialising\n  \u2713 Listing 3/3\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 7 Service from k8s                                                                \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 Name                              \u2502 Data                                   \u2502 Our  \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253c\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 cert-manager                      \u2502 metadata:                              \u2502 Yes  \u2502\n\u2502                                   \u2502   name: cert-manager                   \u2502      \u2502\n\u2502                                   \u2502   namespace: cert-manager              \u2502      \u2502\n\u2502                                   \u2502   selfLink: /api/v1/namespaces/cert-m\u2026 \u2502      \u2502\n\u2502                                   \u2502   uid: a6d32acc-800d-4f3a-8b67-d4e222\u2026 \u2502      \u2502\n\u2502                                   \u2502   resourceVersion: 117972              \u2502      \u2502\n\u2502                                   \u2502   creationTimestamp: 2021-03-23T15:36\u2026 \u2502      \u2502\n\u2502                                   \u2502   labels:                              \u2502      \u2502\n\u2502                                   \u2502     app: cert-manager                  \u2502      \u2502\n\u2502                                   \u2502     app.kubernetes.io/component: cont\u2026 \u2502      \u2502\n\u2502                                   \u2502     app.kubernetes.io/instance: cert-\u2026 \u2502      \u2502\n\u2502                                   \u2502     app.kubernetes.io/name: cert-mana\u2026 \u2502      \u2502\n\u2502                                   \u2502   annotations:                         \u2502      \u2502\n\u2502                                   \u2502     CreatedByProvider: k8s             \u2502      \u2502\n\u2502                                   \u2502     ManagedBy: GruCloud                \u2502      \u2502\n\u2502                                   \u2502     Name: cert-manager                 \u2502      \u2502\n\u2502                                   \u2502     stage: dev                         \u2502      \u2502\n\u2502                                   \u2502 spec:                                  \u2502      \u2502\n\u2502                                   \u2502   ports:                               \u2502      \u2502\n\u2502                                   \u2502     - protocol: TCP                    \u2502      \u2502\n\u2502                                   \u2502       port: 9402                       \u2502      \u2502\n\u2502                                   \u2502       targetPort: 9402                 \u2502      \u2502\n\u2502                                   \u2502   selector:                            \u2502      \u2502\n\u2502                                   \u2502     app.kubernetes.io/component: cont\u2026 \u2502      \u2502\n\u2502                                   \u2502     app.kubernetes.io/instance: cert-\u2026 \u2502      \u2502\n\u2502                                   \u2502     app.kubernetes.io/name: cert-mana\u2026 \u2502      \u2502\n\u2502                                   \u2502   clusterIP: 10.100.5.226              \u2502      \u2502\n\u2502                                   \u2502   type: ClusterIP                      \u2502      \u2502\n\u2502                                   \u2502   sessionAffinity: None                \u2502      \u2502\n\u2502                                   \u2502 status:                                \u2502      \u2502\n\u2502                                   \u2502   loadBalancer:                        \u2502      \u2502\n\u2502                                   \u2502                                        \u2502      \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253c\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n")))}m.isMDXComponent=!0}}]);