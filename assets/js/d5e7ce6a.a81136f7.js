"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[35901],{3905:(e,n,t)=>{t.d(n,{Zo:()=>l,kt:()=>v});var r=t(67294);function i(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function s(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function c(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?s(Object(t),!0).forEach((function(n){i(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):s(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function a(e,n){if(null==e)return{};var t,r,i=function(e,n){if(null==e)return{};var t,r,i={},s=Object.keys(e);for(r=0;r<s.length;r++)t=s[r],n.indexOf(t)>=0||(i[t]=e[t]);return i}(e,n);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(r=0;r<s.length;r++)t=s[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var o=r.createContext({}),p=function(e){var n=r.useContext(o),t=n;return e&&(t="function"==typeof e?e(n):c(c({},n),e)),t},l=function(e){var n=p(e.components);return r.createElement(o.Provider,{value:n},e.children)},u="mdxType",d={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},m=r.forwardRef((function(e,n){var t=e.components,i=e.mdxType,s=e.originalType,o=e.parentName,l=a(e,["components","mdxType","originalType","parentName"]),u=p(t),m=i,v=u["".concat(o,".").concat(m)]||u[m]||d[m]||s;return t?r.createElement(v,c(c({ref:n},l),{},{components:t})):r.createElement(v,c({ref:n},l))}));function v(e,n){var t=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var s=t.length,c=new Array(s);c[0]=m;var a={};for(var o in n)hasOwnProperty.call(n,o)&&(a[o]=n[o]);a.originalType=e,a[u]="string"==typeof e?e:i,c[1]=a;for(var p=2;p<s;p++)c[p]=t[p];return r.createElement.apply(null,c)}return r.createElement.apply(null,t)}m.displayName="MDXCreateElement"},35550:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>o,contentTitle:()=>c,default:()=>d,frontMatter:()=>s,metadata:()=>a,toc:()=>p});var r=t(87462),i=(t(67294),t(3905));const s={id:"ScopeAccessReviewInstanceById",title:"ScopeAccessReviewInstanceById"},c=void 0,a={unversionedId:"azure/resources/Authorization/ScopeAccessReviewInstanceById",id:"azure/resources/Authorization/ScopeAccessReviewInstanceById",title:"ScopeAccessReviewInstanceById",description:"Provides a ScopeAccessReviewInstanceById from the Authorization group",source:"@site/docs/azure/resources/Authorization/ScopeAccessReviewInstanceById.md",sourceDirName:"azure/resources/Authorization",slug:"/azure/resources/Authorization/ScopeAccessReviewInstanceById",permalink:"/docs/azure/resources/Authorization/ScopeAccessReviewInstanceById",draft:!1,tags:[],version:"current",frontMatter:{id:"ScopeAccessReviewInstanceById",title:"ScopeAccessReviewInstanceById"},sidebar:"docs",previous:{title:"ScopeAccessReviewHistoryDefinitionById",permalink:"/docs/azure/resources/Authorization/ScopeAccessReviewHistoryDefinitionById"},next:{title:"ScopeAccessReviewScheduleDefinitionById",permalink:"/docs/azure/resources/Authorization/ScopeAccessReviewScheduleDefinitionById"}},o={},p=[{value:"Examples",id:"examples",level:2},{value:"GetAccessReviews",id:"getaccessreviews",level:3},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],l={toc:p},u="wrapper";function d(e){let{components:n,...t}=e;return(0,i.kt)(u,(0,r.Z)({},l,t,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Provides a ",(0,i.kt)("strong",{parentName:"p"},"ScopeAccessReviewInstanceById")," from the ",(0,i.kt)("strong",{parentName:"p"},"Authorization")," group"),(0,i.kt)("h2",{id:"examples"},"Examples"),(0,i.kt)("h3",{id:"getaccessreviews"},"GetAccessReviews"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "ScopeAccessReviewInstanceById",\n    group: "Authorization",\n    name: "myScopeAccessReviewInstanceById",\n    dependencies: ({}) => ({\n      scheduleDefinitionId: "myScopeAccessReviewScheduleDefinitionById",\n    }),\n  },\n];\n\n')),(0,i.kt)("h2",{id:"dependencies"},"Dependencies"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Authorization/ScopeAccessReviewScheduleDefinitionById"},"ScopeAccessReviewScheduleDefinitionById"))),(0,i.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"{\n  type: 'object',\n  properties: {\n    status: {\n      type: 'string',\n      readOnly: true,\n      description: 'This read-only field specifies the status of an access review instance.',\n      enum: [\n        'NotStarted',    'InProgress',\n        'Completed',     'Applied',\n        'Initializing',  'Applying',\n        'Completing',    'Scheduled',\n        'AutoReviewing', 'AutoReviewed',\n        'Starting'\n      ],\n      'x-ms-enum': { name: 'AccessReviewInstanceStatus', modelAsString: true }\n    },\n    startDateTime: {\n      type: 'string',\n      format: 'date-time',\n      description: 'The DateTime when the review instance is scheduled to be start.',\n      'x-nullable': false\n    },\n    endDateTime: {\n      type: 'string',\n      format: 'date-time',\n      description: 'The DateTime when the review instance is scheduled to end.',\n      'x-nullable': false\n    },\n    reviewers: {\n      type: 'array',\n      items: {\n        type: 'object',\n        properties: {\n          principalId: {\n            type: 'string',\n            description: 'The id of the reviewer(user/servicePrincipal)'\n          },\n          principalType: {\n            type: 'string',\n            readOnly: true,\n            description: 'The identity type : user/servicePrincipal',\n            enum: [ 'user', 'servicePrincipal' ],\n            'x-ms-enum': { name: 'AccessReviewReviewerType', modelAsString: true }\n          }\n        },\n        description: 'Descriptor for what needs to be reviewed'\n      },\n      'x-ms-identifiers': [ 'principalId' ],\n      description: 'This is the collection of reviewers.'\n    },\n    backupReviewers: {\n      type: 'array',\n      items: {\n        type: 'object',\n        properties: {\n          principalId: {\n            type: 'string',\n            description: 'The id of the reviewer(user/servicePrincipal)'\n          },\n          principalType: {\n            type: 'string',\n            readOnly: true,\n            description: 'The identity type : user/servicePrincipal',\n            enum: [ 'user', 'servicePrincipal' ],\n            'x-ms-enum': { name: 'AccessReviewReviewerType', modelAsString: true }\n          }\n        },\n        description: 'Descriptor for what needs to be reviewed'\n      },\n      'x-ms-identifiers': [ 'principalId' ],\n      description: 'This is the collection of backup reviewers.'\n    },\n    reviewersType: {\n      type: 'string',\n      readOnly: true,\n      description: 'This field specifies the type of reviewers for a review. Usually for a review, reviewers are explicitly assigned. However, in some cases, the reviewers may not be assigned and instead be chosen dynamically. For example managers review or self review.',\n      enum: [ 'Assigned', 'Self', 'Managers' ],\n      'x-ms-enum': {\n        name: 'AccessReviewInstanceReviewersType',\n        modelAsString: true\n      }\n    }\n  },\n  description: 'Access Review Instance properties.'\n}\n")),(0,i.kt)("h2",{id:"misc"},"Misc"),(0,i.kt)("p",null,"The resource version is ",(0,i.kt)("inlineCode",{parentName:"p"},"2021-12-01-preview"),"."),(0,i.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/authorization/resource-manager/Microsoft.Authorization/preview/2021-12-01-preview/authorization-AccessReviewCalls.json"},"here"),"."))}d.isMDXComponent=!0}}]);