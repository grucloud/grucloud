"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[35537],{3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>m});var r=n(67294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},l=Object.keys(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var u=r.createContext({}),s=function(e){var t=r.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},c=function(e){var t=s(e.components);return r.createElement(u.Provider,{value:t},e.children)},p="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},k=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,l=e.originalType,u=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),p=s(n),k=a,m=p["".concat(u,".").concat(k)]||p[k]||d[k]||l;return n?r.createElement(m,o(o({ref:t},c),{},{components:n})):r.createElement(m,o({ref:t},c))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var l=n.length,o=new Array(l);o[0]=k;var i={};for(var u in t)hasOwnProperty.call(t,u)&&(i[u]=t[u]);i.originalType=e,i[p]="string"==typeof e?e:a,o[1]=i;for(var s=2;s<l;s++)o[s]=n[s];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}k.displayName="MDXCreateElement"},28159:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>u,contentTitle:()=>o,default:()=>d,frontMatter:()=>l,metadata:()=>i,toc:()=>s});var r=n(87462),a=(n(67294),n(3905));const l={id:"K8sTutorialFullStack",title:"Full Stack App on Kubernetes"},o=void 0,i={unversionedId:"k8s/K8sTutorialFullStack",id:"k8s/K8sTutorialFullStack",title:"Full Stack App on Kubernetes",description:"Introduction",source:"@site/docs/k8s/K8sTutorialFullStack.md",sourceDirName:"k8s",slug:"/k8s/K8sTutorialFullStack",permalink:"/docs/k8s/K8sTutorialFullStack",draft:!1,tags:[],version:"current",frontMatter:{id:"K8sTutorialFullStack",title:"Full Stack App on Kubernetes"}},u={},s=[{value:"Introduction",id:"introduction",level:2},{value:"Requirements",id:"requirements",level:2},{value:"Getting the code",id:"getting-the-code",level:3},{value:"config.js",id:"configjs",level:3},{value:"Plan",id:"plan",level:2},{value:"Deploy",id:"deploy",level:2},{value:"List",id:"list",level:2},{value:"Destroy",id:"destroy",level:2}],c={toc:s},p="wrapper";function d(e){let{components:t,...n}=e;return(0,a.kt)(p,(0,r.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h2",{id:"introduction"},"Introduction"),(0,a.kt)("p",null,"The Kubernetes Grucloud provider allows to define and describe Kubernetes resources in Javascript, removing the need to write YAML or templating file."),(0,a.kt)("p",null,"The GruCloud Command Line Interface ",(0,a.kt)("strong",{parentName:"p"},"gc")," reads this description in Javascript and connect to the k8s control plane to apply the new or updated resource definitions."),(0,a.kt)("p",null,"Let's deploy a full-stack application on kubernetes locally with minikube."),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"a frontend (React)"),(0,a.kt)("li",{parentName:"ul"},"a backend (Node.js)"),(0,a.kt)("li",{parentName:"ul"},"an SQL database (postgres)"),(0,a.kt)("li",{parentName:"ul"},"Key/Value, Pub/Sub (redis)")),(0,a.kt)("p",null,(0,a.kt)("img",{parentName:"p",src:"https://raw.githubusercontent.com/grucloud/grucloud/main/examples/k8s/starhackit/minikube/artifacts/diagram-target.svg",alt:"starhackit-grucloud"})),(0,a.kt)("h2",{id:"requirements"},"Requirements"),(0,a.kt)("p",null,"Ensure ",(0,a.kt)("strong",{parentName:"p"},"kubectl")," and ",(0,a.kt)("strong",{parentName:"p"},"minikube")," is started with the ingress addon: ",(0,a.kt)("a",{parentName:"p",href:"/docs/k8s/K8sRequirements"},"K8s Requirements")),(0,a.kt)("h3",{id:"getting-the-code"},"Getting the code"),(0,a.kt)("p",null,"Install the ",(0,a.kt)("em",{parentName:"p"},"grucloud")," command line utility: ",(0,a.kt)("strong",{parentName:"p"},"gc")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"npm i -g @grucloud/core\n")),(0,a.kt)("p",null,"Clone the source code containing the examples:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"git clone git@github.com:grucloud/grucloud.git\n")),(0,a.kt)("p",null,"Change the k8s minikube directory"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"cd grucloud/examples/k8s/starhackit/minikube\n")),(0,a.kt)("p",null,"Install the node dependencies:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"npm install\n")),(0,a.kt)("h3",{id:"configjs"},"config.js"),(0,a.kt)("p",null,"Edit ",(0,a.kt)("strong",{parentName:"p"},"config.js")," and eventually change the configuration."),(0,a.kt)("h2",{id:"plan"},"Plan"),(0,a.kt)("p",null,"Find out which resources are going to be allocated:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"gc plan\n")),(0,a.kt)("h2",{id:"deploy"},"Deploy"),(0,a.kt)("p",null,"Happy with the expected plan ? Deploy it now:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"gc deploy\n")),(0,a.kt)("h2",{id:"list"},"List"),(0,a.kt)("p",null,"List all the resources:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"gc list\n")),(0,a.kt)("h2",{id:"destroy"},"Destroy"),(0,a.kt)("p",null,"Time to destroy the resources allocated:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"gc destroy\n")))}d.isMDXComponent=!0}}]);