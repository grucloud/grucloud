"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[2420],{3905:function(e,n,t){t.d(n,{Zo:function(){return c},kt:function(){return d}});var r=t(67294);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function i(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function l(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?i(Object(t),!0).forEach((function(n){a(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function o(e,n){if(null==e)return{};var t,r,a=function(e,n){if(null==e)return{};var t,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var s=r.createContext({}),u=function(e){var n=r.useContext(s),t=n;return e&&(t="function"==typeof e?e(n):l(l({},n),e)),t},c=function(e){var n=u(e.components);return r.createElement(s.Provider,{value:n},e.children)},p={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},m=r.forwardRef((function(e,n){var t=e.components,a=e.mdxType,i=e.originalType,s=e.parentName,c=o(e,["components","mdxType","originalType","parentName"]),m=u(t),d=a,g=m["".concat(s,".").concat(d)]||m[d]||p[d]||i;return t?r.createElement(g,l(l({ref:n},c),{},{components:t})):r.createElement(g,l({ref:n},c))}));function d(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var i=t.length,l=new Array(i);l[0]=m;var o={};for(var s in n)hasOwnProperty.call(n,s)&&(o[s]=n[s]);o.originalType=e,o.mdxType="string"==typeof e?e:a,l[1]=o;for(var u=2;u<i;u++)l[u]=t[u];return r.createElement.apply(null,l)}return r.createElement.apply(null,t)}m.displayName="MDXCreateElement"},9521:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return o},contentTitle:function(){return s},metadata:function(){return u},toc:function(){return c},default:function(){return m}});var r=t(87462),a=t(63366),i=(t(67294),t(3905)),l=["components"],o={id:"Image",title:"AMI"},s=void 0,u={unversionedId:"aws/resources/EC2/Image",id:"aws/resources/EC2/Image",isDocsHomePage:!1,title:"AMI",description:"Provides an Amazon Managed Image.",source:"@site/docs/aws/resources/EC2/Image.md",sourceDirName:"aws/resources/EC2",slug:"/aws/resources/EC2/Image",permalink:"/docs/aws/resources/EC2/Image",tags:[],version:"current",frontMatter:{id:"Image",title:"AMI"},sidebar:"docs",previous:{title:"FLow Logs",permalink:"/docs/aws/resources/EC2/FlowLogs"},next:{title:"Instance",permalink:"/docs/aws/resources/EC2/EC2"}},c=[{value:"Example",id:"example",children:[{value:"EC2 running on Ubuntu 20.04",id:"ec2-running-on-ubuntu-2004",children:[],level:3},{value:"Amazon Linux 2",id:"amazon-linux-2",children:[],level:3}],level:2},{value:"Properties",id:"properties",children:[],level:2},{value:"Examples",id:"examples",children:[],level:2},{value:"Used By",id:"used-by",children:[],level:2},{value:"Listing",id:"listing",children:[],level:2},{value:"AWS CLI",id:"aws-cli",children:[],level:2}],p={toc:c};function m(e){var n=e.components,t=(0,a.Z)(e,l);return(0,i.kt)("wrapper",(0,r.Z)({},p,t,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Provides an ",(0,i.kt)("a",{parentName:"p",href:"https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AMIs.html"},"Amazon Managed Image"),"."),(0,i.kt)("h2",{id:"example"},"Example"),(0,i.kt)("h3",{id:"ec2-running-on-ubuntu-2004"},"EC2 running on Ubuntu 20.04"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Find the ",(0,i.kt)("em",{parentName:"li"},"Ubuntu Server 20.04 LTS")," image running on ",(0,i.kt)("em",{parentName:"li"},"x86_64"),"."),(0,i.kt)("li",{parentName:"ul"},"Provides the image as an EC2 dependency.")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Image",\n    group: "EC2",\n    name: "eip",\n    readOnly: true,\n    properties: () => ({\n      Filters: [\n        {\n          Name: "architecture",\n          Values: ["x86_64"],\n        },\n        {\n          Name: "description",\n          Values: ["Canonical, Ubuntu, 20.04 LTS, amd64 focal*"],\n        },\n      ],\n    }),\n  },\n];\n')),(0,i.kt)("h3",{id:"amazon-linux-2"},"Amazon Linux 2"),(0,i.kt)("p",null,"Here is the Amazone Linux 2 image:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Image",\n    group: "EC2",\n    name: "eip",\n    readOnly: true,\n    properties: () => ({\n      Filters: [\n        {\n          Name: "architecture",\n          Values: ["x86_64"],\n        },\n        {\n          Name: "description",\n          Values: ["Amazon Linux 2 AMI *"],\n        },\n      ],\n    }),\n  },\n];\n')),(0,i.kt)("h2",{id:"properties"},"Properties"),(0,i.kt)("p",null,"The list of properties can be found in ",(0,i.kt)("a",{parentName:"p",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/describeimagescommandinput.html"},"DescribeImagesCommandInput")),(0,i.kt)("h2",{id:"examples"},"Examples"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/ec2"},"simple example"))),(0,i.kt)("h2",{id:"used-by"},"Used By"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/EC2"},"EC2"))),(0,i.kt)("h2",{id:"listing"},"Listing"),(0,i.kt)("p",null,"List all of the images with the ",(0,i.kt)("em",{parentName:"p"},"Image")," filter:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t Image\n")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-sh"},'Listing resources on 1 provider: aws\n\u2713 aws\n  \u2713 Initialising\n  \u2713 Listing 1/1\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 1 Image from aws                                                                                             \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 Name                  \u2502 Data                                                                          \u2502 Our  \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253c\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 ami-0945843162c83c351 \u2502 Architecture: x86_64                                                          \u2502 NO   \u2502\n\u2502                       \u2502 CreationDate: 2020-12-04T00:11:02.000Z                                        \u2502      \u2502\n\u2502                       \u2502 ImageId: ami-0945843162c83c351                                                \u2502      \u2502\n\u2502                       \u2502 ImageLocation: aws-marketplace/Ubuntu Server 20.04 LTS-bc9ee367-938c-4032-b2\u2026 \u2502      \u2502\n\u2502                       \u2502 ImageType: machine                                                            \u2502      \u2502\n\u2502                       \u2502 Public: true                                                                  \u2502      \u2502\n\u2502                       \u2502 OwnerId: 679593333241                                                         \u2502      \u2502\n\u2502                       \u2502 PlatformDetails: Linux/UNIX                                                   \u2502      \u2502\n\u2502                       \u2502 UsageOperation: RunInstances                                                  \u2502      \u2502\n\u2502                       \u2502 ProductCodes:                                                                 \u2502      \u2502\n\u2502                       \u2502   - ProductCodeId: b6066zavuglx3tvu52d5ikod2                                  \u2502      \u2502\n\u2502                       \u2502     ProductCodeType: marketplace                                              \u2502      \u2502\n\u2502                       \u2502 State: available                                                              \u2502      \u2502\n\u2502                       \u2502 BlockDeviceMappings:                                                          \u2502      \u2502\n\u2502                       \u2502   - DeviceName: /dev/sda1                                                     \u2502      \u2502\n\u2502                       \u2502     Ebs:                                                                      \u2502      \u2502\n\u2502                       \u2502       DeleteOnTermination: true                                               \u2502      \u2502\n\u2502                       \u2502       SnapshotId: snap-02571452446eabf30                                      \u2502      \u2502\n\u2502                       \u2502       VolumeSize: 8                                                           \u2502      \u2502\n\u2502                       \u2502       VolumeType: gp2                                                         \u2502      \u2502\n\u2502                       \u2502       Encrypted: false                                                        \u2502      \u2502\n\u2502                       \u2502 Description: Ubuntu Server 20.04 LTS                                          \u2502      \u2502\n\u2502                       \u2502 EnaSupport: true                                                              \u2502      \u2502\n\u2502                       \u2502 Hypervisor: xen                                                               \u2502      \u2502\n\u2502                       \u2502 ImageOwnerAlias: aws-marketplace                                              \u2502      \u2502\n\u2502                       \u2502 Name: Ubuntu Server 20.04 LTS-bc9ee367-938c-4032-b257-5dd4abfe8e56-ami-0d86f\u2026 \u2502      \u2502\n\u2502                       \u2502 RootDeviceName: /dev/sda1                                                     \u2502      \u2502\n\u2502                       \u2502 RootDeviceType: ebs                                                           \u2502      \u2502\n\u2502                       \u2502 SriovNetSupport: simple                                                       \u2502      \u2502\n\u2502                       \u2502 Tags: []                                                                      \u2502      \u2502\n\u2502                       \u2502 VirtualizationType: hvm                                                       \u2502      \u2502\n\u2502                       \u2502                                                                               \u2502      \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\nList Summary:\nProvider: aws\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 aws                                                                                                         \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 Image              \u2502 ami-0945843162c83c351                                                                  \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n1 resource, 1 type, 1 provider\nCommand "gc l -t Image" executed in 2s\n')),(0,i.kt)("h2",{id:"aws-cli"},"AWS CLI"),(0,i.kt)("p",null,"You can fiddle the filters with the ",(0,i.kt)("inlineCode",{parentName:"p"},"aws cli")," as well:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-sh"},'aws ec2 describe-images --filters "Name=description,Values=Amazon Linux 2 AMI*" "Name=architecture,Values=x86_64"\n')))}m.isMDXComponent=!0}}]);