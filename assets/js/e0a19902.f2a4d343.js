"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[394],{3905:function(I,M,i){i.d(M,{Zo:function(){return D},kt:function(){return n}});var t=i(67294);function N(I,M,i){return M in I?Object.defineProperty(I,M,{value:i,enumerable:!0,configurable:!0,writable:!0}):I[M]=i,I}function c(I,M){var i=Object.keys(I);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(I);M&&(t=t.filter((function(M){return Object.getOwnPropertyDescriptor(I,M).enumerable}))),i.push.apply(i,t)}return i}function e(I){for(var M=1;M<arguments.length;M++){var i=null!=arguments[M]?arguments[M]:{};M%2?c(Object(i),!0).forEach((function(M){N(I,M,i[M])})):Object.getOwnPropertyDescriptors?Object.defineProperties(I,Object.getOwnPropertyDescriptors(i)):c(Object(i)).forEach((function(M){Object.defineProperty(I,M,Object.getOwnPropertyDescriptor(i,M))}))}return I}function g(I,M){if(null==I)return{};var i,t,N=function(I,M){if(null==I)return{};var i,t,N={},c=Object.keys(I);for(t=0;t<c.length;t++)i=c[t],M.indexOf(i)>=0||(N[i]=I[i]);return N}(I,M);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(I);for(t=0;t<c.length;t++)i=c[t],M.indexOf(i)>=0||Object.prototype.propertyIsEnumerable.call(I,i)&&(N[i]=I[i])}return N}var Z=t.createContext({}),l=function(I){var M=t.useContext(Z),i=M;return I&&(i="function"==typeof I?I(M):e(e({},M),I)),i},D=function(I){var M=l(I.components);return t.createElement(Z.Provider,{value:M},I.children)},b={inlineCode:"code",wrapper:function(I){var M=I.children;return t.createElement(t.Fragment,{},M)}},a=t.forwardRef((function(I,M){var i=I.components,N=I.mdxType,c=I.originalType,Z=I.parentName,D=g(I,["components","mdxType","originalType","parentName"]),a=l(i),n=N,d=a["".concat(Z,".").concat(n)]||a[n]||b[n]||c;return i?t.createElement(d,e(e({ref:M},D),{},{components:i})):t.createElement(d,e({ref:M},D))}));function n(I,M){var i=arguments,N=M&&M.mdxType;if("string"==typeof I||N){var c=i.length,e=new Array(c);e[0]=a;var g={};for(var Z in M)hasOwnProperty.call(M,Z)&&(g[Z]=M[Z]);g.originalType=I,g.mdxType="string"==typeof I?I:N,e[1]=g;for(var l=2;l<c;l++)e[l]=i[l];return t.createElement.apply(null,e)}return t.createElement.apply(null,i)}a.displayName="MDXCreateElement"},37170:function(I,M,i){i.r(M),i.d(M,{frontMatter:function(){return g},contentTitle:function(){return Z},metadata:function(){return l},toc:function(){return D},default:function(){return a}});var t=i(87462),N=i(63366),c=(i(67294),i(3905)),e=["components"],g={id:"Introduction",title:"Introduction"},Z="What is GruCloud ?",l={unversionedId:"Introduction",id:"Introduction",isDocsHomePage:!1,title:"Introduction",description:"GruCloud is a tool for Cloud Solution Architect and DevOps people which allows them to describe and manage cloud infrastructures as Javascript code.",source:"@site/docs/Introduction.md",sourceDirName:".",slug:"/Introduction",permalink:"/docs/Introduction",tags:[],version:"current",frontMatter:{id:"Introduction",title:"Introduction"},sidebar:"docs",next:{title:"Aws Getting Started",permalink:"/docs/aws/AwsGettingStarted"}},D=[],b={toc:D};function a(I){var M=I.components,g=(0,N.Z)(I,e);return(0,c.kt)("wrapper",(0,t.Z)({},b,g,{components:M,mdxType:"MDXLayout"}),(0,c.kt)("h1",{id:"what-is-grucloud-"},"What is GruCloud ?"),(0,c.kt)("p",null,"GruCloud is a tool for Cloud Solution Architect and DevOps people which allows them to describe and manage cloud infrastructures as Javascript code."),(0,c.kt)("p",null,(0,c.kt)("img",{alt:"gc-usecase",src:i(49717).Z})),(0,c.kt)("p",null,"Do you need to create virtual machines, object storage for websites, maintain DNS records, handle SSL certificates, or manage Kubernetes clusters? GruCloud lets you describe and configure these resources with simple Javascript code. The GruCloud CLI interprets this description, connects to the various cloud provider API, and decides what to create, update and destroy."),(0,c.kt)("blockquote",null,(0,c.kt)("p",{parentName:"blockquote"},"A key feature is the ability to generate automatically the target code from the live infrastructure.")),(0,c.kt)("p",null,(0,c.kt)("img",{alt:"target-live-infra.dot.svg",src:i(7704).Z})),(0,c.kt)("p",null,"The next flowchart describes how to use the GruCloud CLI ",(0,c.kt)("inlineCode",{parentName:"p"},"gc")," to manage your infrastructure:"),(0,c.kt)("p",null,(0,c.kt)("img",{alt:"gc-workflow",src:i(47508).Z})),(0,c.kt)("h1",{id:"getting-started"},"Getting Started"),(0,c.kt)("ul",null,(0,c.kt)("li",{parentName:"ul"},(0,c.kt)("a",{parentName:"li",href:"/docs/aws/AwsGettingStarted"},"AWS Getting Started")),(0,c.kt)("li",{parentName:"ul"},(0,c.kt)("a",{parentName:"li",href:"/docs/google/GoogleGettingStarted"},"Google Cloud Getting Started")),(0,c.kt)("li",{parentName:"ul"},(0,c.kt)("a",{parentName:"li",href:"/docs/azure/AzureGettingStarted"},"Microsoft Azure Getting Started")),(0,c.kt)("li",{parentName:"ul"},(0,c.kt)("a",{parentName:"li",href:"/docs/k8s/K8sGettingStarted"},"Kubernetes Getting Started"))),(0,c.kt)("h1",{id:"resources-list"},"Resources List"),(0,c.kt)("ul",null,(0,c.kt)("li",{parentName:"ul"},(0,c.kt)("a",{parentName:"li",href:"/docs/aws/ResourcesList"},"AWS Resources")),(0,c.kt)("li",{parentName:"ul"},(0,c.kt)("a",{parentName:"li",href:"/docs/google/ResourcesList"},"Google Cloud Resources")),(0,c.kt)("li",{parentName:"ul"},(0,c.kt)("a",{parentName:"li",href:"/docs/azure/ResourcesList"},"Microsoft Azure Resources")),(0,c.kt)("li",{parentName:"ul"},(0,c.kt)("a",{parentName:"li",href:"/docs/k8s/ResourcesList"},"Kubernetes Resources"))))}a.isMDXComponent=!0},49717:function(I,M){M.Z="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBjb250ZW50U2NyaXB0VHlwZT0iYXBwbGljYXRpb24vZWNtYXNjcmlwdCIgY29udGVudFN0eWxlVHlwZT0idGV4dC9jc3MiIGhlaWdodD0iNDk4cHgiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiIHN0eWxlPSJ3aWR0aDo3MzJweDtoZWlnaHQ6NDk4cHg7YmFja2dyb3VuZDojRkZGRkZGOyIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgNzMyIDQ5OCIgd2lkdGg9IjczMnB4IiB6b29tQW5kUGFuPSJtYWduaWZ5Ij48ZGVmcy8+PGc+PCEtLU1ENT1bZDNjNjEyYTY0ZDhhNmIwMDQ5NGI0MWNlOWQ0ZGFjZTddCmNsdXN0ZXIgR3J1Q2xvdWQgdXNlIGNhc2VzLS0+PHBvbHlnb24gZmlsbD0iI0ZGRkZGRiIgcG9pbnRzPSIxNDUsMTIuMTE5MSwzOTUsMTIuMTE5MSw0MDIsNDQuODU2NCw1NDUsNDQuODU2NCw1NDUsNDkxLjExOTEsMTQ1LDQ5MS4xMTkxLDE0NSwxMi4xMTkxIiBzdHlsZT0ic3Ryb2tlOiMwMDAwMDA7c3Ryb2tlLXdpZHRoOjEuMDsiLz48bGluZSBzdHlsZT0ic3Ryb2tlOiMwMDAwMDA7c3Ryb2tlLXdpZHRoOjEuMDsiIHgxPSIxNDUiIHgyPSI0MDIiIHkxPSI0NC44NTY0IiB5Mj0iNDQuODU2NCIvPjx0ZXh0IGZpbGw9IiMwMDAwMDAiIGZvbnQtZmFtaWx5PSJWZXJkYW5hIiBmb250LXNpemU9IjIyIiBmb250LXdlaWdodD0iYm9sZCIgbGVuZ3RoQWRqdXN0PSJzcGFjaW5nIiB0ZXh0TGVuZ3RoPSIyNDQiIHg9IjE0OSIgeT0iMzYuMjM3MyI+R3J1Q2xvdWQgdXNlIGNhc2VzPC90ZXh0PjxlbGxpcHNlIGN4PSIzNDUuMDE5OCIgY3k9Ijg5LjAyMzEiIGZpbGw9IiNGRkZGRkYiIHJ4PSIxNDUuMDE5OCIgcnk9IjMxLjQwNCIgc3R5bGU9InN0cm9rZTojMDAwMDAwO3N0cm9rZS13aWR0aDoxLjA7Ii8+PHRleHQgZmlsbD0iIzAwMDAwMCIgZm9udC1mYW1pbHk9IlZlcmRhbmEiIGZvbnQtc2l6ZT0iMTQiIGxlbmd0aEFkanVzdD0ic3BhY2luZyIgdGV4dExlbmd0aD0iMjU5IiB4PSIyMTUuNTE5OCIgeT0iOTIuNTkxIj5EaXNwbGF5IGRpYWdyYW1zIGZyb20gbGl2ZSByZXNvdXJjZXM8L3RleHQ+PGVsbGlwc2UgY3g9IjM0NS4wNjczIiBjeT0iMTk1LjMzMjYiIGZpbGw9IiNGRkZGRkYiIHJ4PSIxODQuMDY3MyIgcnk9IjM5LjIxMzUiIHN0eWxlPSJzdHJva2U6IzAwMDAwMDtzdHJva2Utd2lkdGg6MS4wOyIvPjx0ZXh0IGZpbGw9IiMwMDAwMDAiIGZvbnQtZmFtaWx5PSJWZXJkYW5hIiBmb250LXNpemU9IjE0IiBsZW5ndGhBZGp1c3Q9InNwYWNpbmciIHRleHRMZW5ndGg9IjM0MCIgeD0iMTc1LjA2NzMiIHk9IjE5OC45MDA1Ij5HZW5lcmF0ZSBpbmZyYXN0cnVjdHVyZSBjb2RlIGZyb20gbGl2ZSByZXNvdXJjZXM8L3RleHQ+PGVsbGlwc2UgY3g9IjM0NC44MzIxIiBjeT0iMjk5LjI4NTYiIGZpbGw9IiNGRkZGRkYiIHJ4PSIxMzguODMyMSIgcnk9IjMwLjE2NjQiIHN0eWxlPSJzdHJva2U6IzAwMDAwMDtzdHJva2Utd2lkdGg6MS4wOyIvPjx0ZXh0IGZpbGw9IiMwMDAwMDAiIGZvbnQtZmFtaWx5PSJWZXJkYW5hIiBmb250LXNpemU9IjE0IiBsZW5ndGhBZGp1c3Q9InNwYWNpbmciIHRleHRMZW5ndGg9IjI0NiIgeD0iMjIxLjgzMjEiIHk9IjMwMi44NTM0Ij5EZXBsb3kgcmVzb3VyY2VzIHRvIHZhcmlvdXMgcGhhc2VzPC90ZXh0PjxlbGxpcHNlIGN4PSIzNDQuOTQwNiIgY3k9IjM4Mi45MDczIiBmaWxsPSIjRkZGRkZGIiByeD0iODEuOTQwNiIgcnk9IjE4Ljc4ODEiIHN0eWxlPSJzdHJva2U6IzAwMDAwMDtzdHJva2Utd2lkdGg6MS4wOyIvPjx0ZXh0IGZpbGw9IiMwMDAwMDAiIGZvbnQtZmFtaWx5PSJWZXJkYW5hIiBmb250LXNpemU9IjE0IiBsZW5ndGhBZGp1c3Q9InNwYWNpbmciIHRleHRMZW5ndGg9IjEyMSIgeD0iMjg0LjQ0MDYiIHk9IjM4Ni40NzUxIj5VcGRhdGUgcmVzb3VyY2VzPC90ZXh0PjxlbGxpcHNlIGN4PSIzNDUuMTMyNiIgY3k9IjQ1Ni4yNDU3IiBmaWxsPSIjRkZGRkZGIiByeD0iODMuNjMyNiIgcnk9IjE5LjEyNjUiIHN0eWxlPSJzdHJva2U6IzAwMDAwMDtzdHJva2Utd2lkdGg6MS4wOyIvPjx0ZXh0IGZpbGw9IiMwMDAwMDAiIGZvbnQtZmFtaWx5PSJWZXJkYW5hIiBmb250LXNpemU9IjE0IiBsZW5ndGhBZGp1c3Q9InNwYWNpbmciIHRleHRMZW5ndGg9IjEyNSIgeD0iMjgyLjYzMjYiIHk9IjQ1OS44MTM1Ij5EZXN0cm95IHJlc291cmNlczwvdGV4dD48IS0tTUQ1PVswMTFkYjFkMjcyNzRjODY2OTE4NzFiYzUxYjEyYmViOF0KZW50aXR5IGQtLT48ZWxsaXBzZSBjeD0iNTYiIGN5PSIyNjkuMTE5MSIgZmlsbD0iI0ZGRkZGRiIgcng9IjgiIHJ5PSI4IiBzdHlsZT0ic3Ryb2tlOiMwMDAwMDA7c3Ryb2tlLXdpZHRoOjEuMDsiLz48cGF0aCBkPSJNNTYsMjc3LjExOTEgTDU2LDMwNC4xMTkxIE00MywyODUuMTE5MSBMNjksMjg1LjExOTEgTTU2LDMwNC4xMTkxIEw0MywzMTkuMTE5MSBNNTYsMzA0LjExOTEgTDY5LDMxOS4xMTkxICIgZmlsbD0ibm9uZSIgc3R5bGU9InN0cm9rZTojMDAwMDAwO3N0cm9rZS13aWR0aDoxLjA7Ii8+PHRleHQgZmlsbD0iIzAwMDAwMCIgZm9udC1mYW1pbHk9IlZlcmRhbmEiIGZvbnQtc2l6ZT0iMTQiIGxlbmd0aEFkanVzdD0ic3BhY2luZyIgdGV4dExlbmd0aD0iOTAiIHg9IjExIiB5PSIzMzUuMTk0MyI+RGV2T3BzIFVzZXI8L3RleHQ+PHBhdGggZD0iTTU4OSwyODYuMTE5MSBMNTg5LDI5NS4xMTkxIEw0ODQuMjMsMjk5LjExOTEgTDU4OSwzMDMuMTE5MSBMNTg5LDMxMS45MTg1IEEwLDAgMCAwIDAgNTg5LDMxMS45MTg1IEw3MjUsMzExLjkxODUgQTAsMCAwIDAgMCA3MjUsMzExLjkxODUgTDcyNSwyOTYuMTE5MSBMNzE1LDI4Ni4xMTkxIEw1ODksMjg2LjExOTEgQTAsMCAwIDAgMCA1ODksMjg2LjExOTEgIiBmaWxsPSIjRkZGRkZGIiBzdHlsZT0ic3Ryb2tlOiMwMDAwMDA7c3Ryb2tlLXdpZHRoOjEuMDsiLz48cGF0aCBkPSJNNzE1LDI4Ni4xMTkxIEw3MTUsMjk2LjExOTEgTDcyNSwyOTYuMTE5MSBMNzE1LDI4Ni4xMTkxICIgZmlsbD0iI0ZGRkZGRiIgc3R5bGU9InN0cm9rZTojMDAwMDAwO3N0cm9rZS13aWR0aDoxLjA7Ii8+PHRleHQgZmlsbD0iIzAwMDAwMCIgZm9udC1mYW1pbHk9IlZlcmRhbmEiIGZvbnQtc2l6ZT0iMTMiIGxlbmd0aEFkanVzdD0ic3BhY2luZyIgdGV4dExlbmd0aD0iMTE1IiB4PSI1OTUiIHk9IjMwNC4xODkiPnByb2QsIHRlc3QsIGV0YyAuLi48L3RleHQ+PCEtLU1ENT1bNTk0ZGZkMjliYjc4NTE0NmQwNDJlNDZiYTY3MGIxZjFdCmxpbmsgZCB0byBVQzEtLT48cGF0aCBkPSJNNjYuMjIsMjU5Ljg3OTEgQzc2Ljk2LDIyMi45MjkxIDk4LjM4LDE2OC43NzkxIDEzNywxMzguMTE5MSBDMTU3LjQsMTIxLjkxOTEgMTgyLjI4LDExMC45MjkxIDIwNy42MiwxMDMuNDk5MSAiIGZpbGw9Im5vbmUiIGlkPSJkLXRvLVVDMSIgc3R5bGU9InN0cm9rZTojMDAwMDAwO3N0cm9rZS13aWR0aDoxLjA7Ii8+PHBvbHlnb24gZmlsbD0iIzAwMDAwMCIgcG9pbnRzPSIyMTIuNjksMTAyLjA1OTEsMjAyLjkzODUsMTAwLjY3NzksMjA3Ljg4MTMsMTAzLjQyOSwyMDUuMTMwMiwxMDguMzcxOCwyMTIuNjksMTAyLjA1OTEiIHN0eWxlPSJzdHJva2U6IzAwMDAwMDtzdHJva2Utd2lkdGg6MS4wOyIvPjwhLS1NRDU9WzlhNzBhYjkwMDQ2OTViZjI4NmMyZWM4NjVkYjViYzQ3XQpsaW5rIGQgdG8gVUMyLS0+PHBhdGggZD0iTTEwMS4xMiwyNjkuNjk5MSBDMTEyLjQ5LDI2Mi45NDkxIDEyNC45MywyNTYuMjU5MSAxMzcsMjUxLjExOTEgQzE2MC44NSwyNDAuOTY5MSAxODcuMDMsMjMyLjE5OTEgMjEyLjUxLDIyNC44MDkxICIgZmlsbD0ibm9uZSIgaWQ9ImQtdG8tVUMyIiBzdHlsZT0ic3Ryb2tlOiMwMDAwMDA7c3Ryb2tlLXdpZHRoOjEuMDsiLz48cG9seWdvbiBmaWxsPSIjMDAwMDAwIiBwb2ludHM9IjIxNy42LDIyMy4zNDkxLDIwNy44NDM3LDIyMi4wMDI0LDIxMi43OTYyLDIyNC43MzYsMjEwLjA2MjYsMjI5LjY4ODUsMjE3LjYsMjIzLjM0OTEiIHN0eWxlPSJzdHJva2U6IzAwMDAwMDtzdHJva2Utd2lkdGg6MS4wOyIvPjwhLS1NRDU9WzZkZmYxMjg5ZDU3ZWNjM2MzZGY1MTNjNmZkZDAzNDI0XQpsaW5rIGQgdG8gVUMzLS0+PHBhdGggZD0iTTEwMS4yMSwyOTkuMTE5MSBDMTI4LjE5LDI5OS4xMTkxIDE2NC4zNSwyOTkuMTE5MSAyMDAuNTEsMjk5LjExOTEgIiBmaWxsPSJub25lIiBpZD0iZC10by1VQzMiIHN0eWxlPSJzdHJva2U6IzAwMDAwMDtzdHJva2Utd2lkdGg6MS4wOyIvPjxwb2x5Z29uIGZpbGw9IiMwMDAwMDAiIHBvaW50cz0iMjA1Ljg0LDI5OS4xMTkxLDE5Ni44NCwyOTUuMTE5MSwyMDAuODQsMjk5LjExOTEsMTk2Ljg0LDMwMy4xMTkxLDIwNS44NCwyOTkuMTE5MSIgc3R5bGU9InN0cm9rZTojMDAwMDAwO3N0cm9rZS13aWR0aDoxLjA7Ii8+PCEtLU1ENT1bZDEwYzVhMzNmYTIxMmM5NWYxN2MzNGQ4NzQ2ZTcyMjVdCmxpbmsgZCB0byBVQzQtLT48cGF0aCBkPSJNMTAxLjMxLDMyOC44NzkxIEMxMTIuNTcsMzM1LjM4OTEgMTI0LjkxLDM0MS42NDkxIDEzNywzNDYuMTE5MSBDMTc3LjMxLDM2MS4wMTkxIDIyNC4zMiwzNzAuMDM5MSAyNjMuMzQsMzc1LjQzOTEgIiBmaWxsPSJub25lIiBpZD0iZC10by1VQzQiIHN0eWxlPSJzdHJva2U6IzAwMDAwMDtzdHJva2Utd2lkdGg6MS4wOyIvPjxwb2x5Z29uIGZpbGw9IiMwMDAwMDAiIHBvaW50cz0iMjY4LjU0LDM3Ni4xMzkxLDI2MC4xNjAzLDM3MC45NjQxLDI2My41ODU1LDM3NS40NjYxLDI1OS4wODM1LDM3OC44OTEzLDI2OC41NCwzNzYuMTM5MSIgc3R5bGU9InN0cm9rZTojMDAwMDAwO3N0cm9rZS13aWR0aDoxLjA7Ii8+PCEtLU1ENT1bYWEyYmY2NGUxZDYxMjQ3YTJkYTg3OGMyNDIyZmM5YzhdCmxpbmsgZCB0byBVQzUtLT48cGF0aCBkPSJNNzMuMDUsMzM4LjI5OTEgQzg2LjIsMzY1LjMzOTEgMTA3LjQ3LDM5OS43NzkxIDEzNyw0MTkuMTE5MSBDMTcxLjkzLDQ0MS45OTkxIDIxNi45Niw0NTEuODE5MSAyNTYuMSw0NTUuNjc5MSAiIGZpbGw9Im5vbmUiIGlkPSJkLXRvLVVDNSIgc3R5bGU9InN0cm9rZTojMDAwMDAwO3N0cm9rZS13aWR0aDoxLjA7Ii8+PHBvbHlnb24gZmlsbD0iIzAwMDAwMCIgcG9pbnRzPSIyNjEuMzMsNDU2LjE2OTEsMjUyLjc0NjUsNDUxLjMzOTcsMjU2LjM1MjIsNDU1LjY5ODUsMjUxLjk5MzQsNDU5LjMwNDIsMjYxLjMzLDQ1Ni4xNjkxIiBzdHlsZT0ic3Ryb2tlOiMwMDAwMDA7c3Ryb2tlLXdpZHRoOjEuMDsiLz48IS0tTUQ1PVs3NmJkZGQxZTcxNjIwZDViY2FkZTA3ZTdiMjJkZjgwOV0KQHN0YXJ0dW1sDQoNCiF0aGVtZSBwbGFpbg0KbGVmdCB0byByaWdodCBkaXJlY3Rpb24NCmFjdG9yICJEZXZPcHMgVXNlciIgYXMgZA0KDQpwYWNrYWdlICJHcnVDbG91ZCB1c2UgY2FzZXMiIHsNCiAgdXNlY2FzZSAiRGlzcGxheSBkaWFncmFtcyBmcm9tIGxpdmUgcmVzb3VyY2VzIiBhcyBVQzENCiAgdXNlY2FzZSAiR2VuZXJhdGUgaW5mcmFzdHJ1Y3R1cmUgY29kZSBmcm9tIGxpdmUgcmVzb3VyY2VzIiBhcyBVQzINCiAgdXNlY2FzZSAiRGVwbG95IHJlc291cmNlcyB0byB2YXJpb3VzIHBoYXNlcyIgYXMgVUMzDQogIHVzZWNhc2UgIlVwZGF0ZSByZXNvdXJjZXMiIGFzIFVDNA0KICB1c2VjYXNlICJEZXN0cm95IHJlc291cmNlcyIgYXMgVUM1DQp9DQoNCm5vdGUgcmlnaHQgb2YgVUMzDQpwcm9kLCB0ZXN0LCBldGMgLi4uDQplbmQgbm90ZQ0KDQpkIC0gLT4gVUMxDQpkIC0gLT4gVUMyDQpkIC0gLT4gVUMzDQpkIC0gLT4gVUM0DQpkIC0gLT4gVUM1DQoNCkBlbmR1bWwNCgpAc3RhcnR1bWwNCg0KDQoNCg0KDQoNCg0KDQo8c3R5bGU+DQogIHJvb3Qgew0KICAgIEJhY2tncm91bmRDb2xvciB3aGl0ZQ0KICAgIEZvbnRDb2xvciBibGFjaw0KICAgIEZvbnROYW1lIFZlcmRhbmENCiAgICBIeXBlckxpbmtDb2xvciBibHVlDQogICAgTGluZUNvbG9yIGJsYWNrDQogICAgTGluZVRoaWNrbmVzcyAxDQogICAgTWFyZ2luIDUNCiAgfQ0KICBjYXB0aW9uIHsNCiAgICBMaW5lVGhpY2tuZXNzIDANCiAgfQ0KICBmb290ZXIgew0KICAgIExpbmVUaGlja25lc3MgMA0KICB9DQogIGhlYWRlciB7DQogICAgTGluZVRoaWNrbmVzcyAwDQogIH0NCiAgbm9kZSB7DQogICAgTWF4aW11bVdpZHRoIDMwMA0KICB9DQogIHRpdGxlIHsNCiAgICBGb250U2l6ZSAyMg0KICAgIExpbmVUaGlja25lc3MgMA0KICB9DQo8L3N0eWxlPg0KDQpza2lucGFyYW0gQXJyb3dMb2xsaXBvcENvbG9yIGJsYWNrDQpza2lucGFyYW0gQmFja2dyb3VuZENvbG9yIHdoaXRlDQpza2lucGFyYW0gRGVmYXVsdEZvbnROYW1lIFZlcmRhbmENCnNraW5wYXJhbSBEZWZhdWx0TW9ub3NwYWNlZEZvbnROYW1lIENvdXJpZXINCnNraW5wYXJhbSBMaWZlbGluZVN0cmF0ZWd5IG5vc29saWQNCnNraW5wYXJhbSBQYXJ0aWNpcGFudFBhZGRpbmcgMTANCnNraW5wYXJhbSBTZXF1ZW5jZUxpZmVMaW5lQm9yZGVyQ29sb3IgYmxhY2sNCnNraW5wYXJhbSBTaGFkb3dpbmcgZmFsc2UNCnNraW5wYXJhbSBVc2VCZXRhU3R5bGUgdHJ1ZQ0KDQpza2lucGFyYW0gQWN0aXZpdHkgew0KICBCYWNrZ3JvdW5kQ29sb3Igd2hpdGUNCiAgQmFyQ29sb3IgYmxhY2sNCiAgQm9yZGVyQ29sb3IgYmxhY2sNCiAgRm9udENvbG9yIGJsYWNrDQogIEZvbnROYW1lIFZlcmRhbmENCn0NCnNraW5wYXJhbSBCb3VuZGFyeSB7DQogIEZvbnRDb2xvciBibGFjaw0KfQ0Kc2tpbnBhcmFtIEJveCB7DQogIFBhZGRpbmcgNQ0KfQ0Kc2tpbnBhcmFtIENpcmNsZWRDaGFyYWN0ZXIgew0KICBGb250Q29sb3IgYmxhY2sNCiAgRm9udE5hbWUgQ291cmllcg0KICBSYWRpdXMgOQ0KfQ0Kc2tpbnBhcmFtIENsYXNzIHsNCiAgQmFja2dyb3VuZENvbG9yIHdoaXRlDQogIEJvcmRlckNvbG9yIGJsYWNrDQogIEZvbnRDb2xvciBibGFjaw0KICBGb250TmFtZSBWZXJkYW5hDQp9DQpza2lucGFyYW0gQ2xhc3NBdHRyaWJ1dGUgew0KICBGb250Q29sb3IgYmxhY2sNCiAgRm9udE5hbWUgVmVyZGFuYQ0KfQ0Kc2tpbnBhcmFtIENsYXNzU3RlcmVvdHlwZSB7DQogIEZvbnRDb2xvciBibGFjaw0KICBGb250TmFtZSBWZXJkYW5hDQp9DQpza2lucGFyYW0gRm9vdGVyIHsNCiAgRm9udENvbG9yIGJsYWNrDQogIEZvbnROYW1lIFZlcmRhbmENCn0NCnNraW5wYXJhbSBIZWFkZXIgew0KICBGb250Q29sb3IgYmxhY2sNCiAgRm9udE5hbWUgVmVyZGFuYQ0KfQ0Kc2tpbnBhcmFtIEh5cGVybGluayB7DQogIENvbG9yIGJsdWUNCn0NCnNraW5wYXJhbSBJY29uUGFja2FnZSB7DQogIENvbG9yIGJsYWNrDQogIEJhY2tncm91bmRDb2xvciB3aGl0ZQ0KfQ0Kc2tpbnBhcmFtIEljb25Qcml2YXRlIHsNCiAgQ29sb3IgYmxhY2sNCiAgQmFja2dyb3VuZENvbG9yIHdoaXRlDQp9DQpza2lucGFyYW0gSWNvblByb3RlY3RlZCB7DQogIENvbG9yIGJsYWNrDQogIEJhY2tncm91bmRDb2xvciB3aGl0ZQ0KfQ0Kc2tpbnBhcmFtIEljb25QdWJsaWMgew0KICBDb2xvciBibGFjaw0KICBCYWNrZ3JvdW5kQ29sb3Igd2hpdGUNCn0NCnNraW5wYXJhbSBOb3RlIHsNCiAgRm9udENvbG9yIGJsYWNrDQogIEZvbnROYW1lIFZlcmRhbmENCn0NCnNraW5wYXJhbSBPYmplY3Qgew0KICBCb3JkZXJDb2xvciBibGFjaw0KfQ0Kc2tpbnBhcmFtIFBhY2thZ2Ugew0KICBCb3JkZXJDb2xvciBibGFjaw0KICBGb250Q29sb3IgYmxhY2sNCiAgRm9udE5hbWUgVmVyZGFuYQ0KfQ0Kc2tpbnBhcmFtIFN0YXRlIHsNCiAgQmFja2dyb3VuZENvbG9yIHdoaXRlDQogIEJvcmRlckNvbG9yIGJsYWNrDQp9DQpza2lucGFyYW0gU3RlcmVvdHlwZUEgew0KICBCYWNrZ3JvdW5kQ29sb3Igd2hpdGUNCiAgQm9yZGVyQ29sb3IgYmxhY2sNCn0NCnNraW5wYXJhbSBTdGVyZW90eXBlQyB7DQogIEJhY2tncm91bmRDb2xvciB3aGl0ZQ0KICBCb3JkZXJDb2xvciBibGFjaw0KfQ0Kc2tpbnBhcmFtIFN0ZXJlb3R5cGVFIHsNCiAgQmFja2dyb3VuZENvbG9yIHdoaXRlDQogIEJvcmRlckNvbG9yIGJsYWNrDQp9DQpza2lucGFyYW0gU3RlcmVvdHlwZUkgew0KICBCYWNrZ3JvdW5kQ29sb3Igd2hpdGUNCiAgQm9yZGVyQ29sb3IgYmxhY2sNCn0NCnNraW5wYXJhbSBTdGVyZW90eXBlTiB7DQogIEJhY2tncm91bmRDb2xvciB3aGl0ZQ0KICBCb3JkZXJDb2xvciBibGFjaw0KfQ0Kc2tpbnBhcmFtIFVzZUNhc2VTdGVyZW9UeXBlIHsNCiAgRm9udENvbG9yIGJsYWNrDQogIEZvbnROYW1lIFZlcmRhbmENCn0NCmxlZnQgdG8gcmlnaHQgZGlyZWN0aW9uDQphY3RvciAiRGV2T3BzIFVzZXIiIGFzIGQNCg0KcGFja2FnZSAiR3J1Q2xvdWQgdXNlIGNhc2VzIiB7DQogIHVzZWNhc2UgIkRpc3BsYXkgZGlhZ3JhbXMgZnJvbSBsaXZlIHJlc291cmNlcyIgYXMgVUMxDQogIHVzZWNhc2UgIkdlbmVyYXRlIGluZnJhc3RydWN0dXJlIGNvZGUgZnJvbSBsaXZlIHJlc291cmNlcyIgYXMgVUMyDQogIHVzZWNhc2UgIkRlcGxveSByZXNvdXJjZXMgdG8gdmFyaW91cyBwaGFzZXMiIGFzIFVDMw0KICB1c2VjYXNlICJVcGRhdGUgcmVzb3VyY2VzIiBhcyBVQzQNCiAgdXNlY2FzZSAiRGVzdHJveSByZXNvdXJjZXMiIGFzIFVDNQ0KfQ0KDQpub3RlIHJpZ2h0IG9mIFVDMw0KcHJvZCwgdGVzdCwgZXRjIC4uLg0KZW5kIG5vdGUNCg0KZCAtIC0+IFVDMQ0KZCAtIC0+IFVDMg0KZCAtIC0+IFVDMw0KZCAtIC0+IFVDNA0KZCAtIC0+IFVDNQ0KDQpAZW5kdW1sDQoKUGxhbnRVTUwgdmVyc2lvbiAxLjIwMjEuMTQoRnJpIE5vdiAxMiAxMTo0Njo1MCBDT1QgMjAyMSkKKEdQTCBzb3VyY2UgZGlzdHJpYnV0aW9uKQpKYXZhIFJ1bnRpbWU6IE9wZW5KREsgUnVudGltZSBFbnZpcm9ubWVudApKVk06IE9wZW5KREsgNjQtQml0IFNlcnZlciBWTQpEZWZhdWx0IEVuY29kaW5nOiBVVEYtOApMYW5ndWFnZTogZW4KQ291bnRyeTogR0IKLS0+PC9nPjwvc3ZnPg=="},47508:function(I,M,i){M.Z=i.p+"assets/images/gc-workflow-602148e52a01b8847f0334e3ee8d6b2b.svg"},7704:function(I,M){M.Z="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIKICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgo8IS0tIEdlbmVyYXRlZCBieSBncmFwaHZpeiB2ZXJzaW9uIDIuNDAuMSAoMjAxNjEyMjUuMDMwNCkKIC0tPgo8IS0tIFRpdGxlOiAlMCBQYWdlczogMSAtLT4KPHN2ZyB3aWR0aD0iNDU5cHQiIGhlaWdodD0iNzVwdCIKIHZpZXdCb3g9IjAuMDAgMC4wMCA0NTkuMDkgNzUuMzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgo8ZyBpZD0iZ3JhcGgwIiBjbGFzcz0iZ3JhcGgiIHRyYW5zZm9ybT0ic2NhbGUoMSAxKSByb3RhdGUoMCkgdHJhbnNsYXRlKDQgNzEuMzIwOSkiPgo8dGl0bGU+JTA8L3RpdGxlPgo8cG9seWdvbiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9InRyYW5zcGFyZW50IiBwb2ludHM9Ii00LDQgLTQsLTcxLjMyMDkgNDU1LjA4NjIsLTcxLjMyMDkgNDU1LjA4NjIsNCAtNCw0Ii8+Cjx0ZXh0IHRleHQtYW5jaG9yPSJtaWRkbGUiIHg9IjIyNS41NDMxIiB5PSItNTAuNzIwOSIgZm9udC1mYW1pbHk9IkhlbHZldGljYSxzYW5zLVNlcmlmIiBmb250LXNpemU9IjE0LjAwIiBmaWxsPSIjMDAwMDAwIj5UYXJnZXQgYW5kIExpdmUgSW5mcmFzdHJ1Y3R1cmU8L3RleHQ+CjwhLS0gdGFyZ2V0IC0tPgo8ZyBpZD0ibm9kZTEiIGNsYXNzPSJub2RlIj4KPHRpdGxlPnRhcmdldDwvdGl0bGU+Cjxwb2x5Z29uIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMDAwMCIgcG9pbnRzPSIxNTkuODgsLTQyLjMyMjggLjA0LC00Mi4zMjI4IC4wNCwtMS4xMTkgMTU5Ljg4LC0xLjExOSAxNTkuODgsLTQyLjMyMjgiLz4KPHRleHQgdGV4dC1hbmNob3I9Im1pZGRsZSIgeD0iNzkuOTYiIHk9Ii0yNS45MjA5IiBmb250LWZhbWlseT0iSGVsdmV0aWNhLHNhbnMtU2VyaWYiIGZvbnQtc2l6ZT0iMTQuMDAiIGZpbGw9IiMwMDAwMDAiPlRhcmdldCBJbmZyYXN0cnVjdHVyZTwvdGV4dD4KPHRleHQgdGV4dC1hbmNob3I9Im1pZGRsZSIgeD0iNzkuOTYiIHk9Ii05LjEyMDkiIGZvbnQtZmFtaWx5PSJIZWx2ZXRpY2Esc2Fucy1TZXJpZiIgZm9udC1zaXplPSIxNC4wMCIgZmlsbD0iIzAwMDAwMCI+IGRlZmluZWQgaW4gcmVzb3VyY2VzLmpzPC90ZXh0Pgo8L2c+CjwhLS0gbGl2ZSAtLT4KPGcgaWQ9Im5vZGUyIiBjbGFzcz0ibm9kZSI+Cjx0aXRsZT5saXZlPC90aXRsZT4KPHBvbHlnb24gZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwMDAwIiBwb2ludHM9IjQ1MS4yMDkxLC00Mi4zMjI4IDI4OC43MTc5LC00Mi4zMjI4IDI4OC43MTc5LC0xLjExOSA0NTEuMjA5MSwtMS4xMTkgNDUxLjIwOTEsLTQyLjMyMjgiLz4KPHRleHQgdGV4dC1hbmNob3I9Im1pZGRsZSIgeD0iMzY5Ljk2MzUiIHk9Ii0yNS45MjA5IiBmb250LWZhbWlseT0iSGVsdmV0aWNhLHNhbnMtU2VyaWYiIGZvbnQtc2l6ZT0iMTQuMDAiIGZpbGw9IiMwMDAwMDAiPkxpdmUgSW5mcmFzdHJ1Y3R1cmU8L3RleHQ+Cjx0ZXh0IHRleHQtYW5jaG9yPSJtaWRkbGUiIHg9IjM2OS45NjM1IiB5PSItOS4xMjA5IiBmb250LWZhbWlseT0iSGVsdmV0aWNhLHNhbnMtU2VyaWYiIGZvbnQtc2l6ZT0iMTQuMDAiIGZpbGw9IiMwMDAwMDAiPm9uIEFXUywgR0NQIG9yIEF6dXJlPC90ZXh0Pgo8L2c+CjwhLS0gdGFyZ2V0JiM0NTsmZ3Q7bGl2ZSAtLT4KPGcgaWQ9ImVkZ2UyIiBjbGFzcz0iZWRnZSI+Cjx0aXRsZT50YXJnZXQmIzQ1OyZndDtsaXZlPC90aXRsZT4KPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwMDAwIiBkPSJNMTU5Ljk3MjQsLTIxLjcyMDlDMTk2Ljc1NSwtMjEuNzIwOSAyNDAuNTcyNCwtMjEuNzIwOSAyNzguNjQxNywtMjEuNzIwOSIvPgo8cG9seWdvbiBmaWxsPSIjMDAwMDAwIiBzdHJva2U9IiMwMDAwMDAiIHBvaW50cz0iMjc4LjcwMDgsLTI1LjIyMSAyODguNzAwOCwtMjEuNzIwOSAyNzguNzAwNywtMTguMjIxIDI3OC43MDA4LC0yNS4yMjEiLz4KPHRleHQgdGV4dC1hbmNob3I9Im1pZGRsZSIgeD0iMjI0LjM4MDQiIHk9Ii0yNS45MjA5IiBmb250LWZhbWlseT0iVGltZXMsc2VyaWYiIGZvbnQtc2l6ZT0iMTQuMDAiIGZpbGw9IiMwMDAwMDAiPmdjIGFwcGx5L2Rlc3Ryb3k8L3RleHQ+CjwvZz4KPCEtLSBsaXZlJiM0NTsmZ3Q7dGFyZ2V0IC0tPgo8ZyBpZD0iZWRnZTEiIGNsYXNzPSJlZGdlIj4KPHRpdGxlPmxpdmUmIzQ1OyZndDt0YXJnZXQ8L3RpdGxlPgo8cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIGQ9Ik0yODguNzI3OSwtNS4wNDY4QzI4Mi42OTMyLC00LjE5NzMgMjc2LjY4MjgsLTMuNDcgMjcwLjg0MDgsLTIuOTIwOSAyMjkuNzIzOSwuOTQzOSAyMTkuMDMyNywuOTg4NSAxNzcuOTIsLTIuOTIwOSAxNzUuMzU1NiwtMy4xNjQ3IDE3Mi43NTg1LC0zLjQ0MzcgMTcwLjE0MTEsLTMuNzUyOSIvPgo8cG9seWdvbiBmaWxsPSIjMDAwMDAwIiBzdHJva2U9IiMwMDAwMDAiIHBvaW50cz0iMTY5LjQzMjIsLS4zMTU4IDE1OS45NzE1LC01LjA4NTEgMTcwLjM0MTQsLTcuMjU2NSAxNjkuNDMyMiwtLjMxNTgiLz4KPHRleHQgdGV4dC1hbmNob3I9Im1pZGRsZSIgeD0iMjI0LjM4MDQiIHk9Ii02LjkyMDkiIGZvbnQtZmFtaWx5PSJUaW1lcyxzZXJpZiIgZm9udC1zaXplPSIxNC4wMCIgZmlsbD0iIzAwMDAwMCI+Z2MgZ2VuY29kZTwvdGV4dD4KPC9nPgo8L2c+Cjwvc3ZnPgo="}}]);