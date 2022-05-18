"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[9666],{3905:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return S}});var r=n(67294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var c=r.createContext({}),s=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},p=function(e){var t=s(e.components);return r.createElement(c.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,a=e.originalType,c=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),m=s(n),S=i,d=m["".concat(c,".").concat(S)]||m[S]||u[S]||a;return n?r.createElement(d,o(o({ref:t},p),{},{components:n})):r.createElement(d,o({ref:t},p))}));function S(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var a=n.length,o=new Array(a);o[0]=m;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l.mdxType="string"==typeof e?e:i,o[1]=l;for(var s=2;s<a;s++)o[s]=n[s];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},8496:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return l},contentTitle:function(){return c},metadata:function(){return s},toc:function(){return p},default:function(){return m}});var r=n(87462),i=n(63366),a=(n(67294),n(3905)),o=["components"],l={id:"SNSTopic",title:"Topic"},c=void 0,s={unversionedId:"aws/resources/SNS/SNSTopic",id:"aws/resources/SNS/SNSTopic",isDocsHomePage:!1,title:"Topic",description:"Manages an SNS Topic.",source:"@site/docs/aws/resources/SNS/Topic.md",sourceDirName:"aws/resources/SNS",slug:"/aws/resources/SNS/SNSTopic",permalink:"/docs/aws/resources/SNS/SNSTopic",tags:[],version:"current",frontMatter:{id:"SNSTopic",title:"Topic"},sidebar:"docs",previous:{title:"Subscription",permalink:"/docs/aws/resources/SNS/SNSSubscription"},next:{title:"Network Firewall",permalink:"/docs/aws/resources/NetworkFirewall/NetworkFirewall"}},p=[{value:"Sample code",id:"sample-code",children:[],level:2},{value:"Properties",id:"properties",children:[],level:2},{value:"USed By",id:"used-by",children:[],level:2},{value:"Full Examples",id:"full-examples",children:[],level:2},{value:"List",id:"list",children:[],level:2}],u={toc:p};function m(e){var t=e.components,n=(0,i.Z)(e,o);return(0,a.kt)("wrapper",(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Manages an ",(0,a.kt)("a",{parentName:"p",href:"https://console.aws.amazon.com/sns/v3/home?#/"},"SNS Topic"),"."),(0,a.kt)("h2",{id:"sample-code"},"Sample code"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Topic",\n    group: "SNS",\n    name: "MySnsTopic",\n    properties: ({ config }) => ({\n      Attributes: {\n        Policy: {\n          Version: "2008-10-17",\n          Id: "__default_policy_ID",\n          Statement: [\n            {\n              Sid: "__default_statement_ID",\n              Effect: "Allow",\n              Principal: {\n                AWS: "*",\n              },\n              Action: [\n                "SNS:GetTopicAttributes",\n                "SNS:SetTopicAttributes",\n                "SNS:AddPermission",\n                "SNS:RemovePermission",\n                "SNS:DeleteTopic",\n                "SNS:Subscribe",\n                "SNS:ListSubscriptionsByTopic",\n                "SNS:Publish",\n              ],\n              Resource: `arn:aws:sns:${\n                config.region\n              }:${config.accountId()}:MySnsTopic`,\n              Condition: {\n                StringEquals: {\n                  "AWS:SourceOwner": `${config.accountId()}`,\n                },\n              },\n            },\n          ],\n        },\n        DisplayName: "",\n        DeliveryPolicy: {\n          http: {\n            defaultHealthyRetryPolicy: {\n              minDelayTarget: 20,\n              maxDelayTarget: 20,\n              numRetries: 3,\n              numMaxDelayRetries: 0,\n              numNoDelayRetries: 0,\n              numMinDelayRetries: 0,\n              backoffFunction: "linear",\n            },\n            disableSubscriptionOverrides: false,\n          },\n        },\n      },\n    }),\n  },\n];\n')),(0,a.kt)("h2",{id:"properties"},"Properties"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sns/interfaces/createtopiccommandinput.html"},"CreateTopicCommandInput"))),(0,a.kt)("h2",{id:"used-by"},"USed By"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/aws/resources/SNS/SNSSubscription"},"SNS Subscription"))),(0,a.kt)("h2",{id:"full-examples"},"Full Examples"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/SNS/sns-simple"},"Simple example")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/SNS/sns-lambda"},"SNS with Lambda")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/SNS/sns-sqs"},"SNS with SQS"))),(0,a.kt)("h2",{id:"list"},"List"),(0,a.kt)("p",null,"The topics can be filtered with the ",(0,a.kt)("em",{parentName:"p"},"Topic")," type:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t Topic\n")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-txt"},"")))}m.isMDXComponent=!0}}]);