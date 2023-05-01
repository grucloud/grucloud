"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[87184],{3905:(e,r,t)=>{t.d(r,{Zo:()=>u,kt:()=>f});var i=t(67294);function n(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function o(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);r&&(i=i.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,i)}return t}function a(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?o(Object(t),!0).forEach((function(r){n(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function s(e,r){if(null==e)return{};var t,i,n=function(e,r){if(null==e)return{};var t,i,n={},o=Object.keys(e);for(i=0;i<o.length;i++)t=o[i],r.indexOf(t)>=0||(n[t]=e[t]);return n}(e,r);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(i=0;i<o.length;i++)t=o[i],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(n[t]=e[t])}return n}var l=i.createContext({}),c=function(e){var r=i.useContext(l),t=r;return e&&(t="function"==typeof e?e(r):a(a({},r),e)),t},u=function(e){var r=c(e.components);return i.createElement(l.Provider,{value:r},e.children)},p="mdxType",d={inlineCode:"code",wrapper:function(e){var r=e.children;return i.createElement(i.Fragment,{},r)}},y=i.forwardRef((function(e,r){var t=e.components,n=e.mdxType,o=e.originalType,l=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),p=c(t),y=n,f=p["".concat(l,".").concat(y)]||p[y]||d[y]||o;return t?i.createElement(f,a(a({ref:r},u),{},{components:t})):i.createElement(f,a({ref:r},u))}));function f(e,r){var t=arguments,n=r&&r.mdxType;if("string"==typeof e||n){var o=t.length,a=new Array(o);a[0]=y;var s={};for(var l in r)hasOwnProperty.call(r,l)&&(s[l]=r[l]);s.originalType=e,s[p]="string"==typeof e?e:n,a[1]=s;for(var c=2;c<o;c++)a[c]=t[c];return i.createElement.apply(null,a)}return i.createElement.apply(null,t)}y.displayName="MDXCreateElement"},42897:(e,r,t)=>{t.r(r),t.d(r,{assets:()=>l,contentTitle:()=>a,default:()=>d,frontMatter:()=>o,metadata:()=>s,toc:()=>c});var i=t(87462),n=(t(67294),t(3905));const o={id:"FirewallPolicyIdpsSignaturesOverride",title:"FirewallPolicyIdpsSignaturesOverride"},a=void 0,s={unversionedId:"azure/resources/Network/FirewallPolicyIdpsSignaturesOverride",id:"azure/resources/Network/FirewallPolicyIdpsSignaturesOverride",title:"FirewallPolicyIdpsSignaturesOverride",description:"Provides a FirewallPolicyIdpsSignaturesOverride from the Network group",source:"@site/docs/azure/resources/Network/FirewallPolicyIdpsSignaturesOverride.md",sourceDirName:"azure/resources/Network",slug:"/azure/resources/Network/FirewallPolicyIdpsSignaturesOverride",permalink:"/docs/azure/resources/Network/FirewallPolicyIdpsSignaturesOverride",draft:!1,tags:[],version:"current",frontMatter:{id:"FirewallPolicyIdpsSignaturesOverride",title:"FirewallPolicyIdpsSignaturesOverride"},sidebar:"docs",previous:{title:"FirewallPolicy",permalink:"/docs/azure/resources/Network/FirewallPolicy"},next:{title:"FirewallPolicyRuleCollectionGroup",permalink:"/docs/azure/resources/Network/FirewallPolicyRuleCollectionGroup"}},l={},c=[{value:"Examples",id:"examples",level:2},{value:"put signature overrides",id:"put-signature-overrides",level:3},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],u={toc:c},p="wrapper";function d(e){let{components:r,...t}=e;return(0,n.kt)(p,(0,i.Z)({},u,t,{components:r,mdxType:"MDXLayout"}),(0,n.kt)("p",null,"Provides a ",(0,n.kt)("strong",{parentName:"p"},"FirewallPolicyIdpsSignaturesOverride")," from the ",(0,n.kt)("strong",{parentName:"p"},"Network")," group"),(0,n.kt)("h2",{id:"examples"},"Examples"),(0,n.kt)("h3",{id:"put-signature-overrides"},"put signature overrides"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-js"},'provider.Network.makeFirewallPolicyIdpsSignaturesOverride({\n  name: "myFirewallPolicyIdpsSignaturesOverride",\n  properties: () => ({\n    id: "/subscriptions/e747cc13-97d4-4a79-b463-42d7f4e558f2/resourceGroups/rg1/providers/Microsoft.Network/firewallPolicies/firewallPolicy/signatureOverrides/default",\n    name: "default",\n    type: "Microsoft.Network/firewallPolicies/signatureOverrides",\n    properties: { signatures: { 2000105: "Off", 2000106: "Deny" } },\n  }),\n  dependencies: ({ resources }) => ({\n    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],\n    securityPartnerProvider:\n      resources.Network.SecurityPartnerProvider["mySecurityPartnerProvider"],\n    firewallPolicy: resources.Network.FirewallPolicy["myFirewallPolicy"],\n  }),\n});\n\n')),(0,n.kt)("h2",{id:"dependencies"},"Dependencies"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"/docs/azure/resources/Network/SecurityPartnerProvider"},"SecurityPartnerProvider")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"/docs/azure/resources/Network/FirewallPolicy"},"FirewallPolicy"))),(0,n.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-js"},"{\n  'x-ms-azure-resource': true,\n  type: 'object',\n  description: 'Contains all specific policy signatures overrides for the IDPS',\n  properties: {\n    name: {\n      type: 'string',\n      description: 'Contains the name of the resource (default)'\n    },\n    id: {\n      description: 'Will contain the resource id of the signature override resource',\n      type: 'string'\n    },\n    type: {\n      type: 'string',\n      description: 'Will contain the type of the resource: Microsoft.Network/firewallPolicies/intrusionDetectionSignaturesOverrides'\n    },\n    properties: {\n      type: 'object',\n      description: 'Will contain the properties of the resource (the actual signature overrides)',\n      properties: {\n        signatures: { type: 'object', additionalProperties: { type: 'string' } }\n      }\n    }\n  }\n}\n")),(0,n.kt)("h2",{id:"misc"},"Misc"),(0,n.kt)("p",null,"The resource version is ",(0,n.kt)("inlineCode",{parentName:"p"},"2021-05-01"),"."),(0,n.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,n.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/firewallPolicy.json"},"here"),"."))}d.isMDXComponent=!0}}]);