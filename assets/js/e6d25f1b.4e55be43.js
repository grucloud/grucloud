"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[74511],{3905:function(e,n,r){r.d(n,{Zo:function(){return d},kt:function(){return m}});var t=r(67294);function o(e,n,r){return n in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}function a(e,n){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),r.push.apply(r,t)}return r}function c(e){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?a(Object(r),!0).forEach((function(n){o(e,n,r[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))}))}return e}function s(e,n){if(null==e)return{};var r,t,o=function(e,n){if(null==e)return{};var r,t,o={},a=Object.keys(e);for(t=0;t<a.length;t++)r=a[t],n.indexOf(r)>=0||(o[r]=e[r]);return o}(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(t=0;t<a.length;t++)r=a[t],n.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var i=t.createContext({}),l=function(e){var n=t.useContext(i),r=n;return e&&(r="function"==typeof e?e(n):c(c({},n),e)),r},d=function(e){var n=l(e.components);return t.createElement(i.Provider,{value:n},e.children)},u={inlineCode:"code",wrapper:function(e){var n=e.children;return t.createElement(t.Fragment,{},n)}},p=t.forwardRef((function(e,n){var r=e.components,o=e.mdxType,a=e.originalType,i=e.parentName,d=s(e,["components","mdxType","originalType","parentName"]),p=l(r),m=o,g=p["".concat(i,".").concat(m)]||p[m]||u[m]||a;return r?t.createElement(g,c(c({ref:n},d),{},{components:r})):t.createElement(g,c({ref:n},d))}));function m(e,n){var r=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var a=r.length,c=new Array(a);c[0]=p;var s={};for(var i in n)hasOwnProperty.call(n,i)&&(s[i]=n[i]);s.originalType=e,s.mdxType="string"==typeof e?e:o,c[1]=s;for(var l=2;l<a;l++)c[l]=r[l];return t.createElement.apply(null,c)}return t.createElement.apply(null,r)}p.displayName="MDXCreateElement"},19839:function(e,n,r){r.r(n),r.d(n,{frontMatter:function(){return s},contentTitle:function(){return i},metadata:function(){return l},toc:function(){return d},default:function(){return p}});var t=r(87462),o=r(63366),a=(r(67294),r(3905)),c=["components"],s={id:"DnsManagedZone",title:"Dns Managed Zone"},i=void 0,l={unversionedId:"google/resources/DNS/DnsManagedZone",id:"google/resources/DNS/DnsManagedZone",isDocsHomePage:!1,title:"Dns Managed Zone",description:"Provides a DNS managed zone and resource record set.",source:"@site/docs/google/resources/DNS/DnsManagedZone.md",sourceDirName:"google/resources/DNS",slug:"/google/resources/DNS/DnsManagedZone",permalink:"/docs/google/resources/DNS/DnsManagedZone",tags:[],version:"current",frontMatter:{id:"DnsManagedZone",title:"Dns Managed Zone"},sidebar:"docs",previous:{title:"VM Instance",permalink:"/docs/google/resources/Compute/VmInstance"},next:{title:"Binding",permalink:"/docs/google/resources/IAM/Binding"}},d=[{value:"Examples",id:"examples",children:[{value:"Dns managed zone with one record set",id:"dns-managed-zone-with-one-record-set",children:[],level:3},{value:"Example Code",id:"example-code",children:[],level:3}],level:2},{value:"Properties",id:"properties",children:[],level:2}],u={toc:d};function p(e){var n=e.components,r=(0,o.Z)(e,c);return(0,a.kt)("wrapper",(0,t.Z)({},u,r,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Provides a DNS managed zone and resource record set."),(0,a.kt)("h2",{id:"examples"},"Examples"),(0,a.kt)("h3",{id:"dns-managed-zone-with-one-record-set"},"Dns managed zone with one record set"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'const domain = "gcp.grucloud.com";\n\nprovider.dns.makeManagedZone({\n  name: "dns-managed-zone",\n  properties: () => ({\n    dnsName: `${domain}.`,\n    recordSet: [\n      {\n        name: `${domain}.`,\n        rrdatas: ["1.2.3.1"],\n        ttl: 86400,\n        type: "A",\n      },\n    ],\n  }),\n});\n')),(0,a.kt)("h3",{id:"example-code"},"Example Code"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/google/storage/website-https"},"basic example"))),(0,a.kt)("h2",{id:"properties"},"Properties"),(0,a.kt)("p",null,"See ",(0,a.kt)("a",{parentName:"p",href:"https://cloud.google.com/dns/docs/reference/v1beta2/managedZones/create"},"create properties"),"\nand ",(0,a.kt)("a",{parentName:"p",href:"https://cloud.google.com/dns/docs/reference/v1beta2/resourceRecordSets#resource"},"recordSet properties")))}p.isMDXComponent=!0}}]);