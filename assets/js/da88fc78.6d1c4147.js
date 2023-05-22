"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[88232],{3905:(e,n,a)=>{a.d(n,{Zo:()=>l,kt:()=>f});var t=a(67294);function r(e,n,a){return n in e?Object.defineProperty(e,n,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[n]=a,e}function p(e,n){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),a.push.apply(a,t)}return a}function o(e){for(var n=1;n<arguments.length;n++){var a=null!=arguments[n]?arguments[n]:{};n%2?p(Object(a),!0).forEach((function(n){r(e,n,a[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):p(Object(a)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(a,n))}))}return e}function c(e,n){if(null==e)return{};var a,t,r=function(e,n){if(null==e)return{};var a,t,r={},p=Object.keys(e);for(t=0;t<p.length;t++)a=p[t],n.indexOf(a)>=0||(r[a]=e[a]);return r}(e,n);if(Object.getOwnPropertySymbols){var p=Object.getOwnPropertySymbols(e);for(t=0;t<p.length;t++)a=p[t],n.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var s=t.createContext({}),i=function(e){var n=t.useContext(s),a=n;return e&&(a="function"==typeof e?e(n):o(o({},n),e)),a},l=function(e){var n=i(e.components);return t.createElement(s.Provider,{value:n},e.children)},m="mdxType",d={inlineCode:"code",wrapper:function(e){var n=e.children;return t.createElement(t.Fragment,{},n)}},u=t.forwardRef((function(e,n){var a=e.components,r=e.mdxType,p=e.originalType,s=e.parentName,l=c(e,["components","mdxType","originalType","parentName"]),m=i(a),u=r,f=m["".concat(s,".").concat(u)]||m[u]||d[u]||p;return a?t.createElement(f,o(o({ref:n},l),{},{components:a})):t.createElement(f,o({ref:n},l))}));function f(e,n){var a=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var p=a.length,o=new Array(p);o[0]=u;var c={};for(var s in n)hasOwnProperty.call(n,s)&&(c[s]=n[s]);c.originalType=e,c[m]="string"==typeof e?e:r,o[1]=c;for(var i=2;i<p;i++)o[i]=a[i];return t.createElement.apply(null,o)}return t.createElement.apply(null,a)}u.displayName="MDXCreateElement"},72146:(e,n,a)=>{a.r(n),a.d(n,{assets:()=>s,contentTitle:()=>o,default:()=>d,frontMatter:()=>p,metadata:()=>c,toc:()=>i});var t=a(87462),r=(a(67294),a(3905));const p={id:"IpamScope",title:"IPAM Scope"},o=void 0,c={unversionedId:"aws/resources/EC2/IpamScope",id:"aws/resources/EC2/IpamScope",title:"IPAM Scope",description:"Provides a VPC IP Address Manager Scope",source:"@site/docs/aws/resources/EC2/IpamScope.md",sourceDirName:"aws/resources/EC2",slug:"/aws/resources/EC2/IpamScope",permalink:"/docs/aws/resources/EC2/IpamScope",draft:!1,tags:[],version:"current",frontMatter:{id:"IpamScope",title:"IPAM Scope"},sidebar:"docs",previous:{title:"IPAM Pool CIDR",permalink:"/docs/aws/resources/EC2/IpamPoolCird"},next:{title:"KeyPair",permalink:"/docs/aws/resources/EC2/KeyPair"}},s={},i=[{value:"Examples",id:"examples",level:3},{value:"Properties",id:"properties",level:3},{value:"Dependencies",id:"dependencies",level:3},{value:"Used By",id:"used-by",level:3},{value:"Listing",id:"listing",level:2}],l={toc:i},m="wrapper";function d(e){let{components:n,...a}=e;return(0,r.kt)(m,(0,t.Z)({},l,a,{components:n,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"Provides a ",(0,r.kt)("a",{parentName:"p",href:"https://console.aws.amazon.com/ipam/home?#Scopes"},"VPC IP Address Manager Scope")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "IpamScope",\n    group: "EC2",\n    name: "my-ipam-scope",\n    properties: ({ config }) => ({\n      IpamRegion: `${config.region}`,\n      IpamScopeType: "private",\n      IsDefault: false,\n      Description: "",\n    }),\n    dependencies: ({}) => ({\n      ipam: "ipam",\n    }),\n  },\n];\n')),(0,r.kt)("h3",{id:"examples"},"Examples"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/ipam"},"ipam"))),(0,r.kt)("h3",{id:"properties"},"Properties"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/createipamscopecommandinput.html"},"CreateIpamScopeCommandInput"))),(0,r.kt)("h3",{id:"dependencies"},"Dependencies"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/Ipam"},"Ipam"))),(0,r.kt)("h3",{id:"used-by"},"Used By"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/IpamPool"},"Ipam Pool"))),(0,r.kt)("h2",{id:"listing"},"Listing"),(0,r.kt)("p",null,"List the ipam scopes with the ",(0,r.kt)("em",{parentName:"p"},"IpamScope")," filter:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t IpamScope\n")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-txt"},'Listing resources on 1 provider: aws\n\u2713 aws\n  \u2713 Initialising\n  \u2713 Listing 1/1\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 3 EC2::IpamScope from aws                                                    \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: ipam-scope-04dd070caa9d40f75                                           \u2502\n\u2502 managedByUs: NO                                                              \u2502\n\u2502 live:                                                                        \u2502\n\u2502   OwnerId: 548529576214                                                      \u2502\n\u2502   IpamScopeId: ipam-scope-04dd070caa9d40f75                                  \u2502\n\u2502   IpamScopeArn: arn:aws:ec2::548529576214:ipam-scope/ipam-scope-04dd070caa9\u2026 \u2502\n\u2502   IpamArn: arn:aws:ec2::548529576214:ipam/ipam-05e91ed4dde7d50c5             \u2502\n\u2502   IpamRegion: us-east-1                                                      \u2502\n\u2502   IpamScopeType: private                                                     \u2502\n\u2502   IsDefault: true                                                            \u2502\n\u2502   PoolCount: 0                                                               \u2502\n\u2502   State: create-complete                                                     \u2502\n\u2502   Tags: []                                                                   \u2502\n\u2502                                                                              \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: ipam-scope-06d9e85d28b710534                                           \u2502\n\u2502 managedByUs: NO                                                              \u2502\n\u2502 live:                                                                        \u2502\n\u2502   OwnerId: 548529576214                                                      \u2502\n\u2502   IpamScopeId: ipam-scope-06d9e85d28b710534                                  \u2502\n\u2502   IpamScopeArn: arn:aws:ec2::548529576214:ipam-scope/ipam-scope-06d9e85d28b\u2026 \u2502\n\u2502   IpamArn: arn:aws:ec2::548529576214:ipam/ipam-05e91ed4dde7d50c5             \u2502\n\u2502   IpamRegion: us-east-1                                                      \u2502\n\u2502   IpamScopeType: public                                                      \u2502\n\u2502   IsDefault: true                                                            \u2502\n\u2502   PoolCount: 0                                                               \u2502\n\u2502   State: create-complete                                                     \u2502\n\u2502   Tags: []                                                                   \u2502\n\u2502                                                                              \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: my-ipam-scope                                                          \u2502\n\u2502 managedByUs: Yes                                                             \u2502\n\u2502 live:                                                                        \u2502\n\u2502   OwnerId: 548529576214                                                      \u2502\n\u2502   IpamScopeId: ipam-scope-0cda16456545069f5                                  \u2502\n\u2502   IpamScopeArn: arn:aws:ec2::548529576214:ipam-scope/ipam-scope-0cda1645654\u2026 \u2502\n\u2502   IpamArn: arn:aws:ec2::548529576214:ipam/ipam-05e91ed4dde7d50c5             \u2502\n\u2502   IpamRegion: us-east-1                                                      \u2502\n\u2502   IpamScopeType: private                                                     \u2502\n\u2502   IsDefault: false                                                           \u2502\n\u2502   Description:                                                               \u2502\n\u2502   PoolCount: 0                                                               \u2502\n\u2502   State: create-complete                                                     \u2502\n\u2502   Tags:                                                                      \u2502\n\u2502     - Key: gc-created-by-provider                                            \u2502\n\u2502       Value: aws                                                             \u2502\n\u2502     - Key: gc-managed-by                                                     \u2502\n\u2502       Value: grucloud                                                        \u2502\n\u2502     - Key: gc-project-name                                                   \u2502\n\u2502       Value: ipam                                                            \u2502\n\u2502     - Key: gc-stage                                                          \u2502\n\u2502       Value: dev                                                             \u2502\n\u2502     - Key: Name                                                              \u2502\n\u2502       Value: my-ipam-scope                                                   \u2502\n\u2502                                                                              \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\nList Summary:\nProvider: aws\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 aws                                                                         \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 EC2::IpamScope \u2502 ipam-scope-04dd070caa9d40f75                               \u2502\n\u2502                \u2502 ipam-scope-06d9e85d28b710534                               \u2502\n\u2502                \u2502 my-ipam-scope                                              \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n3 resources, 1 type, 1 provider\nCommand "gc l -t IpamScope" executed in 4s, 163 MB\n')))}d.isMDXComponent=!0}}]);