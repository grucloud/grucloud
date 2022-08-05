"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[9547],{3905:(e,n,t)=>{t.d(n,{Zo:()=>p,kt:()=>m});var a=t(67294);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function s(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?s(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):s(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function l(e,n){if(null==e)return{};var t,a,r=function(e,n){if(null==e)return{};var t,a,r={},s=Object.keys(e);for(a=0;a<s.length;a++)t=s[a],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(a=0;a<s.length;a++)t=s[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var c=a.createContext({}),o=function(e){var n=a.useContext(c),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},p=function(e){var n=o(e.components);return a.createElement(c.Provider,{value:n},e.children)},u={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},d=a.forwardRef((function(e,n){var t=e.components,r=e.mdxType,s=e.originalType,c=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),d=o(t),m=r,f=d["".concat(c,".").concat(m)]||d[m]||u[m]||s;return t?a.createElement(f,i(i({ref:n},p),{},{components:t})):a.createElement(f,i({ref:n},p))}));function m(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var s=t.length,i=new Array(s);i[0]=d;var l={};for(var c in n)hasOwnProperty.call(n,c)&&(l[c]=n[c]);l.originalType=e,l.mdxType="string"==typeof e?e:r,i[1]=l;for(var o=2;o<s;o++)i[o]=t[o];return a.createElement.apply(null,i)}return a.createElement.apply(null,t)}d.displayName="MDXCreateElement"},20248:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>i,default:()=>u,frontMatter:()=>s,metadata:()=>l,toc:()=>o});var a=t(87462),r=(t(67294),t(3905));const s={id:"EC2",title:"Instance"},i=void 0,l={unversionedId:"aws/resources/EC2/EC2",id:"aws/resources/EC2/EC2",title:"Instance",description:"Manages an EC2 instance resource, a.k.a virtual machine.",source:"@site/docs/aws/resources/EC2/Instance.md",sourceDirName:"aws/resources/EC2",slug:"/aws/resources/EC2/EC2",permalink:"/docs/aws/resources/EC2/EC2",draft:!1,tags:[],version:"current",frontMatter:{id:"EC2",title:"Instance"},sidebar:"docs",previous:{title:"AMI",permalink:"/docs/aws/resources/EC2/Image"},next:{title:"Internet Gateway",permalink:"/docs/aws/resources/EC2/InternetGateway"}},c={},o=[{value:"Examples",id:"examples",level:3},{value:"Properties",id:"properties",level:3},{value:"Dependencies",id:"dependencies",level:3},{value:"Used By",id:"used-by",level:3},{value:"Update",id:"update",level:3},{value:"List",id:"list",level:3}],p={toc:o};function u(e){let{components:n,...t}=e;return(0,r.kt)("wrapper",(0,a.Z)({},p,t,{components:n,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"Manages an EC2 instance resource, a.k.a virtual machine."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Instance",\n    group: "EC2",\n    name: "web-server-ec2-vpc",\n    properties: ({ config }) => ({\n      InstanceType: "t2.micro",\n      ImageId: "ami-02e136e904f3da870",\n      UserData:\n        "#!/bin/bash\\necho \\"Mounting /dev/xvdf\\"\\nwhile ! ls /dev/xvdf > /dev/null\\ndo \\n  sleep 1\\ndone\\nif [ `file -s /dev/xvdf | cut -d \' \' -f 2` = \'data\' ]\\nthen\\n  echo \\"Formatting /dev/xvdf\\"\\n  mkfs.xfs /dev/xvdf\\nfi\\nmkdir -p /data\\nmount /dev/xvdf /data\\necho /dev/xvdf /data defaults,nofail 0 2 >> /etc/fstab\\n",\n      Placement: {\n        AvailabilityZone: `${config.region}a`,\n      },\n    }),\n    dependencies: () => ({\n      subnet: "subnet",\n      keyPair: "kp-ec2-vpc",\n      eip: "myip",\n      securityGroups: ["security-group"],\n      volumes: ["volume"],\n    }),\n  },\n];\n')),(0,r.kt)("h3",{id:"examples"},"Examples"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/ec2-simple/"},"one ec2")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/ec2"},"ec2 with elastic ip address, key pair")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/volume"},"attached an EBS volume")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/IAM/iam"},"example with IAM")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/ec2-vpc"},"full example")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/launchTemplate"},"EC2 based launch template")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/launchTemplate-sg"},"EC2 based launch template"))),(0,r.kt)("h3",{id:"properties"},"Properties"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/runinstancescommandinput.html"},"RunInstancesCommandInput list"))),(0,r.kt)("h3",{id:"dependencies"},"Dependencies"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/SecurityGroup"},"Security Group")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/Subnet"},"Subnet")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/KeyPair"},"Key Pair")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/Image"},"Image")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/LaunchTemplate"},"Launch Template")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/PlacementGroup"},"Placement Group")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/IAM/InstanceProfile"},"Iam Instance Profile"))),(0,r.kt)("h3",{id:"used-by"},"Used By"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/CloudWatch/MetricAlarm"},"CloudWatch Metric Alarm")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/ElasticIpAddressAssociation"},"EC2 Elastic IpAddress Association")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/Route"},"EC2 Route")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/VolumeAttachment"},"EC2 Volume Attachment"))),(0,r.kt)("h3",{id:"update"},"Update"),(0,r.kt)("p",null,"There are 2 kind of update depending on the attribute to modify:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"Stop and Start"),": The instance is stopped, the attribute is changed, the instance is started."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"Destroy and Create"),": The instance is destroyed and created with the new attributes.")),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Attribute"),(0,r.kt)("th",{parentName:"tr",align:"center"},"Description"),(0,r.kt)("th",{parentName:"tr",align:"right"},"Update Kind"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"ImageId"),(0,r.kt)("td",{parentName:"tr",align:"center"},"The Amazon Managed Image Id"),(0,r.kt)("td",{parentName:"tr",align:"right"},"Destroy & Create")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"InstanceType"),(0,r.kt)("td",{parentName:"tr",align:"center"},"The Instance Type"),(0,r.kt)("td",{parentName:"tr",align:"right"},"Stop & Start")))),(0,r.kt)("h3",{id:"list"},"List"),(0,r.kt)("p",null,"Lsit all the ec2 instances with the ",(0,r.kt)("em",{parentName:"p"},"Instance")," type:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-sh"},"gc list -t Instance\n")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-txt"},'Listing resources on 1 provider: aws\n\u2713 aws\n  \u2713 Initialising\n  \u2713 Listing 2/2\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 1 EC2::Instance from aws                                              \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: web-server-ec2-vpc                                              \u2502\n\u2502 managedByUs: Yes                                                      \u2502\n\u2502 live:                                                                 \u2502\n\u2502   AmiLaunchIndex: 0                                                   \u2502\n\u2502   ImageId: ami-02e136e904f3da870                                      \u2502\n\u2502   InstanceId: i-0f236430dd1c15b07                                     \u2502\n\u2502   InstanceType: t2.micro                                              \u2502\n\u2502   KeyName: kp-ec2-vpc                                                 \u2502\n\u2502   LaunchTime: 2022-05-08T21:32:53.000Z                                \u2502\n\u2502   Monitoring:                                                         \u2502\n\u2502     State: disabled                                                   \u2502\n\u2502   Placement:                                                          \u2502\n\u2502     AvailabilityZone: us-east-1a                                      \u2502\n\u2502     GroupName:                                                        \u2502\n\u2502     Tenancy: default                                                  \u2502\n\u2502   PrivateDnsName: ip-10-1-0-85.ec2.internal                           \u2502\n\u2502   PrivateIpAddress: 10.1.0.85                                         \u2502\n\u2502   ProductCodes: []                                                    \u2502\n\u2502   PublicDnsName:                                                      \u2502\n\u2502   PublicIpAddress: 54.86.208.126                                      \u2502\n\u2502   State:                                                              \u2502\n\u2502     Code: 16                                                          \u2502\n\u2502     Name: running                                                     \u2502\n\u2502   StateTransitionReason:                                              \u2502\n\u2502   SubnetId: subnet-034c959cf24d3e1c3                                  \u2502\n\u2502   VpcId: vpc-00ae007b28e4442da                                        \u2502\n\u2502   Architecture: x86_64                                                \u2502\n\u2502   BlockDeviceMappings:                                                \u2502\n\u2502     - DeviceName: /dev/xvda                                           \u2502\n\u2502       Ebs:                                                            \u2502\n\u2502         AttachTime: 2022-05-08T21:32:54.000Z                          \u2502\n\u2502         DeleteOnTermination: true                                     \u2502\n\u2502         Status: attached                                              \u2502\n\u2502         VolumeId: vol-08354bd10768baf85                               \u2502\n\u2502     - DeviceName: /dev/sdf                                            \u2502\n\u2502       Ebs:                                                            \u2502\n\u2502         AttachTime: 2022-05-08T21:33:36.000Z                          \u2502\n\u2502         DeleteOnTermination: false                                    \u2502\n\u2502         Status: attached                                              \u2502\n\u2502         VolumeId: vol-0ee2c386eb698a709                               \u2502\n\u2502   ClientToken: b16ad466-702f-49ce-97a0-75ddd50c7356                   \u2502\n\u2502   EbsOptimized: false                                                 \u2502\n\u2502   EnaSupport: true                                                    \u2502\n\u2502   Hypervisor: xen                                                     \u2502\n\u2502   NetworkInterfaces:                                                  \u2502\n\u2502     - Association:                                                    \u2502\n\u2502         IpOwnerId: 840541460064                                       \u2502\n\u2502         PublicDnsName:                                                \u2502\n\u2502         PublicIp: 54.86.208.126                                       \u2502\n\u2502       Attachment:                                                     \u2502\n\u2502         AttachTime: 2022-05-08T21:32:53.000Z                          \u2502\n\u2502         AttachmentId: eni-attach-0c325297c93dde25f                    \u2502\n\u2502         DeleteOnTermination: true                                     \u2502\n\u2502         DeviceIndex: 0                                                \u2502\n\u2502         Status: attached                                              \u2502\n\u2502         NetworkCardIndex: 0                                           \u2502\n\u2502       Description:                                                    \u2502\n\u2502       Groups:                                                         \u2502\n\u2502         - GroupName: security-group                                   \u2502\n\u2502           GroupId: sg-06ff67cc5474ec7c7                               \u2502\n\u2502       Ipv6Addresses: []                                               \u2502\n\u2502       MacAddress: 0a:a8:bd:fa:21:55                                   \u2502\n\u2502       NetworkInterfaceId: eni-09f268c1e60b38336                       \u2502\n\u2502       OwnerId: 840541460064                                           \u2502\n\u2502       PrivateIpAddress: 10.1.0.85                                     \u2502\n\u2502       PrivateIpAddresses:                                             \u2502\n\u2502         - Association:                                                \u2502\n\u2502             IpOwnerId: 840541460064                                   \u2502\n\u2502             PublicDnsName:                                            \u2502\n\u2502             PublicIp: 54.86.208.126                                   \u2502\n\u2502           Primary: true                                               \u2502\n\u2502           PrivateIpAddress: 10.1.0.85                                 \u2502\n\u2502       SourceDestCheck: true                                           \u2502\n\u2502       Status: in-use                                                  \u2502\n\u2502       SubnetId: subnet-034c959cf24d3e1c3                              \u2502\n\u2502       VpcId: vpc-00ae007b28e4442da                                    \u2502\n\u2502       InterfaceType: interface                                        \u2502\n\u2502   RootDeviceName: /dev/xvda                                           \u2502\n\u2502   RootDeviceType: ebs                                                 \u2502\n\u2502   SecurityGroups:                                                     \u2502\n\u2502     - GroupName: security-group                                       \u2502\n\u2502       GroupId: sg-06ff67cc5474ec7c7                                   \u2502\n\u2502   SourceDestCheck: true                                               \u2502\n\u2502   Tags:                                                               \u2502\n\u2502     - Key: gc-created-by-provider                                     \u2502\n\u2502       Value: aws                                                      \u2502\n\u2502     - Key: gc-managed-by                                              \u2502\n\u2502       Value: grucloud                                                 \u2502\n\u2502     - Key: gc-project-name                                            \u2502\n\u2502       Value: @grucloud/example-aws-ec2-vpc                            \u2502\n\u2502     - Key: gc-stage                                                   \u2502\n\u2502       Value: dev                                                      \u2502\n\u2502     - Key: Name                                                       \u2502\n\u2502       Value: web-server-ec2-vpc                                       \u2502\n\u2502   VirtualizationType: hvm                                             \u2502\n\u2502   CpuOptions:                                                         \u2502\n\u2502     CoreCount: 1                                                      \u2502\n\u2502     ThreadsPerCore: 1                                                 \u2502\n\u2502   CapacityReservationSpecification:                                   \u2502\n\u2502     CapacityReservationPreference: open                               \u2502\n\u2502   HibernationOptions:                                                 \u2502\n\u2502     Configured: false                                                 \u2502\n\u2502   MetadataOptions:                                                    \u2502\n\u2502     State: applied                                                    \u2502\n\u2502     HttpTokens: optional                                              \u2502\n\u2502     HttpPutResponseHopLimit: 1                                        \u2502\n\u2502     HttpEndpoint: enabled                                             \u2502\n\u2502     HttpProtocolIpv6: disabled                                        \u2502\n\u2502     InstanceMetadataTags: disabled                                    \u2502\n\u2502   EnclaveOptions:                                                     \u2502\n\u2502     Enabled: false                                                    \u2502\n\u2502   PlatformDetails: Linux/UNIX                                         \u2502\n\u2502   UsageOperation: RunInstances                                        \u2502\n\u2502   UsageOperationUpdateTime: 2022-05-08T21:32:53.000Z                  \u2502\n\u2502   PrivateDnsNameOptions:                                              \u2502\n\u2502     HostnameType: ip-name                                             \u2502\n\u2502     EnableResourceNameDnsARecord: false                               \u2502\n\u2502     EnableResourceNameDnsAAAARecord: false                            \u2502\n\u2502   MaintenanceOptions:                                                 \u2502\n\u2502     AutoRecovery: default                                             \u2502\n\u2502   Image:                                                              \u2502\n\u2502     Description: Amazon Linux 2 AMI 2.0.20211001.1 x86_64 HVM gp2     \u2502\n\u2502   UserData: #!/bin/bash                                               \u2502\n\u2502 echo "Mounting /dev/xvdf"                                             \u2502\n\u2502 while ! ls /dev/xvdf > /dev/null                                      \u2502\n\u2502 do                                                                    \u2502\n\u2502   sleep 1                                                             \u2502\n\u2502 done                                                                  \u2502\n\u2502 if [ `file -s /dev/xvdf | cut -d \' \' -f 2` = \'data\' ]                 \u2502\n\u2502 then                                                                  \u2502\n\u2502   echo "Formatting /dev/xvdf"                                         \u2502\n\u2502   mkfs.xfs /dev/xvdf                                                  \u2502\n\u2502 fi                                                                    \u2502\n\u2502 mkdir -p /data                                                        \u2502\n\u2502 mount /dev/xvdf /data                                                 \u2502\n\u2502 echo /dev/xvdf /data defaults,nofail 0 2 >> /etc/fstab                \u2502\n\u2502                                                                       \u2502\n\u2502                                                                       \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\nList Summary:\nProvider: aws\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 aws                                                                  \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 EC2::Instance \u2502 web-server-ec2-vpc                                   \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n1 resource, 1 type, 1 provider\nCommand "gc l -t Instance" executed in 5s, 182 MB\n')))}u.isMDXComponent=!0}}]);