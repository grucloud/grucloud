"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[53173],{3905:function(e,n,t){t.d(n,{Zo:function(){return l},kt:function(){return m}});var i=t(67294);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);n&&(i=i.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,i)}return t}function s(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function a(e,n){if(null==e)return{};var t,i,r=function(e,n){if(null==e)return{};var t,i,r={},o=Object.keys(e);for(i=0;i<o.length;i++)t=o[i],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(i=0;i<o.length;i++)t=o[i],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var p=i.createContext({}),c=function(e){var n=i.useContext(p),t=n;return e&&(t="function"==typeof e?e(n):s(s({},n),e)),t},l=function(e){var n=c(e.components);return i.createElement(p.Provider,{value:n},e.children)},u={inlineCode:"code",wrapper:function(e){var n=e.children;return i.createElement(i.Fragment,{},n)}},d=i.forwardRef((function(e,n){var t=e.components,r=e.mdxType,o=e.originalType,p=e.parentName,l=a(e,["components","mdxType","originalType","parentName"]),d=c(t),m=r,g=d["".concat(p,".").concat(m)]||d[m]||u[m]||o;return t?i.createElement(g,s(s({ref:n},l),{},{components:t})):i.createElement(g,s({ref:n},l))}));function m(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var o=t.length,s=new Array(o);s[0]=d;var a={};for(var p in n)hasOwnProperty.call(n,p)&&(a[p]=n[p]);a.originalType=e,a.mdxType="string"==typeof e?e:r,s[1]=a;for(var c=2;c<o;c++)s[c]=t[c];return i.createElement.apply(null,s)}return i.createElement.apply(null,t)}d.displayName="MDXCreateElement"},27294:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return a},contentTitle:function(){return p},metadata:function(){return c},toc:function(){return l},default:function(){return d}});var i=t(87462),r=t(63366),o=(t(67294),t(3905)),s=["components"],a={id:"SiteConfigSlot",title:"SiteConfigSlot"},p=void 0,c={unversionedId:"azure/resources/Web/SiteConfigSlot",id:"azure/resources/Web/SiteConfigSlot",isDocsHomePage:!1,title:"SiteConfigSlot",description:"Provides a SiteConfigSlot from the Web group",source:"@site/docs/azure/resources/Web/SiteConfigSlot.md",sourceDirName:"azure/resources/Web",slug:"/azure/resources/Web/SiteConfigSlot",permalink:"/docs/azure/resources/Web/SiteConfigSlot",tags:[],version:"current",frontMatter:{id:"SiteConfigSlot",title:"SiteConfigSlot"},sidebar:"docs",previous:{title:"SiteConfig",permalink:"/docs/azure/resources/Web/SiteConfig"},next:{title:"SiteDeployment",permalink:"/docs/azure/resources/Web/SiteDeployment"}},l=[{value:"Examples",id:"examples",children:[],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"Swagger Schema",id:"swagger-schema",children:[],level:2},{value:"Misc",id:"misc",children:[],level:2}],u={toc:l};function d(e){var n=e.components,t=(0,r.Z)(e,s);return(0,o.kt)("wrapper",(0,i.Z)({},u,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Provides a ",(0,o.kt)("strong",{parentName:"p"},"SiteConfigSlot")," from the ",(0,o.kt)("strong",{parentName:"p"},"Web")," group"),(0,o.kt)("h2",{id:"examples"},"Examples"),(0,o.kt)("h2",{id:"dependencies"},"Dependencies"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Web/Site"},"Site")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Web/SiteSlot"},"SiteSlot"))),(0,o.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"{\n  description: 'Configuration of Azure web site',\n  type: 'object',\n  allOf: [\n    {\n      required: [ 'location' ],\n      properties: {\n        id: { description: 'Resource Id', type: 'string' },\n        name: { description: 'Resource Name', type: 'string' },\n        kind: { description: 'Kind of resource', type: 'string' },\n        location: { description: 'Resource Location', type: 'string' },\n        type: { description: 'Resource type', type: 'string' },\n        tags: {\n          description: 'Resource tags',\n          type: 'object',\n          additionalProperties: { type: 'string' }\n        }\n      },\n      'x-ms-azure-resource': true\n    }\n  ],\n  properties: {\n    properties: {\n      properties: {\n        numberOfWorkers: {\n          format: 'int32',\n          description: 'Number of workers',\n          type: 'integer'\n        },\n        defaultDocuments: {\n          description: 'Default documents',\n          type: 'array',\n          items: { type: 'string' }\n        },\n        netFrameworkVersion: { description: 'Net Framework Version', type: 'string' },\n        phpVersion: { description: 'Version of PHP', type: 'string' },\n        pythonVersion: { description: 'Version of Python', type: 'string' },\n        nodeVersion: { description: 'Version of Node', type: 'string' },\n        requestTracingEnabled: { description: 'Enable request tracing', type: 'boolean' },\n        requestTracingExpirationTime: {\n          format: 'date-time',\n          description: 'Request tracing expiration time',\n          type: 'string'\n        },\n        remoteDebuggingEnabled: { description: 'Remote Debugging Enabled', type: 'boolean' },\n        remoteDebuggingVersion: { description: 'Remote Debugging Version', type: 'string' },\n        httpLoggingEnabled: { description: 'HTTP logging Enabled', type: 'boolean' },\n        logsDirectorySizeLimit: {\n          format: 'int32',\n          description: 'HTTP Logs Directory size limit',\n          type: 'integer'\n        },\n        detailedErrorLoggingEnabled: {\n          description: 'Detailed error logging enabled',\n          type: 'boolean'\n        },\n        publishingUsername: { description: 'Publishing user name', type: 'string' },\n        publishingPassword: { description: 'Publishing password', type: 'string' },\n        appSettings: {\n          description: 'Application Settings',\n          type: 'array',\n          items: {\n            description: 'Name value pair',\n            type: 'object',\n            properties: {\n              name: { description: 'Pair name', type: 'string' },\n              value: { description: 'Pair value', type: 'string' }\n            }\n          }\n        },\n        metadata: {\n          description: 'Site Metadata',\n          type: 'array',\n          items: {\n            description: 'Name value pair',\n            type: 'object',\n            properties: {\n              name: { description: 'Pair name', type: 'string' },\n              value: { description: 'Pair value', type: 'string' }\n            }\n          }\n        },\n        connectionStrings: {\n          description: 'Connection strings',\n          type: 'array',\n          items: {\n            description: 'Represents database connection string information',\n            required: [ 'type' ],\n            type: 'object',\n            properties: {\n              name: {\n                description: 'Name of connection string',\n                type: 'string'\n              },\n              connectionString: {\n                description: 'Connection string value',\n                type: 'string'\n              },\n              type: {\n                description: 'Type of database',\n                enum: [ 'MySql', 'SQLServer', 'SQLAzure', 'Custom' ],\n                type: 'string',\n                'x-ms-enum': { name: 'DatabaseServerType', modelAsString: false }\n              }\n            }\n          }\n        },\n        handlerMappings: {\n          description: 'Handler mappings',\n          type: 'array',\n          items: {\n            description: 'The IIS handler mappings used to define which handler processes HTTP requests with certain extension. \\r\\n' +\n              '            For example it is used to configure php-cgi.exe process to handle all HTTP requests with *.php extension.',\n            type: 'object',\n            properties: {\n              extension: {\n                description: 'Requests with this extension will be handled using the specified FastCGI application.',\n                type: 'string'\n              },\n              scriptProcessor: {\n                description: 'The absolute path to the FastCGI application.',\n                type: 'string'\n              },\n              arguments: {\n                description: 'Command-line arguments to be passed to the script processor.',\n                type: 'string'\n              }\n            }\n          }\n        },\n        documentRoot: { description: 'Document root', type: 'string' },\n        scmType: { description: 'SCM type', type: 'string' },\n        use32BitWorkerProcess: { description: 'Use 32 bit worker process', type: 'boolean' },\n        webSocketsEnabled: { description: 'Web socket enabled.', type: 'boolean' },\n        alwaysOn: { description: 'Always On', type: 'boolean' },\n        javaVersion: { description: 'Java version', type: 'string' },\n        javaContainer: { description: 'Java container', type: 'string' },\n        javaContainerVersion: { description: 'Java container version', type: 'string' },\n        appCommandLine: { description: 'App Command Line to launch', type: 'string' },\n        managedPipelineMode: {\n          description: 'Managed pipeline mode',\n          enum: [ 'Integrated', 'Classic' ],\n          type: 'string',\n          'x-ms-enum': { name: 'ManagedPipelineMode', modelAsString: false }\n        },\n        virtualApplications: {\n          description: 'Virtual applications',\n          type: 'array',\n          items: {\n            type: 'object',\n            properties: {\n              virtualPath: { type: 'string' },\n              physicalPath: { type: 'string' },\n              preloadEnabled: { type: 'boolean' },\n              virtualDirectories: {\n                type: 'array',\n                items: {\n                  type: 'object',\n                  properties: {\n                    virtualPath: { type: 'string' },\n                    physicalPath: { type: 'string' }\n                  }\n                }\n              }\n            }\n          }\n        },\n        loadBalancing: {\n          description: 'Site load balancing',\n          enum: [\n            'WeightedRoundRobin',\n            'LeastRequests',\n            'LeastResponseTime',\n            'WeightedTotalTraffic',\n            'RequestHash'\n          ],\n          type: 'string',\n          'x-ms-enum': { name: 'SiteLoadBalancing', modelAsString: false }\n        },\n        experiments: {\n          description: 'This is work around for polymorphic types',\n          type: 'object',\n          properties: {\n            rampUpRules: {\n              description: 'List of {Microsoft.Web.Hosting.Administration.RampUpRule} objects.',\n              type: 'array',\n              items: {\n                description: 'Routing rules for ramp up testing. This rule allows to redirect static traffic % to a slot or to gradually change routing % based on performance',\n                type: 'object',\n                properties: {\n                  actionHostName: {\n                    description: 'Hostname of a slot to which the traffic will be redirected if decided to. E.g. mysite-stage.azurewebsites.net',\n                    type: 'string'\n                  },\n                  reroutePercentage: {\n                    format: 'double',\n                    description: 'Percentage of the traffic which will be redirected to {Microsoft.Web.Hosting.Administration.RampUpRule.ActionHostName}',\n                    type: 'number'\n                  },\n                  changeStep: {\n                    format: 'double',\n                    description: '[Optional] In auto ramp up scenario this is the step to add/remove from {Microsoft.Web.Hosting.Administration.RampUpRule.ReroutePercentage} until it reaches \\r\\n' +\n                      '            {Microsoft.Web.Hosting.Administration.RampUpRule.MinReroutePercentage} or {Microsoft.Web.Hosting.Administration.RampUpRule.MaxReroutePercentage}. Site metrics are checked every N minutes specified in {Microsoft.Web.Hosting.Administration.RampUpRule.ChangeIntervalInMinutes}.\\r\\n' +\n                      '            Custom decision algorithm can be provided in TiPCallback site extension which Url can be specified in {Microsoft.Web.Hosting.Administration.RampUpRule.ChangeDecisionCallbackUrl}',\n                    type: 'number'\n                  },\n                  changeIntervalInMinutes: {\n                    format: 'int32',\n                    description: '[Optional] Specifies interval in minutes to reevaluate ReroutePercentage',\n                    type: 'integer'\n                  },\n                  minReroutePercentage: {\n                    format: 'double',\n                    description: '[Optional] Specifies lower boundary above which ReroutePercentage will stay.',\n                    type: 'number'\n                  },\n                  maxReroutePercentage: {\n                    format: 'double',\n                    description: '[Optional] Specifies upper boundary below which ReroutePercentage will stay.',\n                    type: 'number'\n                  },\n                  changeDecisionCallbackUrl: {\n                    description: 'Custom decision algorithm can be provided in TiPCallback site extension which Url can be specified. See TiPCallback site extension for the scaffold and contracts.\\r\\n' +\n                      '            https://www.siteextensions.net/packages/TiPCallback/',\n                    type: 'string'\n                  },\n                  name: {\n                    description: 'Name of the routing rule. The recommended name would be to point to the slot which will receive the traffic in the experiment.',\n                    type: 'string'\n                  }\n                }\n              }\n            }\n          }\n        },\n        limits: {\n          description: 'Site limits',\n          type: 'object',\n          properties: {\n            maxPercentageCpu: {\n              format: 'double',\n              description: 'Maximum allowed CPU usage percentage',\n              type: 'number'\n            },\n            maxMemoryInMb: {\n              format: 'int64',\n              description: 'Maximum allowed memory usage in MB',\n              type: 'integer'\n            },\n            maxDiskSizeInMb: {\n              format: 'int64',\n              description: 'Maximum allowed disk size usage in MB',\n              type: 'integer'\n            }\n          }\n        },\n        autoHealEnabled: { description: 'Auto heal enabled', type: 'boolean' },\n        autoHealRules: {\n          description: 'Auto heal rules',\n          type: 'object',\n          properties: {\n            triggers: {\n              description: 'Triggers - Conditions that describe when to execute the auto-heal actions',\n              type: 'object',\n              properties: {\n                requests: {\n                  description: 'Requests - Defines a rule based on total requests',\n                  type: 'object',\n                  properties: {\n                    count: {\n                      format: 'int32',\n                      description: 'Count',\n                      type: 'integer'\n                    },\n                    timeInterval: { description: 'TimeInterval', type: 'string' }\n                  }\n                },\n                privateBytesInKB: {\n                  format: 'int32',\n                  description: 'PrivateBytesInKB - Defines a rule based on private bytes',\n                  type: 'integer'\n                },\n                statusCodes: {\n                  description: 'StatusCodes - Defines a rule based on status codes',\n                  type: 'array',\n                  items: {\n                    description: 'StatusCodeBasedTrigger',\n                    type: 'object',\n                    properties: {\n                      status: {\n                        format: 'int32',\n                        description: 'HTTP status code',\n                        type: 'integer'\n                      },\n                      subStatus: {\n                        format: 'int32',\n                        description: 'SubStatus',\n                        type: 'integer'\n                      },\n                      win32Status: {\n                        format: 'int32',\n                        description: 'Win32 error code',\n                        type: 'integer'\n                      },\n                      count: {\n                        format: 'int32',\n                        description: 'Count',\n                        type: 'integer'\n                      },\n                      timeInterval: { description: 'TimeInterval', type: 'string' }\n                    }\n                  }\n                },\n                slowRequests: {\n                  description: 'SlowRequests - Defines a rule based on request execution time',\n                  type: 'object',\n                  properties: {\n                    timeTaken: { description: 'TimeTaken', type: 'string' },\n                    count: {\n                      format: 'int32',\n                      description: 'Count',\n                      type: 'integer'\n                    },\n                    timeInterval: { description: 'TimeInterval', type: 'string' }\n                  }\n                }\n              }\n            },\n            actions: {\n              description: 'Actions - Actions to be executed when a rule is triggered',\n              required: [ 'actionType' ],\n              type: 'object',\n              properties: {\n                actionType: {\n                  description: 'ActionType - predefined action to be taken',\n                  enum: [ 'Recycle', 'LogEvent', 'CustomAction' ],\n                  type: 'string',\n                  'x-ms-enum': { name: 'AutoHealActionType', modelAsString: false }\n                },\n                customAction: {\n                  description: 'CustomAction - custom action to be taken',\n                  type: 'object',\n                  properties: {\n                    exe: {\n                      description: 'Executable to be run',\n                      type: 'string'\n                    },\n                    parameters: {\n                      description: 'Parameters for the executable',\n                      type: 'string'\n                    }\n                  }\n                },\n                minProcessExecutionTime: {\n                  description: 'MinProcessExecutionTime - minimum time the process must execute\\r\\n' +\n                    '            before taking the action',\n                  type: 'string'\n                }\n              }\n            }\n          }\n        },\n        tracingOptions: { description: 'Tracing options', type: 'string' },\n        vnetName: { description: 'Vnet name', type: 'string' },\n        cors: {\n          description: 'Cross-Origin Resource Sharing (CORS) settings.',\n          type: 'object',\n          properties: {\n            allowedOrigins: {\n              description: 'Gets or sets the list of origins that should be allowed to make cross-origin\\r\\n' +\n                '            calls (for example: http://example.com:12345). Use \"*\" to allow all.',\n              type: 'array',\n              items: { type: 'string' }\n            }\n          }\n        },\n        apiDefinition: {\n          description: 'Information about the formal API definition for the web app.',\n          type: 'object',\n          properties: {\n            url: {\n              description: 'The URL of the API definition.',\n              type: 'string'\n            }\n          }\n        },\n        autoSwapSlotName: { description: 'Auto swap slot name', type: 'string' },\n        localMySqlEnabled: { description: 'Local mysql enabled', type: 'boolean' },\n        ipSecurityRestrictions: {\n          description: 'Ip Security restrictions',\n          type: 'array',\n          items: {\n            description: 'Represents an ip security restriction on a web app.',\n            type: 'object',\n            properties: {\n              ipAddress: {\n                description: 'IP address the security restriction is valid for',\n                type: 'string'\n              },\n              subnetMask: {\n                description: 'Subnet mask for the range of IP addresses the restriction is valid for',\n                type: 'string'\n              }\n            }\n          }\n        }\n      },\n      'x-ms-client-flatten': true\n    }\n  }\n}\n")),(0,o.kt)("h2",{id:"misc"},"Misc"),(0,o.kt)("p",null,"The resource version is ",(0,o.kt)("inlineCode",{parentName:"p"},"2015-08-01"),"."),(0,o.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2015-08-01/service.json"},"here"),"."))}d.isMDXComponent=!0}}]);