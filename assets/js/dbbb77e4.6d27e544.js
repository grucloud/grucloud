"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[321],{3905:(e,t,a)=>{a.d(t,{Zo:()=>g,kt:()=>m});var i=a(67294);function n(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function l(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,i)}return a}function c(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?l(Object(a),!0).forEach((function(t){n(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function r(e,t){if(null==e)return{};var a,i,n=function(e,t){if(null==e)return{};var a,i,n={},l=Object.keys(e);for(i=0;i<l.length;i++)a=l[i],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(i=0;i<l.length;i++)a=l[i],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var s=i.createContext({}),I=function(e){var t=i.useContext(s),a=t;return e&&(a="function"==typeof e?e(t):c(c({},t),e)),a},g=function(e){var t=I(e.components);return i.createElement(s.Provider,{value:t},e.children)},o={inlineCode:"code",wrapper:function(e){var t=e.children;return i.createElement(i.Fragment,{},t)}},d=i.forwardRef((function(e,t){var a=e.components,n=e.mdxType,l=e.originalType,s=e.parentName,g=r(e,["components","mdxType","originalType","parentName"]),d=I(a),m=n,u=d["".concat(s,".").concat(m)]||d[m]||o[m]||l;return a?i.createElement(u,c(c({ref:t},g),{},{components:a})):i.createElement(u,c({ref:t},g))}));function m(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var l=a.length,c=new Array(l);c[0]=d;var r={};for(var s in t)hasOwnProperty.call(t,s)&&(r[s]=t[s]);r.originalType=e,r.mdxType="string"==typeof e?e:n,c[1]=r;for(var I=2;I<l;I++)c[I]=a[I];return i.createElement.apply(null,c)}return i.createElement.apply(null,a)}d.displayName="MDXCreateElement"},3901:(e,t,a)=>{a.d(t,{Z:()=>c});var i=a(67294),n=a(93743);const l="tableOfContentsInline_prmo";function c(e){let{toc:t,minHeadingLevel:a,maxHeadingLevel:c}=e;return i.createElement("div",{className:l},i.createElement(n.Z,{toc:t,minHeadingLevel:a,maxHeadingLevel:c,className:"table-of-contents",linkClassName:null}))}},93743:(e,t,a)=>{a.d(t,{Z:()=>u});var i=a(87462),n=a(67294);function l(e){const t=e.map((e=>({...e,parentIndex:-1,children:[]}))),a=Array(7).fill(-1);t.forEach(((e,t)=>{const i=a.slice(2,e.level);e.parentIndex=Math.max(...i),a[e.level]=t}));const i=[];return t.forEach((e=>{const{parentIndex:a,...n}=e;a>=0?t[a].children.push(n):i.push(n)})),i}function c(e){let{toc:t,minHeadingLevel:a,maxHeadingLevel:i}=e;return t.flatMap((e=>{const t=c({toc:e.children,minHeadingLevel:a,maxHeadingLevel:i});return function(e){return e.level>=a&&e.level<=i}(e)?[{...e,children:t}]:t}))}var r=a(86668);function s(e){const t=e.getBoundingClientRect();return t.top===t.bottom?s(e.parentNode):t}function I(e,t){var a;let{anchorTopOffset:i}=t;const n=e.find((e=>s(e).top>=i));if(n){var l;return function(e){return e.top>0&&e.bottom<window.innerHeight/2}(s(n))?n:null!=(l=e[e.indexOf(n)-1])?l:null}return null!=(a=e[e.length-1])?a:null}function g(){const e=(0,n.useRef)(0),{navbar:{hideOnScroll:t}}=(0,r.L)();return(0,n.useEffect)((()=>{e.current=t?0:document.querySelector(".navbar").clientHeight}),[t]),e}function o(e){const t=(0,n.useRef)(void 0),a=g();(0,n.useEffect)((()=>{if(!e)return()=>{};const{linkClassName:i,linkActiveClassName:n,minHeadingLevel:l,maxHeadingLevel:c}=e;function r(){const e=function(e){return Array.from(document.getElementsByClassName(e))}(i),r=function(e){let{minHeadingLevel:t,maxHeadingLevel:a}=e;const i=[];for(let n=t;n<=a;n+=1)i.push("h"+n+".anchor");return Array.from(document.querySelectorAll(i.join()))}({minHeadingLevel:l,maxHeadingLevel:c}),s=I(r,{anchorTopOffset:a.current}),g=e.find((e=>s&&s.id===function(e){return decodeURIComponent(e.href.substring(e.href.indexOf("#")+1))}(e)));e.forEach((e=>{!function(e,a){a?(t.current&&t.current!==e&&t.current.classList.remove(n),e.classList.add(n),t.current=e):e.classList.remove(n)}(e,e===g)}))}return document.addEventListener("scroll",r),document.addEventListener("resize",r),r(),()=>{document.removeEventListener("scroll",r),document.removeEventListener("resize",r)}}),[e,a])}function d(e){let{toc:t,className:a,linkClassName:i,isChild:l}=e;return t.length?n.createElement("ul",{className:l?void 0:a},t.map((e=>n.createElement("li",{key:e.id},n.createElement("a",{href:"#"+e.id,className:null!=i?i:void 0,dangerouslySetInnerHTML:{__html:e.value}}),n.createElement(d,{isChild:!0,toc:e.children,className:a,linkClassName:i}))))):null}const m=n.memo(d);function u(e){let{toc:t,className:a="table-of-contents table-of-contents__left-border",linkClassName:s="table-of-contents__link",linkActiveClassName:I,minHeadingLevel:g,maxHeadingLevel:d,...u}=e;const M=(0,r.L)(),N=null!=g?g:M.tableOfContents.minHeadingLevel,p=null!=d?d:M.tableOfContents.maxHeadingLevel,b=function(e){let{toc:t,minHeadingLevel:a,maxHeadingLevel:i}=e;return(0,n.useMemo)((()=>c({toc:l(t),minHeadingLevel:a,maxHeadingLevel:i})),[t,a,i])}({toc:t,minHeadingLevel:N,maxHeadingLevel:p});return o((0,n.useMemo)((()=>{if(s&&I)return{linkClassName:s,linkActiveClassName:I,minHeadingLevel:N,maxHeadingLevel:p}}),[s,I,N,p])),n.createElement(m,(0,i.Z)({toc:b,className:a,linkClassName:s},u))}},1121:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>I,contentTitle:()=>r,default:()=>d,frontMatter:()=>c,metadata:()=>s,toc:()=>g});var i=a(87462),n=(a(67294),a(3905)),l=a(3901);const c={id:"AzureGettingStarted",title:"Azure Getting Started"},r=void 0,s={unversionedId:"azure/AzureGettingStarted",id:"azure/AzureGettingStarted",title:"Azure Getting Started",description:"This document describes how to get started with GruCloud on Azure.",source:"@site/docs/azure/AzureGettingStarted.md",sourceDirName:"azure",slug:"/azure/AzureGettingStarted",permalink:"/docs/azure/AzureGettingStarted",draft:!1,tags:[],version:"current",frontMatter:{id:"AzureGettingStarted",title:"Azure Getting Started"},sidebar:"docs",previous:{title:"GCP Getting Started",permalink:"/docs/google/GoogleGettingStarted"},next:{title:"Kubernetes Getting Started",permalink:"/docs/k8s/K8sGettingStarted"}},I={},g=[{value:"Use Cases",id:"use-cases",level:2},{value:"Workflow",id:"workflow",level:2},{value:"Requirement",id:"requirement",level:2},{value:"Azure Account",id:"azure-account",level:3},{value:"Azure CLI",id:"azure-cli",level:3},{value:"Installing the GruCloud CLI",id:"installing-the-grucloud-cli",level:3},{value:"GruCloud CLI commands",id:"grucloud-cli-commands",level:2},{value:"<code>gc new</code> Create a new project",id:"gc-new-create-a-new-project",level:3},{value:"<code>gc list</code> List the live resources",id:"gc-list-list-the-live-resources",level:3},{value:"<code>gc gencode</code> Generate the code",id:"gc-gencode-generate-the-code",level:3},{value:"<code>gc graph</code> Target Graph",id:"gc-graph-target-graph",level:3},{value:"<code>gc apply</code> Update the resources",id:"gc-apply-update-the-resources",level:3},{value:"<code>gc destroy</code> Destroy the resources",id:"gc-destroy-destroy-the-resources",level:3},{value:"Next Steps",id:"next-steps",level:2}],o={toc:g};function d(e){let{components:t,...c}=e;return(0,n.kt)("wrapper",(0,i.Z)({},o,c,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("p",null,"This document describes how to get started with GruCloud on Azure."),(0,n.kt)(l.Z,{toc:g,mdxType:"TOCInline"}),(0,n.kt)("h2",{id:"use-cases"},"Use Cases"),(0,n.kt)("p",null,(0,n.kt)("img",{alt:"usecase.svg",src:a(29e3).Z,width:"732",height:"498"})),(0,n.kt)("h2",{id:"workflow"},"Workflow"),(0,n.kt)("p",null,(0,n.kt)("img",{alt:"gc-new-workflow",src:a(50997).Z,width:"694",height:"1096"})),(0,n.kt)("h2",{id:"requirement"},"Requirement"),(0,n.kt)("h3",{id:"azure-account"},"Azure Account"),(0,n.kt)("p",null,"Visit the ",(0,n.kt)("a",{parentName:"p",href:"https://portal.azure.com"},"azure portal")," and ensure you have an azure account as well as a subscription."),(0,n.kt)("h3",{id:"azure-cli"},"Azure CLI"),(0,n.kt)("p",null,"Install the Azure Command-Line Interface ",(0,n.kt)("strong",{parentName:"p"},"az")," from ",(0,n.kt)("a",{parentName:"p",href:"https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest"},"here")),(0,n.kt)("p",null,"At this point, ensure the ",(0,n.kt)("strong",{parentName:"p"},"az")," command is installed:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-bash"},"az --version\n")),(0,n.kt)("h3",{id:"installing-the-grucloud-cli"},"Installing the GruCloud CLI"),(0,n.kt)("p",null,"The GruCloud CLI, ",(0,n.kt)("inlineCode",{parentName:"p"},"gc"),", is written in Javascript running on ",(0,n.kt)("a",{parentName:"p",href:"https://nodejs.org"},"Node.js")),(0,n.kt)("p",null,"Install it globally with:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-sh"},"npm i -g @grucloud/core\n")),(0,n.kt)("p",null,(0,n.kt)("img",{alt:"gc-cli-install.svg",src:a(43998).Z,width:"418",height:"658"})),(0,n.kt)("h2",{id:"grucloud-cli-commands"},"GruCloud CLI commands"),(0,n.kt)("h3",{id:"gc-new-create-a-new-project"},(0,n.kt)("inlineCode",{parentName:"h3"},"gc new")," Create a new project"),(0,n.kt)("p",null,"Use the ",(0,n.kt)("a",{parentName:"p",href:"/docs/cli/New"},"new")," command to create a new project:"),(0,n.kt)("p",null,(0,n.kt)("img",{alt:"gc-new-azure",src:a(41596).Z,width:"715",height:"2018"})),(0,n.kt)("div",null,(0,n.kt)("iframe",{"data-autoplay":!0,src:"https://asciinema.org/a/MFw0YToJlA6BpFgUU3LY2LA1D/iframe?autoplay=true&speed=2&loop=true",id:"asciicast-iframe-13761",name:"asciicast-iframe-13761",scrolling:"no",style:{width:"100%",height:"500px"}})),"The boilerplate project is now created and configured.",(0,n.kt)("h3",{id:"gc-list-list-the-live-resources"},(0,n.kt)("inlineCode",{parentName:"h3"},"gc list")," List the live resources"),(0,n.kt)("p",null,"Visualize your current infrastructure with the ",(0,n.kt)("a",{parentName:"p",href:"/docs/cli/List"},"list")," command:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-sh"},"gc list --graph\n")),(0,n.kt)("div",null,(0,n.kt)("iframe",{"data-autoplay":!0,src:"https://asciinema.org/a/zbXkGiXBdDwOXHCJtKvttxv9z/iframe?autoplay=true&speed=1&loop=true",id:"asciicast-iframe-13761",name:"asciicast-iframe-13761",scrolling:"no",style:{width:"100%",height:"700px"}})),(0,n.kt)("p",null,(0,n.kt)("img",{parentName:"p",src:"https://raw.githubusercontent.com/grucloud/grucloud/main/examples/azure/Compute/vm/artifacts/diagram-live.svg",alt:"diagram-live.svg"})),(0,n.kt)("h3",{id:"gc-gencode-generate-the-code"},(0,n.kt)("inlineCode",{parentName:"h3"},"gc gencode")," Generate the code"),(0,n.kt)("p",null,"The ",(0,n.kt)("a",{parentName:"p",href:"/docs/cli/GenCode"},"gencode")," command fetches the live resources and generate the code in ",(0,n.kt)("inlineCode",{parentName:"p"},"resource.js")),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-sh"},"gc gencode\n")),(0,n.kt)("p",null,"The following flowchart explains in more detail the process of generating the code from the live infrastructure."),(0,n.kt)("p",null,(0,n.kt)("img",{alt:"gc-gencode.svg",src:a(29605).Z,width:"383",height:"701"})),(0,n.kt)("div",null,(0,n.kt)("iframe",{"data-autoplay":!0,src:"https://asciinema.org/a/MyAIWObbcxVXLMaBA2A05u3y4/iframe?autoplay=true&speed=1&loop=true",id:"asciicast-iframe-13762",name:"asciicast-iframe-13762",scrolling:"no",style:{width:"100%",height:"700px"}})),(0,n.kt)("h3",{id:"gc-graph-target-graph"},(0,n.kt)("inlineCode",{parentName:"h3"},"gc graph")," Target Graph"),(0,n.kt)("p",null,"The ",(0,n.kt)("a",{parentName:"p",href:"/docs/cli/Graph"},"graph")," command creates a dependency graph of the target resources:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-sh"},"gc graph\n")),(0,n.kt)("p",null,(0,n.kt)("img",{parentName:"p",src:"https://raw.githubusercontent.com/grucloud/grucloud/main/examples/azure/Compute/vm/artifacts/diagram-target.svg",alt:"diagram-live.svg"})),(0,n.kt)("blockquote",null,(0,n.kt)("p",{parentName:"blockquote"},"The ",(0,n.kt)("inlineCode",{parentName:"p"},"graph")," command requires ",(0,n.kt)("a",{parentName:"p",href:"https://graphviz.org/"},"graphviz")," to convert the generated ",(0,n.kt)("inlineCode",{parentName:"p"},"artifacts/diagram-target.dot")," into an image such as ",(0,n.kt)("inlineCode",{parentName:"p"},"artifacts/diagram-target.svg"))),(0,n.kt)("h3",{id:"gc-apply-update-the-resources"},(0,n.kt)("inlineCode",{parentName:"h3"},"gc apply")," Update the resources"),(0,n.kt)("p",null,"To update the infrastructure, either use the ",(0,n.kt)("a",{parentName:"p",href:"https://portal.azure.com"},"Azure portal")," and run ",(0,n.kt)("strong",{parentName:"p"},"gc gencode"),", or modify directly the file ",(0,n.kt)("strong",{parentName:"p"},"resource.js"),".\nOnce done, use the ",(0,n.kt)("a",{parentName:"p",href:"/docs/cli/Apply"},"apply")," command to update the infrastructure:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-sh"},"gc apply\n")),(0,n.kt)("div",null,(0,n.kt)("iframe",{"data-autoplay":!0,src:"https://asciinema.org/a/X8nXfxNUnAKVPTORfPRggDbP0/iframe?autoplay=true&speed=1&loop=true",id:"asciicast-iframe-13763",name:"asciicast-iframe-13763",scrolling:"no",style:{width:"100%",height:"800px"}})),(0,n.kt)("h3",{id:"gc-destroy-destroy-the-resources"},(0,n.kt)("inlineCode",{parentName:"h3"},"gc destroy")," Destroy the resources"),(0,n.kt)("p",null,"To destroy the infrastructure, use the ",(0,n.kt)("a",{parentName:"p",href:"/docs/cli/Destroy"},"destroy")," command:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-sh"},"gc destroy\n")),(0,n.kt)("div",null,(0,n.kt)("iframe",{"data-autoplay":!0,src:"https://asciinema.org/a/2pQiYTgZgQD776G077qOHBU64/iframe?autoplay=true&speed=1&loop=true",id:"asciicast-iframe-13764",name:"asciicast-iframe-13764",scrolling:"no",style:{width:"100%",height:"900px"}})),(0,n.kt)("h2",{id:"next-steps"},"Next Steps"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("p",{parentName:"li"},"Browse the various ",(0,n.kt)("a",{parentName:"p",href:"https://github.com/grucloud/grucloud/tree/main/examples/azure"},"examples")," which helps to find out how to use this software.")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("p",{parentName:"li"},"Available ",(0,n.kt)("a",{parentName:"p",href:"/docs/azure/ResourcesList"},"Azure Resources")))))}d.isMDXComponent=!0},29605:(e,t,a)=>{a.d(t,{Z:()=>i});const i=a.p+"assets/images/gc-gencode-063db0529fef36735cc43749fcb35ce8.svg"},41596:(e,t,a)=>{a.d(t,{Z:()=>i});const i=a.p+"assets/images/gc-new-azure-2ea1e4f34e3ad1f72b66eaa523949064.svg"},50997:(e,t,a)=>{a.d(t,{Z:()=>i});const i=a.p+"assets/images/gc-new-workflow-9e3174ee3771bf5c4f08ac5b8ad0a357.svg"},29e3:(e,t,a)=>{a.d(t,{Z:()=>i});const i="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBjb250ZW50U2NyaXB0VHlwZT0iYXBwbGljYXRpb24vZWNtYXNjcmlwdCIgY29udGVudFN0eWxlVHlwZT0idGV4dC9jc3MiIGhlaWdodD0iNDk4cHgiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiIHN0eWxlPSJ3aWR0aDo3MzJweDtoZWlnaHQ6NDk4cHg7YmFja2dyb3VuZDojRkZGRkZGOyIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgNzMyIDQ5OCIgd2lkdGg9IjczMnB4IiB6b29tQW5kUGFuPSJtYWduaWZ5Ij48ZGVmcy8+PGc+PCEtLU1ENT1bZDNjNjEyYTY0ZDhhNmIwMDQ5NGI0MWNlOWQ0ZGFjZTddCmNsdXN0ZXIgR3J1Q2xvdWQgdXNlIGNhc2VzLS0+PHBvbHlnb24gZmlsbD0iI0ZGRkZGRiIgcG9pbnRzPSIxNDUsMTIuMTE5MSwzOTUsMTIuMTE5MSw0MDIsNDQuODU2NCw1NDUsNDQuODU2NCw1NDUsNDkxLjExOTEsMTQ1LDQ5MS4xMTkxLDE0NSwxMi4xMTkxIiBzdHlsZT0ic3Ryb2tlOiMwMDAwMDA7c3Ryb2tlLXdpZHRoOjEuMDsiLz48bGluZSBzdHlsZT0ic3Ryb2tlOiMwMDAwMDA7c3Ryb2tlLXdpZHRoOjEuMDsiIHgxPSIxNDUiIHgyPSI0MDIiIHkxPSI0NC44NTY0IiB5Mj0iNDQuODU2NCIvPjx0ZXh0IGZpbGw9IiMwMDAwMDAiIGZvbnQtZmFtaWx5PSJWZXJkYW5hIiBmb250LXNpemU9IjIyIiBmb250LXdlaWdodD0iYm9sZCIgbGVuZ3RoQWRqdXN0PSJzcGFjaW5nIiB0ZXh0TGVuZ3RoPSIyNDQiIHg9IjE0OSIgeT0iMzYuMjM3MyI+R3J1Q2xvdWQgdXNlIGNhc2VzPC90ZXh0PjxlbGxpcHNlIGN4PSIzNDUuMDE5OCIgY3k9Ijg5LjAyMzEiIGZpbGw9IiNGRkZGRkYiIHJ4PSIxNDUuMDE5OCIgcnk9IjMxLjQwNCIgc3R5bGU9InN0cm9rZTojMDAwMDAwO3N0cm9rZS13aWR0aDoxLjA7Ii8+PHRleHQgZmlsbD0iIzAwMDAwMCIgZm9udC1mYW1pbHk9IlZlcmRhbmEiIGZvbnQtc2l6ZT0iMTQiIGxlbmd0aEFkanVzdD0ic3BhY2luZyIgdGV4dExlbmd0aD0iMjU5IiB4PSIyMTUuNTE5OCIgeT0iOTIuNTkxIj5EaXNwbGF5IGRpYWdyYW1zIGZyb20gbGl2ZSByZXNvdXJjZXM8L3RleHQ+PGVsbGlwc2UgY3g9IjM0NS4wNjczIiBjeT0iMTk1LjMzMjYiIGZpbGw9IiNGRkZGRkYiIHJ4PSIxODQuMDY3MyIgcnk9IjM5LjIxMzUiIHN0eWxlPSJzdHJva2U6IzAwMDAwMDtzdHJva2Utd2lkdGg6MS4wOyIvPjx0ZXh0IGZpbGw9IiMwMDAwMDAiIGZvbnQtZmFtaWx5PSJWZXJkYW5hIiBmb250LXNpemU9IjE0IiBsZW5ndGhBZGp1c3Q9InNwYWNpbmciIHRleHRMZW5ndGg9IjM0MCIgeD0iMTc1LjA2NzMiIHk9IjE5OC45MDA1Ij5HZW5lcmF0ZSBpbmZyYXN0cnVjdHVyZSBjb2RlIGZyb20gbGl2ZSByZXNvdXJjZXM8L3RleHQ+PGVsbGlwc2UgY3g9IjM0NC44MzIxIiBjeT0iMjk5LjI4NTYiIGZpbGw9IiNGRkZGRkYiIHJ4PSIxMzguODMyMSIgcnk9IjMwLjE2NjQiIHN0eWxlPSJzdHJva2U6IzAwMDAwMDtzdHJva2Utd2lkdGg6MS4wOyIvPjx0ZXh0IGZpbGw9IiMwMDAwMDAiIGZvbnQtZmFtaWx5PSJWZXJkYW5hIiBmb250LXNpemU9IjE0IiBsZW5ndGhBZGp1c3Q9InNwYWNpbmciIHRleHRMZW5ndGg9IjI0NiIgeD0iMjIxLjgzMjEiIHk9IjMwMi44NTM0Ij5EZXBsb3kgcmVzb3VyY2VzIHRvIHZhcmlvdXMgcGhhc2VzPC90ZXh0PjxlbGxpcHNlIGN4PSIzNDQuOTQwNiIgY3k9IjM4Mi45MDczIiBmaWxsPSIjRkZGRkZGIiByeD0iODEuOTQwNiIgcnk9IjE4Ljc4ODEiIHN0eWxlPSJzdHJva2U6IzAwMDAwMDtzdHJva2Utd2lkdGg6MS4wOyIvPjx0ZXh0IGZpbGw9IiMwMDAwMDAiIGZvbnQtZmFtaWx5PSJWZXJkYW5hIiBmb250LXNpemU9IjE0IiBsZW5ndGhBZGp1c3Q9InNwYWNpbmciIHRleHRMZW5ndGg9IjEyMSIgeD0iMjg0LjQ0MDYiIHk9IjM4Ni40NzUxIj5VcGRhdGUgcmVzb3VyY2VzPC90ZXh0PjxlbGxpcHNlIGN4PSIzNDUuMTMyNiIgY3k9IjQ1Ni4yNDU3IiBmaWxsPSIjRkZGRkZGIiByeD0iODMuNjMyNiIgcnk9IjE5LjEyNjUiIHN0eWxlPSJzdHJva2U6IzAwMDAwMDtzdHJva2Utd2lkdGg6MS4wOyIvPjx0ZXh0IGZpbGw9IiMwMDAwMDAiIGZvbnQtZmFtaWx5PSJWZXJkYW5hIiBmb250LXNpemU9IjE0IiBsZW5ndGhBZGp1c3Q9InNwYWNpbmciIHRleHRMZW5ndGg9IjEyNSIgeD0iMjgyLjYzMjYiIHk9IjQ1OS44MTM1Ij5EZXN0cm95IHJlc291cmNlczwvdGV4dD48IS0tTUQ1PVswMTFkYjFkMjcyNzRjODY2OTE4NzFiYzUxYjEyYmViOF0KZW50aXR5IGQtLT48ZWxsaXBzZSBjeD0iNTYiIGN5PSIyNjkuMTE5MSIgZmlsbD0iI0ZGRkZGRiIgcng9IjgiIHJ5PSI4IiBzdHlsZT0ic3Ryb2tlOiMwMDAwMDA7c3Ryb2tlLXdpZHRoOjEuMDsiLz48cGF0aCBkPSJNNTYsMjc3LjExOTEgTDU2LDMwNC4xMTkxIE00MywyODUuMTE5MSBMNjksMjg1LjExOTEgTTU2LDMwNC4xMTkxIEw0MywzMTkuMTE5MSBNNTYsMzA0LjExOTEgTDY5LDMxOS4xMTkxICIgZmlsbD0ibm9uZSIgc3R5bGU9InN0cm9rZTojMDAwMDAwO3N0cm9rZS13aWR0aDoxLjA7Ii8+PHRleHQgZmlsbD0iIzAwMDAwMCIgZm9udC1mYW1pbHk9IlZlcmRhbmEiIGZvbnQtc2l6ZT0iMTQiIGxlbmd0aEFkanVzdD0ic3BhY2luZyIgdGV4dExlbmd0aD0iOTAiIHg9IjExIiB5PSIzMzUuMTk0MyI+RGV2T3BzIFVzZXI8L3RleHQ+PHBhdGggZD0iTTU4OSwyODYuMTE5MSBMNTg5LDI5NS4xMTkxIEw0ODQuMjMsMjk5LjExOTEgTDU4OSwzMDMuMTE5MSBMNTg5LDMxMS45MTg1IEEwLDAgMCAwIDAgNTg5LDMxMS45MTg1IEw3MjUsMzExLjkxODUgQTAsMCAwIDAgMCA3MjUsMzExLjkxODUgTDcyNSwyOTYuMTE5MSBMNzE1LDI4Ni4xMTkxIEw1ODksMjg2LjExOTEgQTAsMCAwIDAgMCA1ODksMjg2LjExOTEgIiBmaWxsPSIjRkZGRkZGIiBzdHlsZT0ic3Ryb2tlOiMwMDAwMDA7c3Ryb2tlLXdpZHRoOjEuMDsiLz48cGF0aCBkPSJNNzE1LDI4Ni4xMTkxIEw3MTUsMjk2LjExOTEgTDcyNSwyOTYuMTE5MSBMNzE1LDI4Ni4xMTkxICIgZmlsbD0iI0ZGRkZGRiIgc3R5bGU9InN0cm9rZTojMDAwMDAwO3N0cm9rZS13aWR0aDoxLjA7Ii8+PHRleHQgZmlsbD0iIzAwMDAwMCIgZm9udC1mYW1pbHk9IlZlcmRhbmEiIGZvbnQtc2l6ZT0iMTMiIGxlbmd0aEFkanVzdD0ic3BhY2luZyIgdGV4dExlbmd0aD0iMTE1IiB4PSI1OTUiIHk9IjMwNC4xODkiPnByb2QsIHRlc3QsIGV0YyAuLi48L3RleHQ+PCEtLU1ENT1bNTk0ZGZkMjliYjc4NTE0NmQwNDJlNDZiYTY3MGIxZjFdCmxpbmsgZCB0byBVQzEtLT48cGF0aCBkPSJNNjYuMjIsMjU5Ljg3OTEgQzc2Ljk2LDIyMi45MjkxIDk4LjM4LDE2OC43NzkxIDEzNywxMzguMTE5MSBDMTU3LjQsMTIxLjkxOTEgMTgyLjI4LDExMC45MjkxIDIwNy42MiwxMDMuNDk5MSAiIGZpbGw9Im5vbmUiIGlkPSJkLXRvLVVDMSIgc3R5bGU9InN0cm9rZTojMDAwMDAwO3N0cm9rZS13aWR0aDoxLjA7Ii8+PHBvbHlnb24gZmlsbD0iIzAwMDAwMCIgcG9pbnRzPSIyMTIuNjksMTAyLjA1OTEsMjAyLjkzODUsMTAwLjY3NzksMjA3Ljg4MTMsMTAzLjQyOSwyMDUuMTMwMiwxMDguMzcxOCwyMTIuNjksMTAyLjA1OTEiIHN0eWxlPSJzdHJva2U6IzAwMDAwMDtzdHJva2Utd2lkdGg6MS4wOyIvPjwhLS1NRDU9WzlhNzBhYjkwMDQ2OTViZjI4NmMyZWM4NjVkYjViYzQ3XQpsaW5rIGQgdG8gVUMyLS0+PHBhdGggZD0iTTEwMS4xMiwyNjkuNjk5MSBDMTEyLjQ5LDI2Mi45NDkxIDEyNC45MywyNTYuMjU5MSAxMzcsMjUxLjExOTEgQzE2MC44NSwyNDAuOTY5MSAxODcuMDMsMjMyLjE5OTEgMjEyLjUxLDIyNC44MDkxICIgZmlsbD0ibm9uZSIgaWQ9ImQtdG8tVUMyIiBzdHlsZT0ic3Ryb2tlOiMwMDAwMDA7c3Ryb2tlLXdpZHRoOjEuMDsiLz48cG9seWdvbiBmaWxsPSIjMDAwMDAwIiBwb2ludHM9IjIxNy42LDIyMy4zNDkxLDIwNy44NDM3LDIyMi4wMDI0LDIxMi43OTYyLDIyNC43MzYsMjEwLjA2MjYsMjI5LjY4ODUsMjE3LjYsMjIzLjM0OTEiIHN0eWxlPSJzdHJva2U6IzAwMDAwMDtzdHJva2Utd2lkdGg6MS4wOyIvPjwhLS1NRDU9WzZkZmYxMjg5ZDU3ZWNjM2MzZGY1MTNjNmZkZDAzNDI0XQpsaW5rIGQgdG8gVUMzLS0+PHBhdGggZD0iTTEwMS4yMSwyOTkuMTE5MSBDMTI4LjE5LDI5OS4xMTkxIDE2NC4zNSwyOTkuMTE5MSAyMDAuNTEsMjk5LjExOTEgIiBmaWxsPSJub25lIiBpZD0iZC10by1VQzMiIHN0eWxlPSJzdHJva2U6IzAwMDAwMDtzdHJva2Utd2lkdGg6MS4wOyIvPjxwb2x5Z29uIGZpbGw9IiMwMDAwMDAiIHBvaW50cz0iMjA1Ljg0LDI5OS4xMTkxLDE5Ni44NCwyOTUuMTE5MSwyMDAuODQsMjk5LjExOTEsMTk2Ljg0LDMwMy4xMTkxLDIwNS44NCwyOTkuMTE5MSIgc3R5bGU9InN0cm9rZTojMDAwMDAwO3N0cm9rZS13aWR0aDoxLjA7Ii8+PCEtLU1ENT1bZDEwYzVhMzNmYTIxMmM5NWYxN2MzNGQ4NzQ2ZTcyMjVdCmxpbmsgZCB0byBVQzQtLT48cGF0aCBkPSJNMTAxLjMxLDMyOC44NzkxIEMxMTIuNTcsMzM1LjM4OTEgMTI0LjkxLDM0MS42NDkxIDEzNywzNDYuMTE5MSBDMTc3LjMxLDM2MS4wMTkxIDIyNC4zMiwzNzAuMDM5MSAyNjMuMzQsMzc1LjQzOTEgIiBmaWxsPSJub25lIiBpZD0iZC10by1VQzQiIHN0eWxlPSJzdHJva2U6IzAwMDAwMDtzdHJva2Utd2lkdGg6MS4wOyIvPjxwb2x5Z29uIGZpbGw9IiMwMDAwMDAiIHBvaW50cz0iMjY4LjU0LDM3Ni4xMzkxLDI2MC4xNjAzLDM3MC45NjQxLDI2My41ODU1LDM3NS40NjYxLDI1OS4wODM1LDM3OC44OTEzLDI2OC41NCwzNzYuMTM5MSIgc3R5bGU9InN0cm9rZTojMDAwMDAwO3N0cm9rZS13aWR0aDoxLjA7Ii8+PCEtLU1ENT1bYWEyYmY2NGUxZDYxMjQ3YTJkYTg3OGMyNDIyZmM5YzhdCmxpbmsgZCB0byBVQzUtLT48cGF0aCBkPSJNNzMuMDUsMzM4LjI5OTEgQzg2LjIsMzY1LjMzOTEgMTA3LjQ3LDM5OS43NzkxIDEzNyw0MTkuMTE5MSBDMTcxLjkzLDQ0MS45OTkxIDIxNi45Niw0NTEuODE5MSAyNTYuMSw0NTUuNjc5MSAiIGZpbGw9Im5vbmUiIGlkPSJkLXRvLVVDNSIgc3R5bGU9InN0cm9rZTojMDAwMDAwO3N0cm9rZS13aWR0aDoxLjA7Ii8+PHBvbHlnb24gZmlsbD0iIzAwMDAwMCIgcG9pbnRzPSIyNjEuMzMsNDU2LjE2OTEsMjUyLjc0NjUsNDUxLjMzOTcsMjU2LjM1MjIsNDU1LjY5ODUsMjUxLjk5MzQsNDU5LjMwNDIsMjYxLjMzLDQ1Ni4xNjkxIiBzdHlsZT0ic3Ryb2tlOiMwMDAwMDA7c3Ryb2tlLXdpZHRoOjEuMDsiLz48IS0tTUQ1PVs3NmJkZGQxZTcxNjIwZDViY2FkZTA3ZTdiMjJkZjgwOV0KQHN0YXJ0dW1sDQoNCiF0aGVtZSBwbGFpbg0KbGVmdCB0byByaWdodCBkaXJlY3Rpb24NCmFjdG9yICJEZXZPcHMgVXNlciIgYXMgZA0KDQpwYWNrYWdlICJHcnVDbG91ZCB1c2UgY2FzZXMiIHsNCiAgdXNlY2FzZSAiRGlzcGxheSBkaWFncmFtcyBmcm9tIGxpdmUgcmVzb3VyY2VzIiBhcyBVQzENCiAgdXNlY2FzZSAiR2VuZXJhdGUgaW5mcmFzdHJ1Y3R1cmUgY29kZSBmcm9tIGxpdmUgcmVzb3VyY2VzIiBhcyBVQzINCiAgdXNlY2FzZSAiRGVwbG95IHJlc291cmNlcyB0byB2YXJpb3VzIHBoYXNlcyIgYXMgVUMzDQogIHVzZWNhc2UgIlVwZGF0ZSByZXNvdXJjZXMiIGFzIFVDNA0KICB1c2VjYXNlICJEZXN0cm95IHJlc291cmNlcyIgYXMgVUM1DQp9DQoNCm5vdGUgcmlnaHQgb2YgVUMzDQpwcm9kLCB0ZXN0LCBldGMgLi4uDQplbmQgbm90ZQ0KDQpkIC0gLT4gVUMxDQpkIC0gLT4gVUMyDQpkIC0gLT4gVUMzDQpkIC0gLT4gVUM0DQpkIC0gLT4gVUM1DQoNCkBlbmR1bWwNCgpAc3RhcnR1bWwNCg0KDQoNCg0KDQoNCg0KDQo8c3R5bGU+DQogIHJvb3Qgew0KICAgIEJhY2tncm91bmRDb2xvciB3aGl0ZQ0KICAgIEZvbnRDb2xvciBibGFjaw0KICAgIEZvbnROYW1lIFZlcmRhbmENCiAgICBIeXBlckxpbmtDb2xvciBibHVlDQogICAgTGluZUNvbG9yIGJsYWNrDQogICAgTGluZVRoaWNrbmVzcyAxDQogICAgTWFyZ2luIDUNCiAgfQ0KICBjYXB0aW9uIHsNCiAgICBMaW5lVGhpY2tuZXNzIDANCiAgfQ0KICBmb290ZXIgew0KICAgIExpbmVUaGlja25lc3MgMA0KICB9DQogIGhlYWRlciB7DQogICAgTGluZVRoaWNrbmVzcyAwDQogIH0NCiAgbm9kZSB7DQogICAgTWF4aW11bVdpZHRoIDMwMA0KICB9DQogIHRpdGxlIHsNCiAgICBGb250U2l6ZSAyMg0KICAgIExpbmVUaGlja25lc3MgMA0KICB9DQo8L3N0eWxlPg0KDQpza2lucGFyYW0gQXJyb3dMb2xsaXBvcENvbG9yIGJsYWNrDQpza2lucGFyYW0gQmFja2dyb3VuZENvbG9yIHdoaXRlDQpza2lucGFyYW0gRGVmYXVsdEZvbnROYW1lIFZlcmRhbmENCnNraW5wYXJhbSBEZWZhdWx0TW9ub3NwYWNlZEZvbnROYW1lIENvdXJpZXINCnNraW5wYXJhbSBMaWZlbGluZVN0cmF0ZWd5IG5vc29saWQNCnNraW5wYXJhbSBQYXJ0aWNpcGFudFBhZGRpbmcgMTANCnNraW5wYXJhbSBTZXF1ZW5jZUxpZmVMaW5lQm9yZGVyQ29sb3IgYmxhY2sNCnNraW5wYXJhbSBTaGFkb3dpbmcgZmFsc2UNCnNraW5wYXJhbSBVc2VCZXRhU3R5bGUgdHJ1ZQ0KDQpza2lucGFyYW0gQWN0aXZpdHkgew0KICBCYWNrZ3JvdW5kQ29sb3Igd2hpdGUNCiAgQmFyQ29sb3IgYmxhY2sNCiAgQm9yZGVyQ29sb3IgYmxhY2sNCiAgRm9udENvbG9yIGJsYWNrDQogIEZvbnROYW1lIFZlcmRhbmENCn0NCnNraW5wYXJhbSBCb3VuZGFyeSB7DQogIEZvbnRDb2xvciBibGFjaw0KfQ0Kc2tpbnBhcmFtIEJveCB7DQogIFBhZGRpbmcgNQ0KfQ0Kc2tpbnBhcmFtIENpcmNsZWRDaGFyYWN0ZXIgew0KICBGb250Q29sb3IgYmxhY2sNCiAgRm9udE5hbWUgQ291cmllcg0KICBSYWRpdXMgOQ0KfQ0Kc2tpbnBhcmFtIENsYXNzIHsNCiAgQmFja2dyb3VuZENvbG9yIHdoaXRlDQogIEJvcmRlckNvbG9yIGJsYWNrDQogIEZvbnRDb2xvciBibGFjaw0KICBGb250TmFtZSBWZXJkYW5hDQp9DQpza2lucGFyYW0gQ2xhc3NBdHRyaWJ1dGUgew0KICBGb250Q29sb3IgYmxhY2sNCiAgRm9udE5hbWUgVmVyZGFuYQ0KfQ0Kc2tpbnBhcmFtIENsYXNzU3RlcmVvdHlwZSB7DQogIEZvbnRDb2xvciBibGFjaw0KICBGb250TmFtZSBWZXJkYW5hDQp9DQpza2lucGFyYW0gRm9vdGVyIHsNCiAgRm9udENvbG9yIGJsYWNrDQogIEZvbnROYW1lIFZlcmRhbmENCn0NCnNraW5wYXJhbSBIZWFkZXIgew0KICBGb250Q29sb3IgYmxhY2sNCiAgRm9udE5hbWUgVmVyZGFuYQ0KfQ0Kc2tpbnBhcmFtIEh5cGVybGluayB7DQogIENvbG9yIGJsdWUNCn0NCnNraW5wYXJhbSBJY29uUGFja2FnZSB7DQogIENvbG9yIGJsYWNrDQogIEJhY2tncm91bmRDb2xvciB3aGl0ZQ0KfQ0Kc2tpbnBhcmFtIEljb25Qcml2YXRlIHsNCiAgQ29sb3IgYmxhY2sNCiAgQmFja2dyb3VuZENvbG9yIHdoaXRlDQp9DQpza2lucGFyYW0gSWNvblByb3RlY3RlZCB7DQogIENvbG9yIGJsYWNrDQogIEJhY2tncm91bmRDb2xvciB3aGl0ZQ0KfQ0Kc2tpbnBhcmFtIEljb25QdWJsaWMgew0KICBDb2xvciBibGFjaw0KICBCYWNrZ3JvdW5kQ29sb3Igd2hpdGUNCn0NCnNraW5wYXJhbSBOb3RlIHsNCiAgRm9udENvbG9yIGJsYWNrDQogIEZvbnROYW1lIFZlcmRhbmENCn0NCnNraW5wYXJhbSBPYmplY3Qgew0KICBCb3JkZXJDb2xvciBibGFjaw0KfQ0Kc2tpbnBhcmFtIFBhY2thZ2Ugew0KICBCb3JkZXJDb2xvciBibGFjaw0KICBGb250Q29sb3IgYmxhY2sNCiAgRm9udE5hbWUgVmVyZGFuYQ0KfQ0Kc2tpbnBhcmFtIFN0YXRlIHsNCiAgQmFja2dyb3VuZENvbG9yIHdoaXRlDQogIEJvcmRlckNvbG9yIGJsYWNrDQp9DQpza2lucGFyYW0gU3RlcmVvdHlwZUEgew0KICBCYWNrZ3JvdW5kQ29sb3Igd2hpdGUNCiAgQm9yZGVyQ29sb3IgYmxhY2sNCn0NCnNraW5wYXJhbSBTdGVyZW90eXBlQyB7DQogIEJhY2tncm91bmRDb2xvciB3aGl0ZQ0KICBCb3JkZXJDb2xvciBibGFjaw0KfQ0Kc2tpbnBhcmFtIFN0ZXJlb3R5cGVFIHsNCiAgQmFja2dyb3VuZENvbG9yIHdoaXRlDQogIEJvcmRlckNvbG9yIGJsYWNrDQp9DQpza2lucGFyYW0gU3RlcmVvdHlwZUkgew0KICBCYWNrZ3JvdW5kQ29sb3Igd2hpdGUNCiAgQm9yZGVyQ29sb3IgYmxhY2sNCn0NCnNraW5wYXJhbSBTdGVyZW90eXBlTiB7DQogIEJhY2tncm91bmRDb2xvciB3aGl0ZQ0KICBCb3JkZXJDb2xvciBibGFjaw0KfQ0Kc2tpbnBhcmFtIFVzZUNhc2VTdGVyZW9UeXBlIHsNCiAgRm9udENvbG9yIGJsYWNrDQogIEZvbnROYW1lIFZlcmRhbmENCn0NCmxlZnQgdG8gcmlnaHQgZGlyZWN0aW9uDQphY3RvciAiRGV2T3BzIFVzZXIiIGFzIGQNCg0KcGFja2FnZSAiR3J1Q2xvdWQgdXNlIGNhc2VzIiB7DQogIHVzZWNhc2UgIkRpc3BsYXkgZGlhZ3JhbXMgZnJvbSBsaXZlIHJlc291cmNlcyIgYXMgVUMxDQogIHVzZWNhc2UgIkdlbmVyYXRlIGluZnJhc3RydWN0dXJlIGNvZGUgZnJvbSBsaXZlIHJlc291cmNlcyIgYXMgVUMyDQogIHVzZWNhc2UgIkRlcGxveSByZXNvdXJjZXMgdG8gdmFyaW91cyBwaGFzZXMiIGFzIFVDMw0KICB1c2VjYXNlICJVcGRhdGUgcmVzb3VyY2VzIiBhcyBVQzQNCiAgdXNlY2FzZSAiRGVzdHJveSByZXNvdXJjZXMiIGFzIFVDNQ0KfQ0KDQpub3RlIHJpZ2h0IG9mIFVDMw0KcHJvZCwgdGVzdCwgZXRjIC4uLg0KZW5kIG5vdGUNCg0KZCAtIC0+IFVDMQ0KZCAtIC0+IFVDMg0KZCAtIC0+IFVDMw0KZCAtIC0+IFVDNA0KZCAtIC0+IFVDNQ0KDQpAZW5kdW1sDQoKUGxhbnRVTUwgdmVyc2lvbiAxLjIwMjEuMTQoRnJpIE5vdiAxMiAxMTo0Njo1MCBDT1QgMjAyMSkKKEdQTCBzb3VyY2UgZGlzdHJpYnV0aW9uKQpKYXZhIFJ1bnRpbWU6IE9wZW5KREsgUnVudGltZSBFbnZpcm9ubWVudApKVk06IE9wZW5KREsgNjQtQml0IFNlcnZlciBWTQpEZWZhdWx0IEVuY29kaW5nOiBVVEYtOApMYW5ndWFnZTogZW4KQ291bnRyeTogR0IKLS0+PC9nPjwvc3ZnPg=="},43998:(e,t,a)=>{a.d(t,{Z:()=>i});const i=a.p+"assets/images/grucloud-cli-install-6714dbcfdd7a87d2a06784a4d2c0ac46.svg"}}]);