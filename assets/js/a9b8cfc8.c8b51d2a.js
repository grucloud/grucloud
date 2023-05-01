"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[32821],{3905:(e,n,r)=>{r.d(n,{Zo:()=>l,kt:()=>f});var t=r(67294);function i(e,n,r){return n in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}function o(e,n){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),r.push.apply(r,t)}return r}function a(e){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?o(Object(r),!0).forEach((function(n){i(e,n,r[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))}))}return e}function p(e,n){if(null==e)return{};var r,t,i=function(e,n){if(null==e)return{};var r,t,i={},o=Object.keys(e);for(t=0;t<o.length;t++)r=o[t],n.indexOf(r)>=0||(i[r]=e[r]);return i}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(t=0;t<o.length;t++)r=o[t],n.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(i[r]=e[r])}return i}var s=t.createContext({}),c=function(e){var n=t.useContext(s),r=n;return e&&(r="function"==typeof e?e(n):a(a({},n),e)),r},l=function(e){var n=c(e.components);return t.createElement(s.Provider,{value:n},e.children)},u="mdxType",d={inlineCode:"code",wrapper:function(e){var n=e.children;return t.createElement(t.Fragment,{},n)}},m=t.forwardRef((function(e,n){var r=e.components,i=e.mdxType,o=e.originalType,s=e.parentName,l=p(e,["components","mdxType","originalType","parentName"]),u=c(r),m=i,f=u["".concat(s,".").concat(m)]||u[m]||d[m]||o;return r?t.createElement(f,a(a({ref:n},l),{},{components:r})):t.createElement(f,a({ref:n},l))}));function f(e,n){var r=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var o=r.length,a=new Array(o);a[0]=m;var p={};for(var s in n)hasOwnProperty.call(n,s)&&(p[s]=n[s]);p.originalType=e,p[u]="string"==typeof e?e:i,a[1]=p;for(var c=2;c<o;c++)a[c]=r[c];return t.createElement.apply(null,a)}return t.createElement.apply(null,r)}m.displayName="MDXCreateElement"},5055:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>s,contentTitle:()=>a,default:()=>d,frontMatter:()=>o,metadata:()=>p,toc:()=>c});var t=r(87462),i=(r(67294),r(3905));const o={id:"AppServicePlan",title:"AppServicePlan"},a=void 0,p={unversionedId:"azure/resources/Web/AppServicePlan",id:"azure/resources/Web/AppServicePlan",title:"AppServicePlan",description:"Provides a AppServicePlan from the Web group",source:"@site/docs/azure/resources/Web/AppServicePlan.md",sourceDirName:"azure/resources/Web",slug:"/azure/resources/Web/AppServicePlan",permalink:"/docs/azure/resources/Web/AppServicePlan",draft:!1,tags:[],version:"current",frontMatter:{id:"AppServicePlan",title:"AppServicePlan"},sidebar:"docs",previous:{title:"AppServiceEnvironmentWorkerPool",permalink:"/docs/azure/resources/Web/AppServiceEnvironmentWorkerPool"},next:{title:"Certificate",permalink:"/docs/azure/resources/Web/Certificate"}},s={},c=[{value:"Examples",id:"examples",level:2},{value:"Create Or Update App Service plan",id:"create-or-update-app-service-plan",level:3},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],l={toc:c},u="wrapper";function d(e){let{components:n,...r}=e;return(0,i.kt)(u,(0,t.Z)({},l,r,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Provides a ",(0,i.kt)("strong",{parentName:"p"},"AppServicePlan")," from the ",(0,i.kt)("strong",{parentName:"p"},"Web")," group"),(0,i.kt)("h2",{id:"examples"},"Examples"),(0,i.kt)("h3",{id:"create-or-update-app-service-plan"},"Create Or Update App Service plan"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "AppServicePlan",\n    group: "Web",\n    name: "myAppServicePlan",\n    properties: () => ({\n      kind: "app",\n      location: "East US",\n      properties: {},\n      sku: {\n        name: "P1",\n        tier: "Premium",\n        size: "P1",\n        family: "P",\n        capacity: 1,\n      },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      hostingEnvironment: "myHostingEnvironment",\n    }),\n  },\n];\n\n')),(0,i.kt)("h2",{id:"dependencies"},"Dependencies"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Web/HostingEnvironment"},"HostingEnvironment"))),(0,i.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json"},"{\n  description: 'App Service plan.',\n  type: 'object',\n  allOf: [\n    {\n      description: 'Azure resource. This resource is tracked in Azure Resource Manager',\n      required: [ 'location' ],\n      type: 'object',\n      properties: {\n        id: { description: 'Resource Id.', type: 'string', readOnly: true },\n        name: {\n          description: 'Resource Name.',\n          type: 'string',\n          readOnly: true\n        },\n        kind: { description: 'Kind of resource.', type: 'string' },\n        location: { description: 'Resource Location.', type: 'string' },\n        type: {\n          description: 'Resource type.',\n          type: 'string',\n          readOnly: true\n        },\n        tags: {\n          description: 'Resource tags.',\n          type: 'object',\n          additionalProperties: { type: 'string' }\n        }\n      },\n      'x-ms-azure-resource': true\n    }\n  ],\n  properties: {\n    properties: {\n      description: 'AppServicePlan resource specific properties',\n      type: 'object',\n      properties: {\n        workerTierName: {\n          description: 'Target worker tier assigned to the App Service plan.',\n          type: 'string'\n        },\n        status: {\n          description: 'App Service plan status.',\n          enum: [ 'Ready', 'Pending', 'Creating' ],\n          type: 'string',\n          readOnly: true,\n          'x-ms-enum': { name: 'StatusOptions', modelAsString: false }\n        },\n        subscription: {\n          description: 'App Service plan subscription.',\n          type: 'string',\n          readOnly: true\n        },\n        hostingEnvironmentProfile: {\n          description: 'Specification for the App Service Environment to use for the App Service plan.',\n          'x-ms-mutability': [ 'create', 'read' ],\n          type: 'object',\n          properties: {\n            id: {\n              description: 'Resource ID of the App Service Environment.',\n              type: 'string'\n            },\n            name: {\n              description: 'Name of the App Service Environment.',\n              type: 'string',\n              readOnly: true\n            },\n            type: {\n              description: 'Resource type of the App Service Environment.',\n              type: 'string',\n              readOnly: true\n            }\n          }\n        },\n        maximumNumberOfWorkers: {\n          format: 'int32',\n          description: 'Maximum number of instances that can be assigned to this App Service plan.',\n          type: 'integer',\n          readOnly: true\n        },\n        numberOfWorkers: {\n          format: 'int32',\n          description: 'The number of instances that are assigned to this App Service plan.',\n          type: 'integer',\n          readOnly: true\n        },\n        geoRegion: {\n          description: 'Geographical location for the App Service plan.',\n          type: 'string',\n          readOnly: true\n        },\n        perSiteScaling: {\n          description: 'If <code>true</code>, apps assigned to this App Service plan can be scaled independently.\\n' +\n            'If <code>false</code>, apps assigned to this App Service plan will scale to all instances of the plan.',\n          default: false,\n          type: 'boolean'\n        },\n        elasticScaleEnabled: {\n          description: 'ServerFarm supports ElasticScale. Apps in this plan will scale as if the ServerFarm was ElasticPremium sku',\n          type: 'boolean'\n        },\n        maximumElasticWorkerCount: {\n          format: 'int32',\n          description: 'Maximum number of total workers allowed for this ElasticScaleEnabled App Service Plan',\n          type: 'integer'\n        },\n        numberOfSites: {\n          format: 'int32',\n          description: 'Number of apps assigned to this App Service plan.',\n          type: 'integer',\n          readOnly: true\n        },\n        isSpot: {\n          description: 'If <code>true</code>, this App Service Plan owns spot instances.',\n          type: 'boolean'\n        },\n        spotExpirationTime: {\n          format: 'date-time',\n          description: 'The time when the server farm expires. Valid only if it is a spot server farm.',\n          type: 'string'\n        },\n        freeOfferExpirationTime: {\n          format: 'date-time',\n          description: 'The time when the server farm free offer expires.',\n          type: 'string'\n        },\n        resourceGroup: {\n          description: 'Resource group of the App Service plan.',\n          type: 'string',\n          readOnly: true\n        },\n        reserved: {\n          description: 'If Linux app service plan <code>true</code>, <code>false</code> otherwise.',\n          default: false,\n          type: 'boolean',\n          'x-ms-mutability': [ 'create', 'read' ]\n        },\n        isXenon: {\n          description: 'Obsolete: If Hyper-V container app service plan <code>true</code>, <code>false</code> otherwise.',\n          default: false,\n          type: 'boolean',\n          'x-ms-mutability': [ 'create', 'read' ]\n        },\n        hyperV: {\n          description: 'If Hyper-V container app service plan <code>true</code>, <code>false</code> otherwise.',\n          default: false,\n          type: 'boolean',\n          'x-ms-mutability': [ 'create', 'read' ]\n        },\n        targetWorkerCount: {\n          format: 'int32',\n          description: 'Scaling worker count.',\n          type: 'integer'\n        },\n        targetWorkerSizeId: {\n          format: 'int32',\n          description: 'Scaling worker size ID.',\n          type: 'integer'\n        },\n        provisioningState: {\n          description: 'Provisioning state of the App Service Plan.',\n          enum: [\n            'Succeeded',\n            'Failed',\n            'Canceled',\n            'InProgress',\n            'Deleting'\n          ],\n          type: 'string',\n          readOnly: true,\n          'x-ms-enum': { name: 'ProvisioningState', modelAsString: false }\n        },\n        kubeEnvironmentProfile: {\n          description: 'Specification for the Kubernetes Environment to use for the App Service plan.',\n          type: 'object',\n          properties: {\n            id: {\n              description: 'Resource ID of the Kubernetes Environment.',\n              type: 'string'\n            },\n            name: {\n              description: 'Name of the Kubernetes Environment.',\n              type: 'string',\n              readOnly: true\n            },\n            type: {\n              description: 'Resource type of the Kubernetes Environment.',\n              type: 'string',\n              readOnly: true\n            }\n          }\n        },\n        zoneRedundant: {\n          description: 'If <code>true</code>, this App Service Plan will perform availability zone balancing.\\n' +\n            'If <code>false</code>, this App Service Plan will not perform availability zone balancing.',\n          default: false,\n          type: 'boolean'\n        }\n      },\n      'x-ms-client-flatten': true\n    },\n    sku: {\n      description: 'Description of a SKU for a scalable resource.',\n      type: 'object',\n      properties: {\n        name: { description: 'Name of the resource SKU.', type: 'string' },\n        tier: {\n          description: 'Service tier of the resource SKU.',\n          type: 'string'\n        },\n        size: {\n          description: 'Size specifier of the resource SKU.',\n          type: 'string'\n        },\n        family: {\n          description: 'Family code of the resource SKU.',\n          type: 'string'\n        },\n        capacity: {\n          format: 'int32',\n          description: 'Current number of instances assigned to the resource.',\n          type: 'integer'\n        },\n        skuCapacity: {\n          description: 'Min, max, and default scale values of the SKU.',\n          type: 'object',\n          properties: {\n            minimum: {\n              format: 'int32',\n              description: 'Minimum number of workers for this App Service plan SKU.',\n              type: 'integer'\n            },\n            maximum: {\n              format: 'int32',\n              description: 'Maximum number of workers for this App Service plan SKU.',\n              type: 'integer'\n            },\n            elasticMaximum: {\n              format: 'int32',\n              description: 'Maximum number of Elastic workers for this App Service plan SKU.',\n              type: 'integer'\n            },\n            default: {\n              format: 'int32',\n              description: 'Default number of workers for this App Service plan SKU.',\n              type: 'integer'\n            },\n            scaleType: {\n              description: 'Available scale configurations for an App Service plan.',\n              type: 'string'\n            }\n          }\n        },\n        locations: {\n          description: 'Locations of the SKU.',\n          type: 'array',\n          items: { type: 'string' }\n        },\n        capabilities: {\n          description: 'Capabilities of the SKU, e.g., is traffic manager enabled?',\n          type: 'array',\n          items: {\n            description: 'Describes the capabilities/features allowed for a specific SKU.',\n            type: 'object',\n            properties: {\n              name: {\n                description: 'Name of the SKU capability.',\n                type: 'string'\n              },\n              value: {\n                description: 'Value of the SKU capability.',\n                type: 'string'\n              },\n              reason: {\n                description: 'Reason of the SKU capability.',\n                type: 'string'\n              }\n            }\n          },\n          'x-ms-identifiers': [ 'name' ]\n        }\n      }\n    },\n    extendedLocation: {\n      description: 'Extended Location.',\n      type: 'object',\n      properties: {\n        name: { description: 'Name of extended location.', type: 'string' },\n        type: {\n          description: 'Type of extended location.',\n          type: 'string',\n          readOnly: true\n        }\n      }\n    }\n  }\n}\n")),(0,i.kt)("h2",{id:"misc"},"Misc"),(0,i.kt)("p",null,"The resource version is ",(0,i.kt)("inlineCode",{parentName:"p"},"2022-03-01"),"."),(0,i.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2022-03-01/AppServicePlans.json"},"here"),"."))}d.isMDXComponent=!0}}]);