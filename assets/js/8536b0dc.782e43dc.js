"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[22153],{3905:function(e,r,n){n.d(r,{Zo:function(){return c},kt:function(){return m}});var t=n(67294);function o(e,r,n){return r in e?Object.defineProperty(e,r,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[r]=n,e}function a(e,r){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);r&&(t=t.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),n.push.apply(n,t)}return n}function l(e){for(var r=1;r<arguments.length;r++){var n=null!=arguments[r]?arguments[r]:{};r%2?a(Object(n),!0).forEach((function(r){o(e,r,n[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))}))}return e}function s(e,r){if(null==e)return{};var n,t,o=function(e,r){if(null==e)return{};var n,t,o={},a=Object.keys(e);for(t=0;t<a.length;t++)n=a[t],r.indexOf(n)>=0||(o[n]=e[n]);return o}(e,r);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(t=0;t<a.length;t++)n=a[t],r.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var u=t.createContext({}),i=function(e){var r=t.useContext(u),n=r;return e&&(n="function"==typeof e?e(r):l(l({},r),e)),n},c=function(e){var r=i(e.components);return t.createElement(u.Provider,{value:r},e.children)},p={inlineCode:"code",wrapper:function(e){var r=e.children;return t.createElement(t.Fragment,{},r)}},d=t.forwardRef((function(e,r){var n=e.components,o=e.mdxType,a=e.originalType,u=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),d=i(n),m=o,v=d["".concat(u,".").concat(m)]||d[m]||p[m]||a;return n?t.createElement(v,l(l({ref:r},c),{},{components:n})):t.createElement(v,l({ref:r},c))}));function m(e,r){var n=arguments,o=r&&r.mdxType;if("string"==typeof e||o){var a=n.length,l=new Array(a);l[0]=d;var s={};for(var u in r)hasOwnProperty.call(r,u)&&(s[u]=r[u]);s.originalType=e,s.mdxType="string"==typeof e?e:o,l[1]=s;for(var i=2;i<a;i++)l[i]=n[i];return t.createElement.apply(null,l)}return t.createElement.apply(null,n)}d.displayName="MDXCreateElement"},94090:function(e,r,n){n.r(r),n.d(r,{frontMatter:function(){return s},contentTitle:function(){return u},metadata:function(){return i},toc:function(){return c},default:function(){return d}});var t=n(87462),o=n(63366),a=(n(67294),n(3905)),l=["components"],s={id:"Rule",title:"Rule"},u=void 0,i={unversionedId:"aws/resources/Route53Resolver/Rule",id:"aws/resources/Route53Resolver/Rule",isDocsHomePage:!1,title:"Rule",description:"Provides Route53 Resolver Rules",source:"@site/docs/aws/resources/Route53Resolver/Rule.md",sourceDirName:"aws/resources/Route53Resolver",slug:"/aws/resources/Route53Resolver/Rule",permalink:"/docs/aws/resources/Route53Resolver/Rule",tags:[],version:"current",frontMatter:{id:"Rule",title:"Rule"},sidebar:"docs",previous:{title:"Endpoint",permalink:"/docs/aws/resources/Route53Resolver/Endpoint"},next:{title:"Rule Association",permalink:"/docs/aws/resources/Route53Resolver/RuleAssociation"}},c=[{value:"Examples",id:"examples",children:[],level:2},{value:"Source Code Examples",id:"source-code-examples",children:[],level:2},{value:"Properties",id:"properties",children:[],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"Used By",id:"used-by",children:[],level:2},{value:"List",id:"list",children:[],level:2}],p={toc:c};function d(e){var r=e.components,n=(0,o.Z)(e,l);return(0,a.kt)("wrapper",(0,t.Z)({},p,n,{components:r,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Provides ",(0,a.kt)("a",{parentName:"p",href:"https://console.aws.amazon.com/route53resolver/home/outbound-endpoints#/rules"},"Route53 Resolver Rules")),(0,a.kt)("h2",{id:"examples"},"Examples"),(0,a.kt)("p",null,"Create a Route53 Resolver Rule:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Rule",\n    group: "Route53Resolver",\n    properties: ({}) => ({\n      DomainName: "network-dev.internal.",\n      Name: "root-env",\n      RuleType: "FORWARD",\n    }),\n    dependencies: ({}) => ({\n      resolverEndpoint: "Org-Outbound-Resolver-Endpoint",\n    }),\n  },\n];\n')),(0,a.kt)("h2",{id:"source-code-examples"},"Source Code Examples"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/Route53Resolver/route53-resolver"},"simple example")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/aws-samples/aws-network-hub-for-terraform"},"network hub")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/aws-samples/hub-and-spoke-with-shared-services-vpc-terraform"},"hub and skope with shared service vpc"))),(0,a.kt)("h2",{id:"properties"},"Properties"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-route53resolver/interfaces/createresolverrulecommandinput.html"},"CreateResolverRuleCommandInput"))),(0,a.kt)("h2",{id:"dependencies"},"Dependencies"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/aws/resources/Route53Resolver/Endpoint"},"Endpoint"))),(0,a.kt)("h2",{id:"used-by"},"Used By"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/aws/resources/Route53Resolver/RuleAssociation"},"Rule Association"))),(0,a.kt)("h2",{id:"list"},"List"),(0,a.kt)("p",null,"List the rules with the ",(0,a.kt)("strong",{parentName:"p"},"Route53Resolver::Rule")," filter:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-sh"},"gc list -t Route53Resolver::Rule\n")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-txt"},'Listing resources on 1 provider: aws\n\u2713 aws us-east-1\n  \u2713 Initialising\n  \u2713 Listing 1/1\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 2 Route53Resolver::Rule from aws                                         \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: Internet Resolver                                                  \u2502\n\u2502 managedByUs: NO                                                          \u2502\n\u2502 live:                                                                    \u2502\n\u2502   Arn: arn:aws:route53resolver:us-east-1::autodefined-rule/rslvr-autode\u2026 \u2502\n\u2502   CreatorRequestId:                                                      \u2502\n\u2502   DomainName: .                                                          \u2502\n\u2502   Id: rslvr-autodefined-rr-internet-resolver                             \u2502\n\u2502   Name: Internet Resolver                                                \u2502\n\u2502   OwnerId: Route 53 Resolver                                             \u2502\n\u2502   RuleType: RECURSIVE                                                    \u2502\n\u2502   ShareStatus: NOT_SHARED                                                \u2502\n\u2502   Status: COMPLETE                                                       \u2502\n\u2502                                                                          \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: my-rule                                                            \u2502\n\u2502 managedByUs: Yes                                                         \u2502\n\u2502 live:                                                                    \u2502\n\u2502   Arn: arn:aws:route53resolver:us-east-1:840541460064:resolver-rule/rsl\u2026 \u2502\n\u2502   CreationTime: 2022-06-24T10:05:47.395984Z                              \u2502\n\u2502   CreatorRequestId: grucloud-Fri Jun 24 2022 12:05:45 GMT+0200 (Central\u2026 \u2502\n\u2502   DomainName: internal.grucloud.org.                                     \u2502\n\u2502   Id: rslvr-rr-87420ef83c7a4f078                                         \u2502\n\u2502   ModificationTime: 2022-06-24T10:05:47.395984Z                          \u2502\n\u2502   Name: my-rule                                                          \u2502\n\u2502   OwnerId: 840541460064                                                  \u2502\n\u2502   ResolverEndpointId: rslvr-out-345b5ada2e544ff18                        \u2502\n\u2502   RuleType: FORWARD                                                      \u2502\n\u2502   ShareStatus: NOT_SHARED                                                \u2502\n\u2502   Status: COMPLETE                                                       \u2502\n\u2502   StatusMessage: [Trace id: 1-62b58c7b-0d8761ec44ba804f0e99fb21] Succes\u2026 \u2502\n\u2502   TargetIps:                                                             \u2502\n\u2502     - Ip: 10.0.0.150                                                     \u2502\n\u2502       Port: 53                                                           \u2502\n\u2502     - Ip: 10.0.1.121                                                     \u2502\n\u2502       Port: 53                                                           \u2502\n\u2502   Tags:                                                                  \u2502\n\u2502     - Key: gc-created-by-provider                                        \u2502\n\u2502       Value: aws                                                         \u2502\n\u2502     - Key: gc-managed-by                                                 \u2502\n\u2502       Value: grucloud                                                    \u2502\n\u2502     - Key: gc-project-name                                               \u2502\n\u2502       Value: route53-resolver                                            \u2502\n\u2502     - Key: gc-stage                                                      \u2502\n\u2502       Value: dev                                                         \u2502\n\u2502     - Key: mykey                                                         \u2502\n\u2502       Value: myvalue                                                     \u2502\n\u2502     - Key: Name                                                          \u2502\n\u2502       Value: my-rule                                                     \u2502\n\u2502                                                                          \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\nList Summary:\nProvider: aws\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 aws                                                                     \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 Route53Resolver::Rule \u2502 Internet Resolver                               \u2502\n\u2502                       \u2502 my-rule                                         \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n2 resources, 1 type, 1 provider\nCommand "gc list -t Route53Resolver::Rule" executed in 6s, 99 MB\n')))}d.isMDXComponent=!0}}]);