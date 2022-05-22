"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[19218],{3905:function(e,r,t){t.d(r,{Zo:function(){return u},kt:function(){return y}});var n=t(67294);function o(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function s(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function i(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?s(Object(t),!0).forEach((function(r){o(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):s(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function a(e,r){if(null==e)return{};var t,n,o=function(e,r){if(null==e)return{};var t,n,o={},s=Object.keys(e);for(n=0;n<s.length;n++)t=s[n],r.indexOf(t)>=0||(o[t]=e[t]);return o}(e,r);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(n=0;n<s.length;n++)t=s[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var c=n.createContext({}),l=function(e){var r=n.useContext(c),t=r;return e&&(t="function"==typeof e?e(r):i(i({},r),e)),t},u=function(e){var r=l(e.components);return n.createElement(c.Provider,{value:r},e.children)},p={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},d=n.forwardRef((function(e,r){var t=e.components,o=e.mdxType,s=e.originalType,c=e.parentName,u=a(e,["components","mdxType","originalType","parentName"]),d=l(t),y=o,m=d["".concat(c,".").concat(y)]||d[y]||p[y]||s;return t?n.createElement(m,i(i({ref:r},u),{},{components:t})):n.createElement(m,i({ref:r},u))}));function y(e,r){var t=arguments,o=r&&r.mdxType;if("string"==typeof e||o){var s=t.length,i=new Array(s);i[0]=d;var a={};for(var c in r)hasOwnProperty.call(r,c)&&(a[c]=r[c]);a.originalType=e,a.mdxType="string"==typeof e?e:o,i[1]=a;for(var l=2;l<s;l++)i[l]=t[l];return n.createElement.apply(null,i)}return n.createElement.apply(null,t)}d.displayName="MDXCreateElement"},90465:function(e,r,t){t.r(r),t.d(r,{frontMatter:function(){return a},contentTitle:function(){return c},metadata:function(){return l},toc:function(){return u},default:function(){return d}});var n=t(87462),o=t(63366),s=(t(67294),t(3905)),i=["components"],a={id:"ServerSecurityAlertPolicy",title:"ServerSecurityAlertPolicy"},c=void 0,l={unversionedId:"azure/resources/DBforPostgreSQL/ServerSecurityAlertPolicy",id:"azure/resources/DBforPostgreSQL/ServerSecurityAlertPolicy",isDocsHomePage:!1,title:"ServerSecurityAlertPolicy",description:"Provides a ServerSecurityAlertPolicy from the DBforPostgreSQL group",source:"@site/docs/azure/resources/DBforPostgreSQL/ServerSecurityAlertPolicy.md",sourceDirName:"azure/resources/DBforPostgreSQL",slug:"/azure/resources/DBforPostgreSQL/ServerSecurityAlertPolicy",permalink:"/docs/azure/resources/DBforPostgreSQL/ServerSecurityAlertPolicy",tags:[],version:"current",frontMatter:{id:"ServerSecurityAlertPolicy",title:"ServerSecurityAlertPolicy"},sidebar:"docs",previous:{title:"ServerKey",permalink:"/docs/azure/resources/DBforPostgreSQL/ServerKey"},next:{title:"VirtualNetworkRule",permalink:"/docs/azure/resources/DBforPostgreSQL/VirtualNetworkRule"}},u=[{value:"Examples",id:"examples",children:[{value:"Update a server&#39;s threat detection policy with all parameters",id:"update-a-servers-threat-detection-policy-with-all-parameters",children:[],level:3},{value:"Update a server&#39;s threat detection policy with minimal parameters",id:"update-a-servers-threat-detection-policy-with-minimal-parameters",children:[],level:3}],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"Swagger Schema",id:"swagger-schema",children:[],level:2},{value:"Misc",id:"misc",children:[],level:2}],p={toc:u};function d(e){var r=e.components,t=(0,o.Z)(e,i);return(0,s.kt)("wrapper",(0,n.Z)({},p,t,{components:r,mdxType:"MDXLayout"}),(0,s.kt)("p",null,"Provides a ",(0,s.kt)("strong",{parentName:"p"},"ServerSecurityAlertPolicy")," from the ",(0,s.kt)("strong",{parentName:"p"},"DBforPostgreSQL")," group"),(0,s.kt)("h2",{id:"examples"},"Examples"),(0,s.kt)("h3",{id:"update-a-servers-threat-detection-policy-with-all-parameters"},"Update a server's threat detection policy with all parameters"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js"},'provider.DBforPostgreSQL.makeServerSecurityAlertPolicy({\n  name: "myServerSecurityAlertPolicy",\n  properties: () => ({\n    properties: {\n      state: "Enabled",\n      emailAccountAdmins: true,\n      emailAddresses: ["testSecurityAlert@microsoft.com"],\n      disabledAlerts: ["Access_Anomaly", "Usage_Anomaly"],\n      retentionDays: 5,\n      storageAccountAccessKey:\n        "sdlfkjabc+sdlfkjsdlkfsjdfLDKFTERLKFDFKLjsdfksjdflsdkfD2342309432849328476458/3RSD==",\n      storageEndpoint: "https://mystorage.blob.core.windows.net",\n    },\n  }),\n  dependencies: ({ resources }) => ({\n    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],\n    server: resources.DBforPostgreSQL.Server["myServer"],\n  }),\n});\n\n')),(0,s.kt)("h3",{id:"update-a-servers-threat-detection-policy-with-minimal-parameters"},"Update a server's threat detection policy with minimal parameters"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js"},'provider.DBforPostgreSQL.makeServerSecurityAlertPolicy({\n  name: "myServerSecurityAlertPolicy",\n  properties: () => ({\n    properties: { state: "Disabled", emailAccountAdmins: true },\n  }),\n  dependencies: ({ resources }) => ({\n    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],\n    server: resources.DBforPostgreSQL.Server["myServer"],\n  }),\n});\n\n')),(0,s.kt)("h2",{id:"dependencies"},"Dependencies"),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"/docs/azure/resources/DBforPostgreSQL/Server"},"Server"))),(0,s.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js"},"{\n  description: 'A server security alert policy.',\n  type: 'object',\n  allOf: [\n    {\n      title: 'Proxy Resource',\n      description: 'The resource model definition for a Azure Resource Manager proxy resource. It will not have tags and a location',\n      type: 'object',\n      allOf: [\n        {\n          title: 'Resource',\n          description: 'Common fields that are returned in the response for all Azure Resource Manager resources',\n          type: 'object',\n          properties: {\n            id: {\n              readOnly: true,\n              type: 'string',\n              description: 'Fully qualified resource ID for the resource. Ex - /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/{resourceType}/{resourceName}'\n            },\n            name: {\n              readOnly: true,\n              type: 'string',\n              description: 'The name of the resource'\n            },\n            type: {\n              readOnly: true,\n              type: 'string',\n              description: 'The type of the resource. E.g. \"Microsoft.Compute/virtualMachines\" or \"Microsoft.Storage/storageAccounts\"'\n            }\n          },\n          'x-ms-azure-resource': true\n        }\n      ]\n    }\n  ],\n  properties: {\n    properties: {\n      description: 'Resource properties.',\n      'x-ms-client-flatten': true,\n      required: [ 'state' ],\n      type: 'object',\n      properties: {\n        state: {\n          description: 'Specifies the state of the policy, whether it is enabled or disabled.',\n          enum: [ 'Enabled', 'Disabled' ],\n          type: 'string',\n          'x-ms-enum': {\n            name: 'ServerSecurityAlertPolicyState',\n            modelAsString: false\n          }\n        },\n        disabledAlerts: {\n          description: 'Specifies an array of alerts that are disabled. Allowed values are: Sql_Injection, Sql_Injection_Vulnerability, Access_Anomaly',\n          type: 'array',\n          items: { type: 'string' }\n        },\n        emailAddresses: {\n          description: 'Specifies an array of e-mail addresses to which the alert is sent.',\n          type: 'array',\n          items: { type: 'string' }\n        },\n        emailAccountAdmins: {\n          description: 'Specifies that the alert is sent to the account administrators.',\n          type: 'boolean'\n        },\n        storageEndpoint: {\n          description: 'Specifies the blob storage endpoint (e.g. https://MyAccount.blob.core.windows.net). This blob storage will hold all Threat Detection audit logs.',\n          type: 'string'\n        },\n        storageAccountAccessKey: {\n          description: 'Specifies the identifier key of the Threat Detection audit storage account.',\n          type: 'string'\n        },\n        retentionDays: {\n          format: 'int32',\n          description: 'Specifies the number of days to keep in the Threat Detection audit logs.',\n          type: 'integer'\n        }\n      }\n    }\n  }\n}\n")),(0,s.kt)("h2",{id:"misc"},"Misc"),(0,s.kt)("p",null,"The resource version is ",(0,s.kt)("inlineCode",{parentName:"p"},"2017-12-01"),"."),(0,s.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,s.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/postgresql/resource-manager/Microsoft.DBforPostgreSQL/stable/2017-12-01/ServerSecurityAlertPolicies.json"},"here"),"."))}d.isMDXComponent=!0}}]);