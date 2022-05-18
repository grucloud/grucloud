"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[8273],{3905:function(e,n,t){t.d(n,{Zo:function(){return u},kt:function(){return f}});var r=t(67294);function i(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function s(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){i(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function c(e,n){if(null==e)return{};var t,r,i=function(e,n){if(null==e)return{};var t,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||(i[t]=e[t]);return i}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var a=r.createContext({}),p=function(e){var n=r.useContext(a),t=n;return e&&(t="function"==typeof e?e(n):s(s({},n),e)),t},u=function(e){var n=p(e.components);return r.createElement(a.Provider,{value:n},e.children)},l={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},d=r.forwardRef((function(e,n){var t=e.components,i=e.mdxType,o=e.originalType,a=e.parentName,u=c(e,["components","mdxType","originalType","parentName"]),d=p(t),f=i,m=d["".concat(a,".").concat(f)]||d[f]||l[f]||o;return t?r.createElement(m,s(s({ref:n},u),{},{components:t})):r.createElement(m,s({ref:n},u))}));function f(e,n){var t=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var o=t.length,s=new Array(o);s[0]=d;var c={};for(var a in n)hasOwnProperty.call(n,a)&&(c[a]=n[a]);c.originalType=e,c.mdxType="string"==typeof e?e:i,s[1]=c;for(var p=2;p<o;p++)s[p]=t[p];return r.createElement.apply(null,s)}return r.createElement.apply(null,t)}d.displayName="MDXCreateElement"},98756:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return c},contentTitle:function(){return a},metadata:function(){return p},toc:function(){return u},default:function(){return d}});var r=t(87462),i=t(63366),o=(t(67294),t(3905)),s=["components"],c={id:"WebAppInstanceFunctionSlot",title:"WebAppInstanceFunctionSlot"},a=void 0,p={unversionedId:"azure/resources/Web/WebAppInstanceFunctionSlot",id:"azure/resources/Web/WebAppInstanceFunctionSlot",isDocsHomePage:!1,title:"WebAppInstanceFunctionSlot",description:"Provides a WebAppInstanceFunctionSlot from the Web group",source:"@site/docs/azure/resources/Web/WebAppInstanceFunctionSlot.md",sourceDirName:"azure/resources/Web",slug:"/azure/resources/Web/WebAppInstanceFunctionSlot",permalink:"/docs/azure/resources/Web/WebAppInstanceFunctionSlot",tags:[],version:"current",frontMatter:{id:"WebAppInstanceFunctionSlot",title:"WebAppInstanceFunctionSlot"},sidebar:"docs",previous:{title:"WebAppHostNameBindingSlot",permalink:"/docs/azure/resources/Web/WebAppHostNameBindingSlot"},next:{title:"WebAppInstanceMsDeployStatus",permalink:"/docs/azure/resources/Web/WebAppInstanceMsDeployStatus"}},u=[{value:"Examples",id:"examples",children:[],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"Swagger Schema",id:"swagger-schema",children:[],level:2},{value:"Misc",id:"misc",children:[],level:2}],l={toc:u};function d(e){var n=e.components,t=(0,i.Z)(e,s);return(0,o.kt)("wrapper",(0,r.Z)({},l,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Provides a ",(0,o.kt)("strong",{parentName:"p"},"WebAppInstanceFunctionSlot")," from the ",(0,o.kt)("strong",{parentName:"p"},"Web")," group"),(0,o.kt)("h2",{id:"examples"},"Examples"),(0,o.kt)("h2",{id:"dependencies"},"Dependencies"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Web/Site"},"Site")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Web/SiteSlot"},"SiteSlot"))),(0,o.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"{\n  description: 'Function information.',\n  type: 'object',\n  allOf: [\n    {\n      description: 'Azure proxy only resource. This resource is not tracked by Azure Resource Manager.',\n      type: 'object',\n      properties: {\n        id: { description: 'Resource Id.', type: 'string', readOnly: true },\n        name: {\n          description: 'Resource Name.',\n          type: 'string',\n          readOnly: true\n        },\n        kind: { description: 'Kind of resource.', type: 'string' },\n        type: {\n          description: 'Resource type.',\n          type: 'string',\n          readOnly: true\n        }\n      },\n      'x-ms-azure-resource': true\n    }\n  ],\n  properties: {\n    properties: {\n      description: 'FunctionEnvelope resource specific properties',\n      type: 'object',\n      properties: {\n        function_app_id: { description: 'Function App ID.', type: 'string' },\n        script_root_path_href: { description: 'Script root path URI.', type: 'string' },\n        script_href: { description: 'Script URI.', type: 'string' },\n        config_href: { description: 'Config URI.', type: 'string' },\n        test_data_href: { description: 'Test data URI.', type: 'string' },\n        secrets_file_href: { description: 'Secrets file URI.', type: 'string' },\n        href: { description: 'Function URI.', type: 'string' },\n        config: { description: 'Config information.', type: 'object' },\n        files: {\n          description: 'File list.',\n          type: 'object',\n          additionalProperties: { type: 'string' }\n        },\n        test_data: {\n          description: 'Test data used when testing via the Azure Portal.',\n          type: 'string'\n        },\n        invoke_url_template: { description: 'The invocation URL', type: 'string' },\n        language: { description: 'The function language', type: 'string' },\n        isDisabled: {\n          description: 'Gets or sets a value indicating whether the function is disabled',\n          type: 'boolean'\n        }\n      },\n      'x-ms-client-flatten': true\n    }\n  }\n}\n")),(0,o.kt)("h2",{id:"misc"},"Misc"),(0,o.kt)("p",null,"The resource version is ",(0,o.kt)("inlineCode",{parentName:"p"},"2021-03-01"),"."),(0,o.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2021-03-01/WebApps.json"},"here"),"."))}d.isMDXComponent=!0}}]);