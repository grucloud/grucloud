"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[24231],{3905:(e,a,t)=>{t.d(a,{Zo:()=>i,kt:()=>m});var r=t(67294);function n(e,a,t){return a in e?Object.defineProperty(e,a,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[a]=t,e}function l(e,a){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);a&&(r=r.filter((function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable}))),t.push.apply(t,r)}return t}function o(e){for(var a=1;a<arguments.length;a++){var t=null!=arguments[a]?arguments[a]:{};a%2?l(Object(t),!0).forEach((function(a){n(e,a,t[a])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):l(Object(t)).forEach((function(a){Object.defineProperty(e,a,Object.getOwnPropertyDescriptor(t,a))}))}return e}function c(e,a){if(null==e)return{};var t,r,n=function(e,a){if(null==e)return{};var t,r,n={},l=Object.keys(e);for(r=0;r<l.length;r++)t=l[r],a.indexOf(t)>=0||(n[t]=e[t]);return n}(e,a);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(r=0;r<l.length;r++)t=l[r],a.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(n[t]=e[t])}return n}var s=r.createContext({}),u=function(e){var a=r.useContext(s),t=a;return e&&(t="function"==typeof e?e(a):o(o({},a),e)),t},i=function(e){var a=u(e.components);return r.createElement(s.Provider,{value:a},e.children)},p="mdxType",d={inlineCode:"code",wrapper:function(e){var a=e.children;return r.createElement(r.Fragment,{},a)}},g=r.forwardRef((function(e,a){var t=e.components,n=e.mdxType,l=e.originalType,s=e.parentName,i=c(e,["components","mdxType","originalType","parentName"]),p=u(t),g=n,m=p["".concat(s,".").concat(g)]||p[g]||d[g]||l;return t?r.createElement(m,o(o({ref:a},i),{},{components:t})):r.createElement(m,o({ref:a},i))}));function m(e,a){var t=arguments,n=a&&a.mdxType;if("string"==typeof e||n){var l=t.length,o=new Array(l);o[0]=g;var c={};for(var s in a)hasOwnProperty.call(a,s)&&(c[s]=a[s]);c.originalType=e,c[p]="string"==typeof e?e:n,o[1]=c;for(var u=2;u<l;u++)o[u]=t[u];return r.createElement.apply(null,o)}return r.createElement.apply(null,t)}g.displayName="MDXCreateElement"},48804:(e,a,t)=>{t.r(a),t.d(a,{assets:()=>s,contentTitle:()=>o,default:()=>d,frontMatter:()=>l,metadata:()=>c,toc:()=>u});var r=t(87462),n=(t(67294),t(3905));const l={id:"TargetGroup",title:"Target Group"},o=void 0,c={unversionedId:"aws/resources/ElasticLoadBalancingV2/TargetGroup",id:"aws/resources/ElasticLoadBalancingV2/TargetGroup",title:"Target Group",description:"Manages an ELB Target Group.",source:"@site/docs/aws/resources/ElasticLoadBalancingV2/TargetGroup.md",sourceDirName:"aws/resources/ElasticLoadBalancingV2",slug:"/aws/resources/ElasticLoadBalancingV2/TargetGroup",permalink:"/docs/aws/resources/ElasticLoadBalancingV2/TargetGroup",draft:!1,tags:[],version:"current",frontMatter:{id:"TargetGroup",title:"Target Group"},sidebar:"docs",previous:{title:"Rule",permalink:"/docs/aws/resources/ElasticLoadBalancingV2/Rule"},next:{title:"DeliveryStream",permalink:"/docs/aws/resources/Firehose/DeliveryStream"}},s={},u=[{value:"Example",id:"example",level:2},{value:"Properties",id:"properties",level:2},{value:"Source Code",id:"source-code",level:2},{value:"Dependencies",id:"dependencies",level:2},{value:"Used By",id:"used-by",level:2},{value:"List",id:"list",level:2}],i={toc:u},p="wrapper";function d(e){let{components:a,...t}=e;return(0,n.kt)(p,(0,r.Z)({},i,t,{components:a,mdxType:"MDXLayout"}),(0,n.kt)("p",null,"Manages an ",(0,n.kt)("a",{parentName:"p",href:"https://console.aws.amazon.com/ec2/v2/home?#TargetGroups:"},"ELB Target Group"),"."),(0,n.kt)("p",null,"A target group can be attached directly to an AutoScaling Group or an AutoScaling Group created by an EKS Node Group."),(0,n.kt)("h2",{id:"example"},"Example"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "TargetGroup",\n    group: "ElasticLoadBalancingV2",\n    properties: ({}) => ({\n      Name: "target-group-rest",\n      Protocol: "HTTP",\n      Port: 30020,\n      HealthCheckProtocol: "HTTP",\n      HealthCheckPort: "traffic-port",\n      HealthCheckEnabled: true,\n      HealthCheckIntervalSeconds: 30,\n      HealthCheckTimeoutSeconds: 5,\n      HealthyThresholdCount: 5,\n      HealthCheckPath: "/api/v1/version",\n      Matcher: {\n        HttpCode: "200",\n      },\n      TargetType: "instance",\n      ProtocolVersion: "HTTP1",\n    }),\n    dependencies: () => ({\n      vpc: "VPC",\n    }),\n  },\n];\n')),(0,n.kt)("h2",{id:"properties"},"Properties"),(0,n.kt)("p",null,"The list of properties are the parameter of ",(0,n.kt)("a",{parentName:"p",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-elastic-load-balancing-v2/interfaces/createtargetgroupcommandinput.html"},"CreateTargetGroupCommandInput")),(0,n.kt)("h2",{id:"source-code"},"Source Code"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/ElasticLoadBalancingV2/load-balancer"},"Load Balancer simple")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/CodeDeploy/codedeploy-ecs"},"code deploy ecs")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/EKS/eks-load-balancer"},"EKS with load balancer")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/Route53/routing-failover-policy"},"Route53 failover policy")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/serverless-patterns/apigw-fargate-cdk"},"serverless-patterns apigw-fargate-cdk")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/serverless-patterns/apigw-vpclink-pvt-alb"},"serverless-patterns apigw-vpclink-pvt-alb")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/serverless-patterns/fargate-aurora-serverless-cdk"},"serverless-patterns fargate-aurora-serverless-cdk")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/serverless-patterns/fargate-eventbridge"},"serverless-patterns fargate-eventbridge")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/WAFv2/wafv2-loadbalancer"},"wafv2-loadbalancer"))),(0,n.kt)("h2",{id:"dependencies"},"Dependencies"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/Vpc"},"VPC"))),(0,n.kt)("h2",{id:"used-by"},"Used By"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"/docs/aws/resources/ElasticLoadBalancingV2/Listener"},"Listener")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"/docs/aws/resources/AutoScaling/AutoScalingAttachment"},"AutoScalingGroup AutoScalingAttachment")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"/docs/aws/resources/CodeDeploy/DeploymentGroup"},"CodeDeploy DeploymentGroup")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"/docs/aws/resources/ECS/Service"},"ECS Service")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"/docs/aws/resources/ECS/TaskSet"},"ECS TaskSet"))),(0,n.kt)("h2",{id:"list"},"List"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t TargetGroup\n")),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-txt"},'Listing resources on 1 provider: aws\n\u2713 aws\n  \u2713 Initialising\n  \u2713 Listing 2/2\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 2 ElasticLoadBalancingV2::TargetGroup from aws                                               \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: target-group-rest                                                     \u2502\n\u2502 managedByUs: Yes                                                            \u2502\n\u2502 live:                                                                       \u2502\n\u2502   TargetGroupArn: arn:aws:elasticloadbalancing:us-east-1:840541460064:targ\u2026 \u2502\n\u2502   TargetGroupName: target-group-rest                                        \u2502\n\u2502   Protocol: HTTP                                                            \u2502\n\u2502   Port: 30020                                                               \u2502\n\u2502   VpcId: vpc-055bc1b8bdcbd18ac                                              \u2502\n\u2502   HealthCheckProtocol: HTTP                                                 \u2502\n\u2502   HealthCheckPort: traffic-port                                             \u2502\n\u2502   HealthCheckEnabled: true                                                  \u2502\n\u2502   HealthCheckIntervalSeconds: 30                                            \u2502\n\u2502   HealthCheckTimeoutSeconds: 5                                              \u2502\n\u2502   HealthyThresholdCount: 5                                                  \u2502\n\u2502   UnhealthyThresholdCount: 2                                                \u2502\n\u2502   HealthCheckPath: /                                                        \u2502\n\u2502   Matcher:                                                                  \u2502\n\u2502     HttpCode: 200                                                           \u2502\n\u2502   LoadBalancerArns:                                                         \u2502\n\u2502     - "arn:aws:elasticloadbalancing:us-east-1:840541460064:loadbalancer/ap\u2026 \u2502\n\u2502   TargetType: instance                                                      \u2502\n\u2502   ProtocolVersion: HTTP1                                                    \u2502\n\u2502   Tags:                                                                     \u2502\n\u2502     - Key: gc-created-by-provider                                           \u2502\n\u2502       Value: aws                                                            \u2502\n\u2502     - Key: gc-managed-by                                                    \u2502\n\u2502       Value: grucloud                                                       \u2502\n\u2502     - Key: gc-project-name                                                  \u2502\n\u2502       Value: @grucloud/example-aws-elbv2-loadbalancer                       \u2502\n\u2502     - Key: gc-stage                                                         \u2502\n\u2502       Value: dev                                                            \u2502\n\u2502     - Key: Name                                                             \u2502\n\u2502       Value: target-group-rest                                              \u2502\n\u2502                                                                             \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: target-group-web                                                      \u2502\n\u2502 managedByUs: Yes                                                            \u2502\n\u2502 live:                                                                       \u2502\n\u2502   TargetGroupArn: arn:aws:elasticloadbalancing:us-east-1:840541460064:targ\u2026 \u2502\n\u2502   TargetGroupName: target-group-web                                         \u2502\n\u2502   Protocol: HTTP                                                            \u2502\n\u2502   Port: 30010                                                               \u2502\n\u2502   VpcId: vpc-055bc1b8bdcbd18ac                                              \u2502\n\u2502   HealthCheckProtocol: HTTP                                                 \u2502\n\u2502   HealthCheckPort: traffic-port                                             \u2502\n\u2502   HealthCheckEnabled: true                                                  \u2502\n\u2502   HealthCheckIntervalSeconds: 30                                            \u2502\n\u2502   HealthCheckTimeoutSeconds: 5                                              \u2502\n\u2502   HealthyThresholdCount: 5                                                  \u2502\n\u2502   UnhealthyThresholdCount: 2                                                \u2502\n\u2502   HealthCheckPath: /                                                        \u2502\n\u2502   Matcher:                                                                  \u2502\n\u2502     HttpCode: 200                                                           \u2502\n\u2502   LoadBalancerArns:                                                         \u2502\n\u2502     - "arn:aws:elasticloadbalancing:us-east-1:840541460064:loadbalancer/ap\u2026 \u2502\n\u2502   TargetType: instance                                                      \u2502\n\u2502   ProtocolVersion: HTTP1                                                    \u2502\n\u2502   Tags:                                                                     \u2502\n\u2502     - Key: gc-created-by-provider                                           \u2502\n\u2502       Value: aws                                                            \u2502\n\u2502     - Key: gc-managed-by                                                    \u2502\n\u2502       Value: grucloud                                                       \u2502\n\u2502     - Key: gc-project-name                                                  \u2502\n\u2502       Value: @grucloud/example-aws-elbv2-loadbalancer                       \u2502\n\u2502     - Key: gc-stage                                                         \u2502\n\u2502       Value: dev                                                            \u2502\n\u2502     - Key: Name                                                             \u2502\n\u2502       Value: target-group-web                                               \u2502\n\u2502                                                                             \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\nList Summary:\nProvider: aws\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 aws                                                                        \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 ElasticLoadBalancingV2::TargetGroup \u2502 target-group-rest                                     \u2502\n\u2502                    \u2502 target-group-web                                      \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n2 resources, 1 type, 1 provider\nCommand "gc l -t TargetGroup" executed in 4s\n')))}d.isMDXComponent=!0}}]);