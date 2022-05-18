"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[3747],{3905:function(e,n,r){r.d(n,{Zo:function(){return u},kt:function(){return m}});var t=r(67294);function i(e,n,r){return n in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}function o(e,n){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),r.push.apply(r,t)}return r}function s(e){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?o(Object(r),!0).forEach((function(n){i(e,n,r[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))}))}return e}function a(e,n){if(null==e)return{};var r,t,i=function(e,n){if(null==e)return{};var r,t,i={},o=Object.keys(e);for(t=0;t<o.length;t++)r=o[t],n.indexOf(r)>=0||(i[r]=e[r]);return i}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(t=0;t<o.length;t++)r=o[t],n.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(i[r]=e[r])}return i}var p=t.createContext({}),c=function(e){var n=t.useContext(p),r=n;return e&&(r="function"==typeof e?e(n):s(s({},n),e)),r},u=function(e){var n=c(e.components);return t.createElement(p.Provider,{value:n},e.children)},l={inlineCode:"code",wrapper:function(e){var n=e.children;return t.createElement(t.Fragment,{},n)}},d=t.forwardRef((function(e,n){var r=e.components,i=e.mdxType,o=e.originalType,p=e.parentName,u=a(e,["components","mdxType","originalType","parentName"]),d=c(r),m=i,f=d["".concat(p,".").concat(m)]||d[m]||l[m]||o;return r?t.createElement(f,s(s({ref:n},u),{},{components:r})):t.createElement(f,s({ref:n},u))}));function m(e,n){var r=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var o=r.length,s=new Array(o);s[0]=d;var a={};for(var p in n)hasOwnProperty.call(n,p)&&(a[p]=n[p]);a.originalType=e,a.mdxType="string"==typeof e?e:i,s[1]=a;for(var c=2;c<o;c++)s[c]=r[c];return t.createElement.apply(null,s)}return t.createElement.apply(null,r)}d.displayName="MDXCreateElement"},83452:function(e,n,r){r.r(n),r.d(n,{frontMatter:function(){return a},contentTitle:function(){return p},metadata:function(){return c},toc:function(){return u},default:function(){return d}});var t=r(87462),i=r(63366),o=(r(67294),r(3905)),s=["components"],a={id:"AppServiceEnvironment",title:"AppServiceEnvironment"},p=void 0,c={unversionedId:"azure/resources/Web/AppServiceEnvironment",id:"azure/resources/Web/AppServiceEnvironment",isDocsHomePage:!1,title:"AppServiceEnvironment",description:"Provides a AppServiceEnvironment from the Web group",source:"@site/docs/azure/resources/Web/AppServiceEnvironment.md",sourceDirName:"azure/resources/Web",slug:"/azure/resources/Web/AppServiceEnvironment",permalink:"/docs/azure/resources/Web/AppServiceEnvironment",tags:[],version:"current",frontMatter:{id:"AppServiceEnvironment",title:"AppServiceEnvironment"},sidebar:"docs",previous:{title:"TableService",permalink:"/docs/azure/resources/Storage/TableService"},next:{title:"AppServiceEnvironmentAseV3NetworkingConfiguration",permalink:"/docs/azure/resources/Web/AppServiceEnvironmentAseV3NetworkingConfiguration"}},u=[{value:"Examples",id:"examples",children:[],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"Swagger Schema",id:"swagger-schema",children:[],level:2},{value:"Misc",id:"misc",children:[],level:2}],l={toc:u};function d(e){var n=e.components,r=(0,i.Z)(e,s);return(0,o.kt)("wrapper",(0,t.Z)({},l,r,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Provides a ",(0,o.kt)("strong",{parentName:"p"},"AppServiceEnvironment")," from the ",(0,o.kt)("strong",{parentName:"p"},"Web")," group"),(0,o.kt)("h2",{id:"examples"},"Examples"),(0,o.kt)("h2",{id:"dependencies"},"Dependencies"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Network/VirtualNetwork"},"VirtualNetwork"))),(0,o.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"{\n  description: 'App Service Environment ARM resource.',\n  type: 'object',\n  allOf: [\n    {\n      description: 'Azure resource. This resource is tracked in Azure Resource Manager',\n      required: [ 'location' ],\n      type: 'object',\n      properties: {\n        id: { description: 'Resource Id.', type: 'string', readOnly: true },\n        name: {\n          description: 'Resource Name.',\n          type: 'string',\n          readOnly: true\n        },\n        kind: { description: 'Kind of resource.', type: 'string' },\n        location: { description: 'Resource Location.', type: 'string' },\n        type: {\n          description: 'Resource type.',\n          type: 'string',\n          readOnly: true\n        },\n        tags: {\n          description: 'Resource tags.',\n          type: 'object',\n          additionalProperties: { type: 'string' }\n        }\n      },\n      'x-ms-azure-resource': true\n    }\n  ],\n  properties: {\n    properties: {\n      description: 'Core resource properties',\n      type: 'object',\n      'x-ms-client-flatten': true,\n      required: [ 'virtualNetwork' ],\n      properties: {\n        provisioningState: {\n          description: 'Provisioning state of the App Service Environment.',\n          enum: [\n            'Succeeded',\n            'Failed',\n            'Canceled',\n            'InProgress',\n            'Deleting'\n          ],\n          type: 'string',\n          readOnly: true,\n          'x-ms-enum': { name: 'ProvisioningState', modelAsString: false }\n        },\n        status: {\n          description: 'Current status of the App Service Environment.',\n          enum: [ 'Preparing', 'Ready', 'Scaling', 'Deleting' ],\n          type: 'string',\n          readOnly: true,\n          'x-ms-enum': { name: 'HostingEnvironmentStatus', modelAsString: false }\n        },\n        virtualNetwork: {\n          description: 'Description of the Virtual Network.',\n          required: [ 'id' ],\n          type: 'object',\n          properties: {\n            id: {\n              description: 'Resource id of the Virtual Network.',\n              type: 'string'\n            },\n            name: {\n              description: 'Name of the Virtual Network (read-only).',\n              type: 'string',\n              readOnly: true\n            },\n            type: {\n              description: 'Resource type of the Virtual Network (read-only).',\n              type: 'string',\n              readOnly: true\n            },\n            subnet: {\n              description: 'Subnet within the Virtual Network.',\n              type: 'string'\n            }\n          }\n        },\n        internalLoadBalancingMode: {\n          description: 'Specifies which endpoints to serve internally in the Virtual Network for the App Service Environment.',\n          enum: [ 'None', 'Web', 'Publishing', 'Web, Publishing' ],\n          type: 'string',\n          'x-ms-enum': { name: 'LoadBalancingMode', modelAsString: true }\n        },\n        multiSize: {\n          description: 'Front-end VM size, e.g. \"Medium\", \"Large\".',\n          type: 'string'\n        },\n        multiRoleCount: {\n          format: 'int32',\n          description: 'Number of front-end instances.',\n          type: 'integer',\n          readOnly: true\n        },\n        ipsslAddressCount: {\n          format: 'int32',\n          description: 'Number of IP SSL addresses reserved for the App Service Environment.',\n          type: 'integer'\n        },\n        dnsSuffix: {\n          description: 'DNS suffix of the App Service Environment.',\n          type: 'string'\n        },\n        maximumNumberOfMachines: {\n          format: 'int32',\n          description: 'Maximum number of VMs in the App Service Environment.',\n          type: 'integer',\n          readOnly: true\n        },\n        frontEndScaleFactor: {\n          format: 'int32',\n          description: 'Scale factor for front-ends.',\n          type: 'integer'\n        },\n        suspended: {\n          description: '<code>true</code> if the App Service Environment is suspended; otherwise, <code>false</code>. The environment can be suspended, e.g. when the management endpoint is no longer available\\n' +\n            ' (most likely because NSG blocked the incoming traffic).',\n          type: 'boolean',\n          readOnly: true\n        },\n        clusterSettings: {\n          description: 'Custom settings for changing the behavior of the App Service Environment.',\n          type: 'array',\n          items: {\n            description: 'Name value pair.',\n            type: 'object',\n            properties: {\n              name: { description: 'Pair name.', type: 'string' },\n              value: { description: 'Pair value.', type: 'string' }\n            }\n          },\n          'x-ms-identifiers': [ 'name' ]\n        },\n        userWhitelistedIpRanges: {\n          description: 'User added ip ranges to whitelist on ASE db',\n          type: 'array',\n          items: { type: 'string' }\n        },\n        hasLinuxWorkers: {\n          description: 'Flag that displays whether an ASE has linux workers or not',\n          type: 'boolean',\n          readOnly: true\n        },\n        dedicatedHostCount: {\n          format: 'int32',\n          description: 'Dedicated Host Count',\n          type: 'integer'\n        },\n        zoneRedundant: {\n          description: 'Whether or not this App Service Environment is zone-redundant.',\n          type: 'boolean'\n        }\n      }\n    }\n  }\n}\n")),(0,o.kt)("h2",{id:"misc"},"Misc"),(0,o.kt)("p",null,"The resource version is ",(0,o.kt)("inlineCode",{parentName:"p"},"2021-03-01"),"."),(0,o.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2021-03-01/AppServiceEnvironments.json"},"here"),"."))}d.isMDXComponent=!0}}]);