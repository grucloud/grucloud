"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[24089],{3905:(e,n,t)=>{t.d(n,{Zo:()=>c,kt:()=>g});var r=t(67294);function o(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function a(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?a(Object(t),!0).forEach((function(n){o(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function s(e,n){if(null==e)return{};var t,r,o=function(e,n){if(null==e)return{};var t,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var u=r.createContext({}),l=function(e){var n=r.useContext(u),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},c=function(e){var n=l(e.components);return r.createElement(u.Provider,{value:n},e.children)},d="mdxType",m={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},p=r.forwardRef((function(e,n){var t=e.components,o=e.mdxType,a=e.originalType,u=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),d=l(t),p=o,g=d["".concat(u,".").concat(p)]||d[p]||m[p]||a;return t?r.createElement(g,i(i({ref:n},c),{},{components:t})):r.createElement(g,i({ref:n},c))}));function g(e,n){var t=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var a=t.length,i=new Array(a);i[0]=p;var s={};for(var u in n)hasOwnProperty.call(n,u)&&(s[u]=n[u]);s.originalType=e,s[d]="string"==typeof e?e:o,i[1]=s;for(var l=2;l<a;l++)i[l]=t[l];return r.createElement.apply(null,i)}return r.createElement.apply(null,t)}p.displayName="MDXCreateElement"},98575:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>u,contentTitle:()=>i,default:()=>m,frontMatter:()=>a,metadata:()=>s,toc:()=>l});var r=t(87462),o=(t(67294),t(3905));const a={id:"Distribution",title:"Distribution"},i=void 0,s={unversionedId:"aws/resources/CloudFront/Distribution",id:"aws/resources/CloudFront/Distribution",title:"Distribution",description:"Provides a Cloud Front distribution.",source:"@site/docs/aws/resources/CloudFront/Distribution.md",sourceDirName:"aws/resources/CloudFront",slug:"/aws/resources/CloudFront/Distribution",permalink:"/docs/aws/resources/CloudFront/Distribution",draft:!1,tags:[],version:"current",frontMatter:{id:"Distribution",title:"Distribution"},sidebar:"docs",previous:{title:"Cache Policy",permalink:"/docs/aws/resources/CloudFront/CachePolicy"},next:{title:"Function",permalink:"/docs/aws/resources/CloudFront/Function"}},u={},l=[{value:"CloudFront with a S3 bucket as origin",id:"cloudfront-with-a-s3-bucket-as-origin",level:2},{value:"Examples",id:"examples",level:3},{value:"Properties",id:"properties",level:3},{value:"Cache Invalidation",id:"cache-invalidation",level:3},{value:"Dependencies",id:"dependencies",level:3},{value:"Used By",id:"used-by",level:3},{value:"List",id:"list",level:3}],c={toc:l},d="wrapper";function m(e){let{components:n,...t}=e;return(0,o.kt)(d,(0,r.Z)({},c,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Provides a Cloud Front distribution."),(0,o.kt)("h2",{id:"cloudfront-with-a-s3-bucket-as-origin"},"CloudFront with a S3 bucket as origin"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Distribution",\n    group: "CloudFront",\n    name: "E2P10W0URYHQV",\n    properties: ({ getId }) => ({\n      PriceClass: "PriceClass_100",\n      Aliases: {\n        Quantity: 1,\n        Items: [\n          getId({\n            type: "Certificate",\n            group: "ACM",\n            name: "cloudfront-demo.grucloud.org",\n            path: "name",\n          }),\n        ],\n      },\n      DefaultRootObject: "index.html",\n      DefaultCacheBehavior: {\n        TargetOriginId: `${getId({\n          type: "Bucket",\n          group: "S3",\n          name: "cloudfront-demo.grucloud.org",\n          path: "name",\n        })}.s3.us-east-1.amazonaws.com`,\n        TrustedSigners: {\n          Enabled: false,\n          Quantity: 0,\n          Items: [],\n        },\n        TrustedKeyGroups: {\n          Enabled: false,\n          Quantity: 0,\n          Items: [],\n        },\n        ViewerProtocolPolicy: "redirect-to-https",\n        AllowedMethods: {\n          Quantity: 2,\n          Items: ["HEAD", "GET"],\n          CachedMethods: {\n            Quantity: 2,\n            Items: ["HEAD", "GET"],\n          },\n        },\n        SmoothStreaming: false,\n        Compress: true,\n        LambdaFunctionAssociations: {\n          Quantity: 0,\n          Items: [],\n        },\n        FunctionAssociations: {\n          Quantity: 0,\n          Items: [],\n        },\n        FieldLevelEncryptionId: "",\n        CachePolicyId: "658327ea-f89d-4fab-a63d-7e88639e58f6",\n      },\n      Origins: {\n        Quantity: 1,\n        Items: [\n          {\n            Id: `${getId({\n              type: "Bucket",\n              group: "S3",\n              name: "cloudfront-demo.grucloud.org",\n              path: "name",\n            })}.s3.us-east-1.amazonaws.com`,\n            DomainName: `${getId({\n              type: "Bucket",\n              group: "S3",\n              name: "cloudfront-demo.grucloud.org",\n              path: "name",\n            })}.s3.us-east-1.amazonaws.com`,\n            OriginPath: "",\n            CustomHeaders: {\n              Quantity: 0,\n              Items: [],\n            },\n            S3OriginConfig: {\n              OriginAccessIdentity: `origin-access-identity/cloudfront/${getId({\n                type: "OriginAccessIdentity",\n                group: "CloudFront",\n                name: "access-identity-cloudfront-demo.grucloud.org.s3.us-east-1.amazonaws.com",\n              })}`,\n            },\n            ConnectionAttempts: 3,\n            ConnectionTimeout: 10,\n            OriginShield: {\n              Enabled: false,\n            },\n          },\n        ],\n      },\n      Restrictions: {\n        GeoRestriction: {\n          RestrictionType: "none",\n          Quantity: 0,\n          Items: [],\n        },\n      },\n      Comment: "",\n      Logging: {\n        Enabled: false,\n        IncludeCookies: false,\n        Bucket: "",\n        Prefix: "",\n      },\n      Tags: [\n        {\n          Key: "mykey",\n          Value: "myvalue",\n        },\n      ],\n    }),\n    dependencies: () => ({\n      buckets: ["cloudfront-demo.grucloud.org"],\n      certificate: "cloudfront-demo.grucloud.org",\n      originAccessIdentities: [\n        "access-identity-cloudfront-demo.grucloud.org.s3.us-east-1.amazonaws.com",\n      ],\n    }),\n  },\n];\n')),(0,o.kt)("h3",{id:"examples"},"Examples"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/website-https/resources.js"},"HTTPS static website ")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/CloudFront/cloudfront-distribution/resources.js"},"Cloudfront distribution with origin access identity")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/WAFv2/wafv2-cloudfront"},"WebACL with CloudFront"))),(0,o.kt)("h3",{id:"properties"},"Properties"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-cloudfront/interfaces/createdistributionwithtagscommandinput.html"},"CreateDistributionWithTagsCommandInput"))),(0,o.kt)("h3",{id:"cache-invalidation"},"Cache Invalidation"),(0,o.kt)("p",null,"When some S3 objects are updated during the ",(0,o.kt)("em",{parentName:"p"},"gc apply")," command, a ",(0,o.kt)("a",{parentName:"p",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#createInvalidation-property"},(0,o.kt)("em",{parentName:"a"},"createInvalidation"))," call is made to invalide the cache to make sure the new version is available to the node edges."),(0,o.kt)("h3",{id:"dependencies"},"Dependencies"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/aws/resources/S3/Bucket"},"S3 Bucket")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/aws/resources/ACM/Certificate"},"Certificate")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/aws/resources/CloudFront/OriginAccessIdentity"},"OriginAccessIdentity")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/aws/resources/WAFv2/WebACLCloudFront"},"WAFv2 WebACLCloudFront"))),(0,o.kt)("h3",{id:"used-by"},"Used By"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/aws/resources/Route53/Record"},"Route53 Record"))),(0,o.kt)("h3",{id:"list"},"List"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"gc l -t CloudFront::Distribution\n")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-txt"},'Listing resources on 1 provider: aws\n\u2713 aws us-east-1\n  \u2713 Initialising\n  \u2713 Listing 1/1\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 1 CloudFront::Distribution from aws                                                   \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: S3-cloudfront.aws.test.grucloud.org                                             \u2502\n\u2502 managedByUs: Yes                                                                      \u2502\n\u2502 live:                                                                                 \u2502\n\u2502   CallerReference: grucloud-192515cd-c5f0-42cc-93a2-1c1b249abb11                      \u2502\n\u2502   Aliases:                                                                            \u2502\n\u2502     Quantity: 1                                                                       \u2502\n\u2502     Items:                                                                            \u2502\n\u2502       - "cloudfront.aws.test.grucloud.org"                                            \u2502\n\u2502   DefaultRootObject: index.html                                                       \u2502\n\u2502   Origins:                                                                            \u2502\n\u2502     Quantity: 1                                                                       \u2502\n\u2502     Items:                                                                            \u2502\n\u2502       - Id: S3-cloudfront.aws.test.grucloud.org                                       \u2502\n\u2502         DomainName: cloudfront.aws.test.grucloud.org.s3.amazonaws.com                 \u2502\n\u2502         OriginPath:                                                                   \u2502\n\u2502         CustomHeaders:                                                                \u2502\n\u2502           Quantity: 0                                                                 \u2502\n\u2502         S3OriginConfig:                                                               \u2502\n\u2502           OriginAccessIdentity:                                                       \u2502\n\u2502         ConnectionAttempts: 3                                                         \u2502\n\u2502         ConnectionTimeout: 10                                                         \u2502\n\u2502         OriginShield:                                                                 \u2502\n\u2502           Enabled: false                                                              \u2502\n\u2502   OriginGroups:                                                                       \u2502\n\u2502     Quantity: 0                                                                       \u2502\n\u2502   DefaultCacheBehavior:                                                               \u2502\n\u2502     TargetOriginId: S3-cloudfront.aws.test.grucloud.org                               \u2502\n\u2502     TrustedSigners:                                                                   \u2502\n\u2502       Enabled: false                                                                  \u2502\n\u2502       Quantity: 0                                                                     \u2502\n\u2502     TrustedKeyGroups:                                                                 \u2502\n\u2502       Enabled: false                                                                  \u2502\n\u2502       Quantity: 0                                                                     \u2502\n\u2502     ViewerProtocolPolicy: redirect-to-https                                           \u2502\n\u2502     AllowedMethods:                                                                   \u2502\n\u2502       Quantity: 2                                                                     \u2502\n\u2502       Items:                                                                          \u2502\n\u2502         - "HEAD"                                                                      \u2502\n\u2502         - "GET"                                                                       \u2502\n\u2502       CachedMethods:                                                                  \u2502\n\u2502         Quantity: 2                                                                   \u2502\n\u2502         Items:                                                                        \u2502\n\u2502           - "HEAD"                                                                    \u2502\n\u2502           - "GET"                                                                     \u2502\n\u2502     SmoothStreaming: false                                                            \u2502\n\u2502     Compress: false                                                                   \u2502\n\u2502     LambdaFunctionAssociations:                                                       \u2502\n\u2502       Quantity: 0                                                                     \u2502\n\u2502     FunctionAssociations:                                                             \u2502\n\u2502       Quantity: 0                                                                     \u2502\n\u2502     FieldLevelEncryptionId:                                                           \u2502\n\u2502     ForwardedValues:                                                                  \u2502\n\u2502       QueryString: false                                                              \u2502\n\u2502       Cookies:                                                                        \u2502\n\u2502         Forward: none                                                                 \u2502\n\u2502       Headers:                                                                        \u2502\n\u2502         Quantity: 0                                                                   \u2502\n\u2502       QueryStringCacheKeys:                                                           \u2502\n\u2502         Quantity: 0                                                                   \u2502\n\u2502     MinTTL: 600                                                                       \u2502\n\u2502     DefaultTTL: 86400                                                                 \u2502\n\u2502     MaxTTL: 31536000                                                                  \u2502\n\u2502   CacheBehaviors:                                                                     \u2502\n\u2502     Quantity: 0                                                                       \u2502\n\u2502   CustomErrorResponses:                                                               \u2502\n\u2502     Quantity: 0                                                                       \u2502\n\u2502   Comment: cloudfront.aws.test.grucloud.org.s3.amazonaws.com                          \u2502\n\u2502   Logging:                                                                            \u2502\n\u2502     Enabled: false                                                                    \u2502\n\u2502     IncludeCookies: false                                                             \u2502\n\u2502     Bucket:                                                                           \u2502\n\u2502     Prefix:                                                                           \u2502\n\u2502   PriceClass: PriceClass_100                                                          \u2502\n\u2502   Enabled: true                                                                       \u2502\n\u2502   ViewerCertificate:                                                                  \u2502\n\u2502     CloudFrontDefaultCertificate: false                                               \u2502\n\u2502     ACMCertificateArn: arn:aws:acm:us-east-1:840541460064:certificate/40824773-1a98-\u2026 \u2502\n\u2502     SSLSupportMethod: sni-only                                                        \u2502\n\u2502     MinimumProtocolVersion: TLSv1.2_2019                                              \u2502\n\u2502     Certificate: arn:aws:acm:us-east-1:840541460064:certificate/40824773-1a98-4f70-a\u2026 \u2502\n\u2502     CertificateSource: acm                                                            \u2502\n\u2502   Restrictions:                                                                       \u2502\n\u2502     GeoRestriction:                                                                   \u2502\n\u2502       RestrictionType: none                                                           \u2502\n\u2502       Quantity: 0                                                                     \u2502\n\u2502   WebACLId:                                                                           \u2502\n\u2502   HttpVersion: http2                                                                  \u2502\n\u2502   IsIPV6Enabled: true                                                                 \u2502\n\u2502   Tags:                                                                               \u2502\n\u2502     - Key: gc-created-by-provider                                                     \u2502\n\u2502       Value: aws                                                                      \u2502\n\u2502     - Key: gc-managed-by                                                              \u2502\n\u2502       Value: grucloud                                                                 \u2502\n\u2502     - Key: gc-project-name                                                            \u2502\n\u2502       Value: @grucloud/example-aws-website-https                                      \u2502\n\u2502     - Key: gc-stage                                                                   \u2502\n\u2502       Value: dev                                                                      \u2502\n\u2502     - Key: Name                                                                       \u2502\n\u2502       Value: S3-cloudfront.aws.test.grucloud.org                                      \u2502\n\u2502   Id: ENSP11JQNT4WY                                                                   \u2502\n\u2502   ARN: arn:aws:cloudfront::840541460064:distribution/ENSP11JQNT4WY                    \u2502\n\u2502   Status: Deployed                                                                    \u2502\n\u2502   LastModifiedTime: 2022-08-05T11:28:58.586Z                                          \u2502\n\u2502   DomainName: d2nnsefnqnrio6.cloudfront.net                                           \u2502\n\u2502   AliasICPRecordals:                                                                  \u2502\n\u2502     - CNAME: cloudfront.aws.test.grucloud.org                                         \u2502\n\u2502       ICPRecordalStatus: APPROVED                                                     \u2502\n\u2502                                                                                       \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\nList Summary:\nProvider: aws\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 aws                                                                                  \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 CloudFront::Distribution \u2502 S3-cloudfront.aws.test.grucloud.org                       \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n1 resource, 1 type, 1 provider\nCommand "gc l -t CloudFront::Distribution" executed in 5s, 102 MB\n')))}m.isMDXComponent=!0}}]);