"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[1933],{3905:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return S}});var r=n(67294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var c=r.createContext({}),l=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},p=function(e){var t=l(e.components);return r.createElement(c.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,c=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),m=l(n),S=a,d=m["".concat(c,".").concat(S)]||m[S]||u[S]||i;return n?r.createElement(d,o(o({ref:t},p),{},{components:n})):r.createElement(d,o({ref:t},p))}));function S(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,o=new Array(i);o[0]=m;var s={};for(var c in t)hasOwnProperty.call(t,c)&&(s[c]=t[c]);s.originalType=e,s.mdxType="string"==typeof e?e:a,o[1]=s;for(var l=2;l<i;l++)o[l]=n[l];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},15387:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return s},contentTitle:function(){return c},metadata:function(){return l},toc:function(){return p},default:function(){return m}});var r=n(87462),a=n(63366),i=(n(67294),n(3905)),o=["components"],s={id:"SNSSubscription",title:"Subscription"},c=void 0,l={unversionedId:"aws/resources/SNS/SNSSubscription",id:"aws/resources/SNS/SNSSubscription",isDocsHomePage:!1,title:"Subscription",description:"Manages an SNS Subscription.",source:"@site/docs/aws/resources/SNS/Subscription.md",sourceDirName:"aws/resources/SNS",slug:"/aws/resources/SNS/SNSSubscription",permalink:"/docs/aws/resources/SNS/SNSSubscription",tags:[],version:"current",frontMatter:{id:"SNSSubscription",title:"Subscription"},sidebar:"docs",previous:{title:"State Machine",permalink:"/docs/aws/resources/SFN/StateMachine"},next:{title:"Topic",permalink:"/docs/aws/resources/SNS/SNSTopic"}},p=[{value:"Sample code",id:"sample-code",children:[],level:2},{value:"Properties",id:"properties",children:[],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"Full Examples",id:"full-examples",children:[],level:2},{value:"List",id:"list",children:[],level:2}],u={toc:p};function m(e){var t=e.components,n=(0,a.Z)(e,o);return(0,i.kt)("wrapper",(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Manages an ",(0,i.kt)("a",{parentName:"p",href:"https://console.aws.amazon.com/sns/v3/home?#/"},"SNS Subscription"),"."),(0,i.kt)("h2",{id:"sample-code"},"Sample code"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Subscription",\n    group: "SNS",\n    properties: ({}) => ({\n      RawMessageDelivery: "false",\n      PendingConfirmation: "false",\n      ConfirmationWasAuthenticated: "true",\n    }),\n    dependencies: () => ({\n      snsTopic: "app-MySnsTopic",\n      lambdaFunction: "app-TopicConsumerFunction1",\n    }),\n  },\n];\n')),(0,i.kt)("h2",{id:"properties"},"Properties"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sns/modules/subscribeinput.html"},"SubscribeInput"))),(0,i.kt)("h2",{id:"dependencies"},"Dependencies"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/aws/resources/SNS/SNSTopic"},"SNS Topic"))),(0,i.kt)("h2",{id:"full-examples"},"Full Examples"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/SNS/sns-simple"},"Simple example")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/SNS/sns-lambda"},"SNS with Lambda")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/SNS/sns-sqs"},"SNS with SQS"))),(0,i.kt)("h2",{id:"list"},"List"),(0,i.kt)("p",null,"The subscription can be filtered with the ",(0,i.kt)("em",{parentName:"p"},"Subscription")," type:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t Subscription\n")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-txt"},"")))}m.isMDXComponent=!0}}]);