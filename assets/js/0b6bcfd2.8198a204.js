"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[44652],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>d});var r=n(67294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var l=r.createContext({}),c=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},p=function(e){var t=c(e.components);return r.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,a=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),m=c(n),d=i,y=m["".concat(l,".").concat(d)]||m[d]||u[d]||a;return n?r.createElement(y,o(o({ref:t},p),{},{components:n})):r.createElement(y,o({ref:t},p))}));function d(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var a=n.length,o=new Array(a);o[0]=m;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:i,o[1]=s;for(var c=2;c<a;c++)o[c]=n[c];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},81469:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>o,default:()=>u,frontMatter:()=>a,metadata:()=>s,toc:()=>c});var r=n(87462),i=(n(67294),n(3905));const a={id:"AvailabilitySet",title:"AvailabilitySet"},o=void 0,s={unversionedId:"azure/resources/Compute/AvailabilitySet",id:"azure/resources/Compute/AvailabilitySet",title:"AvailabilitySet",description:"Provides a AvailabilitySet from the Compute group",source:"@site/docs/azure/resources/Compute/AvailabilitySet.md",sourceDirName:"azure/resources/Compute",slug:"/azure/resources/Compute/AvailabilitySet",permalink:"/docs/azure/resources/Compute/AvailabilitySet",draft:!1,tags:[],version:"current",frontMatter:{id:"AvailabilitySet",title:"AvailabilitySet"},sidebar:"docs",previous:{title:"AppServiceCertificateOrderCertificate",permalink:"/docs/azure/resources/CertificateRegistration/AppServiceCertificateOrderCertificate"},next:{title:"CapacityReservation",permalink:"/docs/azure/resources/Compute/CapacityReservation"}},l={},c=[{value:"Examples",id:"examples",level:2},{value:"Create an availability set.",id:"create-an-availability-set",level:3},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],p={toc:c};function u(e){let{components:t,...n}=e;return(0,i.kt)("wrapper",(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Provides a ",(0,i.kt)("strong",{parentName:"p"},"AvailabilitySet")," from the ",(0,i.kt)("strong",{parentName:"p"},"Compute")," group"),(0,i.kt)("h2",{id:"examples"},"Examples"),(0,i.kt)("h3",{id:"create-an-availability-set"},"Create an availability set."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "AvailabilitySet",\n    group: "Compute",\n    name: "myAvailabilitySet",\n    properties: () => ({\n      location: "westus",\n      properties: {\n        platformFaultDomainCount: 2,\n        platformUpdateDomainCount: 20,\n      },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      virtualMachines: ["myVirtualMachine"],\n      proximityPlacementGroup: "myProximityPlacementGroup",\n    }),\n  },\n];\n\n')),(0,i.kt)("h2",{id:"dependencies"},"Dependencies"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Compute/VirtualMachine"},"VirtualMachine")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Compute/ProximityPlacementGroup"},"ProximityPlacementGroup"))),(0,i.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"{\n  properties: {\n    properties: {\n      'x-ms-client-flatten': true,\n      properties: {\n        platformUpdateDomainCount: {\n          type: 'integer',\n          format: 'int32',\n          description: 'Update Domain count.'\n        },\n        platformFaultDomainCount: {\n          type: 'integer',\n          format: 'int32',\n          description: 'Fault Domain count.'\n        },\n        virtualMachines: {\n          type: 'array',\n          items: {\n            properties: { id: { type: 'string', description: 'Resource Id' } },\n            'x-ms-azure-resource': true\n          },\n          description: 'A list of references to all virtual machines in the availability set.'\n        },\n        proximityPlacementGroup: {\n          description: 'Specifies information about the proximity placement group that the availability set should be assigned to. <br><br>Minimum api-version: 2018-04-01.',\n          properties: { id: { type: 'string', description: 'Resource Id' } },\n          'x-ms-azure-resource': true\n        },\n        statuses: {\n          readOnly: true,\n          type: 'array',\n          items: {\n            properties: {\n              code: { type: 'string', description: 'The status code.' },\n              level: {\n                type: 'string',\n                description: 'The level code.',\n                enum: [ 'Info', 'Warning', 'Error' ],\n                'x-ms-enum': { name: 'StatusLevelTypes', modelAsString: false }\n              },\n              displayStatus: {\n                type: 'string',\n                description: 'The short localizable label for the status.'\n              },\n              message: {\n                type: 'string',\n                description: 'The detailed status message, including for alerts and error messages.'\n              },\n              time: {\n                type: 'string',\n                format: 'date-time',\n                description: 'The time of the status.'\n              }\n            },\n            description: 'Instance view status.'\n          },\n          'x-ms-identifiers': [],\n          description: 'The resource status information.'\n        }\n      },\n      description: 'The instance view of a resource.'\n    },\n    sku: {\n      description: \"Sku of the availability set, only name is required to be set. See AvailabilitySetSkuTypes for possible set of values. Use 'Aligned' for virtual machines with managed disks and 'Classic' for virtual machines with unmanaged disks. Default value is 'Classic'.\",\n      properties: {\n        name: { type: 'string', description: 'The sku name.' },\n        tier: {\n          type: 'string',\n          description: 'Specifies the tier of virtual machines in a scale set.<br /><br /> Possible Values:<br /><br /> **Standard**<br /><br /> **Basic**'\n        },\n        capacity: {\n          type: 'integer',\n          format: 'int64',\n          description: 'Specifies the number of virtual machines in the scale set.'\n        }\n      }\n    }\n  },\n  allOf: [\n    {\n      description: 'The Resource model definition.',\n      properties: {\n        id: { readOnly: true, type: 'string', description: 'Resource Id' },\n        name: {\n          readOnly: true,\n          type: 'string',\n          description: 'Resource name'\n        },\n        type: {\n          readOnly: true,\n          type: 'string',\n          description: 'Resource type'\n        },\n        location: { type: 'string', description: 'Resource location' },\n        tags: {\n          type: 'object',\n          additionalProperties: { type: 'string' },\n          description: 'Resource tags'\n        }\n      },\n      required: [ 'location' ],\n      'x-ms-azure-resource': true\n    }\n  ],\n  description: 'Specifies information about the availability set that the virtual machine should be assigned to. Virtual machines specified in the same availability set are allocated to different nodes to maximize availability. For more information about availability sets, see [Availability sets overview](https://docs.microsoft.com/azure/virtual-machines/availability-set-overview). <br><br> For more information on Azure planned maintenance, see [Maintenance and updates for Virtual Machines in Azure](https://docs.microsoft.com/azure/virtual-machines/maintenance-and-updates) <br><br> Currently, a VM can only be added to availability set at creation time. An existing VM cannot be added to an availability set.'\n}\n")),(0,i.kt)("h2",{id:"misc"},"Misc"),(0,i.kt)("p",null,"The resource version is ",(0,i.kt)("inlineCode",{parentName:"p"},"2022-03-01"),"."),(0,i.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/ComputeRP/stable/2022-03-01/availabilitySet.json"},"here"),"."))}u.isMDXComponent=!0}}]);