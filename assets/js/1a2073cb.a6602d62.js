"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[4983],{3905:function(e,r,t){t.d(r,{Zo:function(){return p},kt:function(){return m}});var n=t(67294);function a(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function o(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function i(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?o(Object(t),!0).forEach((function(r){a(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function s(e,r){if(null==e)return{};var t,n,a=function(e,r){if(null==e)return{};var t,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)t=o[n],r.indexOf(t)>=0||(a[t]=e[t]);return a}(e,r);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)t=o[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var c=n.createContext({}),u=function(e){var r=n.useContext(c),t=r;return e&&(t="function"==typeof e?e(r):i(i({},r),e)),t},p=function(e){var r=u(e.components);return n.createElement(c.Provider,{value:r},e.children)},l={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},d=n.forwardRef((function(e,r){var t=e.components,a=e.mdxType,o=e.originalType,c=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),d=u(t),m=a,f=d["".concat(c,".").concat(m)]||d[m]||l[m]||o;return t?n.createElement(f,i(i({ref:r},p),{},{components:t})):n.createElement(f,i({ref:r},p))}));function m(e,r){var t=arguments,a=r&&r.mdxType;if("string"==typeof e||a){var o=t.length,i=new Array(o);i[0]=d;var s={};for(var c in r)hasOwnProperty.call(r,c)&&(s[c]=r[c]);s.originalType=e,s.mdxType="string"==typeof e?e:a,i[1]=s;for(var u=2;u<o;u++)i[u]=t[u];return n.createElement.apply(null,i)}return n.createElement.apply(null,t)}d.displayName="MDXCreateElement"},3102:function(e,r,t){t.r(r),t.d(r,{frontMatter:function(){return s},contentTitle:function(){return c},metadata:function(){return u},toc:function(){return p},default:function(){return d}});var n=t(87462),a=t(63366),o=(t(67294),t(3905)),i=["components"],s={id:"AzureRequirements",title:"Requirements"},c=void 0,u={unversionedId:"azure/AzureRequirements",id:"azure/AzureRequirements",isDocsHomePage:!1,title:"Requirements",description:"Azure Account and Subscription",source:"@site/docs/azure/AzureRequirements.md",sourceDirName:"azure",slug:"/azure/AzureRequirements",permalink:"/docs/azure/AzureRequirements",tags:[],version:"current",frontMatter:{id:"AzureRequirements",title:"Requirements"},sidebar:"docs",previous:{title:"WebAppVnetConnectionSlot",permalink:"/docs/azure/resources/Web/WebAppVnetConnectionSlot"},next:{title:"Resources List",permalink:"/docs/k8s/ResourcesList"}},p=[{value:"Azure Account and Subscription",id:"azure-account-and-subscription",children:[],level:2},{value:"Azure CLI",id:"azure-cli",children:[],level:2},{value:"Login",id:"login",children:[{value:"tenantId",id:"tenantid",children:[],level:3},{value:"subscriptionId",id:"subscriptionid",children:[],level:3},{value:"appId and password",id:"appid-and-password",children:[],level:3},{value:"Register the Microsoft.Network and Microsoft.Compute namespaces",id:"register-the-microsoftnetwork-and-microsoftcompute-namespaces",children:[],level:3}],level:2}],l={toc:p};function d(e){var r=e.components,t=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,n.Z)({},l,t,{components:r,mdxType:"MDXLayout"}),(0,o.kt)("h2",{id:"azure-account-and-subscription"},"Azure Account and Subscription"),(0,o.kt)("p",null,"Visit the ",(0,o.kt)("a",{parentName:"p",href:"https://portal.azure.com"},"azure portal")," and ensure you have an azure account as well as a subscription."),(0,o.kt)("h2",{id:"azure-cli"},"Azure CLI"),(0,o.kt)("p",null,"Install the Azure Command Line Interface from ",(0,o.kt)("a",{parentName:"p",href:"https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest"},"https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest")),(0,o.kt)("p",null,"At this point, ensure the ",(0,o.kt)("strong",{parentName:"p"},"az")," command is installed:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"az --version\n")),(0,o.kt)("h2",{id:"login"},"Login"),(0,o.kt)("p",null,"Login to your Azure account"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"az login\n")),(0,o.kt)("h3",{id:"tenantid"},"tenantId"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"az account show\n")),(0,o.kt)("h3",{id:"subscriptionid"},"subscriptionId"),(0,o.kt)("p",null,"Get the ",(0,o.kt)("strong",{parentName:"p"},"subscriptionId")," from the following command:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"az account show --query id -otsv\n")),(0,o.kt)("h3",{id:"appid-and-password"},"appId and password"),(0,o.kt)("p",null,"Create a service principal name for instance ",(0,o.kt)("strong",{parentName:"p"},"sp1")," to manage new resources:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},'az ad sp create-for-rbac -n "sp1"\n')),(0,o.kt)("p",null,"Save somewhere the ",(0,o.kt)("strong",{parentName:"p"},"appId")," and the ",(0,o.kt)("strong",{parentName:"p"},"password")),(0,o.kt)("h3",{id:"register-the-microsoftnetwork-and-microsoftcompute-namespaces"},"Register the Microsoft.Network and Microsoft.Compute namespaces"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"az provider register --namespace Microsoft.Network\naz provider register --namespace Microsoft.Compute\n\n")),(0,o.kt)("p",null,"See ",(0,o.kt)("a",{parentName:"p",href:"https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/error-register-resource-provider"},"https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/error-register-resource-provider")))}d.isMDXComponent=!0}}]);