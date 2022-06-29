"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[60013],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>g});var r=n(67294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},l=Object.keys(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var s=r.createContext({}),c=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},u=function(e){var t=c(e.components);return r.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,l=e.originalType,s=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),d=c(n),g=o,m=d["".concat(s,".").concat(g)]||d[g]||p[g]||l;return n?r.createElement(m,a(a({ref:t},u),{},{components:n})):r.createElement(m,a({ref:t},u))}));function g(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var l=n.length,a=new Array(l);a[0]=d;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i.mdxType="string"==typeof e?e:o,a[1]=i;for(var c=2;c<l;c++)a[c]=n[c];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},41592:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>a,default:()=>p,frontMatter:()=>l,metadata:()=>i,toc:()=>c});var r=n(87462),o=(n(67294),n(3905));const l={id:"GoogleRequirements",title:"Google Requirements"},a=void 0,i={unversionedId:"google/GoogleRequirements",id:"google/GoogleRequirements",title:"Google Requirements",description:"Gcloud",source:"@site/docs/google/GoogleRequirements.md",sourceDirName:"google",slug:"/google/GoogleRequirements",permalink:"/docs/google/GoogleRequirements",draft:!1,tags:[],version:"current",frontMatter:{id:"GoogleRequirements",title:"Google Requirements"},sidebar:"docs",previous:{title:"Object",permalink:"/docs/google/resources/storage/Object"},next:{title:"Resources List",permalink:"/docs/azure/ResourcesList"}},s={},c=[{value:"Gcloud",id:"gcloud",level:2},{value:"Initialise gcloud",id:"initialise-gcloud",level:2},{value:"SSH keys",id:"ssh-keys",level:2}],u={toc:c};function p(e){let{components:t,...n}=e;return(0,o.kt)("wrapper",(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h2",{id:"gcloud"},"Gcloud"),(0,o.kt)("p",null,"Ensure ",(0,o.kt)("strong",{parentName:"p"},"gcloud")," is installed:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"$ gcloud -v\nGoogle Cloud SDK 288.0.0\nbq 2.0.56\ncore 2020.04.03\ngsutil 4.49\n\n")),(0,o.kt)("h2",{id:"initialise-gcloud"},"Initialise gcloud"),(0,o.kt)("p",null,"Initialise gcloud in order to authenticate your user, as well and setting the default region and zone:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-sh"},"gcloud init\n")),(0,o.kt)("p",null,"Check the config at any time with:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-sh"},"gcloud config list\n")),(0,o.kt)("h2",{id:"ssh-keys"},"SSH keys"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-sh"},"gcloud compute os-login ssh-keys list\n")),(0,o.kt)("p",null,"Upload your ssh keys:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-sh"},"gcloud compute os-login ssh-keys add --key-file .ssh/id_rsa.pub\n")),(0,o.kt)("p",null,"Describe a key"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-sh"},"gcloud compute os-login ssh-keys describe --key=ad1811081881c04dad627f96b5d20ddd41fd44e31e76fc259c3e2534f75a190b\n")))}p.isMDXComponent=!0}}]);