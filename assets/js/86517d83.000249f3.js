"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[8940],{3905:function(e,n,t){t.d(n,{Zo:function(){return d},kt:function(){return l}});var r=t(67294);function i(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function s(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){i(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function c(e,n){if(null==e)return{};var t,r,i=function(e,n){if(null==e)return{};var t,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||(i[t]=e[t]);return i}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var a=r.createContext({}),p=function(e){var n=r.useContext(a),t=n;return e&&(t="function"==typeof e?e(n):s(s({},n),e)),t},d=function(e){var n=p(e.components);return r.createElement(a.Provider,{value:n},e.children)},u={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},y=r.forwardRef((function(e,n){var t=e.components,i=e.mdxType,o=e.originalType,a=e.parentName,d=c(e,["components","mdxType","originalType","parentName"]),y=p(t),l=i,g=y["".concat(a,".").concat(l)]||y[l]||u[l]||o;return t?r.createElement(g,s(s({ref:n},d),{},{components:t})):r.createElement(g,s({ref:n},d))}));function l(e,n){var t=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var o=t.length,s=new Array(o);s[0]=y;var c={};for(var a in n)hasOwnProperty.call(n,a)&&(c[a]=n[a]);c.originalType=e,c.mdxType="string"==typeof e?e:i,s[1]=c;for(var p=2;p<o;p++)s[p]=t[p];return r.createElement.apply(null,s)}return r.createElement.apply(null,t)}y.displayName="MDXCreateElement"},81835:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return c},contentTitle:function(){return a},metadata:function(){return p},toc:function(){return d},default:function(){return y}});var r=t(87462),i=t(63366),o=(t(67294),t(3905)),s=["components"],c={id:"ConnectedRegistry",title:"ConnectedRegistry"},a=void 0,p={unversionedId:"azure/resources/ContainerRegistry/ConnectedRegistry",id:"azure/resources/ContainerRegistry/ConnectedRegistry",isDocsHomePage:!1,title:"ConnectedRegistry",description:"Provides a ConnectedRegistry from the ContainerRegistry group",source:"@site/docs/azure/resources/ContainerRegistry/ConnectedRegistry.md",sourceDirName:"azure/resources/ContainerRegistry",slug:"/azure/resources/ContainerRegistry/ConnectedRegistry",permalink:"/docs/azure/resources/ContainerRegistry/ConnectedRegistry",tags:[],version:"current",frontMatter:{id:"ConnectedRegistry",title:"ConnectedRegistry"},sidebar:"docs",previous:{title:"BuildTask",permalink:"/docs/azure/resources/ContainerRegistry/BuildTask"},next:{title:"ExportPipeline",permalink:"/docs/azure/resources/ContainerRegistry/ExportPipeline"}},d=[{value:"Examples",id:"examples",children:[{value:"ConnectedRegistryCreate",id:"connectedregistrycreate",children:[],level:3}],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"Swagger Schema",id:"swagger-schema",children:[],level:2},{value:"Misc",id:"misc",children:[],level:2}],u={toc:d};function y(e){var n=e.components,t=(0,i.Z)(e,s);return(0,o.kt)("wrapper",(0,r.Z)({},u,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Provides a ",(0,o.kt)("strong",{parentName:"p"},"ConnectedRegistry")," from the ",(0,o.kt)("strong",{parentName:"p"},"ContainerRegistry")," group"),(0,o.kt)("h2",{id:"examples"},"Examples"),(0,o.kt)("h3",{id:"connectedregistrycreate"},"ConnectedRegistryCreate"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'provider.ContainerRegistry.makeConnectedRegistry({\n  name: "myConnectedRegistry",\n  properties: () => ({\n    properties: {\n      mode: "ReadWrite",\n      parent: {\n        syncProperties: {\n          tokenId:\n            "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.ContainerRegistry/registries/myRegistry/tokens/syncToken",\n          schedule: "0 9 * * *",\n          messageTtl: "P2D",\n          syncWindow: "PT3H",\n        },\n      },\n      clientTokenIds: [\n        "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.ContainerRegistry/registries/myRegistry/tokens/client1Token",\n      ],\n      notificationsList: ["hello-world:*:*", "sample/repo/*:1.0:*"],\n    },\n  }),\n  dependencies: ({ resources }) => ({\n    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],\n    registry: resources.ContainerRegistry.Registry["myRegistry"],\n  }),\n});\n\n')),(0,o.kt)("h2",{id:"dependencies"},"Dependencies"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/ContainerRegistry/Registry"},"Registry"))),(0,o.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"{\n  description: 'An object that represents a connected registry for a container registry.',\n  type: 'object',\n  allOf: [\n    {\n      description: 'The resource model definition for a ARM proxy resource. It will have everything other than required location and tags.',\n      properties: {\n        id: {\n          description: 'The resource ID.',\n          type: 'string',\n          readOnly: true\n        },\n        name: {\n          description: 'The name of the resource.',\n          type: 'string',\n          readOnly: true\n        },\n        type: {\n          description: 'The type of the resource.',\n          type: 'string',\n          readOnly: true\n        },\n        systemData: {\n          description: 'Metadata pertaining to creation and last modification of the resource.',\n          type: 'object',\n          readOnly: true,\n          properties: {\n            createdBy: {\n              description: 'The identity that created the resource.',\n              type: 'string'\n            },\n            createdByType: {\n              description: 'The type of identity that created the resource.',\n              enum: [ 'User', 'Application', 'ManagedIdentity', 'Key' ],\n              type: 'string',\n              'x-ms-enum': { name: 'createdByType', modelAsString: true }\n            },\n            createdAt: {\n              format: 'date-time',\n              description: 'The timestamp of resource creation (UTC).',\n              type: 'string'\n            },\n            lastModifiedBy: {\n              description: 'The identity that last modified the resource.',\n              type: 'string'\n            },\n            lastModifiedByType: {\n              description: 'The type of identity that last modified the resource.',\n              enum: [ 'User', 'Application', 'ManagedIdentity', 'Key' ],\n              type: 'string',\n              'x-ms-enum': { name: 'lastModifiedByType', modelAsString: true }\n            },\n            lastModifiedAt: {\n              format: 'date-time',\n              description: 'The timestamp of resource modification (UTC).',\n              type: 'string'\n            }\n          }\n        }\n      },\n      'x-ms-azure-resource': true\n    }\n  ],\n  properties: {\n    properties: {\n      description: 'The properties of the connected registry.',\n      'x-ms-client-flatten': true,\n      required: [ 'mode', 'parent' ],\n      type: 'object',\n      properties: {\n        provisioningState: {\n          description: 'Provisioning state of the resource.',\n          enum: [\n            'Creating',\n            'Updating',\n            'Deleting',\n            'Succeeded',\n            'Failed',\n            'Canceled'\n          ],\n          type: 'string',\n          readOnly: true,\n          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }\n        },\n        mode: {\n          description: 'The mode of the connected registry resource that indicates the permissions of the registry.',\n          enum: [ 'ReadWrite', 'ReadOnly', 'Registry', 'Mirror' ],\n          type: 'string',\n          'x-ms-enum': { name: 'ConnectedRegistryMode', modelAsString: true }\n        },\n        version: {\n          description: 'The current version of ACR runtime on the connected registry.',\n          type: 'string',\n          readOnly: true\n        },\n        connectionState: {\n          description: 'The current connection state of the connected registry.',\n          enum: [ 'Online', 'Offline', 'Syncing', 'Unhealthy' ],\n          type: 'string',\n          readOnly: true,\n          'x-ms-enum': { name: 'ConnectionState', modelAsString: true }\n        },\n        lastActivityTime: {\n          format: 'date-time',\n          description: 'The last activity time of the connected registry.',\n          type: 'string',\n          readOnly: true\n        },\n        activation: {\n          description: 'The activation properties of the connected registry.',\n          readOnly: true,\n          type: 'object',\n          properties: {\n            status: {\n              description: 'The activation status of the connected registry.',\n              enum: [ 'Active', 'Inactive' ],\n              type: 'string',\n              readOnly: true,\n              'x-ms-enum': { name: 'ActivationStatus', modelAsString: true }\n            }\n          }\n        },\n        parent: {\n          description: 'The parent of the connected registry.',\n          required: [ 'syncProperties' ],\n          type: 'object',\n          properties: {\n            id: {\n              description: 'The resource ID of the parent to which the connected registry will be associated.',\n              type: 'string'\n            },\n            syncProperties: {\n              description: 'The sync properties of the connected registry with its parent.',\n              required: [ 'tokenId', 'messageTtl' ],\n              type: 'object',\n              properties: {\n                tokenId: {\n                  description: 'The resource ID of the ACR token used to authenticate the connected registry to its parent during sync.',\n                  type: 'string'\n                },\n                schedule: {\n                  description: 'The cron expression indicating the schedule that the connected registry will sync with its parent.',\n                  type: 'string'\n                },\n                syncWindow: {\n                  format: 'duration',\n                  description: 'The time window during which sync is enabled for each schedule occurrence. Specify the duration using the format P[n]Y[n]M[n]DT[n]H[n]M[n]S as per ISO8601.',\n                  type: 'string'\n                },\n                messageTtl: {\n                  format: 'duration',\n                  description: 'The period of time for which a message is available to sync before it is expired. Specify the duration using the format P[n]Y[n]M[n]DT[n]H[n]M[n]S as per ISO8601.',\n                  type: 'string'\n                },\n                lastSyncTime: {\n                  format: 'date-time',\n                  description: 'The last time a sync occurred between the connected registry and its parent.',\n                  type: 'string',\n                  readOnly: true\n                },\n                gatewayEndpoint: {\n                  description: 'The gateway endpoint used by the connected registry to communicate with its parent.',\n                  type: 'string',\n                  readOnly: true\n                }\n              }\n            }\n          }\n        },\n        clientTokenIds: {\n          description: 'The list of the ACR token resource IDs used to authenticate clients to the connected registry.',\n          type: 'array',\n          items: { type: 'string' }\n        },\n        loginServer: {\n          description: 'The login server properties of the connected registry.',\n          type: 'object',\n          properties: {\n            host: {\n              description: 'The host of the connected registry. Can be FQDN or IP.',\n              type: 'string',\n              readOnly: true\n            },\n            tls: {\n              description: 'The TLS properties of the connected registry login server.',\n              readOnly: true,\n              type: 'object',\n              properties: {\n                status: {\n                  description: 'Indicates whether HTTPS is enabled for the login server.',\n                  enum: [ 'Enabled', 'Disabled' ],\n                  type: 'string',\n                  readOnly: true,\n                  'x-ms-enum': { name: 'TlsStatus', modelAsString: true }\n                },\n                certificate: {\n                  description: 'The certificate used to configure HTTPS for the login server.',\n                  readOnly: true,\n                  type: 'object',\n                  properties: {\n                    type: {\n                      description: 'The type of certificate location.',\n                      enum: [ 'LocalDirectory' ],\n                      type: 'string',\n                      readOnly: true,\n                      'x-ms-enum': { name: 'CertificateType', modelAsString: true }\n                    },\n                    location: {\n                      description: 'Indicates the location of the certificates.',\n                      type: 'string',\n                      readOnly: true\n                    }\n                  }\n                }\n              }\n            }\n          }\n        },\n        logging: {\n          description: 'The logging properties of the connected registry.',\n          type: 'object',\n          properties: {\n            logLevel: {\n              description: 'The verbosity of logs persisted on the connected registry.',\n              default: 'Information',\n              enum: [ 'Debug', 'Information', 'Warning', 'Error', 'None' ],\n              type: 'string',\n              'x-ms-enum': { name: 'LogLevel', modelAsString: true }\n            },\n            auditLogStatus: {\n              description: 'Indicates whether audit logs are enabled on the connected registry.',\n              default: 'Disabled',\n              enum: [ 'Enabled', 'Disabled' ],\n              type: 'string',\n              'x-ms-enum': { name: 'AuditLogStatus', modelAsString: true }\n            }\n          }\n        },\n        statusDetails: {\n          description: 'The list of current statuses of the connected registry.',\n          type: 'array',\n          items: {\n            description: 'The status detail properties of the connected registry.',\n            type: 'object',\n            properties: {\n              type: {\n                description: 'The component of the connected registry corresponding to the status.',\n                type: 'string',\n                readOnly: true\n              },\n              code: {\n                description: 'The code of the status.',\n                type: 'string',\n                readOnly: true\n              },\n              description: {\n                description: 'The description of the status.',\n                type: 'string',\n                readOnly: true\n              },\n              timestamp: {\n                format: 'date-time',\n                description: 'The timestamp of the status.',\n                type: 'string',\n                readOnly: true\n              },\n              correlationId: {\n                description: 'The correlation ID of the status.',\n                type: 'string',\n                readOnly: true\n              }\n            }\n          },\n          readOnly: true\n        },\n        notificationsList: {\n          description: 'The list of notifications subscription information for the connected registry.',\n          type: 'array',\n          items: { type: 'string' }\n        }\n      }\n    }\n  }\n}\n")),(0,o.kt)("h2",{id:"misc"},"Misc"),(0,o.kt)("p",null,"The resource version is ",(0,o.kt)("inlineCode",{parentName:"p"},"2021-08-01-preview"),"."),(0,o.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerregistry/resource-manager/Microsoft.ContainerRegistry/preview/2021-08-01-preview/containerregistry.json"},"here"),"."))}y.isMDXComponent=!0}}]);