"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[20961],{3905:(e,n,r)=>{r.d(n,{Zo:()=>u,kt:()=>d});var t=r(67294);function a(e,n,r){return n in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}function o(e,n){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),r.push.apply(r,t)}return r}function i(e){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?o(Object(r),!0).forEach((function(n){a(e,n,r[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))}))}return e}function s(e,n){if(null==e)return{};var r,t,a=function(e,n){if(null==e)return{};var r,t,a={},o=Object.keys(e);for(t=0;t<o.length;t++)r=o[t],n.indexOf(r)>=0||(a[r]=e[r]);return a}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(t=0;t<o.length;t++)r=o[t],n.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var c=t.createContext({}),l=function(e){var n=t.useContext(c),r=n;return e&&(r="function"==typeof e?e(n):i(i({},n),e)),r},u=function(e){var n=l(e.components);return t.createElement(c.Provider,{value:n},e.children)},p="mdxType",m={inlineCode:"code",wrapper:function(e){var n=e.children;return t.createElement(t.Fragment,{},n)}},v=t.forwardRef((function(e,n){var r=e.components,a=e.mdxType,o=e.originalType,c=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),p=l(r),v=a,d=p["".concat(c,".").concat(v)]||p[v]||m[v]||o;return r?t.createElement(d,i(i({ref:n},u),{},{components:r})):t.createElement(d,i({ref:n},u))}));function d(e,n){var r=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var o=r.length,i=new Array(o);i[0]=v;var s={};for(var c in n)hasOwnProperty.call(n,c)&&(s[c]=n[c]);s.originalType=e,s[p]="string"==typeof e?e:a,i[1]=s;for(var l=2;l<o;l++)i[l]=r[l];return t.createElement.apply(null,i)}return t.createElement.apply(null,r)}v.displayName="MDXCreateElement"},3082:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>c,contentTitle:()=>i,default:()=>m,frontMatter:()=>o,metadata:()=>s,toc:()=>l});var t=r(87462),a=(r(67294),r(3905));const o={id:"Service",title:"Service"},i=void 0,s={unversionedId:"google/resources/run/Service",id:"google/resources/run/Service",title:"Service",description:"Provides a Cloud Run Service:",source:"@site/docs/google/resources/run/Service.md",sourceDirName:"google/resources/run",slug:"/google/resources/run/Service",permalink:"/docs/google/resources/run/Service",draft:!1,tags:[],version:"current",frontMatter:{id:"Service",title:"Service"},sidebar:"docs",previous:{title:"Service Account",permalink:"/docs/google/resources/iam/ServiceAccount"},next:{title:"Service Iam Member",permalink:"/docs/google/resources/run/ServiceIamMember"}},c={},l=[{value:"Examples",id:"examples",level:3},{value:"Properties",id:"properties",level:3},{value:"Used By",id:"used-by",level:3},{value:"List",id:"list",level:2}],u={toc:l},p="wrapper";function m(e){let{components:n,...r}=e;return(0,a.kt)(p,(0,t.Z)({},u,r,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Provides a ",(0,a.kt)("a",{parentName:"p",href:"https://console.cloud.google.com/run"},"Cloud Run Service"),":"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'provider.run.makeService({\n  properties: ({ config }) => ({\n    apiVersion: "serving.knative.dev/v1",\n    kind: "Service",\n    metadata: {\n      name: "starhackit-server",\n    },\n    spec: {\n      template: {\n        metadata: {\n          name: "starhackit-server-00005-rud",\n          annotations: {\n            "autoscaling.knative.dev/maxScale": "100",\n          },\n        },\n        spec: {\n          containerConcurrency: 80,\n          timeoutSeconds: 300,\n          serviceAccountName: `${config.projectNumber()}-compute@developer.gserviceaccount.com`,\n          containers: [\n            {\n              image: "gcr.io/google-samples/hello-app:1.0",\n              resources: {\n                limits: {\n                  cpu: "2000m",\n                  memory: "512Mi",\n                },\n              },\n              ports: [\n                {\n                  name: "http1",\n                  containerPort: 8080,\n                },\n              ],\n            },\n          ],\n        },\n      },\n      traffic: [\n        {\n          percent: 100,\n          latestRevision: true,\n        },\n      ],\n    },\n  }),\n});\n')),(0,a.kt)("h3",{id:"examples"},"Examples"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/google/run/run-hello-nodejs/resources.js"},"basic example"))),(0,a.kt)("h3",{id:"properties"},"Properties"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://cloud.google.com/run/docs/reference/rest/v1/namespaces.services#Service"},"all properties"))),(0,a.kt)("h3",{id:"used-by"},"Used By"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/google/resources/run/ServiceIamMember"},"Service Iam Member"))),(0,a.kt)("h2",{id:"list"},"List"),(0,a.kt)("p",null,"List all cloud run services with the ",(0,a.kt)("strong",{parentName:"p"},"run::Service")," type"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t run::Service\n")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-txt"},'Listing resources on 1 provider: google\n\u2713 google\n  \u2713 Initialising\n  \u2713 Listing 1/1\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 1 run::Service from google                                                                        \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: starhackit-server                                                                           \u2502\n\u2502 managedByUs: Yes                                                                                  \u2502\n\u2502 live:                                                                                             \u2502\n\u2502   apiVersion: serving.knative.dev/v1                                                              \u2502\n\u2502   kind: Service                                                                                   \u2502\n\u2502   metadata:                                                                                       \u2502\n\u2502     name: starhackit-server                                                                       \u2502\n\u2502     namespace: 91170824493                                                                        \u2502\n\u2502     selfLink: /apis/serving.knative.dev/v1/namespaces/91170824493/services/starhackit-server      \u2502\n\u2502     uid: b5eddd26-9ba7-4e9b-a9ef-7d31d60e89b6                                                     \u2502\n\u2502     resourceVersion: AAXSct2QUIs                                                                  \u2502\n\u2502     generation: 1                                                                                 \u2502\n\u2502     labels:                                                                                       \u2502\n\u2502       cloud.googleapis.com/location: us-central1                                                  \u2502\n\u2502     annotations:                                                                                  \u2502\n\u2502       serving.knative.dev/creator: grucloud@grucloud-test.iam.gserviceaccount.com                 \u2502\n\u2502       serving.knative.dev/lastModifier: grucloud@grucloud-test.iam.gserviceaccount.com            \u2502\n\u2502       run.googleapis.com/ingress: all                                                             \u2502\n\u2502       run.googleapis.com/ingress-status: all                                                      \u2502\n\u2502     creationTimestamp: 2021-12-06T04:41:00.634657Z                                                \u2502\n\u2502   spec:                                                                                           \u2502\n\u2502     template:                                                                                     \u2502\n\u2502       metadata:                                                                                   \u2502\n\u2502         name: starhackit-server-00005-rud                                                         \u2502\n\u2502         annotations:                                                                              \u2502\n\u2502           autoscaling.knative.dev/maxScale: 100                                                   \u2502\n\u2502       spec:                                                                                       \u2502\n\u2502         containerConcurrency: 80                                                                  \u2502\n\u2502         timeoutSeconds: 300                                                                       \u2502\n\u2502         serviceAccountName: 91170824493-compute@developer.gserviceaccount.com                     \u2502\n\u2502         containers:                                                                               \u2502\n\u2502           - image: gcr.io/google-samples/hello-app:1.0                                            \u2502\n\u2502             resources:                                                                            \u2502\n\u2502               limits:                                                                             \u2502\n\u2502                 cpu: 2000m                                                                        \u2502\n\u2502                 memory: 512Mi                                                                     \u2502\n\u2502             ports:                                                                                \u2502\n\u2502               - name: http1                                                                       \u2502\n\u2502                 containerPort: 8080                                                               \u2502\n\u2502     traffic:                                                                                      \u2502\n\u2502       - percent: 100                                                                              \u2502\n\u2502         latestRevision: true                                                                      \u2502\n\u2502   status:                                                                                         \u2502\n\u2502     observedGeneration: 1                                                                         \u2502\n\u2502     conditions:                                                                                   \u2502\n\u2502       - type: Ready                                                                               \u2502\n\u2502         status: True                                                                              \u2502\n\u2502         lastTransitionTime: 2021-12-06T04:41:08.880523Z                                           \u2502\n\u2502       - type: ConfigurationsReady                                                                 \u2502\n\u2502         status: True                                                                              \u2502\n\u2502         lastTransitionTime: 2021-12-06T04:41:08.049687Z                                           \u2502\n\u2502       - type: RoutesReady                                                                         \u2502\n\u2502         status: True                                                                              \u2502\n\u2502         lastTransitionTime: 2021-12-06T04:41:08.880523Z                                           \u2502\n\u2502     latestReadyRevisionName: starhackit-server-00005-rud                                          \u2502\n\u2502     latestCreatedRevisionName: starhackit-server-00005-rud                                        \u2502\n\u2502     traffic:                                                                                      \u2502\n\u2502       - revisionName: starhackit-server-00005-rud                                                 \u2502\n\u2502         percent: 100                                                                              \u2502\n\u2502         latestRevision: true                                                                      \u2502\n\u2502     url: https://starhackit-server-dbxubuk5wa-uc.a.run.app                                        \u2502\n\u2502     address:                                                                                      \u2502\n\u2502       url: https://starhackit-server-dbxubuk5wa-uc.a.run.app                                      \u2502\n\u2502                                                                                                   \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\nList Summary:\nProvider: google\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 google                                                                                           \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 run::Service \u2502 starhackit-server                                                                 \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n1 resource, 1 type, 1 provider\nCommand "gc l -t run::Service" executed in 2s\n')))}m.isMDXComponent=!0}}]);