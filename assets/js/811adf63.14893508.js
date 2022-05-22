"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[24089],{3905:function(e,n,t){t.d(n,{Zo:function(){return l},kt:function(){return m}});var r=t(67294);function o(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function i(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function a(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?i(Object(t),!0).forEach((function(n){o(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function s(e,n){if(null==e)return{};var t,r,o=function(e,n){if(null==e)return{};var t,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var c=r.createContext({}),u=function(e){var n=r.useContext(c),t=n;return e&&(t="function"==typeof e?e(n):a(a({},n),e)),t},l=function(e){var n=u(e.components);return r.createElement(c.Provider,{value:n},e.children)},d={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},p=r.forwardRef((function(e,n){var t=e.components,o=e.mdxType,i=e.originalType,c=e.parentName,l=s(e,["components","mdxType","originalType","parentName"]),p=u(t),m=o,f=p["".concat(c,".").concat(m)]||p[m]||d[m]||i;return t?r.createElement(f,a(a({ref:n},l),{},{components:t})):r.createElement(f,a({ref:n},l))}));function m(e,n){var t=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var i=t.length,a=new Array(i);a[0]=p;var s={};for(var c in n)hasOwnProperty.call(n,c)&&(s[c]=n[c]);s.originalType=e,s.mdxType="string"==typeof e?e:o,a[1]=s;for(var u=2;u<i;u++)a[u]=t[u];return r.createElement.apply(null,a)}return r.createElement.apply(null,t)}p.displayName="MDXCreateElement"},98575:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return s},contentTitle:function(){return c},metadata:function(){return u},toc:function(){return l},default:function(){return p}});var r=t(87462),o=t(63366),i=(t(67294),t(3905)),a=["components"],s={id:"Distribution",title:"Distribution"},c=void 0,u={unversionedId:"aws/resources/CloudFront/Distribution",id:"aws/resources/CloudFront/Distribution",isDocsHomePage:!1,title:"Distribution",description:"Provides a Cloud Front distribution.",source:"@site/docs/aws/resources/CloudFront/Distribution.md",sourceDirName:"aws/resources/CloudFront",slug:"/aws/resources/CloudFront/Distribution",permalink:"/docs/aws/resources/CloudFront/Distribution",tags:[],version:"current",frontMatter:{id:"Distribution",title:"Distribution"},sidebar:"docs",previous:{title:"Resolver",permalink:"/docs/aws/resources/AppSync/Resolver"},next:{title:"Origin Access Identity",permalink:"/docs/aws/resources/CloudFront/OriginAccessIdentity"}},l=[{value:"CloudFront with a S3 bucket as origin",id:"cloudfront-with-a-s3-bucket-as-origin",children:[{value:"Examples",id:"examples",children:[],level:3},{value:"Properties",id:"properties",children:[],level:3},{value:"Cache Invalidation",id:"cache-invalidation",children:[],level:3},{value:"Dependencies",id:"dependencies",children:[],level:3}],level:2}],d={toc:l};function p(e){var n=e.components,t=(0,o.Z)(e,a);return(0,i.kt)("wrapper",(0,r.Z)({},d,t,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Provides a Cloud Front distribution."),(0,i.kt)("h2",{id:"cloudfront-with-a-s3-bucket-as-origin"},"CloudFront with a S3 bucket as origin"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Distribution",\n    group: "CloudFront",\n    name: "E2P10W0URYHQV",\n    properties: ({ getId }) => ({\n      PriceClass: "PriceClass_100",\n      Aliases: {\n        Quantity: 1,\n        Items: [\n          getId({\n            type: "Certificate",\n            group: "ACM",\n            name: "cloudfront-demo.grucloud.org",\n            path: "name",\n          }),\n        ],\n      },\n      DefaultRootObject: "index.html",\n      DefaultCacheBehavior: {\n        TargetOriginId: `${getId({\n          type: "Bucket",\n          group: "S3",\n          name: "cloudfront-demo.grucloud.org",\n          path: "name",\n        })}.s3.us-east-1.amazonaws.com`,\n        TrustedSigners: {\n          Enabled: false,\n          Quantity: 0,\n          Items: [],\n        },\n        TrustedKeyGroups: {\n          Enabled: false,\n          Quantity: 0,\n          Items: [],\n        },\n        ViewerProtocolPolicy: "redirect-to-https",\n        AllowedMethods: {\n          Quantity: 2,\n          Items: ["HEAD", "GET"],\n          CachedMethods: {\n            Quantity: 2,\n            Items: ["HEAD", "GET"],\n          },\n        },\n        SmoothStreaming: false,\n        Compress: true,\n        LambdaFunctionAssociations: {\n          Quantity: 0,\n          Items: [],\n        },\n        FunctionAssociations: {\n          Quantity: 0,\n          Items: [],\n        },\n        FieldLevelEncryptionId: "",\n        CachePolicyId: "658327ea-f89d-4fab-a63d-7e88639e58f6",\n      },\n      Origins: {\n        Quantity: 1,\n        Items: [\n          {\n            Id: `${getId({\n              type: "Bucket",\n              group: "S3",\n              name: "cloudfront-demo.grucloud.org",\n              path: "name",\n            })}.s3.us-east-1.amazonaws.com`,\n            DomainName: `${getId({\n              type: "Bucket",\n              group: "S3",\n              name: "cloudfront-demo.grucloud.org",\n              path: "name",\n            })}.s3.us-east-1.amazonaws.com`,\n            OriginPath: "",\n            CustomHeaders: {\n              Quantity: 0,\n              Items: [],\n            },\n            S3OriginConfig: {\n              OriginAccessIdentity: `origin-access-identity/cloudfront/${getId({\n                type: "OriginAccessIdentity",\n                group: "CloudFront",\n                name: "access-identity-cloudfront-demo.grucloud.org.s3.us-east-1.amazonaws.com",\n              })}`,\n            },\n            ConnectionAttempts: 3,\n            ConnectionTimeout: 10,\n            OriginShield: {\n              Enabled: false,\n            },\n          },\n        ],\n      },\n      Restrictions: {\n        GeoRestriction: {\n          RestrictionType: "none",\n          Quantity: 0,\n          Items: [],\n        },\n      },\n      Comment: "",\n      Logging: {\n        Enabled: false,\n        IncludeCookies: false,\n        Bucket: "",\n        Prefix: "",\n      },\n      Tags: [\n        {\n          Key: "mykey",\n          Value: "myvalue",\n        },\n      ],\n    }),\n    dependencies: () => ({\n      buckets: ["cloudfront-demo.grucloud.org"],\n      certificate: "cloudfront-demo.grucloud.org",\n      originAccessIdentities: [\n        "access-identity-cloudfront-demo.grucloud.org.s3.us-east-1.amazonaws.com",\n      ],\n    }),\n  },\n];\n')),(0,i.kt)("h3",{id:"examples"},"Examples"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("a",{parentName:"p",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/website-https/resources.js"},"https static website "))),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("a",{parentName:"p",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/CloudFront/cloudfront-distribution/resources.js"},"cloudfront distribution with origin access identity")))),(0,i.kt)("h3",{id:"properties"},"Properties"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-cloudfront/interfaces/createdistributionwithtagscommandinput.html"},"CreateDistributionWithTagsCommandInput"))),(0,i.kt)("h3",{id:"cache-invalidation"},"Cache Invalidation"),(0,i.kt)("p",null,"When some S3 objects are updated during the ",(0,i.kt)("em",{parentName:"p"},"gc apply")," command, a ",(0,i.kt)("a",{parentName:"p",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#createInvalidation-property"},(0,i.kt)("em",{parentName:"a"},"createInvalidation"))," call is made to invalide the cache to make sure the new version is available to the node edges."),(0,i.kt)("h3",{id:"dependencies"},"Dependencies"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/aws/resources/S3/Bucket"},"S3 Bucket")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/aws/resources/ACM/Certificate"},"Certificate")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/aws/resources/CloudFront/OriginAccessIdentity"},"OriginAccessIdentity"))))}p.isMDXComponent=!0}}]);