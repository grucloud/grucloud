"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[23464],{3905:function(e,r,t){t.d(r,{Zo:function(){return p},kt:function(){return d}});var n=t(67294);function i(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function o(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function c(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?o(Object(t),!0).forEach((function(r){i(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function u(e,r){if(null==e)return{};var t,n,i=function(e,r){if(null==e)return{};var t,n,i={},o=Object.keys(e);for(n=0;n<o.length;n++)t=o[n],r.indexOf(t)>=0||(i[t]=e[t]);return i}(e,r);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)t=o[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var a=n.createContext({}),s=function(e){var r=n.useContext(a),t=r;return e&&(t="function"==typeof e?e(r):c(c({},r),e)),t},p=function(e){var r=s(e.components);return n.createElement(a.Provider,{value:r},e.children)},l={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},m=n.forwardRef((function(e,r){var t=e.components,i=e.mdxType,o=e.originalType,a=e.parentName,p=u(e,["components","mdxType","originalType","parentName"]),m=s(t),d=i,k=m["".concat(a,".").concat(d)]||m[d]||l[d]||o;return t?n.createElement(k,c(c({ref:r},p),{},{components:t})):n.createElement(k,c({ref:r},p))}));function d(e,r){var t=arguments,i=r&&r.mdxType;if("string"==typeof e||i){var o=t.length,c=new Array(o);c[0]=m;var u={};for(var a in r)hasOwnProperty.call(r,a)&&(u[a]=r[a]);u.originalType=e,u.mdxType="string"==typeof e?e:i,c[1]=u;for(var s=2;s<o;s++)c[s]=t[s];return n.createElement.apply(null,c)}return n.createElement.apply(null,t)}m.displayName="MDXCreateElement"},98554:function(e,r,t){t.r(r),t.d(r,{frontMatter:function(){return u},contentTitle:function(){return a},metadata:function(){return s},toc:function(){return p},default:function(){return m}});var n=t(87462),i=t(63366),o=(t(67294),t(3905)),c=["components"],u={id:"NetworkSecurityPerimeter",title:"NetworkSecurityPerimeter"},a=void 0,s={unversionedId:"azure/resources/Network/NetworkSecurityPerimeter",id:"azure/resources/Network/NetworkSecurityPerimeter",isDocsHomePage:!1,title:"NetworkSecurityPerimeter",description:"Provides a NetworkSecurityPerimeter from the Network group",source:"@site/docs/azure/resources/Network/NetworkSecurityPerimeter.md",sourceDirName:"azure/resources/Network",slug:"/azure/resources/Network/NetworkSecurityPerimeter",permalink:"/docs/azure/resources/Network/NetworkSecurityPerimeter",tags:[],version:"current",frontMatter:{id:"NetworkSecurityPerimeter",title:"NetworkSecurityPerimeter"},sidebar:"docs",previous:{title:"NetworkSecurityGroup",permalink:"/docs/azure/resources/Network/NetworkSecurityGroup"},next:{title:"NetworkVirtualAppliance",permalink:"/docs/azure/resources/Network/NetworkVirtualAppliance"}},p=[{value:"Examples",id:"examples",children:[{value:"Put Network Security Perimeter",id:"put-network-security-perimeter",children:[],level:3}],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"Misc",id:"misc",children:[],level:2}],l={toc:p};function m(e){var r=e.components,t=(0,i.Z)(e,c);return(0,o.kt)("wrapper",(0,n.Z)({},l,t,{components:r,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Provides a ",(0,o.kt)("strong",{parentName:"p"},"NetworkSecurityPerimeter")," from the ",(0,o.kt)("strong",{parentName:"p"},"Network")," group"),(0,o.kt)("h2",{id:"examples"},"Examples"),(0,o.kt)("h3",{id:"put-network-security-perimeter"},"Put Network Security Perimeter"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'provider.Network.makeNetworkSecurityPerimeter({\n  name: "myNetworkSecurityPerimeter",\n  properties: () => ({\n    properties: {\n      displayName: "TestNetworkSecurityPerimeter",\n      description: "Description of TestNetworkSecurityPerimeter",\n    },\n  }),\n  dependencies: ({ resources }) => ({\n    adminRule: resources.Network.AdminRule["myAdminRule"],\n  }),\n});\n\n')),(0,o.kt)("h2",{id:"dependencies"},"Dependencies"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"../Network/AdminRule.md"},"AdminRule"))),(0,o.kt)("h2",{id:"misc"},"Misc"),(0,o.kt)("p",null,"The resource version is ",(0,o.kt)("inlineCode",{parentName:"p"},"2021-03-01-preview"),"."),(0,o.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/preview/2021-03-01-preview/networkSecurityPerimeter.json"},"here"),"."))}m.isMDXComponent=!0}}]);