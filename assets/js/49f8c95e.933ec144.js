"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[3637],{3905:function(e,r,t){t.d(r,{Zo:function(){return p},kt:function(){return m}});var n=t(67294);function o(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function i(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function c(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?i(Object(t),!0).forEach((function(r){o(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function s(e,r){if(null==e)return{};var t,n,o=function(e,r){if(null==e)return{};var t,n,o={},i=Object.keys(e);for(n=0;n<i.length;n++)t=i[n],r.indexOf(t)>=0||(o[t]=e[t]);return o}(e,r);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)t=i[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var u=n.createContext({}),a=function(e){var r=n.useContext(u),t=r;return e&&(t="function"==typeof e?e(r):c(c({},r),e)),t},p=function(e){var r=a(e.components);return n.createElement(u.Provider,{value:r},e.children)},l={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},d=n.forwardRef((function(e,r){var t=e.components,o=e.mdxType,i=e.originalType,u=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),d=a(t),m=o,y=d["".concat(u,".").concat(m)]||d[m]||l[m]||i;return t?n.createElement(y,c(c({ref:r},p),{},{components:t})):n.createElement(y,c({ref:r},p))}));function m(e,r){var t=arguments,o=r&&r.mdxType;if("string"==typeof e||o){var i=t.length,c=new Array(i);c[0]=d;var s={};for(var u in r)hasOwnProperty.call(r,u)&&(s[u]=r[u]);s.originalType=e,s.mdxType="string"==typeof e?e:o,c[1]=s;for(var a=2;a<i;a++)c[a]=t[a];return n.createElement.apply(null,c)}return n.createElement.apply(null,t)}d.displayName="MDXCreateElement"},77300:function(e,r,t){t.r(r),t.d(r,{frontMatter:function(){return s},contentTitle:function(){return u},metadata:function(){return a},toc:function(){return p},default:function(){return d}});var n=t(87462),o=t(63366),i=(t(67294),t(3905)),c=["components"],s={id:"SshPublicKey",title:"SshPublicKey"},u=void 0,a={unversionedId:"azure/resources/Compute/SshPublicKey",id:"azure/resources/Compute/SshPublicKey",isDocsHomePage:!1,title:"SshPublicKey",description:"Provides a SshPublicKey from the Compute group",source:"@site/docs/azure/resources/Compute/SshPublicKey.md",sourceDirName:"azure/resources/Compute",slug:"/azure/resources/Compute/SshPublicKey",permalink:"/docs/azure/resources/Compute/SshPublicKey",tags:[],version:"current",frontMatter:{id:"SshPublicKey",title:"SshPublicKey"},sidebar:"docs",previous:{title:"Snapshot",permalink:"/docs/azure/resources/Compute/Snapshot"},next:{title:"VirtualMachine",permalink:"/docs/azure/resources/Compute/VirtualMachine"}},p=[{value:"Examples",id:"examples",children:[{value:"Create a new SSH public key resource.",id:"create-a-new-ssh-public-key-resource",children:[],level:3}],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"Swagger Schema",id:"swagger-schema",children:[],level:2},{value:"Misc",id:"misc",children:[],level:2}],l={toc:p};function d(e){var r=e.components,t=(0,o.Z)(e,c);return(0,i.kt)("wrapper",(0,n.Z)({},l,t,{components:r,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Provides a ",(0,i.kt)("strong",{parentName:"p"},"SshPublicKey")," from the ",(0,i.kt)("strong",{parentName:"p"},"Compute")," group"),(0,i.kt)("h2",{id:"examples"},"Examples"),(0,i.kt)("h3",{id:"create-a-new-ssh-public-key-resource"},"Create a new SSH public key resource."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "SshPublicKey",\n    group: "Compute",\n    name: "mySshPublicKey",\n    properties: () => ({\n      location: "westus",\n      properties: { publicKey: "{ssh-rsa public key}" },\n    }),\n    dependencies: ({}) => ({ resourceGroup: "myResourceGroup" }),\n  },\n];\n\n')),(0,i.kt)("h2",{id:"dependencies"},"Dependencies"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup"))),(0,i.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"{\n  properties: {\n    properties: {\n      'x-ms-client-flatten': true,\n      description: 'Properties of the SSH public key.',\n      properties: {\n        publicKey: {\n          type: 'string',\n          description: 'SSH public key used to authenticate to a virtual machine through ssh. If this property is not initially provided when the resource is created, the publicKey property will be populated when generateKeyPair is called. If the public key is provided upon resource creation, the provided public key needs to be at least 2048-bit and in ssh-rsa format.'\n        }\n      }\n    }\n  },\n  allOf: [\n    {\n      description: 'The Resource model definition.',\n      properties: {\n        id: { readOnly: true, type: 'string', description: 'Resource Id' },\n        name: {\n          readOnly: true,\n          type: 'string',\n          description: 'Resource name'\n        },\n        type: {\n          readOnly: true,\n          type: 'string',\n          description: 'Resource type'\n        },\n        location: { type: 'string', description: 'Resource location' },\n        tags: {\n          type: 'object',\n          additionalProperties: { type: 'string' },\n          description: 'Resource tags'\n        }\n      },\n      required: [ 'location' ],\n      'x-ms-azure-resource': true\n    }\n  ],\n  description: 'Specifies information about the SSH public key.'\n}\n")),(0,i.kt)("h2",{id:"misc"},"Misc"),(0,i.kt)("p",null,"The resource version is ",(0,i.kt)("inlineCode",{parentName:"p"},"2021-11-01"),"."),(0,i.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/stable/2021-11-01/compute.json"},"here"),"."))}d.isMDXComponent=!0}}]);