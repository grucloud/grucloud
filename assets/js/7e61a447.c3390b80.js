"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[42559],{3905:function(e,r,t){t.d(r,{Zo:function(){return p},kt:function(){return g}});var n=t(67294);function a(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function o(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function l(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?o(Object(t),!0).forEach((function(r){a(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function c(e,r){if(null==e)return{};var t,n,a=function(e,r){if(null==e)return{};var t,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)t=o[n],r.indexOf(t)>=0||(a[t]=e[t]);return a}(e,r);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)t=o[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var u=n.createContext({}),s=function(e){var r=n.useContext(u),t=r;return e&&(t="function"==typeof e?e(r):l(l({},r),e)),t},p=function(e){var r=s(e.components);return n.createElement(u.Provider,{value:r},e.children)},i={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},d=n.forwardRef((function(e,r){var t=e.components,a=e.mdxType,o=e.originalType,u=e.parentName,p=c(e,["components","mdxType","originalType","parentName"]),d=s(t),g=a,h=d["".concat(u,".").concat(g)]||d[g]||i[g]||o;return t?n.createElement(h,l(l({ref:r},p),{},{components:t})):n.createElement(h,l({ref:r},p))}));function g(e,r){var t=arguments,a=r&&r.mdxType;if("string"==typeof e||a){var o=t.length,l=new Array(o);l[0]=d;var c={};for(var u in r)hasOwnProperty.call(r,u)&&(c[u]=r[u]);c.originalType=e,c.mdxType="string"==typeof e?e:a,l[1]=c;for(var s=2;s<o;s++)l[s]=t[s];return n.createElement.apply(null,l)}return n.createElement.apply(null,t)}d.displayName="MDXCreateElement"},17153:function(e,r,t){t.r(r),t.d(r,{frontMatter:function(){return c},contentTitle:function(){return u},metadata:function(){return s},toc:function(){return p},default:function(){return d}});var n=t(87462),a=t(63366),o=(t(67294),t(3905)),l=["components"],c={id:"TargetGroup",title:"Target Group"},u=void 0,s={unversionedId:"aws/resources/ELBv2/TargetGroup",id:"aws/resources/ELBv2/TargetGroup",isDocsHomePage:!1,title:"Target Group",description:"Manages an ELB Target Group.",source:"@site/docs/aws/resources/ELBv2/TargetGroup.md",sourceDirName:"aws/resources/ELBv2",slug:"/aws/resources/ELBv2/TargetGroup",permalink:"/docs/aws/resources/ELBv2/TargetGroup",tags:[],version:"current",frontMatter:{id:"TargetGroup",title:"Target Group"},sidebar:"docs",previous:{title:"Rule",permalink:"/docs/aws/resources/ELBv2/Rule"},next:{title:"Group",permalink:"/docs/aws/resources/IAM/Group"}},p=[{value:"Example",id:"example",children:[],level:2},{value:"Properties",id:"properties",children:[],level:2},{value:"Source Code",id:"source-code",children:[],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"Used By",id:"used-by",children:[],level:2},{value:"List",id:"list",children:[],level:2}],i={toc:p};function d(e){var r=e.components,t=(0,a.Z)(e,l);return(0,o.kt)("wrapper",(0,n.Z)({},i,t,{components:r,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Manages an ",(0,o.kt)("a",{parentName:"p",href:"https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-target-groups.html"},"ELB Target Group"),"."),(0,o.kt)("p",null,"A target group can be attached directly to an AutoScaling Group or an AutoScaling Group created by an EKS Node Group."),(0,o.kt)("h2",{id:"example"},"Example"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "TargetGroup",\n    group: "ELBv2",\n    name: "target-group-rest",\n    properties: ({}) => ({\n      Protocol: "HTTP",\n      Port: 30020,\n      HealthCheckProtocol: "HTTP",\n      HealthCheckPort: "traffic-port",\n      HealthCheckEnabled: true,\n      HealthCheckIntervalSeconds: 30,\n      HealthCheckTimeoutSeconds: 5,\n      HealthyThresholdCount: 5,\n      HealthCheckPath: "/api/v1/version",\n      Matcher: {\n        HttpCode: "200",\n      },\n      TargetType: "instance",\n      ProtocolVersion: "HTTP1",\n    }),\n    dependencies: () => ({\n      vpc: "VPC",\n    }),\n  },\n];\n')),(0,o.kt)("h2",{id:"properties"},"Properties"),(0,o.kt)("p",null,"The list of properties are the parameter of ",(0,o.kt)("a",{parentName:"p",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-elastic-load-balancing-v2/interfaces/createtargetgroupcommandinput.html"},"CreateTargetGroupCommandInput")),(0,o.kt)("h2",{id:"source-code"},"Source Code"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/ELBv2/load-balancer/resources.js"},"Load Balancer"))),(0,o.kt)("h2",{id:"dependencies"},"Dependencies"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/Vpc"},"VPC")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/aws/resources/EKS/NodeGroup"},"EKS NodeGroup"))),(0,o.kt)("h2",{id:"used-by"},"Used By"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/aws/resources/AutoScaling/AutoScalingGroup"},"AutoScalingGroup"))),(0,o.kt)("h2",{id:"list"},"List"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t TargetGroup\n")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-txt"},'Listing resources on 1 provider: aws\n\u2713 aws\n  \u2713 Initialising\n  \u2713 Listing 2/2\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 2 ELBv2::TargetGroup from aws                                               \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: target-group-rest                                                     \u2502\n\u2502 managedByUs: Yes                                                            \u2502\n\u2502 live:                                                                       \u2502\n\u2502   TargetGroupArn: arn:aws:elasticloadbalancing:us-east-1:840541460064:targ\u2026 \u2502\n\u2502   TargetGroupName: target-group-rest                                        \u2502\n\u2502   Protocol: HTTP                                                            \u2502\n\u2502   Port: 30020                                                               \u2502\n\u2502   VpcId: vpc-055bc1b8bdcbd18ac                                              \u2502\n\u2502   HealthCheckProtocol: HTTP                                                 \u2502\n\u2502   HealthCheckPort: traffic-port                                             \u2502\n\u2502   HealthCheckEnabled: true                                                  \u2502\n\u2502   HealthCheckIntervalSeconds: 30                                            \u2502\n\u2502   HealthCheckTimeoutSeconds: 5                                              \u2502\n\u2502   HealthyThresholdCount: 5                                                  \u2502\n\u2502   UnhealthyThresholdCount: 2                                                \u2502\n\u2502   HealthCheckPath: /                                                        \u2502\n\u2502   Matcher:                                                                  \u2502\n\u2502     HttpCode: 200                                                           \u2502\n\u2502   LoadBalancerArns:                                                         \u2502\n\u2502     - "arn:aws:elasticloadbalancing:us-east-1:840541460064:loadbalancer/ap\u2026 \u2502\n\u2502   TargetType: instance                                                      \u2502\n\u2502   ProtocolVersion: HTTP1                                                    \u2502\n\u2502   Tags:                                                                     \u2502\n\u2502     - Key: gc-created-by-provider                                           \u2502\n\u2502       Value: aws                                                            \u2502\n\u2502     - Key: gc-managed-by                                                    \u2502\n\u2502       Value: grucloud                                                       \u2502\n\u2502     - Key: gc-project-name                                                  \u2502\n\u2502       Value: @grucloud/example-aws-elbv2-loadbalancer                       \u2502\n\u2502     - Key: gc-stage                                                         \u2502\n\u2502       Value: dev                                                            \u2502\n\u2502     - Key: Name                                                             \u2502\n\u2502       Value: target-group-rest                                              \u2502\n\u2502                                                                             \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: target-group-web                                                      \u2502\n\u2502 managedByUs: Yes                                                            \u2502\n\u2502 live:                                                                       \u2502\n\u2502   TargetGroupArn: arn:aws:elasticloadbalancing:us-east-1:840541460064:targ\u2026 \u2502\n\u2502   TargetGroupName: target-group-web                                         \u2502\n\u2502   Protocol: HTTP                                                            \u2502\n\u2502   Port: 30010                                                               \u2502\n\u2502   VpcId: vpc-055bc1b8bdcbd18ac                                              \u2502\n\u2502   HealthCheckProtocol: HTTP                                                 \u2502\n\u2502   HealthCheckPort: traffic-port                                             \u2502\n\u2502   HealthCheckEnabled: true                                                  \u2502\n\u2502   HealthCheckIntervalSeconds: 30                                            \u2502\n\u2502   HealthCheckTimeoutSeconds: 5                                              \u2502\n\u2502   HealthyThresholdCount: 5                                                  \u2502\n\u2502   UnhealthyThresholdCount: 2                                                \u2502\n\u2502   HealthCheckPath: /                                                        \u2502\n\u2502   Matcher:                                                                  \u2502\n\u2502     HttpCode: 200                                                           \u2502\n\u2502   LoadBalancerArns:                                                         \u2502\n\u2502     - "arn:aws:elasticloadbalancing:us-east-1:840541460064:loadbalancer/ap\u2026 \u2502\n\u2502   TargetType: instance                                                      \u2502\n\u2502   ProtocolVersion: HTTP1                                                    \u2502\n\u2502   Tags:                                                                     \u2502\n\u2502     - Key: gc-created-by-provider                                           \u2502\n\u2502       Value: aws                                                            \u2502\n\u2502     - Key: gc-managed-by                                                    \u2502\n\u2502       Value: grucloud                                                       \u2502\n\u2502     - Key: gc-project-name                                                  \u2502\n\u2502       Value: @grucloud/example-aws-elbv2-loadbalancer                       \u2502\n\u2502     - Key: gc-stage                                                         \u2502\n\u2502       Value: dev                                                            \u2502\n\u2502     - Key: Name                                                             \u2502\n\u2502       Value: target-group-web                                               \u2502\n\u2502                                                                             \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\nList Summary:\nProvider: aws\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 aws                                                                        \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 ELBv2::TargetGroup \u2502 target-group-rest                                     \u2502\n\u2502                    \u2502 target-group-web                                      \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n2 resources, 1 type, 1 provider\nCommand "gc l -t TargetGroup" executed in 4s\n')))}d.isMDXComponent=!0}}]);