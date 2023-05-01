"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[79113],{3905:(e,n,t)=>{t.d(n,{Zo:()=>u,kt:()=>g});var r=t(67294);function o(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function s(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?s(Object(t),!0).forEach((function(n){o(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):s(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function a(e,n){if(null==e)return{};var t,r,o=function(e,n){if(null==e)return{};var t,r,o={},s=Object.keys(e);for(r=0;r<s.length;r++)t=s[r],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(r=0;r<s.length;r++)t=s[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var c=r.createContext({}),l=function(e){var n=r.useContext(c),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},u=function(e){var n=l(e.components);return r.createElement(c.Provider,{value:n},e.children)},p="mdxType",m={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},d=r.forwardRef((function(e,n){var t=e.components,o=e.mdxType,s=e.originalType,c=e.parentName,u=a(e,["components","mdxType","originalType","parentName"]),p=l(t),d=o,g=p["".concat(c,".").concat(d)]||p[d]||m[d]||s;return t?r.createElement(g,i(i({ref:n},u),{},{components:t})):r.createElement(g,i({ref:n},u))}));function g(e,n){var t=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var s=t.length,i=new Array(s);i[0]=d;var a={};for(var c in n)hasOwnProperty.call(n,c)&&(a[c]=n[c]);a.originalType=e,a[p]="string"==typeof e?e:o,i[1]=a;for(var l=2;l<s;l++)i[l]=t[l];return r.createElement.apply(null,i)}return r.createElement.apply(null,t)}d.displayName="MDXCreateElement"},59281:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>i,default:()=>m,frontMatter:()=>s,metadata:()=>a,toc:()=>l});var r=t(87462),o=(t(67294),t(3905));const s={id:"SqlResourceSqlRoleAssignment",title:"SqlResourceSqlRoleAssignment"},i=void 0,a={unversionedId:"azure/resources/DocumentDB/SqlResourceSqlRoleAssignment",id:"azure/resources/DocumentDB/SqlResourceSqlRoleAssignment",title:"SqlResourceSqlRoleAssignment",description:"Provides a SqlResourceSqlRoleAssignment from the DocumentDB group",source:"@site/docs/azure/resources/DocumentDB/SqlResourceSqlRoleAssignment.md",sourceDirName:"azure/resources/DocumentDB",slug:"/azure/resources/DocumentDB/SqlResourceSqlRoleAssignment",permalink:"/docs/azure/resources/DocumentDB/SqlResourceSqlRoleAssignment",draft:!1,tags:[],version:"current",frontMatter:{id:"SqlResourceSqlRoleAssignment",title:"SqlResourceSqlRoleAssignment"},sidebar:"docs",previous:{title:"SqlResourceSqlDatabaseThroughput",permalink:"/docs/azure/resources/DocumentDB/SqlResourceSqlDatabaseThroughput"},next:{title:"SqlResourceSqlRoleDefinition",permalink:"/docs/azure/resources/DocumentDB/SqlResourceSqlRoleDefinition"}},c={},l=[{value:"Examples",id:"examples",level:2},{value:"CosmosDBSqlRoleAssignmentCreateUpdate",id:"cosmosdbsqlroleassignmentcreateupdate",level:3},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],u={toc:l},p="wrapper";function m(e){let{components:n,...t}=e;return(0,o.kt)(p,(0,r.Z)({},u,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Provides a ",(0,o.kt)("strong",{parentName:"p"},"SqlResourceSqlRoleAssignment")," from the ",(0,o.kt)("strong",{parentName:"p"},"DocumentDB")," group"),(0,o.kt)("h2",{id:"examples"},"Examples"),(0,o.kt)("h3",{id:"cosmosdbsqlroleassignmentcreateupdate"},"CosmosDBSqlRoleAssignmentCreateUpdate"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "SqlResourceSqlRoleAssignment",\n    group: "DocumentDB",\n    name: "mySqlResourceSqlRoleAssignment",\n    properties: () => ({\n      properties: {\n        roleDefinitionId:\n          "/subscriptions/mySubscriptionId/resourceGroups/myResourceGroupName/providers/Microsoft.DocumentDB/databaseAccounts/myAccountName/sqlRoleDefinitions/myRoleDefinitionId",\n        scope:\n          "/subscriptions/mySubscriptionId/resourceGroups/myResourceGroupName/providers/Microsoft.DocumentDB/databaseAccounts/myAccountName/dbs/purchases/colls/redmond-purchases",\n        principalId: "myPrincipalId",\n      },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      sqlResourceSqlRoleDefinition: "mySqlResourceSqlRoleDefinition",\n      account: "myDatabaseAccount",\n    }),\n  },\n];\n\n')),(0,o.kt)("h2",{id:"dependencies"},"Dependencies"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/DocumentDB/SqlResourceSqlRoleDefinition"},"SqlResourceSqlRoleDefinition")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/DocumentDB/DatabaseAccount"},"DatabaseAccount"))),(0,o.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-json"},"{\n  description: 'Parameters to create and update an Azure Cosmos DB SQL Role Assignment.',\n  type: 'object',\n  properties: {\n    properties: {\n      'x-ms-client-flatten': true,\n      description: 'Properties to create and update an Azure Cosmos DB SQL Role Assignment.',\n      type: 'object',\n      properties: {\n        roleDefinitionId: {\n          type: 'string',\n          description: 'The unique identifier for the associated Role Definition.'\n        },\n        scope: {\n          type: 'string',\n          description: 'The data plane resource path for which access is being granted through this Role Assignment.'\n        },\n        principalId: {\n          type: 'string',\n          description: 'The unique identifier for the associated AAD principal in the AAD graph to which access is being granted through this Role Assignment. Tenant ID for the principal is inferred using the tenant associated with the subscription.'\n        }\n      }\n    }\n  }\n}\n")),(0,o.kt)("h2",{id:"misc"},"Misc"),(0,o.kt)("p",null,"The resource version is ",(0,o.kt)("inlineCode",{parentName:"p"},"2022-05-15"),"."),(0,o.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/cosmos-db/resource-manager/Microsoft.DocumentDB/stable/2022-05-15/rbac.json"},"here"),"."))}m.isMDXComponent=!0}}]);