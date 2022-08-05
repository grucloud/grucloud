"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[92263],{3905:(e,a,r)=>{r.d(a,{Zo:()=>u,kt:()=>d});var t=r(67294);function s(e,a,r){return a in e?Object.defineProperty(e,a,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[a]=r,e}function o(e,a){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);a&&(t=t.filter((function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable}))),r.push.apply(r,t)}return r}function n(e){for(var a=1;a<arguments.length;a++){var r=null!=arguments[a]?arguments[a]:{};a%2?o(Object(r),!0).forEach((function(a){s(e,a,r[a])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(a){Object.defineProperty(e,a,Object.getOwnPropertyDescriptor(r,a))}))}return e}function i(e,a){if(null==e)return{};var r,t,s=function(e,a){if(null==e)return{};var r,t,s={},o=Object.keys(e);for(t=0;t<o.length;t++)r=o[t],a.indexOf(r)>=0||(s[r]=e[r]);return s}(e,a);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(t=0;t<o.length;t++)r=o[t],a.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(s[r]=e[r])}return s}var c=t.createContext({}),l=function(e){var a=t.useContext(c),r=a;return e&&(r="function"==typeof e?e(a):n(n({},a),e)),r},u=function(e){var a=l(e.components);return t.createElement(c.Provider,{value:a},e.children)},p={inlineCode:"code",wrapper:function(e){var a=e.children;return t.createElement(t.Fragment,{},a)}},m=t.forwardRef((function(e,a){var r=e.components,s=e.mdxType,o=e.originalType,c=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),m=l(r),d=s,w=m["".concat(c,".").concat(d)]||m[d]||p[d]||o;return r?t.createElement(w,n(n({ref:a},u),{},{components:r})):t.createElement(w,n({ref:a},u))}));function d(e,a){var r=arguments,s=a&&a.mdxType;if("string"==typeof e||s){var o=r.length,n=new Array(o);n[0]=m;var i={};for(var c in a)hasOwnProperty.call(a,c)&&(i[c]=a[c]);i.originalType=e,i.mdxType="string"==typeof e?e:s,n[1]=i;for(var l=2;l<o;l++)n[l]=r[l];return t.createElement.apply(null,n)}return t.createElement.apply(null,r)}m.displayName="MDXCreateElement"},722:(e,a,r)=>{r.r(a),r.d(a,{assets:()=>c,contentTitle:()=>n,default:()=>p,frontMatter:()=>o,metadata:()=>i,toc:()=>l});var t=r(87462),s=(r(67294),r(3905));const o={id:"ResourcesList",title:"Resources List"},n=void 0,i={unversionedId:"aws/ResourcesList",id:"aws/ResourcesList",title:"Resources List",description:"List of resources for provider aws:",source:"@site/docs/aws/AwsResources.md",sourceDirName:"aws",slug:"/aws/ResourcesList",permalink:"/docs/aws/ResourcesList",draft:!1,tags:[],version:"current",frontMatter:{id:"ResourcesList",title:"Resources List"},sidebar:"docs",previous:{title:"Kubernetes Getting Started",permalink:"/docs/k8s/K8sGettingStarted"},next:{title:"Certificate",permalink:"/docs/aws/resources/ACM/Certificate"}},c={},l=[],u={toc:l};function p(e){let{components:a,...r}=e;return(0,s.kt)("wrapper",(0,t.Z)({},u,r,{components:a,mdxType:"MDXLayout"}),(0,s.kt)("p",null,"List of resources for provider aws:"),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},"ACM:\n",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/ACM/Certificate"},"Certificate")),(0,s.kt)("li",{parentName:"ul"},"APIGateway:\n",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/APIGateway/Account"},"Account"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/APIGateway/ApiKey"},"ApiKey"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/APIGateway/RestApi"},"RestApi"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/APIGateway/Stage"},"Stage"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/APIGateway/Authorizer"},"Authorizer"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/APIGateway/UsagePlan"},"UsagePlan"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/APIGateway/UsagePlanKey"},"UsagePlanKey")),(0,s.kt)("li",{parentName:"ul"},"ApiGatewayV2:\n",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/ApiGatewayV2/DomainName"},"DomainName"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/ApiGatewayV2/Api"},"Api"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/ApiGatewayV2/Stage"},"Stage"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/ApiGatewayV2/Authorizer"},"Authorizer"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/ApiGatewayV2/ApiMapping"},"ApiMapping"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/ApiGatewayV2/Integration"},"Integration"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/ApiGatewayV2/Route"},"Route"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/ApiGatewayV2/Deployment"},"Deployment"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/ApiGatewayV2/VpcLink"},"VpcLink")),(0,s.kt)("li",{parentName:"ul"},"AppRunner:\n",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/AppRunner/Connection"},"Connection"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/AppRunner/Service"},"Service")),(0,s.kt)("li",{parentName:"ul"},"AppSync:\n",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/AppSync/GraphqlApi"},"GraphqlApi"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/AppSync/DataSource"},"DataSource"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/AppSync/Resolver"},"Resolver")),(0,s.kt)("li",{parentName:"ul"},"AutoScaling:\n",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/AutoScaling/AutoScalingGroup"},"AutoScalingGroup"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/AutoScaling/AutoScalingAttachment"},"AutoScalingAttachment"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/AutoScaling/LaunchConfiguration"},"LaunchConfiguration")),(0,s.kt)("li",{parentName:"ul"},"CloudFormation:\n",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/CloudFormation/Stack"},"Stack")),(0,s.kt)("li",{parentName:"ul"},"CloudFront:\n",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/CloudFront/Distribution"},"Distribution"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/CloudFront/CachePolicy"},"CachePolicy"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/CloudFront/Function"},"Function"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/CloudFront/OriginAccessIdentity"},"OriginAccessIdentity")),(0,s.kt)("li",{parentName:"ul"},"CloudTrail:\n",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/CloudTrail/CloudTrail"},"Trail"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/CloudTrail/EventDataStore"},"EventDataStore")),(0,s.kt)("li",{parentName:"ul"},"CloudWatch:\n",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/CloudWatch/MetricAlarm"},"MetricAlarm")),(0,s.kt)("li",{parentName:"ul"},"CloudWatchEvents:\n",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/CloudWatchEvents/ApiDestination"},"ApiDestination"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/CloudWatchEvents/Connection"},"Connection"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/CloudWatchEvents/EventBus"},"EventBus"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/CloudWatchEvents/Rule"},"Rule"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/CloudWatchEvents/Target"},"Target")),(0,s.kt)("li",{parentName:"ul"},"CloudWatchLogs:\n",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/CloudWatchLogs/LogGroup"},"LogGroup"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/CloudWatchLogs/LogStream"},"LogStream"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/CloudWatchLogs/SubscriptionFilter"},"SubscriptionFilter")),(0,s.kt)("li",{parentName:"ul"},"CodeBuild:\n",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/CodeBuild/Project"},"Project")),(0,s.kt)("li",{parentName:"ul"},"CodeDeploy:\n",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/CodeDeploy/Application"},"Application"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/CodeDeploy/DeploymentGroup"},"DeploymentGroup")),(0,s.kt)("li",{parentName:"ul"},"CodePipeline:\n",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/CodePipeline/Pipeline"},"Pipeline")),(0,s.kt)("li",{parentName:"ul"},"CodeStarConnections:\n",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/CodeStarConnections/Connection"},"Connection")),(0,s.kt)("li",{parentName:"ul"},"CognitoIdentityServiceProvider:\n",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/CognitoIdentityServiceProvider/IdentityProvider"},"IdentityProvider"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/CognitoIdentityServiceProvider/UserPool"},"UserPool"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/CognitoIdentityServiceProvider/UserPoolClient"},"UserPoolClient"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/CognitoIdentityServiceProvider/UserPoolDomain"},"UserPoolDomain")),(0,s.kt)("li",{parentName:"ul"},"DynamoDB:\n",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/DynamoDB/Table"},"Table"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/DynamoDB/DynamoDBKinesisStreamingDestination"},"KinesisStreamingDestination")),(0,s.kt)("li",{parentName:"ul"},"EC2:\n",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/CustomerGateway"},"CustomerGateway"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/ClientVpnAuthorizationRule"},"ClientVpnAuthorizationRule"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/ClientVpnEndpoint"},"ClientVpnEndpoint"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/ClientVpnTargetNetwork"},"ClientVpnTargetNetwork"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/DhcpOptions"},"DhcpOptions"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/DhcpOptionsAssociation"},"DhcpOptionsAssociation"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/FlowLogs"},"FlowLogs"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/Ipam"},"Ipam"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/IpamScope"},"IpamScope"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/IpamPool"},"IpamPool"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/IpamPoolCird"},"IpamPoolCidr"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/KeyPair"},"KeyPair"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/NetworkInterface"},"NetworkInterface"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/Volume"},"Volume"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/VolumeAttachment"},"VolumeAttachment"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/Vpc"},"Vpc"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/InternetGateway"},"InternetGateway"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/InternetGatewayAttachment"},"InternetGatewayAttachment"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/EgressOnlyInternetGateway"},"EgressOnlyInternetGateway"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/NatGateway"},"NatGateway"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/Subnet"},"Subnet"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/RouteTable"},"RouteTable"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/RouteTableAssociation"},"RouteTableAssociation"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/Route"},"Route"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/SecurityGroup"},"SecurityGroup"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/SecurityGroupRuleIngress"},"SecurityGroupRuleIngress"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/SecurityGroupRuleEgress"},"SecurityGroupRuleEgress"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/ElasticIpAddress"},"ElasticIpAddress"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/ElasticIpAddressAssociation"},"ElasticIpAddressAssociation"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/EC2"},"Instance"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/LaunchTemplate"},"LaunchTemplate"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/NetworkAcl"},"NetworkAcl"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/ManagedPrefixList"},"ManagedPrefixList"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/PlacementGroup"},"PlacementGroup"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/VpcEndpoint"},"VpcEndpoint"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/VpcPeeringConnection"},"VpcPeeringConnection"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/VpcPeeringConnectionAccepter"},"VpcPeeringConnectionAccepter"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/TransitGateway"},"TransitGateway"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/TransitGatewayRoute"},"TransitGatewayRoute"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/TransitGatewayRouteTable"},"TransitGatewayRouteTable"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/TransitGatewayPeeringAttachment"},"TransitGatewayPeeringAttachment"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/TransitGatewayAttachment"},"TransitGatewayAttachment"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/TransitGatewayVpcAttachment"},"TransitGatewayVpcAttachment"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/TransitGatewayRouteTableAssociation"},"TransitGatewayRouteTableAssociation"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/TransitGatewayRouteTablePropagation"},"TransitGatewayRouteTablePropagation"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/VpnGateway"},"VpnGateway"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/VpnConnection"},"VpnConnection")),(0,s.kt)("li",{parentName:"ul"},"ECR:\n",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/ECR/Repository"},"Repository"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/ECR/Registry"},"Registry")),(0,s.kt)("li",{parentName:"ul"},"ECS:\n",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/ECS/CapacityProvider"},"CapacityProvider"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/ECS/Cluster"},"Cluster"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/ECS/TaskDefinition"},"TaskDefinition"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/ECS/Service"},"Service"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/ECS/TaskSet"},"TaskSet"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/ECS/Task"},"Task")),(0,s.kt)("li",{parentName:"ul"},"EFS:\n",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EFS/FileSystem"},"FileSystem"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EFS/AccessPoint"},"AccessPoint"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EFS/MountTarget"},"MountTarget")),(0,s.kt)("li",{parentName:"ul"},"EKS:\n",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EKS/Cluster"},"Cluster"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/EKS/NodeGroup"},"NodeGroup")),(0,s.kt)("li",{parentName:"ul"},"ElasticLoadBalancingV2:\n",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/ElasticLoadBalancingV2/LoadBalancer"},"LoadBalancer"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/ElasticLoadBalancingV2/TargetGroup"},"TargetGroup"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/ElasticLoadBalancingV2/Listener"},"Listener"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/ElasticLoadBalancingV2/Rule"},"Rule")),(0,s.kt)("li",{parentName:"ul"},"Firehose:\n",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/Firehose/DeliveryStream"},"DeliveryStream")),(0,s.kt)("li",{parentName:"ul"},"Glue:\n",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/Glue/Job"},"Job")),(0,s.kt)("li",{parentName:"ul"},"IAM:\n",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/IAM/OpenIDConnectProvider"},"OpenIDConnectProvider"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/IAM/User"},"User"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/IAM/Group"},"Group"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/IAM/Role"},"Role"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/IAM/Policy"},"Policy"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/IAM/InstanceProfile"},"InstanceProfile")),(0,s.kt)("li",{parentName:"ul"},"Kinesis:\n",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/Kinesis/Stream"},"Stream")),(0,s.kt)("li",{parentName:"ul"},"KMS:\n",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/KMS/Key"},"Key")),(0,s.kt)("li",{parentName:"ul"},"Lambda:\n",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/Lambda/Layer"},"Layer"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/Lambda/Function"},"Function"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/Lambda/EventSourceMapping"},"EventSourceMapping")),(0,s.kt)("li",{parentName:"ul"},"NetworkFirewall:\n",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/NetworkFirewall/NetworkFirewall"},"Firewall"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/NetworkFirewall/NetworkFirewallPolicy"},"Policy"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/NetworkFirewall/RuleGroup"},"RuleGroup"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/NetworkFirewall/LoggingConfiguration"},"LoggingConfiguration")),(0,s.kt)("li",{parentName:"ul"},"NetworkManager:\n",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/NetworkManager/GlobalNetwork"},"GlobalNetwork"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/NetworkManager/CoreNetwork"},"CoreNetwork"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/NetworkManager/Site"},"Site"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/NetworkManager/Device"},"Device"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/NetworkManager/Link"},"Link"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/NetworkManager/TransitGatewayRegistration"},"TransitGatewayRegistration")),(0,s.kt)("li",{parentName:"ul"},"Organisations:\n",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/Organisations/Root"},"Root"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/Organisations/Organisation"},"Organisation"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/Organisations/OrganisationalUnit"},"OrganisationalUnit")),(0,s.kt)("li",{parentName:"ul"},"RAM:\n",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/RAM/ResourceShare"},"ResourceShare"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/RAM/PrincipalAssociation"},"PrincipalAssociation"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/RAM/ResourceAssociation"},"ResourceAssociation")),(0,s.kt)("li",{parentName:"ul"},"RDS:\n",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/RDS/DBProxy"},"DBProxy"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/RDS/DBProxyTargetGroup"},"DBProxyTargetGroup"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/RDS/DBSubnetGroup"},"DBSubnetGroup"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/RDS/DBCluster"},"DBCluster"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/RDS/DBInstance"},"DBInstance")),(0,s.kt)("li",{parentName:"ul"},"Route53:\n",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/Route53/HealthCheck"},"HealthCheck"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/Route53/HostedZone"},"HostedZone"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/Route53/ZoneVpcAssociation"},"ZoneVpcAssociation"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/Route53/VpcAssociationAuthorization"},"VpcAssociationAuthorization"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/Route53/Record"},"Record")),(0,s.kt)("li",{parentName:"ul"},"Route53Domains:\n",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/Route53Domains/Domain"},"Domain")),(0,s.kt)("li",{parentName:"ul"},"Route53RecoveryControlConfig:\n",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/Route53RecoveryControlConfig/Cluster"},"Cluster"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/Route53RecoveryControlConfig/ControlPanel"},"ControlPanel"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/Route53RecoveryControlConfig/RoutingControl"},"RoutingControl"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/Route53RecoveryControlConfig/SafetyRule"},"SafetyRule")),(0,s.kt)("li",{parentName:"ul"},"Route53RecoveryReadiness:\n",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/Route53RecoveryReadiness/Cell"},"Cell"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/Route53RecoveryReadiness/ReadinessCheck"},"ReadinessCheck"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/Route53RecoveryReadiness/RecoveryGroup"},"RecoveryGroup"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/Route53RecoveryReadiness/ResourceSet"},"ResourceSet")),(0,s.kt)("li",{parentName:"ul"},"Route53Resolver:\n",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/Route53Resolver/Endpoint"},"Endpoint"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/Route53Resolver/Rule"},"Rule"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/Route53Resolver/RuleAssociation"},"RuleAssociation")),(0,s.kt)("li",{parentName:"ul"},"S3:\n",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/S3/Bucket"},"Bucket"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/S3/Object"},"Object")),(0,s.kt)("li",{parentName:"ul"},"SecretsManager:\n",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/SecretsManager/Secret"},"Secret"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/SecretsManager/Resource%20Policy"},"ResourcePolicy")),(0,s.kt)("li",{parentName:"ul"},"SNS:\n",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/SNS/SNSTopic"},"Topic"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/SNS/SNSSubscription"},"Subscription")),(0,s.kt)("li",{parentName:"ul"},"SQS:\n",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/SQS/Queue"},"Queue")),(0,s.kt)("li",{parentName:"ul"},"SSM:\n",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/SSM/Document"},"Document"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/SSM/Parameter"},"Parameter")),(0,s.kt)("li",{parentName:"ul"},"StepFunctions:\n",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/StepFunctions/StateMachine"},"StateMachine")),(0,s.kt)("li",{parentName:"ul"},"WAFv2:\n",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/WAFv2/WebACL"},"WebACL"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/WAFv2/WebACLCloudFront"},"WebACLCloudFront"),", ",(0,s.kt)("a",{parentName:"li",href:"/docs/aws/resources/WAFv2/WebACLAssociation"},"WebACLAssociation"))))}p.isMDXComponent=!0}}]);