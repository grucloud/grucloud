"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[34310],{3905:(e,t,r)=>{r.d(t,{Zo:()=>s,kt:()=>f});var n=r(67294);function l(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){l(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function p(e,t){if(null==e)return{};var r,n,l=function(e,t){if(null==e)return{};var r,n,l={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(l[r]=e[r]);return l}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(l[r]=e[r])}return l}var i=n.createContext({}),u=function(e){var t=n.useContext(i),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},s=function(e){var t=u(e.components);return n.createElement(i.Provider,{value:t},e.children)},c="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,l=e.mdxType,a=e.originalType,i=e.parentName,s=p(e,["components","mdxType","originalType","parentName"]),c=u(r),d=l,f=c["".concat(i,".").concat(d)]||c[d]||m[d]||a;return r?n.createElement(f,o(o({ref:t},s),{},{components:r})):n.createElement(f,o({ref:t},s))}));function f(e,t){var r=arguments,l=t&&t.mdxType;if("string"==typeof e||l){var a=r.length,o=new Array(a);o[0]=d;var p={};for(var i in t)hasOwnProperty.call(t,i)&&(p[i]=t[i]);p.originalType=e,p[c]="string"==typeof e?e:l,o[1]=p;for(var u=2;u<a;u++)o[u]=r[u];return n.createElement.apply(null,o)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},94917:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>i,contentTitle:()=>o,default:()=>m,frontMatter:()=>a,metadata:()=>p,toc:()=>u});var n=r(87462),l=(r(67294),r(3905));const a={id:"Tree",title:"Tree"},o=void 0,p={unversionedId:"cli/Tree",id:"cli/Tree",title:"Tree",description:"The tree commands generates a mind map tree of the target resources.",source:"@site/docs/cli/Tree.md",sourceDirName:"cli",slug:"/cli/Tree",permalink:"/docs/cli/Tree",draft:!1,tags:[],version:"current",frontMatter:{id:"Tree",title:"Tree"},sidebar:"docs",previous:{title:"List Resources",permalink:"/docs/cli/List"},next:{title:"Destroy",permalink:"/docs/cli/Destroy"}},i={},u=[{value:"Requirements",id:"requirements",level:2},{value:"Help",id:"help",level:2},{value:"Example",id:"example",level:2},{value:"Alias",id:"alias",level:3},{value:"Full",id:"full",level:3}],s={toc:u},c="wrapper";function m(e){let{components:t,...r}=e;return(0,l.kt)(c,(0,n.Z)({},s,r,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("p",null,"The ",(0,l.kt)("strong",{parentName:"p"},"tree")," commands generates a ",(0,l.kt)("a",{parentName:"p",href:"https://plantuml.com/mindmap-diagram"},"mind map")," tree of the target resources."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"gc tree\n")),(0,l.kt)("h2",{id:"requirements"},"Requirements"),(0,l.kt)("p",null,"The conversion from ","*",".puml to SVG/PNG is performed by ",(0,l.kt)("a",{parentName:"p",href:"https://plantuml.com/download"},"plantuml"),".\nDo not forget to download the ",(0,l.kt)("a",{parentName:"p",href:"https://plantuml.com/download"},"plantuml.jar"),"."),(0,l.kt)("h2",{id:"help"},"Help"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-sh"},"gc tree --help\n")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-txt"},'Output the target resources as a mind map tree\n\nOptions:\n  --pumlFile <file>         plantuml output file name (default: "resources-mindmap.puml")\n  --title <value>           title (default: "multi")\n  -t, --type <type>         file type: png, svg (default: "svg")\n  -f, --full                display resources name\n  -j, --plantumlJar <type>  plantuml.jar location (default: "/Users/mario/Downloads/plantuml.jar")\n  -p, --provider <value>    Filter by provider, multiple values allowed\n  -h, --help                display help for command\n')),(0,l.kt)("h2",{id:"example"},"Example"),(0,l.kt)("h3",{id:"alias"},"Alias"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-sh"},"gc t\n")),(0,l.kt)("p",null,"A kubernetes cluster running on AWS EKS:"),(0,l.kt)("p",null,(0,l.kt)("img",{parentName:"p",src:"https://raw.githubusercontent.com/grucloud/grucloud/main/examples/starhackit/eks-lean/resources-mindmap.svg",alt:"tree-eks"})),(0,l.kt)("h3",{id:"full"},"Full"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"gc tree --full --pumlFile resources-all-mindmap.svg\n")),(0,l.kt)("p",null,(0,l.kt)("img",{parentName:"p",src:"https://raw.githubusercontent.com/grucloud/grucloud/main/examples/starhackit/eks-lean/resources-all-mindmap.svg",alt:"tree-eks"})))}m.isMDXComponent=!0}}]);