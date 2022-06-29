"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[13903],{3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>m});var a=n(67294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=a.createContext({}),p=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},c=function(e){var t=p(e.components);return a.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},d=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,s=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),d=p(n),m=r,g=d["".concat(s,".").concat(m)]||d[m]||u[m]||o;return n?a.createElement(g,l(l({ref:t},c),{},{components:n})):a.createElement(g,l({ref:t},c))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,l=new Array(o);l[0]=d;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i.mdxType="string"==typeof e?e:r,l[1]=i;for(var p=2;p<o;p++)l[p]=n[p];return a.createElement.apply(null,l)}return a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},27155:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>l,default:()=>u,frontMatter:()=>o,metadata:()=>i,toc:()=>p});var a=n(87462),r=(n(67294),n(3905));const o={id:"AwsModuleHowto",title:"How to implement a new AWS Module"},l=void 0,i={unversionedId:"aws/howto/AwsModuleHowto",id:"aws/howto/AwsModuleHowto",title:"How to implement a new AWS Module",description:"This document will guide you through the implementation of new module for the GruCloud AWS provider.",source:"@site/docs/aws/howto/AwsModuleHowto.md",sourceDirName:"aws/howto",slug:"/aws/howto/AwsModuleHowto",permalink:"/docs/aws/howto/AwsModuleHowto",draft:!1,tags:[],version:"current",frontMatter:{id:"AwsModuleHowto",title:"How to implement a new AWS Module"}},s={},p=[{value:"Clone the code",id:"clone-the-code",level:2},{value:"Dependencies",id:"dependencies",level:2},{value:"Module boilerplate",id:"module-boilerplate",level:2},{value:".npmignore",id:"npmignore",level:2},{value:"Install dependencies",id:"install-dependencies",level:2},{value:"config.js",id:"configjs",level:2},{value:"iac.js",id:"iacjs",level:3},{value:"package.json",id:"packagejson",level:2},{value:"config.js",id:"configjs-1",level:2},{value:"iac.js",id:"iacjs-1",level:2},{value:"Generate the dependency graph",id:"generate-the-dependency-graph",level:2},{value:"Running with gc",id:"running-with-gc",level:2}],c={toc:p};function u(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,a.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"This document will guide you through the implementation of new module for the ",(0,r.kt)("a",{parentName:"p",href:"https://www.npmjs.com/package/@grucloud/provider-aws"},"GruCloud AWS provider"),"."),(0,r.kt)("p",null,"A GruCloud module is just a bunch of functions to create a set of related resources, packaged and distributed with the node package manager NPM"),(0,r.kt)("p",null,"Case study: VPC suited for EKS, the Amazon Elastic Kubernetes Service.\nThe following resources are required to create an EKS Cluster:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://www.grucloud.com/docs/aws/resources/EC2/Vpc"},"VPC")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://www.grucloud.com/docs/aws/resources/EC2/InternetGateway"},"Internet Gateway"),": one internet gateway attached to the VPC"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://www.grucloud.com/docs/aws/resources/EC2/Subnet"},"Subnet"),": 2 public and 2 private subnets belong to the VPC."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://www.grucloud.com/docs/aws/resources/EC2/SecurityGroup"},"SecurityGroup")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://www.grucloud.com/docs/aws/resources/EC2/ElasticIpAddress"},"Elastic IP Address"),": required by the NAT Gateway"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://www.grucloud.com/docs/aws/resources/EC2/NatGateway"},"NAT Gateway"),": a NAT gateway to allow the ec2 instances to connect to internet."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://www.grucloud.com/docs/aws/resources/EC2/RouteTable"},"Route Table")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://www.grucloud.com/docs/aws/resources/EC2/Route"},"Route"),": 3 routes for the public subnet and 3 routes for the private subnet")),(0,r.kt)("p",null,"A picture is worth a thousand word, we'll be able to generate this dependency graph at the end of this tutorial:\n",(0,r.kt)("img",{parentName:"p",src:"https://raw.githubusercontent.com/grucloud/grucloud/main/packages/modules/aws/vpc/example/artifacts/diagram-target.svg",alt:"Graph"})),(0,r.kt)("h1",{id:"requirements"},"Requirements"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"AWS account"),(0,r.kt)("li",{parentName:"ul"},"AWS CLI: ",(0,r.kt)("inlineCode",{parentName:"li"},"aws --version")),(0,r.kt)("li",{parentName:"ul"},"AWS access and secret key"),(0,r.kt)("li",{parentName:"ul"},"Configure authentication ans region with ",(0,r.kt)("inlineCode",{parentName:"li"},"aws configure")),(0,r.kt)("li",{parentName:"ul"},"Node 14: ",(0,r.kt)("inlineCode",{parentName:"li"},"node --version")),(0,r.kt)("li",{parentName:"ul"},"VS code for editing and debugging.")),(0,r.kt)("h1",{id:"getting-started"},"Getting Started"),(0,r.kt)("h2",{id:"clone-the-code"},"Clone the code"),(0,r.kt)("p",null,"Visit the ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/grucloud/grucloud"},"GruCloud github page")," and fork the monorepo."),(0,r.kt)("p",null,"Clone the repository on your local machine:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-sh"},"git clone git@github.com:<yourusername>/grucloud.git\ncd grucloud\n")),(0,r.kt)("h2",{id:"dependencies"},"Dependencies"),(0,r.kt)("p",null,"Install the dependencies and run the ",(0,r.kt)("em",{parentName:"p"},"bootstrap")," npm script:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-sh"},"npm install\nnpm run bootstrap\n")),(0,r.kt)("h1",{id:"aws-vpc-module"},"Aws Vpc Module"),(0,r.kt)("h2",{id:"module-boilerplate"},"Module boilerplate"),(0,r.kt)("p",null,"Change to the aws module directory:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-sh"},"cd packages/modules/aws\n")),(0,r.kt)("p",null,"Create the module directory ",(0,r.kt)("em",{parentName:"p"},"vpc")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-sh"},"mkdir vpc\ncd vpc\n")),(0,r.kt)("p",null,"We'll create the ",(0,r.kt)("em",{parentName:"p"},"package.json")," with ",(0,r.kt)("inlineCode",{parentName:"p"},"npm init")),(0,r.kt)("p",null,"The package name in this case is ",(0,r.kt)("em",{parentName:"p"},"@grucloud/module-aws-vpc"),"."),(0,r.kt)("p",null,"The entry point will be ",(0,r.kt)("em",{parentName:"p"},"iac.js")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-sh"},"npm init\n")),(0,r.kt)("h2",{id:"npmignore"},".npmignore"),(0,r.kt)("p",null,"This code will be published to NPM, therefore ensure ",(0,r.kt)("em",{parentName:"p"},".npmignore")," excludes files and directories not needed by the published packages: logs, examples and tests."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"node_modules/\n*.log\n.vscode/\n**/test/*\nexample\n")),(0,r.kt)("h2",{id:"install-dependencies"},"Install dependencies"),(0,r.kt)("p",null,"Install the npm dependencies for this AWS module:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"npm install @grucloud/core @grucloud/provider-aws rubico\n")),(0,r.kt)("p",null,"For testing, we'll use mocha that we install as a ",(0,r.kt)("em",{parentName:"p"},"devDependencies"),":"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"npm install -D mocha\n")),(0,r.kt)("h2",{id:"configjs"},"config.js"),(0,r.kt)("p",null,"Create the ",(0,r.kt)("em",{parentName:"p"},"config.js")," file:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'module.exports = ({ region }) => ({\n  vpc: {\n    vpc: { name: "vpc", CidrBlock: "192.168.0.0/16", Tags },\n    internetGateway: { name: "internet-gateway" },\n    eip: { name: "eip" },\n    subnets: {\n      publicTags: [],\n      public: [\n        {\n          name: "subnet-public-1",\n          CidrBlock: "192.168.0.0/19",\n          AvailabilityZone: `${region}a`,\n        },\n        {\n          name: "subnet-public-2",\n          CidrBlock: "192.168.32.0/19",\n          AvailabilityZone: `${region}b`,\n        },\n        {\n          name: "subnet-public-3",\n          CidrBlock: "192.168.64.0/19",\n          AvailabilityZone: `${region}c`,\n        },\n      ],\n      privateTags: [],\n      private: [\n        {\n          name: "subnet-private-1",\n          CidrBlock: "192.168.96.0/19",\n          AvailabilityZone: `${region}a`,\n        },\n        {\n          name: "subnet-private-2",\n          CidrBlock: "192.168.128.0/19",\n          AvailabilityZone: `${region}b`,\n        },\n        {\n          name: "subnet-private-3",\n          CidrBlock: "192.168.160.0/19",\n          AvailabilityZone: `${region}c`,\n        },\n      ],\n    },\n  },\n});\n')),(0,r.kt)("h3",{id:"iacjs"},"iac.js"),(0,r.kt)("p",null,"For a module, the ",(0,r.kt)("em",{parentName:"p"},"iac.js")," must exports the ",(0,r.kt)("strong",{parentName:"p"},"createResources")," function which takes an already created AWS provider. This ",(0,r.kt)("strong",{parentName:"p"},"createResources")," is responsible for creating VPC, subnets, internet gateway, NAT gateway and an elastic IP address."),(0,r.kt)("p",null,"We'll also exports the ",(0,r.kt)("em",{parentName:"p"},"config")," from here."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},"// TODO\n")),(0,r.kt)("h1",{id:"example"},"Example"),(0,r.kt)("p",null,"It is time to create an example to consume this module."),(0,r.kt)("p",null,"We'll create its directory and package.json, install the dependencies, and create the ",(0,r.kt)("em",{parentName:"p"},"config.js")," an ",(0,r.kt)("em",{parentName:"p"},"iac.js")," file."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-sh"},"mkdir example\ncd example\n")),(0,r.kt)("h2",{id:"packagejson"},"package.json"),(0,r.kt)("p",null,"Let's create the package.json with ",(0,r.kt)("inlineCode",{parentName:"p"},"npm init"),":"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"The package name in this case is ",(0,r.kt)("em",{parentName:"li"},"@grucloud/example-module-aws-vpc")),(0,r.kt)("li",{parentName:"ul"},"The entry point is ",(0,r.kt)("em",{parentName:"li"},"iac.js"))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"npm init\n")),(0,r.kt)("p",null,"This package is not meant to be pusblished to NPM, hence set the ",(0,r.kt)("em",{parentName:"p"},"private")," package.json field to ",(0,r.kt)("em",{parentName:"p"},"true")),(0,r.kt)("p",null,"We'll install the module ",(0,r.kt)("em",{parentName:"p"},"@grucloud/module-aws-vpc")," that has been implemented in the last steps:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-sh"},"npm install @grucloud/core @grucloud/provider-aws @grucloud/module-aws-vpc\n")),(0,r.kt)("h2",{id:"configjs-1"},"config.js"),(0,r.kt)("p",null,"The example config is rather simple, we can set the tags for the VPCs and subnets."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'const pkg = require("./package.json");\nmodule.exports = ({ region }) => ({\n  projectName: pkg.name,\n  vpc: {\n    vpc: { Tags: [] },\n    subnets: {\n      publicTags: [],\n      privateTags: [],\n    },\n  },\n});\n')),(0,r.kt)("h2",{id:"iacjs-1"},"iac.js"),(0,r.kt)("p",null,"The file will export the ",(0,r.kt)("em",{parentName:"p"},"createStack")," function. It uses the ",(0,r.kt)("em",{parentName:"p"},"createResources")," and ",(0,r.kt)("em",{parentName:"p"},"config")," function from this module: ",(0,r.kt)("em",{parentName:"p"},"@grucloud/module-aws-vpc"),"."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'const { AwsProvider } = require("@grucloud/provider-aws");\nconst ModuleAwsVpc = require("@grucloud/module-aws-vpc");\n// const ModuleAwsVpc = require("../iac"); When the package is not published yet.\n\nexports.createStack = async ({ createProvider }) => {\n  const provider = createProvider(AwsProvider, {\n    configs: [require("./config"), ModuleAwsVpc.config],\n  });\n  const resources = await ModuleAwsVpc.createResources({\n    provider,\n  });\n  return {\n    provider,\n    resources,\n  };\n};\n')),(0,r.kt)("h2",{id:"generate-the-dependency-graph"},"Generate the dependency graph"),(0,r.kt)("p",null,"Things can get quickly complicated, especially in term of dependencies. Some resources needs to created before others. Same for destruction, the order is paramount."),(0,r.kt)("p",null,"The ",(0,r.kt)("inlineCode",{parentName:"p"},"graph")," command generates a graph from the ",(0,r.kt)("em",{parentName:"p"},"iac.js")," file in the form of a ",(0,r.kt)("em",{parentName:"p"},".dot")," file and an SVG."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"gc graph\n")),(0,r.kt)("h2",{id:"running-with-gc"},"Running with gc"),(0,r.kt)("p",null,"At this stage, one can use the usual ",(0,r.kt)("em",{parentName:"p"},"gc")," commands: ",(0,r.kt)("em",{parentName:"p"},"plan"),", ",(0,r.kt)("em",{parentName:"p"},"apply"),", ",(0,r.kt)("em",{parentName:"p"},"list")," and ",(0,r.kt)("em",{parentName:"p"},"destroy")),(0,r.kt)("h1",{id:"testing-with-mocha"},"Testing with mocha"),(0,r.kt)("p",null,"Testing the module is not an option. We'll use mocha to write and run the test suite."),(0,r.kt)("p",null,"First of all create the file ",(0,r.kt)("em",{parentName:"p"},".mocharc.json")," and the following content:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "watch-files": ["**/*.js"],\n  "extension": ["js"],\n  "exclude": "node_modules",\n  "reporter": "spec",\n  "timeout": 300e3,\n  "ui": "bdd",\n  "bail": false,\n  "recursive": true\n}\n')),(0,r.kt)("p",null,"Now we'll add a new entry in the ",(0,r.kt)("em",{parentName:"p"},"scripts")," section of our ",(0,r.kt)("em",{parentName:"p"},"package.json")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json"},'//package.json\n  "scripts": {\n    "test": "mocha \'test/**/*.test.js\'"\n  },\n')),(0,r.kt)("p",null,"Finally let's create a test suite for this module.\nCreate the ",(0,r.kt)("em",{parentName:"p"},"test")," directory and add ",(0,r.kt)("em",{parentName:"p"},"iac.test.js")," with the following content:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'// test/iac.test.js\nconst assert = require("assert");\nconst cliCommands = require("@grucloud/core/cli/cliCommands");\nconst { createStack } = require("../example/iac");\nconst config = require("../example/config");\n\ndescribe("AWS VPC Module", async function () {\n  before(async function () {});\n  it("run workflow", async function () {\n    const infra = await createStack({ config });\n\n    await cliCommands.planDestroy({\n      infra,\n      commandOptions: { force: true },\n    });\n    await cliCommands.planApply({\n      infra,\n      commandOptions: { force: true },\n    });\n    await cliCommands.planDestroy({\n      infra,\n      commandOptions: { force: true },\n    });\n    // TODO list should be empty\n    const result = await cliCommands.list({\n      infra,\n      commandOptions: { our: true },\n    });\n    assert(result);\n  }).timeout(35 * 60e3);\n});\n')),(0,r.kt)("p",null,"Ready to execute the test suite ?"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-sh"},"npm test\n")))}u.isMDXComponent=!0}}]);