"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[23212],{3905:function(e,r,t){t.d(r,{Zo:function(){return c},kt:function(){return m}});var n=t(67294);function i(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function o(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function a(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?o(Object(t),!0).forEach((function(r){i(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function p(e,r){if(null==e)return{};var t,n,i=function(e,r){if(null==e)return{};var t,n,i={},o=Object.keys(e);for(n=0;n<o.length;n++)t=o[n],r.indexOf(t)>=0||(i[t]=e[t]);return i}(e,r);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)t=o[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var l=n.createContext({}),s=function(e){var r=n.useContext(l),t=r;return e&&(t="function"==typeof e?e(r):a(a({},r),e)),t},c=function(e){var r=s(e.components);return n.createElement(l.Provider,{value:r},e.children)},u={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},d=n.forwardRef((function(e,r){var t=e.components,i=e.mdxType,o=e.originalType,l=e.parentName,c=p(e,["components","mdxType","originalType","parentName"]),d=s(t),m=i,y=d["".concat(l,".").concat(m)]||d[m]||u[m]||o;return t?n.createElement(y,a(a({ref:r},c),{},{components:t})):n.createElement(y,a({ref:r},c))}));function m(e,r){var t=arguments,i=r&&r.mdxType;if("string"==typeof e||i){var o=t.length,a=new Array(o);a[0]=d;var p={};for(var l in r)hasOwnProperty.call(r,l)&&(p[l]=r[l]);p.originalType=e,p.mdxType="string"==typeof e?e:i,a[1]=p;for(var s=2;s<o;s++)a[s]=t[s];return n.createElement.apply(null,a)}return n.createElement.apply(null,t)}d.displayName="MDXCreateElement"},45475:function(e,r,t){t.r(r),t.d(r,{frontMatter:function(){return p},contentTitle:function(){return l},metadata:function(){return s},toc:function(){return c},default:function(){return d}});var n=t(87462),i=t(63366),o=(t(67294),t(3905)),a=["components"],p={id:"GalleryApplication",title:"GalleryApplication"},l=void 0,s={unversionedId:"azure/resources/Compute/GalleryApplication",id:"azure/resources/Compute/GalleryApplication",isDocsHomePage:!1,title:"GalleryApplication",description:"Provides a GalleryApplication from the Compute group",source:"@site/docs/azure/resources/Compute/GalleryApplication.md",sourceDirName:"azure/resources/Compute",slug:"/azure/resources/Compute/GalleryApplication",permalink:"/docs/azure/resources/Compute/GalleryApplication",tags:[],version:"current",frontMatter:{id:"GalleryApplication",title:"GalleryApplication"},sidebar:"docs",previous:{title:"Gallery",permalink:"/docs/azure/resources/Compute/Gallery"},next:{title:"GalleryApplicationVersion",permalink:"/docs/azure/resources/Compute/GalleryApplicationVersion"}},c=[{value:"Examples",id:"examples",children:[{value:"Create or update a simple gallery Application.",id:"create-or-update-a-simple-gallery-application",children:[],level:3}],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"Swagger Schema",id:"swagger-schema",children:[],level:2},{value:"Misc",id:"misc",children:[],level:2}],u={toc:c};function d(e){var r=e.components,t=(0,i.Z)(e,a);return(0,o.kt)("wrapper",(0,n.Z)({},u,t,{components:r,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Provides a ",(0,o.kt)("strong",{parentName:"p"},"GalleryApplication")," from the ",(0,o.kt)("strong",{parentName:"p"},"Compute")," group"),(0,o.kt)("h2",{id:"examples"},"Examples"),(0,o.kt)("h3",{id:"create-or-update-a-simple-gallery-application"},"Create or update a simple gallery Application."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "GalleryApplication",\n    group: "Compute",\n    name: "myGalleryApplication",\n    properties: () => ({\n      location: "West US",\n      properties: {\n        description: "This is the gallery application description.",\n        eula: "This is the gallery application EULA.",\n        privacyStatementUri: "myPrivacyStatementUri}",\n        releaseNoteUri: "myReleaseNoteUri",\n        supportedOSType: "Windows",\n      },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      gallery: "myGallery",\n    }),\n  },\n];\n\n')),(0,o.kt)("h2",{id:"dependencies"},"Dependencies"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Compute/Gallery"},"Gallery"))),(0,o.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"{\n  properties: {\n    properties: {\n      'x-ms-client-flatten': true,\n      properties: {\n        description: {\n          type: 'string',\n          description: 'The description of this gallery Application Definition resource. This property is updatable.'\n        },\n        eula: {\n          type: 'string',\n          description: 'The Eula agreement for the gallery Application Definition.'\n        },\n        privacyStatementUri: { type: 'string', description: 'The privacy statement uri.' },\n        releaseNoteUri: { type: 'string', description: 'The release note uri.' },\n        endOfLifeDate: {\n          type: 'string',\n          format: 'date-time',\n          description: 'The end of life date of the gallery Application Definition. This property can be used for decommissioning purposes. This property is updatable.'\n        },\n        supportedOSType: {\n          type: 'string',\n          description: 'This property allows you to specify the supported type of the OS that application is built for. <br><br> Possible values are: <br><br> **Windows** <br><br> **Linux**',\n          enum: [ 'Windows', 'Linux' ],\n          'x-ms-enum': { name: 'OperatingSystemTypes', modelAsString: false }\n        }\n      },\n      required: [ 'supportedOSType' ],\n      description: 'Describes the properties of a gallery Application Definition.'\n    }\n  },\n  allOf: [\n    {\n      description: 'The Resource model definition.',\n      properties: {\n        id: { readOnly: true, type: 'string', description: 'Resource Id' },\n        name: {\n          readOnly: true,\n          type: 'string',\n          description: 'Resource name'\n        },\n        type: {\n          readOnly: true,\n          type: 'string',\n          description: 'Resource type'\n        },\n        location: { type: 'string', description: 'Resource location' },\n        tags: {\n          type: 'object',\n          additionalProperties: { type: 'string' },\n          description: 'Resource tags'\n        }\n      },\n      required: [ 'location' ],\n      'x-ms-azure-resource': true\n    }\n  ],\n  description: 'Specifies information about the gallery Application Definition that you want to create or update.'\n}\n")),(0,o.kt)("h2",{id:"misc"},"Misc"),(0,o.kt)("p",null,"The resource version is ",(0,o.kt)("inlineCode",{parentName:"p"},"2021-10-01"),"."),(0,o.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/stable/2021-10-01/gallery.json"},"here"),"."))}d.isMDXComponent=!0}}]);