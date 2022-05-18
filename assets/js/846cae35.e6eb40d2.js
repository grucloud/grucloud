"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[3620],{3905:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return p}});var r=n(67294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=r.createContext({}),l=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},u=function(e){var t=l(e.components);return r.createElement(s.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,s=e.parentName,u=c(e,["components","mdxType","originalType","parentName"]),m=l(n),p=a,f=m["".concat(s,".").concat(p)]||m[p]||d[p]||i;return n?r.createElement(f,o(o({ref:t},u),{},{components:n})):r.createElement(f,o({ref:t},u))}));function p(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,o=new Array(i);o[0]=m;var c={};for(var s in t)hasOwnProperty.call(t,s)&&(c[s]=t[s]);c.originalType=e,c.mdxType="string"==typeof e?e:a,o[1]=c;for(var l=2;l<i;l++)o[l]=n[l];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},47885:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return c},contentTitle:function(){return s},metadata:function(){return l},toc:function(){return u},default:function(){return m}});var r=n(87462),a=n(63366),i=(n(67294),n(3905)),o=["components"],c={id:"Certificate",title:"Certificate"},s=void 0,l={unversionedId:"aws/resources/ACM/Certificate",id:"aws/resources/ACM/Certificate",isDocsHomePage:!1,title:"Certificate",description:"Provides an SSL certificate.",source:"@site/docs/aws/resources/ACM/Certificate.md",sourceDirName:"aws/resources/ACM",slug:"/aws/resources/ACM/Certificate",permalink:"/docs/aws/resources/ACM/Certificate",tags:[],version:"current",frontMatter:{id:"Certificate",title:"Certificate"},sidebar:"docs",previous:{title:"Resources List",permalink:"/docs/aws/ResourcesList"},next:{title:"Account",permalink:"/docs/aws/resources/APIGateway/Account"}},u=[{value:"Examples",id:"examples",children:[{value:"Create a certificate with DNS validation",id:"create-a-certificate-with-dns-validation",children:[],level:3}],level:2},{value:"Source Code Examples",id:"source-code-examples",children:[],level:2},{value:"Properties",id:"properties",children:[],level:2},{value:"UsedBy",id:"usedby",children:[],level:2},{value:"List",id:"list",children:[],level:2}],d={toc:u};function m(e){var t=e.components,n=(0,a.Z)(e,o);return(0,i.kt)("wrapper",(0,r.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Provides an SSL certificate."),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},"Certificates for CloudFront must be created in the us-east-1 region only.")),(0,i.kt)("h2",{id:"examples"},"Examples"),(0,i.kt)("h3",{id:"create-a-certificate-with-dns-validation"},"Create a certificate with DNS validation"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'const domainName = "your.domain.name.com";\n\nexports.createResources = () => [\n  { type: "Certificate", group: "ACM", name: domainName },\n];\n')),(0,i.kt)("h2",{id:"source-code-examples"},"Source Code Examples"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/ACM/certificate/resources.js"},"certificate validated by DNS")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/website-https/resources.js"},"https static website"))),(0,i.kt)("h2",{id:"properties"},"Properties"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-acm/interfaces/requestcertificatecommandinput.html"},"RequestCertificateCommandInput"))),(0,i.kt)("h2",{id:"usedby"},"UsedBy"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/aws/resources/Route53/HostedZone"},"Route53 Hosted Zone")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/aws/resources/CloudFront/Distribution"},"CloudFront Distribution")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"../APIGateway/DomainName.md"},"APIGateway Domain Name")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/aws/resources/ApiGatewayV2/DomainName"},"ApiGatewayV2 Domain Name"))),(0,i.kt)("h2",{id:"list"},"List"),(0,i.kt)("p",null,"The list of certificates can be displayed and filtered with the type ",(0,i.kt)("strong",{parentName:"p"},"Certificate"),":"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-sh"},"gc list -t Certificate\n")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-txt"},'Listing resources on 1 provider: aws\n\u2713 aws\n  \u2713 Initialising\n  \u2713 Listing 1/1\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 2 ACM::Certificate from aws                                      \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: dev.cloudfront.aws.test.grucloud.org                       \u2502\n\u2502 managedByUs: NO                                                  \u2502\n\u2502 live:                                                            \u2502\n\u2502   CertificateArn: arn:aws:acm:us-east-1:840541460064:certificat\u2026 \u2502\n\u2502   DomainName: dev.cloudfront.aws.test.grucloud.org               \u2502\n\u2502   SubjectAlternativeNames:                                       \u2502\n\u2502     - "dev.cloudfront.aws.test.grucloud.org"                     \u2502\n\u2502   DomainValidationOptions:                                       \u2502\n\u2502     - DomainName: dev.cloudfront.aws.test.grucloud.org           \u2502\n\u2502       ValidationDomain: dev.cloudfront.aws.test.grucloud.org     \u2502\n\u2502       ValidationStatus: SUCCESS                                  \u2502\n\u2502       ResourceRecord:                                            \u2502\n\u2502         Name: _1c003a592ed0c0c949c1031f5deaef5e.dev.cloudfront.\u2026 \u2502\n\u2502         Type: CNAME                                              \u2502\n\u2502         Value: _20c68e8d64be718e90d61c5bbb573b2b.bbfvkzsszw.acm\u2026 \u2502\n\u2502       ValidationMethod: DNS                                      \u2502\n\u2502   Serial: 08:be:e5:a5:32:6e:83:1f:04:62:74:ad:35:40:35:59        \u2502\n\u2502   Subject: CN=dev.cloudfront.aws.test.grucloud.org               \u2502\n\u2502   Issuer: Amazon                                                 \u2502\n\u2502   CreatedAt: 2021-09-21T18:09:06.000Z                            \u2502\n\u2502   IssuedAt: 2021-09-21T18:10:02.000Z                             \u2502\n\u2502   Status: ISSUED                                                 \u2502\n\u2502   NotBefore: 2021-09-21T00:00:00.000Z                            \u2502\n\u2502   NotAfter: 2022-10-20T23:59:59.000Z                             \u2502\n\u2502   KeyAlgorithm: RSA-2048                                         \u2502\n\u2502   SignatureAlgorithm: SHA256WITHRSA                              \u2502\n\u2502   InUseBy: []                                                    \u2502\n\u2502   Type: AMAZON_ISSUED                                            \u2502\n\u2502   KeyUsages:                                                     \u2502\n\u2502     - Name: DIGITAL_SIGNATURE                                    \u2502\n\u2502     - Name: KEY_ENCIPHERMENT                                     \u2502\n\u2502   ExtendedKeyUsages:                                             \u2502\n\u2502     - Name: TLS_WEB_SERVER_AUTHENTICATION                        \u2502\n\u2502       OID: 1.3.6.1.5.5.7.3.1                                     \u2502\n\u2502     - Name: TLS_WEB_CLIENT_AUTHENTICATION                        \u2502\n\u2502       OID: 1.3.6.1.5.5.7.3.2                                     \u2502\n\u2502   RenewalEligibility: INELIGIBLE                                 \u2502\n\u2502   Options:                                                       \u2502\n\u2502     CertificateTransparencyLoggingPreference: ENABLED            \u2502\n\u2502   Tags:                                                          \u2502\n\u2502     - Key: gc-created-by-provider                                \u2502\n\u2502       Value: aws                                                 \u2502\n\u2502     - Key: gc-managed-by                                         \u2502\n\u2502       Value: grucloud                                            \u2502\n\u2502     - Key: gc-project-name                                       \u2502\n\u2502       Value: @grucloud/example-aws-website-https                 \u2502\n\u2502     - Key: gc-stage                                              \u2502\n\u2502       Value: dev                                                 \u2502\n\u2502     - Key: Name                                                  \u2502\n\u2502       Value: dev.cloudfront.aws.test.grucloud.org                \u2502\n\u2502                                                                  \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: grucloud.org                                               \u2502\n\u2502 managedByUs: NO                                                  \u2502\n\u2502 live:                                                            \u2502\n\u2502   CertificateArn: arn:aws:acm:us-east-1:840541460064:certificat\u2026 \u2502\n\u2502   DomainName: grucloud.org                                       \u2502\n\u2502   SubjectAlternativeNames:                                       \u2502\n\u2502     - "grucloud.org"                                             \u2502\n\u2502   DomainValidationOptions:                                       \u2502\n\u2502     - DomainName: grucloud.org                                   \u2502\n\u2502       ValidationDomain: grucloud.org                             \u2502\n\u2502       ValidationStatus: SUCCESS                                  \u2502\n\u2502       ResourceRecord:                                            \u2502\n\u2502         Name: _691e4a68814938b97e40e8e955bf1a30.grucloud.org.    \u2502\n\u2502         Type: CNAME                                              \u2502\n\u2502         Value: _19aece4a9123a510cd3c628c73fa754b.wggjkglgrm.acm\u2026 \u2502\n\u2502       ValidationMethod: DNS                                      \u2502\n\u2502   Serial: 04:66:5e:8d:c5:53:94:cc:cd:f7:33:70:73:a4:33:05        \u2502\n\u2502   Subject: CN=grucloud.org                                       \u2502\n\u2502   Issuer: Amazon                                                 \u2502\n\u2502   CreatedAt: 2021-10-27T17:31:03.044Z                            \u2502\n\u2502   IssuedAt: 2021-10-27T17:41:51.537Z                             \u2502\n\u2502   Status: ISSUED                                                 \u2502\n\u2502   NotBefore: 2021-10-27T00:00:00.000Z                            \u2502\n\u2502   NotAfter: 2022-11-25T23:59:59.000Z                             \u2502\n\u2502   KeyAlgorithm: RSA-2048                                         \u2502\n\u2502   SignatureAlgorithm: SHA256WITHRSA                              \u2502\n\u2502   InUseBy: []                                                    \u2502\n\u2502   Type: AMAZON_ISSUED                                            \u2502\n\u2502   KeyUsages:                                                     \u2502\n\u2502     - Name: DIGITAL_SIGNATURE                                    \u2502\n\u2502     - Name: KEY_ENCIPHERMENT                                     \u2502\n\u2502   ExtendedKeyUsages:                                             \u2502\n\u2502     - Name: TLS_WEB_SERVER_AUTHENTICATION                        \u2502\n\u2502       OID: 1.3.6.1.5.5.7.3.1                                     \u2502\n\u2502     - Name: TLS_WEB_CLIENT_AUTHENTICATION                        \u2502\n\u2502       OID: 1.3.6.1.5.5.7.3.2                                     \u2502\n\u2502   RenewalEligibility: INELIGIBLE                                 \u2502\n\u2502   Options:                                                       \u2502\n\u2502     CertificateTransparencyLoggingPreference: ENABLED            \u2502\n\u2502   Tags: []                                                       \u2502\n\u2502                                                                  \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\n')))}m.isMDXComponent=!0}}]);