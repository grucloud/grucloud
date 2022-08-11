"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[89212],{3905:(e,n,t)=>{t.d(n,{Zo:()=>u,kt:()=>m});var r=t(67294);function s(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function a(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function o(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?a(Object(t),!0).forEach((function(n){s(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function i(e,n){if(null==e)return{};var t,r,s=function(e,n){if(null==e)return{};var t,r,s={},a=Object.keys(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||(s[t]=e[t]);return s}(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(s[t]=e[t])}return s}var c=r.createContext({}),d=function(e){var n=r.useContext(c),t=n;return e&&(t="function"==typeof e?e(n):o(o({},n),e)),t},u=function(e){var n=d(e.components);return r.createElement(c.Provider,{value:n},e.children)},p={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},l=r.forwardRef((function(e,n){var t=e.components,s=e.mdxType,a=e.originalType,c=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),l=d(t),m=s,h=l["".concat(c,".").concat(m)]||l[m]||p[m]||a;return t?r.createElement(h,o(o({ref:n},u),{},{components:t})):r.createElement(h,o({ref:n},u))}));function m(e,n){var t=arguments,s=n&&n.mdxType;if("string"==typeof e||s){var a=t.length,o=new Array(a);o[0]=l;var i={};for(var c in n)hasOwnProperty.call(n,c)&&(i[c]=n[c]);i.originalType=e,i.mdxType="string"==typeof e?e:s,o[1]=i;for(var d=2;d<a;d++)o[d]=t[d];return r.createElement.apply(null,o)}return r.createElement.apply(null,t)}l.displayName="MDXCreateElement"},71558:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>o,default:()=>p,frontMatter:()=>a,metadata:()=>i,toc:()=>d});var r=t(87462),s=(t(67294),t(3905));const a={id:"CassandraCluster",title:"CassandraCluster"},o=void 0,i={unversionedId:"azure/resources/DocumentDB/CassandraCluster",id:"azure/resources/DocumentDB/CassandraCluster",title:"CassandraCluster",description:"Provides a CassandraCluster from the DocumentDB group",source:"@site/docs/azure/resources/DocumentDB/CassandraCluster.md",sourceDirName:"azure/resources/DocumentDB",slug:"/azure/resources/DocumentDB/CassandraCluster",permalink:"/docs/azure/resources/DocumentDB/CassandraCluster",draft:!1,tags:[],version:"current",frontMatter:{id:"CassandraCluster",title:"CassandraCluster"},sidebar:"docs",previous:{title:"VirtualNetworkRule",permalink:"/docs/azure/resources/DBforPostgreSQL/VirtualNetworkRule"},next:{title:"CassandraDataCenter",permalink:"/docs/azure/resources/DocumentDB/CassandraDataCenter"}},c={},d=[{value:"Examples",id:"examples",level:2},{value:"CosmosDBManagedCassandraClusterCreate",id:"cosmosdbmanagedcassandraclustercreate",level:3},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],u={toc:d};function p(e){let{components:n,...t}=e;return(0,s.kt)("wrapper",(0,r.Z)({},u,t,{components:n,mdxType:"MDXLayout"}),(0,s.kt)("p",null,"Provides a ",(0,s.kt)("strong",{parentName:"p"},"CassandraCluster")," from the ",(0,s.kt)("strong",{parentName:"p"},"DocumentDB")," group"),(0,s.kt)("h2",{id:"examples"},"Examples"),(0,s.kt)("h3",{id:"cosmosdbmanagedcassandraclustercreate"},"CosmosDBManagedCassandraClusterCreate"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "CassandraCluster",\n    group: "DocumentDB",\n    name: "myCassandraCluster",\n    properties: () => ({\n      location: "West US",\n      tags: {},\n      properties: {\n        delegatedManagementSubnetId:\n          "/subscriptions/536e130b-d7d6-4ac7-98a5-de20d69588d2/resourceGroups/customer-vnet-rg/providers/Microsoft.Network/virtualNetworks/customer-vnet/subnets/management",\n        cassandraVersion: "3.11",\n        hoursBetweenBackups: 24,\n        authenticationMethod: "Cassandra",\n        initialCassandraAdminPassword: "mypassword",\n        externalSeedNodes: [\n          { ipAddress: "10.52.221.2" },\n          { ipAddress: "10.52.221.3" },\n          { ipAddress: "10.52.221.4" },\n        ],\n        clusterNameOverride: "ClusterNameIllegalForAzureResource",\n        clientCertificates: [\n          {\n            pem: "-----BEGIN CERTIFICATE-----\\n...Base64 encoded certificate...\\n-----END CERTIFICATE-----",\n          },\n        ],\n        externalGossipCertificates: [\n          {\n            pem: "-----BEGIN CERTIFICATE-----\\n...Base64 encoded certificate...\\n-----END CERTIFICATE-----",\n          },\n        ],\n      },\n    }),\n    dependencies: ({}) => ({ resourceGroup: "myResourceGroup" }),\n  },\n];\n\n')),(0,s.kt)("h2",{id:"dependencies"},"Dependencies"),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup"))),(0,s.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-json"},"{\n  description: 'Representation of a managed Cassandra cluster.',\n  type: 'object',\n  allOf: [\n    {\n      type: 'object',\n      description: 'The core properties of ARM resources.',\n      properties: {\n        id: {\n          readOnly: true,\n          type: 'string',\n          description: 'The unique resource identifier of the ARM resource.'\n        },\n        name: {\n          readOnly: true,\n          type: 'string',\n          description: 'The name of the ARM resource.'\n        },\n        type: {\n          readOnly: true,\n          type: 'string',\n          description: 'The type of Azure resource.'\n        },\n        location: {\n          type: 'string',\n          description: 'The location of the resource group to which the resource belongs.'\n        },\n        tags: {\n          type: 'object',\n          additionalProperties: { type: 'string' },\n          description: 'Tags are a list of key-value pairs that describe the resource. These tags can be used in viewing and grouping this resource (across resource groups). A maximum of 15 tags can be provided for a resource. Each tag must have a key no greater than 128 characters and value no greater than 256 characters. For example, the default experience for a template type is set with \"defaultExperience\": \"Cassandra\". Current \"defaultExperience\" values also include \"Table\", \"Graph\", \"DocumentDB\", and \"MongoDB\".'\n        },\n        identity: {\n          description: 'Identity for the resource.',\n          type: 'object',\n          properties: {\n            principalId: {\n              readOnly: true,\n              type: 'string',\n              description: 'The object id of the identity resource.'\n            },\n            tenantId: {\n              readOnly: true,\n              type: 'string',\n              description: 'The tenant id of the resource.'\n            },\n            type: {\n              type: 'string',\n              description: 'The type of the resource.',\n              enum: [ 'SystemAssigned', 'None' ],\n              'x-ms-enum': {\n                name: 'ManagedCassandraResourceIdentityType',\n                modelAsString: true\n              }\n            }\n          }\n        }\n      },\n      'x-ms-azure-resource': true\n    }\n  ],\n  properties: {\n    properties: {\n      type: 'object',\n      description: 'Properties of a managed Cassandra cluster.',\n      properties: {\n        provisioningState: {\n          description: 'The status of the resource at the time the operation was called.',\n          type: 'string',\n          enum: [\n            'Creating',\n            'Updating',\n            'Deleting',\n            'Succeeded',\n            'Failed',\n            'Canceled'\n          ],\n          'x-ms-enum': {\n            name: 'ManagedCassandraProvisioningState',\n            modelAsString: true\n          }\n        },\n        restoreFromBackupId: {\n          type: 'string',\n          'x-ms-mutability': [ 'create' ],\n          description: 'To create an empty cluster, omit this field or set it to null. To restore a backup into a new cluster, set this field to the resource id of the backup.'\n        },\n        delegatedManagementSubnetId: {\n          type: 'string',\n          'x-ms-mutability': [ 'create', 'read' ],\n          description: \"Resource id of a subnet that this cluster's management service should have its network interface attached to. The subnet must be routable to all subnets that will be delegated to data centers. The resource id must be of the form '/subscriptions/<subscription id>/resourceGroups/<resource group>/providers/Microsoft.Network/virtualNetworks/<virtual network>/subnets/<subnet>'\"\n        },\n        cassandraVersion: {\n          type: 'string',\n          description: 'Which version of Cassandra should this cluster converge to running (e.g., 3.11). When updated, the cluster may take some time to migrate to the new version.'\n        },\n        clusterNameOverride: {\n          type: 'string',\n          'x-ms-mutability': [ 'create', 'read' ],\n          description: 'If you need to set the clusterName property in cassandra.yaml to something besides the resource name of the cluster, set the value to use on this property.'\n        },\n        authenticationMethod: {\n          type: 'string',\n          description: \"Which authentication method Cassandra should use to authenticate clients. 'None' turns off authentication, so should not be used except in emergencies. 'Cassandra' is the default password based authentication. The default is 'Cassandra'.\",\n          enum: [ 'None', 'Cassandra' ],\n          'x-ms-enum': { name: 'AuthenticationMethod', modelAsString: true }\n        },\n        initialCassandraAdminPassword: {\n          'x-ms-mutability': [ 'create' ],\n          'x-ms-secret': true,\n          description: \"Initial password for clients connecting as admin to the cluster. Should be changed after cluster creation. Returns null on GET. This field only applies when the authenticationMethod field is 'Cassandra'.\",\n          type: 'string'\n        },\n        prometheusEndpoint: {\n          description: 'Hostname or IP address where the Prometheus endpoint containing data about the managed Cassandra nodes can be reached.',\n          type: 'object',\n          properties: {\n            ipAddress: {\n              description: 'IP address of this seed node.',\n              type: 'string'\n            }\n          }\n        },\n        repairEnabled: {\n          type: 'boolean',\n          description: 'Should automatic repairs run on this cluster? If omitted, this is true, and should stay true unless you are running a hybrid cluster where you are already doing your own repairs.'\n        },\n        clientCertificates: {\n          description: 'List of TLS certificates used to authorize clients connecting to the cluster. All connections are TLS encrypted whether clientCertificates is set or not, but if clientCertificates is set, the managed Cassandra cluster will reject all connections not bearing a TLS client certificate that can be validated from one or more of the public certificates in this property.',\n          type: 'array',\n          items: {\n            type: 'object',\n            properties: {\n              pem: {\n                description: 'PEM formatted public key.',\n                type: 'string'\n              }\n            }\n          }\n        },\n        externalGossipCertificates: {\n          description: 'List of TLS certificates used to authorize gossip from unmanaged data centers. The TLS certificates of all nodes in unmanaged data centers must be verifiable using one of the certificates provided in this property.',\n          type: 'array',\n          items: {\n            type: 'object',\n            properties: {\n              pem: {\n                description: 'PEM formatted public key.',\n                type: 'string'\n              }\n            }\n          }\n        },\n        gossipCertificates: {\n          readOnly: true,\n          'x-ms-mutability': [ 'read' ],\n          description: 'List of TLS certificates that unmanaged nodes must trust for gossip with managed nodes. All managed nodes will present TLS client certificates that are verifiable using one of the certificates provided in this property.',\n          type: 'array',\n          items: {\n            type: 'object',\n            properties: {\n              pem: {\n                description: 'PEM formatted public key.',\n                type: 'string'\n              }\n            }\n          }\n        },\n        externalSeedNodes: {\n          type: 'array',\n          description: 'List of IP addresses of seed nodes in unmanaged data centers. These will be added to the seed node lists of all managed nodes.',\n          items: {\n            type: 'object',\n            properties: {\n              ipAddress: {\n                description: 'IP address of this seed node.',\n                type: 'string'\n              }\n            }\n          }\n        },\n        seedNodes: {\n          readOnly: true,\n          type: 'array',\n          items: {\n            type: 'object',\n            properties: {\n              ipAddress: {\n                description: 'IP address of this seed node.',\n                type: 'string'\n              }\n            }\n          },\n          description: 'List of IP addresses of seed nodes in the managed data centers. These should be added to the seed node lists of all unmanaged nodes.'\n        },\n        hoursBetweenBackups: {\n          type: 'integer',\n          format: 'int32',\n          description: 'Number of hours to wait between taking a backup of the cluster. To disable backups, set this property to 0.'\n        },\n        deallocated: {\n          type: 'boolean',\n          description: 'Whether the cluster and associated data centers has been deallocated.'\n        },\n        cassandraAuditLoggingEnabled: {\n          type: 'boolean',\n          description: 'Whether Cassandra audit logging is enabled'\n        }\n      }\n    }\n  }\n}\n")),(0,s.kt)("h2",{id:"misc"},"Misc"),(0,s.kt)("p",null,"The resource version is ",(0,s.kt)("inlineCode",{parentName:"p"},"2022-05-15"),"."),(0,s.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,s.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/cosmos-db/resource-manager/Microsoft.DocumentDB/stable/2022-05-15/managedCassandra.json"},"here"),"."))}p.isMDXComponent=!0}}]);