"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[15460],{3905:(e,n,t)=>{t.d(n,{Zo:()=>u,kt:()=>m});var r=t(67294);function i(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function s(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){i(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function a(e,n){if(null==e)return{};var t,r,i=function(e,n){if(null==e)return{};var t,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||(i[t]=e[t]);return i}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var p=r.createContext({}),c=function(e){var n=r.useContext(p),t=n;return e&&(t="function"==typeof e?e(n):s(s({},n),e)),t},u=function(e){var n=c(e.components);return r.createElement(p.Provider,{value:n},e.children)},l={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},d=r.forwardRef((function(e,n){var t=e.components,i=e.mdxType,o=e.originalType,p=e.parentName,u=a(e,["components","mdxType","originalType","parentName"]),d=c(t),m=i,h=d["".concat(p,".").concat(m)]||d[m]||l[m]||o;return t?r.createElement(h,s(s({ref:n},u),{},{components:t})):r.createElement(h,s({ref:n},u))}));function m(e,n){var t=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var o=t.length,s=new Array(o);s[0]=d;var a={};for(var p in n)hasOwnProperty.call(n,p)&&(a[p]=n[p]);a.originalType=e,a.mdxType="string"==typeof e?e:i,s[1]=a;for(var c=2;c<o;c++)s[c]=t[c];return r.createElement.apply(null,s)}return r.createElement.apply(null,t)}d.displayName="MDXCreateElement"},46946:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>p,contentTitle:()=>s,default:()=>l,frontMatter:()=>o,metadata:()=>a,toc:()=>c});var r=t(87462),i=(t(67294),t(3905));const o={id:"GremlinResourceGremlinGraph",title:"GremlinResourceGremlinGraph"},s=void 0,a={unversionedId:"azure/resources/DocumentDB/GremlinResourceGremlinGraph",id:"azure/resources/DocumentDB/GremlinResourceGremlinGraph",title:"GremlinResourceGremlinGraph",description:"Provides a GremlinResourceGremlinGraph from the DocumentDB group",source:"@site/docs/azure/resources/DocumentDB/GremlinResourceGremlinGraph.md",sourceDirName:"azure/resources/DocumentDB",slug:"/azure/resources/DocumentDB/GremlinResourceGremlinGraph",permalink:"/docs/azure/resources/DocumentDB/GremlinResourceGremlinGraph",draft:!1,tags:[],version:"current",frontMatter:{id:"GremlinResourceGremlinGraph",title:"GremlinResourceGremlinGraph"},sidebar:"docs",previous:{title:"GremlinResourceGremlinDatabaseThroughput",permalink:"/docs/azure/resources/DocumentDB/GremlinResourceGremlinDatabaseThroughput"},next:{title:"GremlinResourceGremlinGraphThroughput",permalink:"/docs/azure/resources/DocumentDB/GremlinResourceGremlinGraphThroughput"}},p={},c=[{value:"Examples",id:"examples",level:2},{value:"CosmosDBGremlinGraphCreateUpdate",id:"cosmosdbgremlingraphcreateupdate",level:3},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],u={toc:c};function l(e){let{components:n,...t}=e;return(0,i.kt)("wrapper",(0,r.Z)({},u,t,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Provides a ",(0,i.kt)("strong",{parentName:"p"},"GremlinResourceGremlinGraph")," from the ",(0,i.kt)("strong",{parentName:"p"},"DocumentDB")," group"),(0,i.kt)("h2",{id:"examples"},"Examples"),(0,i.kt)("h3",{id:"cosmosdbgremlingraphcreateupdate"},"CosmosDBGremlinGraphCreateUpdate"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "GremlinResourceGremlinGraph",\n    group: "DocumentDB",\n    name: "myGremlinResourceGremlinGraph",\n    properties: () => ({\n      location: "West US",\n      tags: {},\n      properties: {\n        resource: {\n          id: "graphName",\n          indexingPolicy: {\n            indexingMode: "consistent",\n            automatic: true,\n            includedPaths: [\n              {\n                path: "/*",\n                indexes: [\n                  { kind: "Range", dataType: "String", precision: -1 },\n                  { kind: "Range", dataType: "Number", precision: -1 },\n                ],\n              },\n            ],\n            excludedPaths: [],\n          },\n          partitionKey: { paths: ["/AccountNumber"], kind: "Hash" },\n          defaultTtl: 100,\n          uniqueKeyPolicy: { uniqueKeys: [{ paths: ["/testPath"] }] },\n          conflictResolutionPolicy: {\n            mode: "LastWriterWins",\n            conflictResolutionPath: "/path",\n          },\n        },\n        options: {},\n      },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      account: "myDatabaseAccount",\n      database: "myGremlinResourceGremlinDatabase",\n    }),\n  },\n];\n\n')),(0,i.kt)("h2",{id:"dependencies"},"Dependencies"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/DocumentDB/DatabaseAccount"},"DatabaseAccount")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/DocumentDB/GremlinResourceGremlinDatabase"},"GremlinResourceGremlinDatabase"))),(0,i.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json"},"{\n  description: 'Parameters to create and update Cosmos DB Gremlin graph.',\n  type: 'object',\n  properties: {\n    properties: {\n      'x-ms-client-flatten': true,\n      description: 'Properties to create and update Azure Cosmos DB Gremlin graph.',\n      type: 'object',\n      properties: {\n        resource: {\n          description: 'The standard JSON format of a Gremlin graph',\n          type: 'object',\n          properties: {\n            id: {\n              type: 'string',\n              description: 'Name of the Cosmos DB Gremlin graph'\n            },\n            indexingPolicy: {\n              description: 'The configuration of the indexing policy. By default, the indexing is automatic for all document paths within the graph',\n              type: 'object',\n              properties: {\n                automatic: {\n                  type: 'boolean',\n                  description: 'Indicates if the indexing policy is automatic'\n                },\n                indexingMode: {\n                  description: 'Indicates the indexing mode.',\n                  type: 'string',\n                  default: 'consistent',\n                  enum: [ 'consistent', 'lazy', 'none' ],\n                  'x-ms-enum': { name: 'IndexingMode', modelAsString: true }\n                },\n                includedPaths: {\n                  description: 'List of paths to include in the indexing',\n                  type: 'array',\n                  items: {\n                    type: 'object',\n                    description: 'The paths that are included in indexing',\n                    properties: {\n                      path: {\n                        type: 'string',\n                        description: 'The path for which the indexing behavior applies to. Index paths typically start with root and end with wildcard (/path/*)'\n                      },\n                      indexes: {\n                        description: 'List of indexes for this path',\n                        type: 'array',\n                        items: {\n                          type: 'object',\n                          description: 'The indexes for the path.',\n                          properties: {\n                            dataType: {\n                              description: 'The datatype for which the indexing behavior is applied to.',\n                              type: 'string',\n                              default: 'String',\n                              enum: [\n                                'String',\n                                'Number',\n                                'Point',\n                                'Polygon',\n                                'LineString',\n                                'MultiPolygon'\n                              ],\n                              'x-ms-enum': { name: 'DataType', modelAsString: true }\n                            },\n                            precision: {\n                              description: 'The precision of the index. -1 is maximum precision.',\n                              type: 'integer'\n                            },\n                            kind: {\n                              description: 'Indicates the type of index.',\n                              type: 'string',\n                              default: 'Hash',\n                              enum: [ 'Hash', 'Range', 'Spatial' ],\n                              'x-ms-enum': {\n                                name: 'IndexKind',\n                                modelAsString: true\n                              }\n                            }\n                          }\n                        }\n                      }\n                    }\n                  }\n                },\n                excludedPaths: {\n                  description: 'List of paths to exclude from indexing',\n                  type: 'array',\n                  items: {\n                    type: 'object',\n                    properties: {\n                      path: {\n                        type: 'string',\n                        description: 'The path for which the indexing behavior applies to. Index paths typically start with root and end with wildcard (/path/*)'\n                      }\n                    }\n                  }\n                },\n                compositeIndexes: {\n                  description: 'List of composite path list',\n                  type: 'array',\n                  items: {\n                    description: 'List of composite path',\n                    type: 'array',\n                    items: {\n                      type: 'object',\n                      properties: {\n                        path: {\n                          type: 'string',\n                          description: 'The path for which the indexing behavior applies to. Index paths typically start with root and end with wildcard (/path/*)'\n                        },\n                        order: {\n                          description: 'Sort order for composite paths.',\n                          type: 'string',\n                          enum: [ 'ascending', 'descending' ],\n                          'x-ms-enum': {\n                            name: 'CompositePathSortOrder',\n                            modelAsString: true\n                          }\n                        }\n                      }\n                    }\n                  }\n                },\n                spatialIndexes: {\n                  description: 'List of spatial specifics',\n                  type: 'array',\n                  items: {\n                    type: 'object',\n                    properties: {\n                      path: {\n                        type: 'string',\n                        description: 'The path for which the indexing behavior applies to. Index paths typically start with root and end with wildcard (/path/*)'\n                      },\n                      types: {\n                        description: \"List of path's spatial type\",\n                        type: 'array',\n                        items: {\n                          description: 'Indicates the spatial type of index.',\n                          type: 'string',\n                          enum: [\n                            'Point',\n                            'LineString',\n                            'Polygon',\n                            'MultiPolygon'\n                          ],\n                          'x-ms-enum': { name: 'SpatialType', modelAsString: true }\n                        }\n                      }\n                    }\n                  }\n                }\n              }\n            },\n            partitionKey: {\n              description: 'The configuration of the partition key to be used for partitioning data into multiple partitions',\n              type: 'object',\n              properties: {\n                paths: {\n                  description: 'List of paths using which data within the container can be partitioned',\n                  type: 'array',\n                  items: {\n                    type: 'string',\n                    description: 'A path. These typically start with root (/path)'\n                  }\n                },\n                kind: {\n                  description: 'Indicates the kind of algorithm used for partitioning. For MultiHash, multiple partition keys (upto three maximum) are supported for container create',\n                  type: 'string',\n                  default: 'Hash',\n                  enum: [ 'Hash', 'Range', 'MultiHash' ],\n                  'x-ms-enum': { name: 'PartitionKind', modelAsString: true }\n                },\n                version: {\n                  description: 'Indicates the version of the partition key definition',\n                  type: 'integer',\n                  minimum: 1,\n                  maximum: 2,\n                  format: 'int32'\n                },\n                systemKey: {\n                  description: 'Indicates if the container is using a system generated partition key',\n                  type: 'boolean',\n                  readOnly: true\n                }\n              }\n            },\n            defaultTtl: { type: 'integer', description: 'Default time to live' },\n            uniqueKeyPolicy: {\n              description: 'The unique key policy configuration for specifying uniqueness constraints on documents in the collection in the Azure Cosmos DB service.',\n              type: 'object',\n              properties: {\n                uniqueKeys: {\n                  description: 'List of unique keys on that enforces uniqueness constraint on documents in the collection in the Azure Cosmos DB service.',\n                  type: 'array',\n                  items: {\n                    type: 'object',\n                    description: 'The unique key on that enforces uniqueness constraint on documents in the collection in the Azure Cosmos DB service.',\n                    properties: {\n                      paths: {\n                        description: 'List of paths must be unique for each document in the Azure Cosmos DB service',\n                        type: 'array',\n                        items: {\n                          type: 'string',\n                          description: 'A path. These typically start with root (/path)'\n                        }\n                      }\n                    }\n                  }\n                }\n              }\n            },\n            conflictResolutionPolicy: {\n              description: 'The conflict resolution policy for the graph.',\n              type: 'object',\n              properties: {\n                mode: {\n                  description: 'Indicates the conflict resolution mode.',\n                  type: 'string',\n                  default: 'LastWriterWins',\n                  enum: [ 'LastWriterWins', 'Custom' ],\n                  'x-ms-enum': {\n                    name: 'ConflictResolutionMode',\n                    modelAsString: true\n                  }\n                },\n                conflictResolutionPath: {\n                  type: 'string',\n                  description: 'The conflict resolution path in the case of LastWriterWins mode.'\n                },\n                conflictResolutionProcedure: {\n                  type: 'string',\n                  description: 'The procedure to resolve conflicts in the case of custom mode.'\n                }\n              }\n            },\n            analyticalStorageTtl: {\n              type: 'integer',\n              format: 'int64',\n              description: 'Analytical TTL.'\n            }\n          },\n          required: [ 'id' ]\n        },\n        options: {\n          description: 'A key-value pair of options to be applied for the request. This corresponds to the headers sent with the request.',\n          type: 'object',\n          properties: {\n            throughput: {\n              type: 'integer',\n              description: 'Request Units per second. For example, \"throughput\": 10000.'\n            },\n            autoscaleSettings: {\n              description: 'Specifies the Autoscale settings.',\n              type: 'object',\n              properties: {\n                maxThroughput: {\n                  type: 'integer',\n                  description: 'Represents maximum throughput, the resource can scale up to.'\n                }\n              }\n            }\n          }\n        }\n      },\n      required: [ 'resource' ]\n    }\n  },\n  allOf: [\n    {\n      type: 'object',\n      description: 'The core properties of ARM resources.',\n      properties: {\n        id: {\n          readOnly: true,\n          type: 'string',\n          description: 'The unique resource identifier of the ARM resource.'\n        },\n        name: {\n          readOnly: true,\n          type: 'string',\n          description: 'The name of the ARM resource.'\n        },\n        type: {\n          readOnly: true,\n          type: 'string',\n          description: 'The type of Azure resource.'\n        },\n        location: {\n          type: 'string',\n          description: 'The location of the resource group to which the resource belongs.'\n        },\n        tags: {\n          type: 'object',\n          additionalProperties: { type: 'string' },\n          description: 'Tags are a list of key-value pairs that describe the resource. These tags can be used in viewing and grouping this resource (across resource groups). A maximum of 15 tags can be provided for a resource. Each tag must have a key no greater than 128 characters and value no greater than 256 characters. For example, the default experience for a template type is set with \"defaultExperience\": \"Cassandra\". Current \"defaultExperience\" values also include \"Table\", \"Graph\", \"DocumentDB\", and \"MongoDB\".'\n        }\n      },\n      'x-ms-azure-resource': true\n    }\n  ],\n  required: [ 'properties' ]\n}\n")),(0,i.kt)("h2",{id:"misc"},"Misc"),(0,i.kt)("p",null,"The resource version is ",(0,i.kt)("inlineCode",{parentName:"p"},"2022-05-15"),"."),(0,i.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/cosmos-db/resource-manager/Microsoft.DocumentDB/stable/2022-05-15/cosmos-db.json"},"here"),"."))}l.isMDXComponent=!0}}]);