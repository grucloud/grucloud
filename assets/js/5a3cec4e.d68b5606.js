"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[3291],{3905:function(e,n,r){r.d(n,{Zo:function(){return d},kt:function(){return m}});var t=r(67294);function o(e,n,r){return n in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}function a(e,n){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),r.push.apply(r,t)}return r}function s(e){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?a(Object(r),!0).forEach((function(n){o(e,n,r[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))}))}return e}function u(e,n){if(null==e)return{};var r,t,o=function(e,n){if(null==e)return{};var r,t,o={},a=Object.keys(e);for(t=0;t<a.length;t++)r=a[t],n.indexOf(r)>=0||(o[r]=e[r]);return o}(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(t=0;t<a.length;t++)r=a[t],n.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var c=t.createContext({}),l=function(e){var n=t.useContext(c),r=n;return e&&(r="function"==typeof e?e(n):s(s({},n),e)),r},d=function(e){var n=l(e.components);return t.createElement(c.Provider,{value:n},e.children)},i={inlineCode:"code",wrapper:function(e){var n=e.children;return t.createElement(t.Fragment,{},n)}},p=t.forwardRef((function(e,n){var r=e.components,o=e.mdxType,a=e.originalType,c=e.parentName,d=u(e,["components","mdxType","originalType","parentName"]),p=l(r),m=o,g=p["".concat(c,".").concat(m)]||p[m]||i[m]||a;return r?t.createElement(g,s(s({ref:n},d),{},{components:r})):t.createElement(g,s({ref:n},d))}));function m(e,n){var r=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var a=r.length,s=new Array(a);s[0]=p;var u={};for(var c in n)hasOwnProperty.call(n,c)&&(u[c]=n[c]);u.originalType=e,u.mdxType="string"==typeof e?e:o,s[1]=u;for(var l=2;l<a;l++)s[l]=r[l];return t.createElement.apply(null,s)}return t.createElement.apply(null,r)}p.displayName="MDXCreateElement"},41166:function(e,n,r){r.r(n),r.d(n,{frontMatter:function(){return u},contentTitle:function(){return c},metadata:function(){return l},toc:function(){return d},default:function(){return p}});var t=r(87462),o=r(63366),a=(r(67294),r(3905)),s=["components"],u={id:"Record",title:"Record"},c=void 0,l={unversionedId:"aws/resources/Route53/Record",id:"aws/resources/Route53/Record",isDocsHomePage:!1,title:"Record",description:"Provides a single Route53 Record",source:"@site/docs/aws/resources/Route53/Record.md",sourceDirName:"aws/resources/Route53",slug:"/aws/resources/Route53/Record",permalink:"/docs/aws/resources/Route53/Record",tags:[],version:"current",frontMatter:{id:"Record",title:"Record"},sidebar:"docs",previous:{title:"Hosted Zone",permalink:"/docs/aws/resources/Route53/HostedZone"},next:{title:"Domains",permalink:"/docs/aws/resources/Route53Domains/Domain"}},d=[{value:"Examples",id:"examples",children:[{value:"CNAME from a certificate",id:"cname-from-a-certificate",children:[],level:3},{value:"TXT record",id:"txt-record",children:[],level:3},{value:"A record from an elastic IP address",id:"a-record-from-an-elastic-ip-address",children:[],level:3},{value:"Alias for a CloudFront Distribution",id:"alias-for-a-cloudfront-distribution",children:[],level:3}],level:2},{value:"Source Code Examples",id:"source-code-examples",children:[],level:2},{value:"Properties",id:"properties",children:[],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"List",id:"list",children:[],level:2}],i={toc:d};function p(e){var n=e.components,r=(0,o.Z)(e,s);return(0,a.kt)("wrapper",(0,t.Z)({},i,r,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Provides a single ",(0,a.kt)("a",{parentName:"p",href:"https://console.aws.amazon.com/route53/v2/home#Dashboard"},"Route53 Record")),(0,a.kt)("h2",{id:"examples"},"Examples"),(0,a.kt)("h3",{id:"cname-from-a-certificate"},"CNAME from a certificate"),(0,a.kt)("p",null,"Verify a certificate with DNS validation by adding a CNAME record."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  { type: "Certificate", group: "ACM", name: "grucloud.org" },\n  {\n    type: "HostedZone",\n    group: "Route53",\n    name: "grucloud.org.",\n    dependencies: () => ({\n      domain: "grucloud.org",\n    }),\n  },\n  {\n    type: "Record",\n    group: "Route53",\n    dependencies: () => ({\n      hostedZone: "grucloud.org.",\n      certificate: "grucloud.org",\n    }),\n  },\n  {\n    type: "Domain",\n    group: "Route53Domains",\n    name: "grucloud.org",\n    readOnly: true,\n  },\n];\n')),(0,a.kt)("h3",{id:"txt-record"},"TXT record"),(0,a.kt)("p",null,"Let's add TXT record to verify a domain ownership:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "HostedZone",\n    group: "Route53",\n    name: "grucloud.org.",\n    dependencies: () => ({\n      domain: "grucloud.org",\n    }),\n  },\n  {\n    type: "Record",\n    group: "Route53",\n    properties: ({}) => ({\n      Name: "gcrun.grucloud.org.",\n      Type: "TXT",\n      TTL: 300,\n      ResourceRecords: [\n        {\n          Value:\n            \'"google-site-verification=ZXCVBNMF8sKTj__itc4iAXA4my_hB-bzUlCFGHJK"\',\n        },\n      ],\n    }),\n    dependencies: () => ({\n      hostedZone: "grucloud.org.",\n    }),\n  },\n  {\n    type: "Domain",\n    group: "Route53Domains",\n    name: "grucloud.org",\n    readOnly: true,\n  },\n];\n')),(0,a.kt)("h3",{id:"a-record-from-an-elastic-ip-address"},"A record from an elastic IP address"),(0,a.kt)("p",null,"Ads a IPv4 A record from an elastic IP address"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "ElasticIpAddress",\n    group: "EC2",\n    name: "myip",\n  },\n  {\n    type: "HostedZone",\n    group: "Route53",\n    name: "grucloud.org.",\n    dependencies: () => ({\n      domain: "grucloud.org",\n    }),\n  },\n  {\n    type: "Record",\n    group: "Route53",\n    properties: ({ getId }) => ({\n      Name: "grucloud.org.",\n      Type: "A",\n      TTL: 300,\n      ResourceRecords: [\n        {\n          Value: getId({\n            type: "ElasticIpAddress",\n            group: "EC2",\n            name: "myip",\n            path: "live.PublicIp",\n          }),\n        },\n      ],\n    }),\n    dependencies: () => ({\n      hostedZone: "grucloud.org.",\n      elasticIpAddress: "myip",\n    }),\n  },\n];\n')),(0,a.kt)("h3",{id:"alias-for-a-cloudfront-distribution"},"Alias for a CloudFront Distribution"),(0,a.kt)("p",null,"Add an alias entry to the the CloudFront distribution domain name"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "HostedZone",\n    group: "Route53",\n    name: "dev.cloudfront.aws.test.grucloud.org.",\n    dependencies: () => ({\n      domain: "grucloud.org",\n    }),\n  },\n  {\n    type: "Record",\n    group: "Route53",\n    dependencies: () => ({\n      hostedZone: "dev.cloudfront.aws.test.grucloud.org.",\n      distribution: "distribution-cloudfront.aws.test.grucloud.org-dev",\n    }),\n  },\n];\n')),(0,a.kt)("h2",{id:"source-code-examples"},"Source Code Examples"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/ELBv2/load-balancer/resources.js"},"Alias record for a load balancer")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/website-https/resources.js"},"Aliad record for a Cloudfront distribution")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/Route53/txt-record/resources.js"},"TXT record and hosted zone ")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/Route53/dns-record-ip-address/resources.js"},"A Record to an elastic IP address"))),(0,a.kt)("h2",{id:"properties"},"Properties"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-route-53/interfaces/changeresourcerecordsetscommandinput.html"},"ChangeResourceRecordSetsCommandInput"))),(0,a.kt)("h2",{id:"dependencies"},"Dependencies"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"./HostedZone"},"Route53 HostedZone")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/aws/resources/ELBv2/LoadBalancer"},"LoadBalancer")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"../ACM/Certificate"},"Certificate")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/aws/resources/ApiGatewayV2/DomainName"},"ApiGatewayV2 DomainName")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/aws/resources/CloudFront/Distribution"},"CloudFront Distribution")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/ElasticIpAddress"},"Elastic IP Address"))),(0,a.kt)("h2",{id:"list"},"List"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-txt"},'\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 3 route53::Record from aws                                                 \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 Name               \u2502 Data                                           \u2502 Our  \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253c\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 grucloud.org.::NS  \u2502 Name: grucloud.org.                            \u2502 Yes  \u2502\n\u2502                    \u2502 Type: NS                                       \u2502      \u2502\n\u2502                    \u2502 TTL: 172800                                    \u2502      \u2502\n\u2502                    \u2502 ResourceRecords:                               \u2502      \u2502\n\u2502                    \u2502   - Value: ns-1907.awsdns-46.co.uk.            \u2502      \u2502\n\u2502                    \u2502   - Value: ns-15.awsdns-01.com.                \u2502      \u2502\n\u2502                    \u2502   - Value: ns-1423.awsdns-49.org.              \u2502      \u2502\n\u2502                    \u2502   - Value: ns-514.awsdns-00.net.               \u2502      \u2502\n\u2502                    \u2502 HostedZoneId: /hostedzone/Z0064831PNCGMBFQ0H7Y \u2502      \u2502\n\u2502                    \u2502                                                \u2502      \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253c\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 grucloud.org.::SOA \u2502 Name: grucloud.org.                            \u2502 Yes  \u2502\n\u2502                    \u2502 Type: SOA                                      \u2502      \u2502\n\u2502                    \u2502 TTL: 900                                       \u2502      \u2502\n\u2502                    \u2502 ResourceRecords:                               \u2502      \u2502\n\u2502                    \u2502   - Value: ns-1907.awsdns-46.co.uk. awsdns-ho\u2026 \u2502      \u2502\n\u2502                    \u2502 HostedZoneId: /hostedzone/Z0064831PNCGMBFQ0H7Y \u2502      \u2502\n\u2502                    \u2502                                                \u2502      \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253c\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 txt.grucloud.org.  \u2502 Name: grucloud.org.                            \u2502 Yes  \u2502\n\u2502                    \u2502 Type: TXT                                      \u2502      \u2502\n\u2502                    \u2502 TTL: 60                                        \u2502      \u2502\n\u2502                    \u2502 ResourceRecords:                               \u2502      \u2502\n\u2502                    \u2502   - Value: "google-site-verification=q_tZuuK8\u2026 \u2502      \u2502\n\u2502                    \u2502 Tags:                                          \u2502      \u2502\n\u2502                    \u2502   - Key: gc-managed-by                         \u2502      \u2502\n\u2502                    \u2502     Value: grucloud                            \u2502      \u2502\n\u2502                    \u2502   - Key: gc-project-name                       \u2502      \u2502\n\u2502                    \u2502     Value: @grucloud/example-aws-route53-dns-\u2026 \u2502      \u2502\n\u2502                    \u2502   - Key: gc-stage                              \u2502      \u2502\n\u2502                    \u2502     Value: dev                                 \u2502      \u2502\n\u2502                    \u2502   - Key: gc-record-txt.grucloud.org.           \u2502      \u2502\n\u2502                    \u2502     Value: grucloud.org.::TXT                  \u2502      \u2502\n\u2502                    \u2502   - Key: gc-created-by-provider                \u2502      \u2502\n\u2502                    \u2502     Value: aws                                 \u2502      \u2502\n\u2502                    \u2502   - Key: Name                                  \u2502      \u2502\n\u2502                    \u2502     Value: grucloud.org.                       \u2502      \u2502\n\u2502                    \u2502 HostedZoneId: /hostedzone/Z0064831PNCGMBFQ0H7Y \u2502      \u2502\n\u2502                    \u2502 namespace:                                     \u2502      \u2502\n\u2502                    \u2502                                                \u2502      \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n')))}p.isMDXComponent=!0}}]);