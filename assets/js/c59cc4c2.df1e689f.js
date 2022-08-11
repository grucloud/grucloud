"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[16314],{3905:(e,t,n)=>{n.d(t,{Zo:()=>l,kt:()=>d});var r=n(67294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?s(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function a(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},s=Object.keys(e);for(r=0;r<s.length;r++)n=s[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(r=0;r<s.length;r++)n=s[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var p=r.createContext({}),c=function(e){var t=r.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},l=function(e){var t=c(e.components);return r.createElement(p.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,s=e.originalType,p=e.parentName,l=a(e,["components","mdxType","originalType","parentName"]),m=c(n),d=i,y=m["".concat(p,".").concat(d)]||m[d]||u[d]||s;return n?r.createElement(y,o(o({ref:t},l),{},{components:n})):r.createElement(y,o({ref:t},l))}));function d(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var s=n.length,o=new Array(s);o[0]=m;var a={};for(var p in t)hasOwnProperty.call(t,p)&&(a[p]=t[p]);a.originalType=e,a.mdxType="string"==typeof e?e:i,o[1]=a;for(var c=2;c<s;c++)o[c]=n[c];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},94114:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>o,default:()=>u,frontMatter:()=>s,metadata:()=>a,toc:()=>c});var r=n(87462),i=(n(67294),n(3905));const s={id:"ProximityPlacementGroup",title:"ProximityPlacementGroup"},o=void 0,a={unversionedId:"azure/resources/Compute/ProximityPlacementGroup",id:"azure/resources/Compute/ProximityPlacementGroup",title:"ProximityPlacementGroup",description:"Provides a ProximityPlacementGroup from the Compute group",source:"@site/docs/azure/resources/Compute/ProximityPlacementGroup.md",sourceDirName:"azure/resources/Compute",slug:"/azure/resources/Compute/ProximityPlacementGroup",permalink:"/docs/azure/resources/Compute/ProximityPlacementGroup",draft:!1,tags:[],version:"current",frontMatter:{id:"ProximityPlacementGroup",title:"ProximityPlacementGroup"},sidebar:"docs",previous:{title:"Image",permalink:"/docs/azure/resources/Compute/Image"},next:{title:"RestorePoint",permalink:"/docs/azure/resources/Compute/RestorePoint"}},p={},c=[{value:"Examples",id:"examples",level:2},{value:"Create or Update a proximity placement group.",id:"create-or-update-a-proximity-placement-group",level:3},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],l={toc:c};function u(e){let{components:t,...n}=e;return(0,i.kt)("wrapper",(0,r.Z)({},l,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Provides a ",(0,i.kt)("strong",{parentName:"p"},"ProximityPlacementGroup")," from the ",(0,i.kt)("strong",{parentName:"p"},"Compute")," group"),(0,i.kt)("h2",{id:"examples"},"Examples"),(0,i.kt)("h3",{id:"create-or-update-a-proximity-placement-group"},"Create or Update a proximity placement group."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "ProximityPlacementGroup",\n    group: "Compute",\n    name: "myProximityPlacementGroup",\n    properties: () => ({\n      location: "westus",\n      zones: ["1"],\n      properties: {\n        proximityPlacementGroupType: "Standard",\n        intent: { vmSizes: ["Basic_A0", "Basic_A2"] },\n      },\n    }),\n    dependencies: ({}) => ({ resourceGroup: "myResourceGroup" }),\n  },\n];\n\n')),(0,i.kt)("h2",{id:"dependencies"},"Dependencies"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup"))),(0,i.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json"},"{\n  properties: {\n    properties: {\n      'x-ms-client-flatten': true,\n      description: 'Describes the properties of a Proximity Placement Group.',\n      properties: {\n        proximityPlacementGroupType: {\n          type: 'string',\n          description: 'Specifies the type of the proximity placement group. <br><br> Possible values are: <br><br> **Standard** : Co-locate resources within an Azure region or Availability Zone. <br><br> **Ultra** : For future use.',\n          enum: [ 'Standard', 'Ultra' ],\n          'x-ms-enum': { name: 'ProximityPlacementGroupType', modelAsString: true }\n        },\n        virtualMachines: {\n          readOnly: true,\n          type: 'array',\n          items: {\n            allOf: [\n              {\n                properties: { id: { type: 'string', description: 'Resource Id' } },\n                'x-ms-azure-resource': true\n              }\n            ],\n            properties: {\n              colocationStatus: {\n                description: 'Describes colocation status of a resource in the Proximity Placement Group.',\n                properties: {\n                  code: { type: 'string', description: 'The status code.' },\n                  level: {\n                    type: 'string',\n                    description: 'The level code.',\n                    enum: [ 'Info', 'Warning', 'Error' ],\n                    'x-ms-enum': { name: 'StatusLevelTypes', modelAsString: false }\n                  },\n                  displayStatus: {\n                    type: 'string',\n                    description: 'The short localizable label for the status.'\n                  },\n                  message: {\n                    type: 'string',\n                    description: 'The detailed status message, including for alerts and error messages.'\n                  },\n                  time: {\n                    type: 'string',\n                    format: 'date-time',\n                    description: 'The time of the status.'\n                  }\n                }\n              }\n            }\n          },\n          description: 'A list of references to all virtual machines in the proximity placement group.'\n        },\n        virtualMachineScaleSets: {\n          readOnly: true,\n          type: 'array',\n          items: {\n            allOf: [\n              {\n                properties: { id: { type: 'string', description: 'Resource Id' } },\n                'x-ms-azure-resource': true\n              }\n            ],\n            properties: {\n              colocationStatus: {\n                description: 'Describes colocation status of a resource in the Proximity Placement Group.',\n                properties: {\n                  code: { type: 'string', description: 'The status code.' },\n                  level: {\n                    type: 'string',\n                    description: 'The level code.',\n                    enum: [ 'Info', 'Warning', 'Error' ],\n                    'x-ms-enum': { name: 'StatusLevelTypes', modelAsString: false }\n                  },\n                  displayStatus: {\n                    type: 'string',\n                    description: 'The short localizable label for the status.'\n                  },\n                  message: {\n                    type: 'string',\n                    description: 'The detailed status message, including for alerts and error messages.'\n                  },\n                  time: {\n                    type: 'string',\n                    format: 'date-time',\n                    description: 'The time of the status.'\n                  }\n                }\n              }\n            }\n          },\n          description: 'A list of references to all virtual machine scale sets in the proximity placement group.'\n        },\n        availabilitySets: {\n          readOnly: true,\n          type: 'array',\n          items: {\n            allOf: [\n              {\n                properties: { id: { type: 'string', description: 'Resource Id' } },\n                'x-ms-azure-resource': true\n              }\n            ],\n            properties: {\n              colocationStatus: {\n                description: 'Describes colocation status of a resource in the Proximity Placement Group.',\n                properties: {\n                  code: { type: 'string', description: 'The status code.' },\n                  level: {\n                    type: 'string',\n                    description: 'The level code.',\n                    enum: [ 'Info', 'Warning', 'Error' ],\n                    'x-ms-enum': { name: 'StatusLevelTypes', modelAsString: false }\n                  },\n                  displayStatus: {\n                    type: 'string',\n                    description: 'The short localizable label for the status.'\n                  },\n                  message: {\n                    type: 'string',\n                    description: 'The detailed status message, including for alerts and error messages.'\n                  },\n                  time: {\n                    type: 'string',\n                    format: 'date-time',\n                    description: 'The time of the status.'\n                  }\n                }\n              }\n            }\n          },\n          description: 'A list of references to all availability sets in the proximity placement group.'\n        },\n        colocationStatus: {\n          description: 'Describes colocation status of the Proximity Placement Group.',\n          properties: {\n            code: { type: 'string', description: 'The status code.' },\n            level: {\n              type: 'string',\n              description: 'The level code.',\n              enum: [ 'Info', 'Warning', 'Error' ],\n              'x-ms-enum': { name: 'StatusLevelTypes', modelAsString: false }\n            },\n            displayStatus: {\n              type: 'string',\n              description: 'The short localizable label for the status.'\n            },\n            message: {\n              type: 'string',\n              description: 'The detailed status message, including for alerts and error messages.'\n            },\n            time: {\n              type: 'string',\n              format: 'date-time',\n              description: 'The time of the status.'\n            }\n          }\n        },\n        intent: {\n          type: 'object',\n          properties: {\n            vmSizes: {\n              type: 'array',\n              description: 'Specifies possible sizes of virtual machines that can be created in the proximity placement group.',\n              items: {\n                type: 'string',\n                description: 'Specifies the size of the virtual machine. Recommended way to get the list of available sizes is using these APIs: <br><br> [List all available virtual machine sizes in an availability set](https://docs.microsoft.com/rest/api/compute/availabilitysets/listavailablesizes) <br><br> [List all available virtual machine sizes in a region]( https://docs.microsoft.com/rest/api/compute/resourceskus/list) <br><br> [List all available virtual machine sizes for resizing](https://docs.microsoft.com/rest/api/compute/virtualmachines/listavailablesizes). For more information about virtual machine sizes, see [Sizes for virtual machines](https://docs.microsoft.com/azure/virtual-machines/sizes). <br><br> The available VM sizes depend on region and availability set.'\n              }\n            }\n          },\n          description: 'Specifies the user intent of the proximity placement group.'\n        }\n      }\n    },\n    zones: {\n      type: 'array',\n      items: { type: 'string' },\n      description: 'Specifies the Availability Zone where virtual machine, virtual machine scale set or availability set associated with the  proximity placement group can be created.'\n    }\n  },\n  allOf: [\n    {\n      description: 'The Resource model definition.',\n      properties: {\n        id: { readOnly: true, type: 'string', description: 'Resource Id' },\n        name: {\n          readOnly: true,\n          type: 'string',\n          description: 'Resource name'\n        },\n        type: {\n          readOnly: true,\n          type: 'string',\n          description: 'Resource type'\n        },\n        location: { type: 'string', description: 'Resource location' },\n        tags: {\n          type: 'object',\n          additionalProperties: { type: 'string' },\n          description: 'Resource tags'\n        }\n      },\n      required: [ 'location' ],\n      'x-ms-azure-resource': true\n    }\n  ],\n  description: 'Specifies information about the proximity placement group.'\n}\n")),(0,i.kt)("h2",{id:"misc"},"Misc"),(0,i.kt)("p",null,"The resource version is ",(0,i.kt)("inlineCode",{parentName:"p"},"2022-03-01"),"."),(0,i.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/ComputeRP/stable/2022-03-01/proximityPlacementGroup.json"},"here"),"."))}u.isMDXComponent=!0}}]);