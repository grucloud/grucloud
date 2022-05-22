"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[28994],{3905:function(e,n,t){t.d(n,{Zo:function(){return u},kt:function(){return m}});var r=t(67294);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function i(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function s(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?i(Object(t),!0).forEach((function(n){a(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function o(e,n){if(null==e)return{};var t,r,a=function(e,n){if(null==e)return{};var t,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var c=r.createContext({}),p=function(e){var n=r.useContext(c),t=n;return e&&(t="function"==typeof e?e(n):s(s({},n),e)),t},u=function(e){var n=p(e.components);return r.createElement(c.Provider,{value:n},e.children)},l={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},d=r.forwardRef((function(e,n){var t=e.components,a=e.mdxType,i=e.originalType,c=e.parentName,u=o(e,["components","mdxType","originalType","parentName"]),d=p(t),m=a,h=d["".concat(c,".").concat(m)]||d[m]||l[m]||i;return t?r.createElement(h,s(s({ref:n},u),{},{components:t})):r.createElement(h,s({ref:n},u))}));function m(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var i=t.length,s=new Array(i);s[0]=d;var o={};for(var c in n)hasOwnProperty.call(n,c)&&(o[c]=n[c]);o.originalType=e,o.mdxType="string"==typeof e?e:a,s[1]=o;for(var p=2;p<i;p++)s[p]=t[p];return r.createElement.apply(null,s)}return r.createElement.apply(null,t)}d.displayName="MDXCreateElement"},38805:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return o},contentTitle:function(){return c},metadata:function(){return p},toc:function(){return u},default:function(){return d}});var r=t(87462),a=t(63366),i=(t(67294),t(3905)),s=["components"],o={id:"VirtualMachineExtension",title:"VirtualMachineExtension"},c=void 0,p={unversionedId:"azure/resources/Compute/VirtualMachineExtension",id:"azure/resources/Compute/VirtualMachineExtension",isDocsHomePage:!1,title:"VirtualMachineExtension",description:"Provides a VirtualMachineExtension from the Compute group",source:"@site/docs/azure/resources/Compute/VirtualMachineExtension.md",sourceDirName:"azure/resources/Compute",slug:"/azure/resources/Compute/VirtualMachineExtension",permalink:"/docs/azure/resources/Compute/VirtualMachineExtension",tags:[],version:"current",frontMatter:{id:"VirtualMachineExtension",title:"VirtualMachineExtension"},sidebar:"docs",previous:{title:"VirtualMachine",permalink:"/docs/azure/resources/Compute/VirtualMachine"},next:{title:"VirtualMachineRunCommandByVirtualMachine",permalink:"/docs/azure/resources/Compute/VirtualMachineRunCommandByVirtualMachine"}},u=[{value:"Examples",id:"examples",children:[{value:"VirtualMachineExtensions_CreateOrUpdate_MaximumSet_Gen",id:"virtualmachineextensions_createorupdate_maximumset_gen",children:[],level:3},{value:"VirtualMachineExtensions_CreateOrUpdate_MinimumSet_Gen",id:"virtualmachineextensions_createorupdate_minimumset_gen",children:[],level:3}],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"Swagger Schema",id:"swagger-schema",children:[],level:2},{value:"Misc",id:"misc",children:[],level:2}],l={toc:u};function d(e){var n=e.components,t=(0,a.Z)(e,s);return(0,i.kt)("wrapper",(0,r.Z)({},l,t,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Provides a ",(0,i.kt)("strong",{parentName:"p"},"VirtualMachineExtension")," from the ",(0,i.kt)("strong",{parentName:"p"},"Compute")," group"),(0,i.kt)("h2",{id:"examples"},"Examples"),(0,i.kt)("h3",{id:"virtualmachineextensions_createorupdate_maximumset_gen"},"VirtualMachineExtensions_CreateOrUpdate_MaximumSet_Gen"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "VirtualMachineExtension",\n    group: "Compute",\n    name: "myVirtualMachineExtension",\n    properties: () => ({\n      location: "westus",\n      properties: {\n        autoUpgradeMinorVersion: true,\n        publisher: "extPublisher",\n        type: "extType",\n        typeHandlerVersion: "1.2",\n        suppressFailures: true,\n        settings: {},\n        forceUpdateTag: "a",\n        enableAutomaticUpgrade: true,\n        protectedSettings: {},\n        instanceView: {\n          name: "aaaaaaaaaaaaaaaaa",\n          type: "aaaaaaaaa",\n          typeHandlerVersion: "aaaaaaaaaaaaaaaaaaaaaaaaaa",\n          substatuses: [\n            {\n              code: "aaaaaaaaaaaaaaaaaaaaaaa",\n              level: "Info",\n              displayStatus: "aaaaaa",\n              message: "a",\n              time: "2021-11-30T12:58:26.522Z",\n            },\n          ],\n          statuses: [\n            {\n              code: "aaaaaaaaaaaaaaaaaaaaaaa",\n              level: "Info",\n              displayStatus: "aaaaaa",\n              message: "a",\n              time: "2021-11-30T12:58:26.522Z",\n            },\n          ],\n        },\n      },\n      tags: { key9183: "aa" },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      vm: "myVirtualMachine",\n    }),\n  },\n];\n\n')),(0,i.kt)("h3",{id:"virtualmachineextensions_createorupdate_minimumset_gen"},"VirtualMachineExtensions_CreateOrUpdate_MinimumSet_Gen"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "VirtualMachineExtension",\n    group: "Compute",\n    name: "myVirtualMachineExtension",\n    properties: () => ({ location: "westus" }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      vm: "myVirtualMachine",\n    }),\n  },\n];\n\n')),(0,i.kt)("h2",{id:"dependencies"},"Dependencies"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Compute/VirtualMachine"},"VirtualMachine"))),(0,i.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"{\n  properties: {\n    properties: {\n      'x-ms-client-flatten': true,\n      properties: {\n        forceUpdateTag: {\n          type: 'string',\n          description: 'How the extension handler should be forced to update even if the extension configuration has not changed.'\n        },\n        publisher: {\n          type: 'string',\n          description: 'The name of the extension handler publisher.'\n        },\n        type: {\n          type: 'string',\n          description: 'Specifies the type of the extension; an example is \"CustomScriptExtension\".'\n        },\n        typeHandlerVersion: {\n          type: 'string',\n          description: 'Specifies the version of the script handler.'\n        },\n        autoUpgradeMinorVersion: {\n          type: 'boolean',\n          description: 'Indicates whether the extension should use a newer minor version if one is available at deployment time. Once deployed, however, the extension will not upgrade minor versions unless redeployed, even with this property set to true.'\n        },\n        enableAutomaticUpgrade: {\n          type: 'boolean',\n          description: 'Indicates whether the extension should be automatically upgraded by the platform if there is a newer version of the extension available.'\n        },\n        settings: {\n          type: 'object',\n          description: 'Json formatted public settings for the extension.'\n        },\n        protectedSettings: {\n          type: 'object',\n          description: 'The extension can contain either protectedSettings or protectedSettingsFromKeyVault or no protected settings at all.'\n        },\n        provisioningState: {\n          readOnly: true,\n          type: 'string',\n          description: 'The provisioning state, which only appears in the response.'\n        },\n        instanceView: {\n          description: 'The virtual machine extension instance view.',\n          properties: {\n            name: {\n              type: 'string',\n              description: 'The virtual machine extension name.'\n            },\n            type: {\n              type: 'string',\n              description: 'Specifies the type of the extension; an example is \"CustomScriptExtension\".'\n            },\n            typeHandlerVersion: {\n              type: 'string',\n              description: 'Specifies the version of the script handler.'\n            },\n            substatuses: {\n              type: 'array',\n              items: {\n                properties: {\n                  code: { type: 'string', description: 'The status code.' },\n                  level: {\n                    type: 'string',\n                    description: 'The level code.',\n                    enum: [ 'Info', 'Warning', 'Error' ],\n                    'x-ms-enum': { name: 'StatusLevelTypes', modelAsString: false }\n                  },\n                  displayStatus: {\n                    type: 'string',\n                    description: 'The short localizable label for the status.'\n                  },\n                  message: {\n                    type: 'string',\n                    description: 'The detailed status message, including for alerts and error messages.'\n                  },\n                  time: {\n                    type: 'string',\n                    format: 'date-time',\n                    description: 'The time of the status.'\n                  }\n                },\n                description: 'Instance view status.'\n              },\n              'x-ms-identifiers': [],\n              description: 'The resource status information.'\n            },\n            statuses: {\n              type: 'array',\n              items: {\n                properties: {\n                  code: { type: 'string', description: 'The status code.' },\n                  level: {\n                    type: 'string',\n                    description: 'The level code.',\n                    enum: [ 'Info', 'Warning', 'Error' ],\n                    'x-ms-enum': { name: 'StatusLevelTypes', modelAsString: false }\n                  },\n                  displayStatus: {\n                    type: 'string',\n                    description: 'The short localizable label for the status.'\n                  },\n                  message: {\n                    type: 'string',\n                    description: 'The detailed status message, including for alerts and error messages.'\n                  },\n                  time: {\n                    type: 'string',\n                    format: 'date-time',\n                    description: 'The time of the status.'\n                  }\n                },\n                description: 'Instance view status.'\n              },\n              'x-ms-identifiers': [],\n              description: 'The resource status information.'\n            }\n          }\n        },\n        suppressFailures: {\n          type: 'boolean',\n          description: 'Indicates whether failures stemming from the extension will be suppressed (Operational failures such as not connecting to the VM will not be suppressed regardless of this value). The default is false.'\n        },\n        protectedSettingsFromKeyVault: {\n          type: 'object',\n          description: 'The extensions protected settings that are passed by reference, and consumed from key vault'\n        }\n      },\n      description: 'Describes the properties of a Virtual Machine Extension.'\n    }\n  },\n  allOf: [\n    {\n      description: 'The Resource model definition.',\n      properties: {\n        id: { readOnly: true, type: 'string', description: 'Resource Id' },\n        name: {\n          readOnly: true,\n          type: 'string',\n          description: 'Resource name'\n        },\n        type: {\n          readOnly: true,\n          type: 'string',\n          description: 'Resource type'\n        },\n        location: { type: 'string', description: 'Resource location' },\n        tags: {\n          type: 'object',\n          additionalProperties: { type: 'string' },\n          description: 'Resource tags'\n        }\n      },\n      required: [ 'location' ],\n      'x-ms-azure-resource': true\n    }\n  ],\n  description: 'Describes a Virtual Machine Extension.'\n}\n")),(0,i.kt)("h2",{id:"misc"},"Misc"),(0,i.kt)("p",null,"The resource version is ",(0,i.kt)("inlineCode",{parentName:"p"},"2021-11-01"),"."),(0,i.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/stable/2021-11-01/compute.json"},"here"),"."))}d.isMDXComponent=!0}}]);