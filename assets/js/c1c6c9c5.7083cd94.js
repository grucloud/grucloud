"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[89825],{3905:(e,t,n)=>{n.d(t,{Zo:()=>i,kt:()=>h});var o=n(67294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,o,r=function(e,t){if(null==e)return{};var n,o,r={},a=Object.keys(e);for(o=0;o<a.length;o++)n=a[o],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(o=0;o<a.length;o++)n=a[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var u=o.createContext({}),c=function(e){var t=o.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},i=function(e){var t=c(e.components);return o.createElement(u.Provider,{value:t},e.children)},d="mdxType",p={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},m=o.forwardRef((function(e,t){var n=e.components,r=e.mdxType,a=e.originalType,u=e.parentName,i=l(e,["components","mdxType","originalType","parentName"]),d=c(n),m=r,h=d["".concat(u,".").concat(m)]||d[m]||p[m]||a;return n?o.createElement(h,s(s({ref:t},i),{},{components:n})):o.createElement(h,s({ref:t},i))}));function h(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var a=n.length,s=new Array(a);s[0]=m;var l={};for(var u in t)hasOwnProperty.call(t,u)&&(l[u]=t[u]);l.originalType=e,l[d]="string"==typeof e?e:r,s[1]=l;for(var c=2;c<a;c++)s[c]=n[c];return o.createElement.apply(null,s)}return o.createElement.apply(null,n)}m.displayName="MDXCreateElement"},8146:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>u,contentTitle:()=>s,default:()=>p,frontMatter:()=>a,metadata:()=>l,toc:()=>c});var o=n(87462),r=(n(67294),n(3905));const a={id:"HostedZone",title:"Hosted Zone"},s=void 0,l={unversionedId:"aws/resources/Route53/HostedZone",id:"aws/resources/Route53/HostedZone",title:"Hosted Zone",description:"Provides a Route53 Hosted Zone",source:"@site/docs/aws/resources/Route53/HostedZone.md",sourceDirName:"aws/resources/Route53",slug:"/aws/resources/Route53/HostedZone",permalink:"/docs/aws/resources/Route53/HostedZone",draft:!1,tags:[],version:"current",frontMatter:{id:"HostedZone",title:"Hosted Zone"},sidebar:"docs",previous:{title:"Health Check",permalink:"/docs/aws/resources/Route53/HealthCheck"},next:{title:"Record",permalink:"/docs/aws/resources/Route53/Record"}},u={},c=[{value:"Examples",id:"examples",level:2},{value:"Simple HostedZone",id:"simple-hostedzone",level:3},{value:"Private HostedZone",id:"private-hostedzone",level:3},{value:"Source Code Examples",id:"source-code-examples",level:2},{value:"Properties",id:"properties",level:2},{value:"Dependencies",id:"dependencies",level:2},{value:"Used By",id:"used-by",level:2},{value:"List",id:"list",level:2}],i={toc:c},d="wrapper";function p(e){let{components:t,...n}=e;return(0,r.kt)(d,(0,o.Z)({},i,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"Provides a ",(0,r.kt)("a",{parentName:"p",href:"https://console.aws.amazon.com/route53/v2/home#Dashboard"},"Route53 Hosted Zone")),(0,r.kt)("p",null,"Add one or more records with the ",(0,r.kt)("a",{parentName:"p",href:"/docs/aws/resources/Route53/Record"},"Route53 Record")," resource."),(0,r.kt)("h2",{id:"examples"},"Examples"),(0,r.kt)("h3",{id:"simple-hostedzone"},"Simple HostedZone"),(0,r.kt)("p",null,"Create a HostedZone with a Route53Domain as a dependency to update automatically the DNS servers."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'const domainName = "mydomain.com";\n\nexports.createResources = () => [\n  {\n    type: "HostedZone",\n    group: "Route53",\n    properties: ({}) => ({\n      Name: domainName,\n    }),\n    dependencies: ({}) => ({\n      domain: "grucloud.org",\n    }),\n  },\n  {\n    type: "Domain",\n    group: "Route53Domains",\n    name: domainName,\n    readOnly: true,\n  },\n];\n')),(0,r.kt)("h3",{id:"private-hostedzone"},"Private HostedZone"),(0,r.kt)("p",null,"Create a private HostedZone associated to a VPC"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Vpc",\n    group: "EC2",\n    name: "vpc-hostedzone",\n    properties: ({}) => ({\n      CidrBlock: "10.0.0.0/16",\n    }),\n  },\n  {\n    type: "HostedZone",\n    group: "Route53",\n    properties: ({}) => ({\n      Name: "test.grucloud.org.",\n    }),\n    dependencies: ({}) => ({\n      domain: "grucloud.org",\n      vpc: "vpc-hostedzone",\n    }),\n  },\n];\n')),(0,r.kt)("h2",{id:"source-code-examples"},"Source Code Examples"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/website-https"},"https static website ")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/Route53/dns-validation-record-txt"},"A record and hosted zone ")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/Route53/hostedzone-private"},"private hosted zone associated with one VPC"))),(0,r.kt)("h2",{id:"properties"},"Properties"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-route-53/interfaces/createhostedzonecommandinput.html"},"CreateHostedZoneCommandInput"))),(0,r.kt)("h2",{id:"dependencies"},"Dependencies"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/Route53Domains/Domain"},"Route53 Domain")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/Vpc"},"EC2 Vpc"))),(0,r.kt)("h2",{id:"used-by"},"Used By"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/Route53/Record"},"Route53 Record"))),(0,r.kt)("h2",{id:"list"},"List"),(0,r.kt)("p",null,"list the hosted zones with the ",(0,r.kt)("strong",{parentName:"p"},"Route53::HostedZone")," filter:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-sh"},"gc list -t Route53::HostedZone\n")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-txt"},"\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 1 Route53::HostedZone from aws                                          \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: test.grucloud.org.                                                \u2502\n\u2502 managedByUs: Yes                                                        \u2502\n\u2502 live:                                                                   \u2502\n\u2502   Id: /hostedzone/Z096960312EGF3ADWBJ12                                 \u2502\n\u2502   Name: test.grucloud.org.                                              \u2502\n\u2502   CallerReference: 64229059-7c56-488e-a785-924222770bfd                 \u2502\n\u2502   Config:                                                               \u2502\n\u2502     Comment:                                                            \u2502\n\u2502     PrivateZone: true                                                   \u2502\n\u2502   ResourceRecordSetCount: 2                                             \u2502\n\u2502   Tags: []                                                              \u2502\n\u2502   RecordSet:                                                            \u2502\n\u2502     - Name: test.grucloud.org.                                          \u2502\n\u2502       Type: NS                                                          \u2502\n\u2502       TTL: 172800                                                       \u2502\n\u2502       ResourceRecords:                                                  \u2502\n\u2502         - Value: ns-1536.awsdns-00.co.uk.                               \u2502\n\u2502         - Value: ns-0.awsdns-00.com.                                    \u2502\n\u2502         - Value: ns-1024.awsdns-00.org.                                 \u2502\n\u2502         - Value: ns-512.awsdns-00.net.                                  \u2502\n\u2502     - Name: test.grucloud.org.                                          \u2502\n\u2502       Type: SOA                                                         \u2502\n\u2502       TTL: 900                                                          \u2502\n\u2502       ResourceRecords:                                                  \u2502\n\u2502         - Value: ns-1536.awsdns-00.co.uk. awsdns-hostmaster.amazon.com\u2026 \u2502\n\u2502   VpcAssociations:                                                      \u2502\n\u2502     - VPCId: vpc-09d82ceb6fcd32e22                                      \u2502\n\u2502       Owner:                                                            \u2502\n\u2502         OwningAccount: 840541460064                                     \u2502\n\u2502                                                                         \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n")))}p.isMDXComponent=!0}}]);