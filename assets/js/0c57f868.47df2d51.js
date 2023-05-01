"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[94794],{3905:(e,t,r)=>{r.d(t,{Zo:()=>u,kt:()=>f});var n=r(67294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var p=n.createContext({}),c=function(e){var t=n.useContext(p),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},u=function(e){var t=c(e.components);return n.createElement(p.Provider,{value:t},e.children)},l="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,a=e.originalType,p=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),l=c(r),m=o,f=l["".concat(p,".").concat(m)]||l[m]||d[m]||a;return r?n.createElement(f,i(i({ref:t},u),{},{components:r})):n.createElement(f,i({ref:t},u))}));function f(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=r.length,i=new Array(a);i[0]=m;var s={};for(var p in t)hasOwnProperty.call(t,p)&&(s[p]=t[p]);s.originalType=e,s[l]="string"==typeof e?e:o,i[1]=s;for(var c=2;c<a;c++)i[c]=r[c];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},69173:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>p,contentTitle:()=>i,default:()=>d,frontMatter:()=>a,metadata:()=>s,toc:()=>c});var n=r(87462),o=(r(67294),r(3905));const a={id:"PacketCapture",title:"PacketCapture"},i=void 0,s={unversionedId:"azure/resources/Network/PacketCapture",id:"azure/resources/Network/PacketCapture",title:"PacketCapture",description:"Provides a PacketCapture from the Network group",source:"@site/docs/azure/resources/Network/PacketCapture.md",sourceDirName:"azure/resources/Network",slug:"/azure/resources/Network/PacketCapture",permalink:"/docs/azure/resources/Network/PacketCapture",draft:!1,tags:[],version:"current",frontMatter:{id:"PacketCapture",title:"PacketCapture"},sidebar:"docs",previous:{title:"P2sVpnServerConfiguration",permalink:"/docs/azure/resources/Network/P2sVpnServerConfiguration"},next:{title:"PrivateDnsZoneGroup",permalink:"/docs/azure/resources/Network/PrivateDnsZoneGroup"}},p={},c=[{value:"Examples",id:"examples",level:2},{value:"Create packet capture",id:"create-packet-capture",level:3},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],u={toc:c},l="wrapper";function d(e){let{components:t,...r}=e;return(0,o.kt)(l,(0,n.Z)({},u,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Provides a ",(0,o.kt)("strong",{parentName:"p"},"PacketCapture")," from the ",(0,o.kt)("strong",{parentName:"p"},"Network")," group"),(0,o.kt)("h2",{id:"examples"},"Examples"),(0,o.kt)("h3",{id:"create-packet-capture"},"Create packet capture"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "PacketCapture",\n    group: "Network",\n    name: "myPacketCapture",\n    properties: () => ({\n      properties: {\n        target:\n          "/subscriptions/subid/resourceGroups/rg2/providers/Microsoft.Compute/virtualMachines/vm1",\n        bytesToCapturePerPacket: 10000,\n        totalBytesPerSession: 100000,\n        timeLimitInSeconds: 100,\n        storageLocation: {\n          storageId:\n            "/subscriptions/subid/resourceGroups/rg2/providers/Microsoft.Storage/storageAccounts/pcstore",\n          storagePath:\n            "https://mytestaccountname.blob.core.windows.net/capture/pc1.cap",\n          filePath: "D:\\\\capture\\\\pc1.cap",\n        },\n        filters: [\n          { protocol: "TCP", localIPAddress: "10.0.0.4", localPort: "80" },\n        ],\n      },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      networkWatcher: "myNetworkWatcher",\n    }),\n  },\n];\n\n')),(0,o.kt)("h2",{id:"dependencies"},"Dependencies"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Network/NetworkWatcher"},"NetworkWatcher"))),(0,o.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-json"},"{\n  properties: {\n    properties: {\n      'x-ms-client-flatten': true,\n      description: 'Properties of the packet capture.',\n      properties: {\n        target: {\n          type: 'string',\n          description: 'The ID of the targeted resource, only AzureVM and AzureVMSS as target type are currently supported.'\n        },\n        scope: {\n          description: 'A list of AzureVMSS instances which can be included or excluded to run packet capture. If both included and excluded are empty, then the packet capture will run on all instances of AzureVMSS.',\n          type: 'object',\n          properties: {\n            include: {\n              type: 'array',\n              description: 'List of AzureVMSS instances to run packet capture on.',\n              items: { type: 'string' }\n            },\n            exclude: {\n              type: 'array',\n              description: 'List of AzureVMSS instances which has to be excluded from the AzureVMSS from running packet capture.',\n              items: { type: 'string' }\n            }\n          }\n        },\n        targetType: {\n          description: 'Target type of the resource provided.',\n          type: 'string',\n          enum: [ 'AzureVM', 'AzureVMSS' ],\n          'x-ms-enum': { name: 'PacketCaptureTargetType', modelAsString: false }\n        },\n        bytesToCapturePerPacket: {\n          type: 'integer',\n          format: 'int64',\n          minimum: 0,\n          maximum: 4294967295,\n          default: 0,\n          description: 'Number of bytes captured per packet, the remaining bytes are truncated.'\n        },\n        totalBytesPerSession: {\n          type: 'integer',\n          format: 'int64',\n          minimum: 0,\n          maximum: 4294967295,\n          default: 1073741824,\n          description: 'Maximum size of the capture output.'\n        },\n        timeLimitInSeconds: {\n          type: 'integer',\n          format: 'int32',\n          minimum: 0,\n          maximum: 18000,\n          default: 18000,\n          description: 'Maximum duration of the capture session in seconds.'\n        },\n        storageLocation: {\n          description: 'The storage location for a packet capture session.',\n          properties: {\n            storageId: {\n              type: 'string',\n              description: 'The ID of the storage account to save the packet capture session. Required if no local file path is provided.'\n            },\n            storagePath: {\n              type: 'string',\n              description: 'The URI of the storage path to save the packet capture. Must be a well-formed URI describing the location to save the packet capture.'\n            },\n            filePath: {\n              type: 'string',\n              description: 'A valid local path on the targeting VM. Must include the name of the capture file (*.cap). For linux virtual machine it must start with /var/captures. Required if no storage ID is provided, otherwise optional.'\n            }\n          }\n        },\n        filters: {\n          type: 'array',\n          items: {\n            properties: {\n              protocol: {\n                type: 'string',\n                enum: [ 'TCP', 'UDP', 'Any' ],\n                'x-ms-enum': { name: 'PcProtocol', modelAsString: true },\n                default: 'Any',\n                description: 'Protocol to be filtered on.'\n              },\n              localIPAddress: {\n                type: 'string',\n                description: 'Local IP Address to be filtered on. Notation: \"127.0.0.1\" for single address entry. \"127.0.0.1-127.0.0.255\" for range. \"127.0.0.1;127.0.0.5\"? for multiple entries. Multiple ranges not currently supported. Mixing ranges with multiple entries not currently supported. Default = null.'\n              },\n              remoteIPAddress: {\n                type: 'string',\n                description: 'Local IP Address to be filtered on. Notation: \"127.0.0.1\" for single address entry. \"127.0.0.1-127.0.0.255\" for range. \"127.0.0.1;127.0.0.5;\" for multiple entries. Multiple ranges not currently supported. Mixing ranges with multiple entries not currently supported. Default = null.'\n              },\n              localPort: {\n                type: 'string',\n                description: 'Local port to be filtered on. Notation: \"80\" for single port entry.\"80-85\" for range. \"80;443;\" for multiple entries. Multiple ranges not currently supported. Mixing ranges with multiple entries not currently supported. Default = null.'\n              },\n              remotePort: {\n                type: 'string',\n                description: 'Remote port to be filtered on. Notation: \"80\" for single port entry.\"80-85\" for range. \"80;443;\" for multiple entries. Multiple ranges not currently supported. Mixing ranges with multiple entries not currently supported. Default = null.'\n              }\n            },\n            description: 'Filter that is applied to packet capture request. Multiple filters can be applied.'\n          },\n          description: 'A list of packet capture filters.'\n        }\n      },\n      required: [ 'target', 'storageLocation' ]\n    }\n  },\n  required: [ 'properties' ],\n  description: 'Parameters that define the create packet capture operation.'\n}\n")),(0,o.kt)("h2",{id:"misc"},"Misc"),(0,o.kt)("p",null,"The resource version is ",(0,o.kt)("inlineCode",{parentName:"p"},"2022-01-01"),"."),(0,o.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2022-01-01/networkWatcher.json"},"here"),"."))}d.isMDXComponent=!0}}]);