"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[64024],{3905:(e,n,t)=>{t.d(n,{Zo:()=>c,kt:()=>m});var r=t(67294);function i(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function a(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function o(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?a(Object(t),!0).forEach((function(n){i(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function l(e,n){if(null==e)return{};var t,r,i=function(e,n){if(null==e)return{};var t,r,i={},a=Object.keys(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||(i[t]=e[t]);return i}(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var p=r.createContext({}),s=function(e){var n=r.useContext(p),t=n;return e&&(t="function"==typeof e?e(n):o(o({},n),e)),t},c=function(e){var n=s(e.components);return r.createElement(p.Provider,{value:n},e.children)},u={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},d=r.forwardRef((function(e,n){var t=e.components,i=e.mdxType,a=e.originalType,p=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),d=s(t),m=i,f=d["".concat(p,".").concat(m)]||d[m]||u[m]||a;return t?r.createElement(f,o(o({ref:n},c),{},{components:t})):r.createElement(f,o({ref:n},c))}));function m(e,n){var t=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var a=t.length,o=new Array(a);o[0]=d;var l={};for(var p in n)hasOwnProperty.call(n,p)&&(l[p]=n[p]);l.originalType=e,l.mdxType="string"==typeof e?e:i,o[1]=l;for(var s=2;s<a;s++)o[s]=t[s];return r.createElement.apply(null,o)}return r.createElement.apply(null,t)}d.displayName="MDXCreateElement"},37171:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>p,contentTitle:()=>o,default:()=>u,frontMatter:()=>a,metadata:()=>l,toc:()=>s});var r=t(87462),i=(t(67294),t(3905));const a={id:"ClientVpnEndpoint",title:"Client VPN Endpoint"},o=void 0,l={unversionedId:"aws/resources/EC2/ClientVpnEndpoint",id:"aws/resources/EC2/ClientVpnEndpoint",title:"Client VPN Endpoint",description:"Provides a Client VPN Endpoint",source:"@site/docs/aws/resources/EC2/ClientVpnEndpoint.md",sourceDirName:"aws/resources/EC2",slug:"/aws/resources/EC2/ClientVpnEndpoint",permalink:"/docs/aws/resources/EC2/ClientVpnEndpoint",draft:!1,tags:[],version:"current",frontMatter:{id:"ClientVpnEndpoint",title:"Client VPN Endpoint"},sidebar:"docs",previous:{title:"Client Vpn Authorization Rule",permalink:"/docs/aws/resources/EC2/ClientVpnAuthorizationRule"},next:{title:"Client Vpn Target Network",permalink:"/docs/aws/resources/EC2/ClientVpnTargetNetwork"}},p={},s=[{value:"Examples",id:"examples",level:3},{value:"Properties",id:"properties",level:3},{value:"Dependencies",id:"dependencies",level:3},{value:"List",id:"list",level:3}],c={toc:s};function u(e){let{components:n,...t}=e;return(0,i.kt)("wrapper",(0,r.Z)({},c,t,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Provides a ",(0,i.kt)("a",{parentName:"p",href:"https://console.aws.amazon.com/vpc/home?#ClientVPNEndpoints:"},"Client VPN Endpoint")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "ClientVpnEndpoint",\n    group: "EC2",\n    name: "client-vpn",\n    properties: ({ getId }) => ({\n      ClientCidrBlock: "10.0.0.0/16",\n      AuthenticationOptions: [\n        {\n          Type: "certificate-authentication",\n          MutualAuthentication: {\n            ClientRootCertificateChainArn: `${getId({\n              type: "Certificate",\n              group: "ACM",\n              name: "client1.vpn.tld",\n            })}`,\n          },\n        },\n      ],\n    }),\n    dependencies: ({}) => ({\n      serverCertificate: "server",\n      clientCertificate: "client1.vpn.tld",\n    }),\n  },\n];\n')),(0,i.kt)("h3",{id:"examples"},"Examples"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/client-vpn-endpoint"},"client-vpn-endpoint"))),(0,i.kt)("h3",{id:"properties"},"Properties"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/createclientvpnendpointcommandinput.html"},"CreateClientVpnEndpointCommandInput"))),(0,i.kt)("h3",{id:"dependencies"},"Dependencies"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/aws/resources/ACM/Certificate"},"ACM Certificate")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"./Vpc"},"Vpc")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/SecurityGroup"},"Security Group")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/aws/resources/CloudWatchLogs/LogGroup"},"CloudWatchLogs LogGroup")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/aws/resources/CloudWatchLogs/LogStream"},"CloudWatchLogs LogStream"))),(0,i.kt)("h3",{id:"list"},"List"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t ClientVpnEndpoint\n")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-txt"},'Listing resources on 1 provider: aws\n\u2713 aws us-east-1\n  \u2713 Initialising\n  \u2713 Listing 1/1\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 1 EC2::ClientVpnEndpoint from aws                                                            \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: client-vpn                                                                             \u2502\n\u2502 managedByUs: Yes                                                                             \u2502\n\u2502 live:                                                                                        \u2502\n\u2502   ClientVpnEndpointId: cvpn-endpoint-0a4eb6f262142e601                                       \u2502\n\u2502   Description:                                                                               \u2502\n\u2502   Status:                                                                                    \u2502\n\u2502     Code: pending-associate                                                                  \u2502\n\u2502   CreationTime: 2022-07-19T12:57:40                                                          \u2502\n\u2502   DnsName: *.cvpn-endpoint-0a4eb6f262142e601.prod.clientvpn.us-east-1.amazonaws.com          \u2502\n\u2502   ClientCidrBlock: 10.0.0.0/16                                                               \u2502\n\u2502   SplitTunnel: false                                                                         \u2502\n\u2502   VpnProtocol: openvpn                                                                       \u2502\n\u2502   TransportProtocol: udp                                                                     \u2502\n\u2502   VpnPort: 443                                                                               \u2502\n\u2502   ServerCertificateArn: arn:aws:acm:us-east-1:840541460064:certificate/555b616a-ca01-4ccf-b\u2026 \u2502\n\u2502   AuthenticationOptions:                                                                     \u2502\n\u2502     - Type: certificate-authentication                                                       \u2502\n\u2502       MutualAuthentication:                                                                  \u2502\n\u2502         ClientRootCertificateChain: arn:aws:acm:us-east-1:840541460064:certificate/81633d75\u2026 \u2502\n\u2502   ConnectionLogOptions:                                                                      \u2502\n\u2502     Enabled: false                                                                           \u2502\n\u2502   Tags:                                                                                      \u2502\n\u2502     - Key: Name                                                                              \u2502\n\u2502       Value: client-vpn                                                                      \u2502\n\u2502   SecurityGroupIds:                                                                          \u2502\n\u2502     - "sg-4e82a670"                                                                          \u2502\n\u2502   VpcId: vpc-faff3987                                                                        \u2502\n\u2502   ClientConnectOptions:                                                                      \u2502\n\u2502     Enabled: false                                                                           \u2502\n\u2502     Status:                                                                                  \u2502\n\u2502       Code: applying                                                                         \u2502\n\u2502   SessionTimeoutHours: 24                                                                    \u2502\n\u2502   ClientLoginBannerOptions:                                                                  \u2502\n\u2502     Enabled: false                                                                           \u2502\n\u2502                                                                                              \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\nList Summary:\nProvider: aws\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 aws                                                                                         \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 EC2::ClientVpnEndpoint \u2502 client-vpn                                                         \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n1 resource, 1 type, 1 provider\nCommand "gc l -t ClientVpnEndpoint" executed in 4s, 102 MB\n')))}u.isMDXComponent=!0}}]);