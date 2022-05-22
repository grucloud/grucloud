"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[85511],{3905:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return d}});var r=n(67294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var s=r.createContext({}),l=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},p=function(e){var t=l(e.components);return r.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},f=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,i=e.originalType,s=e.parentName,p=c(e,["components","mdxType","originalType","parentName"]),f=l(n),d=o,m=f["".concat(s,".").concat(d)]||f[d]||u[d]||i;return n?r.createElement(m,a(a({ref:t},p),{},{components:n})):r.createElement(m,a({ref:t},p))}));function d(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=n.length,a=new Array(i);a[0]=f;var c={};for(var s in t)hasOwnProperty.call(t,s)&&(c[s]=t[s]);c.originalType=e,c.mdxType="string"==typeof e?e:o,a[1]=c;for(var l=2;l<i;l++)a[l]=n[l];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}f.displayName="MDXCreateElement"},86258:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return c},contentTitle:function(){return s},metadata:function(){return l},toc:function(){return p},default:function(){return f}});var r=n(87462),o=n(63366),i=(n(67294),n(3905)),a=["components"],c={id:"gc",title:"gc"},s=void 0,l={unversionedId:"cli/gc",id:"cli/gc",isDocsHomePage:!1,title:"gc",description:"The gc command line interface is a short for GruCloud.",source:"@site/docs/cli/gc.md",sourceDirName:"cli",slug:"/cli/gc",permalink:"/docs/cli/gc",tags:[],version:"current",frontMatter:{id:"gc",title:"gc"},sidebar:"docs",previous:{title:"Requirements",permalink:"/docs/k8s/K8sRequirements"},next:{title:"New Project",permalink:"/docs/cli/New"}},p=[],u={toc:p};function f(e){var t=e.components,n=(0,o.Z)(e,a);return(0,i.kt)("wrapper",(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"The ",(0,i.kt)("strong",{parentName:"p"},"gc")," command line interface is a short for GruCloud.\nIt is a ",(0,i.kt)("em",{parentName:"p"},"node js")," application which can be installed with ",(0,i.kt)("em",{parentName:"p"},"npm")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"npm i -g @grucloud/core\n")),(0,i.kt)("p",null,"Now check that ",(0,i.kt)("strong",{parentName:"p"},"gc")," is installed correctly:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-sh"},"gc\n")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-txt"},"Usage: gc [options] [command]\n\nOptions:\n  -V, --version                  output the version number\n  -i, --infra <file>             infrastructure default is iac.js\n  -c, --config <file>            config file, default is config.js\n  -r, --resource <file>          additional resource file\n  -j, --json <file>              write result to a file in json format\n  -d, --workingDirectory <file>  The working directory.\n  --noOpen                       Do not open diagram\n  -h, --help                     display help for command\n\nCommands:\n  info [options]                 Get Information about the current project\n  new                            Create a new project\n  init|i                         Initialise the cloud providers\n  uninit|u                       Un-initialise the cloud providers\n  plan|p [options]               Find out which resources need to be deployed or destroyed\n  run|r [options]                run onDeployed or onDestroy\n  apply|a [options]              Apply the plan, a.k.a deploy the resources\n  destroy|d [options]            Destroy the resources\n  list|l [options]               List the live resources\n  output|o [options]             Output the value of a resource\n  graph|gt [options]             Output the target resources in a dot file and a graphical format such as SVG\n  tree|t [options]               Output the target resources as a mind map tree\n  gencode|c [options]            Generate infrastruture code from deployed resources\n  help [command]                 display help for command\n")))}f.isMDXComponent=!0}}]);