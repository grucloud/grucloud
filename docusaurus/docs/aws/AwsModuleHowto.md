---
id: AwsModuleHowto
title: How to implement a new AWS Module
---

This document will guide you through the implementation of new module for the [GruCloud AWS provider](https://www.npmjs.com/package/@grucloud/provider-aws).

A GruCloud module is just a bunch of functions to create a set of related resources, packaged and distributed with the node package manager NPM

Case study: VPC suited for EKS, the Amazon Elastic Kubernetes Service.
The following resources are required to create an EKS Cluster:

- [VPC](https://www.grucloud.com/docs/aws/resources/EC2/Vpc)
- [Internet Gateway](https://www.grucloud.com/docs/aws/resources/EC2/InternetGateway): one internet gateway attached to the VPC
- [Subnet](https://www.grucloud.com/docs/aws/resources/EC2/Subnet): 3 public and 3 private subnets belong to the VPC.
- [SecurityGroup](https://www.grucloud.com/docs/aws/resources/EC2/SecurityGroup)
- [Elastic IP Address](https://www.grucloud.com/docs/aws/resources/EC2/ElasticIpAddress): required by the NAT Gateway
- [NAT Gateway](https://www.grucloud.com/docs/aws/resources/EC2/NatGateway): a NAT gateway to allow the ec2 instances to connect to internet.
- [Route Table](https://www.grucloud.com/docs/aws/resources/EC2/RouteTables)
- [Route](https://www.grucloud.com/docs/aws/resources/EC2/Route): 3 routes for the public subnet and 3 routes for the private subnet

A picture is worth a thousand word, we'll be able to generate this dependency graph at the end of this tutorial:
![Graph](https://github.com/grucloud/grucloud/tree/main/packages/modules/aws/vpc/example/grucloud.svg)

# Requirements

- AWS account
- AWS CLI: `aws --version`
- AWS access and secret key
- Configure authentication ans region with `aws configure`
- Node 14: `node --version`
- VS code for editing and debugging.

# Getting Started

## Clone the code

Visit the [GruCloud github page](https://github.com/grucloud/grucloud) and fork the monorepo.

Clone the repository on your local machine:

```sh
git clone git@github.com:<yourusername>/grucloud.git
cd grucloud
```

## Dependencies
Install the dependencies with the _bootstrap_ npm script:

```sh
npm install
npm run bootstrap
```

# Aws Vpc Module

## Module boilerplate

Change to the aws module directory:

```sh
cd packages/modules/aws
```

Create the module directory _vpc_

```sh
mkdir vpc
cd vpc
```

We'll create the _package.json_ with `npm init`

The package name in this case is _@grucloud/module-aws-vpc_.

The entry point will be _iac.js_

```sh
npm init
```

## .npmignore

This code will be published to NPM, therefore ensure _.npmignore_ excludes files and directories not needed by the published packages: logs, examples and tests.

```
node_modules/
*.log
.vscode/
**/test/*
example
```

## Install dependencies

Install the npm dependencies for this AWS module:

```
npm install @grucloud/core @grucloud/provider-aws rubico
```

For testing, we'll use mocha that we install as a _devDependencies_:

```
npm install -D mocha
```

## config.js

Create the _config.js_ file:

```js
module.exports = ({ region }) => ({
  vpc: {
    vpc: { name: "vpc", CidrBlock: "192.168.0.0/16", Tags },
    internetGateway: { name: "internet-gateway" },
    eip: { name: "eip" },
    subnets: {
      publicTags: [],
      public: [
        {
          name: "subnet-public-1",
          CidrBlock: "192.168.0.0/19",
          AvailabilityZone: `${region}a`,
        },
        {
          name: "subnet-public-2",
          CidrBlock: "192.168.32.0/19",
          AvailabilityZone: `${region}b`,
        },
        {
          name: "subnet-public-3",
          CidrBlock: "192.168.64.0/19",
          AvailabilityZone: `${region}c`,
        },
      ],
      privateTags: [],
      private: [
        {
          name: "subnet-private-1",
          CidrBlock: "192.168.96.0/19",
          AvailabilityZone: `${region}a`,
        },
        {
          name: "subnet-private-2",
          CidrBlock: "192.168.128.0/19",
          AvailabilityZone: `${region}b`,
        },
        {
          name: "subnet-private-3",
          CidrBlock: "192.168.160.0/19",
          AvailabilityZone: `${region}c`,
        },
      ],
    },
  },
});
```

### iac.js

For a module, the _iac.js_ must exports the **createResources** function which takes an already created AWS provider. This **createResources** is responsible for creating VPC, subnets, internet gateway, NAT gateway and an elastic IP address.

We'll also exports the _config_ from here.

```js
const assert = require("assert");
const { get, map, pipe, assign, tap, and } = require("rubico");

exports.config = require("./config");

const createResources = async ({ provider }) => {
  const { config } = provider;
  assert(config.vpc);
  assert(config.vpc.vpc);
  assert(config.vpc.internetGateway);
  assert(config.vpc.eip);
  assert(config.vpc.publics);
  assert(config.vpc.privates);

  const vpc = await provider.makeVpc({
    name: config.vpc.vpc.name,
    properties: () => ({
      DnsHostnames: true,
      CidrBlock: config.vpc.vpc.CidrBlock,
      Tags: config.vpc.vpc.Tags,
    }),
  });

  const internetGateway = await provider.makeInternetGateway({
    name: config.internetGateway.name,
    dependencies: { vpc },
  });

  const eip = await provider.makeElasticIpAddress({
    name: config.eip.name,
  });

  //Public subnets
  assert(config.vpc.subnet.public);

  const publics = await map(({ name, CidrBlock, AvailabilityZone }) =>
    pipe([
      assign({
        subnet: () =>
          provider.makeSubnet({
            name,
            dependencies: { vpc },
            properties: () => ({
              CidrBlock,
              AvailabilityZone,
              Tags: config.vpc.subnets.publicTags,
            }),
          }),
      }),
      assign({
        routeTable: ({ subnet }) =>
          provider.makeRouteTables({
            name: `route-table-${subnet.name}`,
            dependencies: { vpc, subnet },
          }),
      }),
      assign({
        routeIg: ({ routeTable }) =>
          provider.makeRoute({
            name: `route-igw-${routeTable.name}`,
            dependencies: { routeTable, ig },
          }),
      }),
    ])()
  )(config.vpc.subnets.public);

  const subnet = publics[0].subnet;
  const natGateway = await provider.makeNatGateway({
    name: `nat-gateway-${subnet.name}`,
    dependencies: { subnet, eip },
  });

  //Private
  assert(config.vpc.subnets.private);

  const privates = await map(({ name, CidrBlock, AvailabilityZone }) =>
    pipe([
      assign({
        subnet: () =>
          provider.makeSubnet({
            name,
            dependencies: { vpc },
            properties: () => ({
              CidrBlock,
              AvailabilityZone,
              Tags: config.vpc.subnets.privateTags,
            }),
          }),
      }),
      assign({
        routeTable: ({ subnet }) =>
          provider.makeRouteTables({
            name: `route-table-${subnet.name}`,
            dependencies: { vpc, subnet },
          }),
      }),
      assign({
        routeNat: ({ routeTable }) =>
          provider.makeRoute({
            name: `route-nat-${routeTable.name}`,
            dependencies: { routeTable, natGateway },
          }),
      }),
    ])()
  )(config.vpc.subnets.private);

  return {
    vpc,
    internetGateway,
    eip,
    natGateway,
    privates,
    publics,
  };
};

exports.createResources = createResources;
```

# Example

It is time to create an example to consume this module.

We'll create its directory and package.json, install the dependencies, and create the _config.js_ an _iac.js_ file.

```sh
mkdir example
cd example
```

## package.json

Let's create the package.json with `npm init`:

- The package name in this case is _@grucloud/example-module-aws-vpc_
- The entry point is _iac.js_

```
npm init
```

This package is not meant to be pusblished to NPM, hence set the _private_ package.json field to _false_

We'll install the module _@grucloud/module-aws-vpc_ that has been implemented in the last steps:

```sh
npm install @grucloud/core @grucloud/provider-aws @grucloud/module-aws-vpc
```

## config.js

The example config is rather simple, we can set the tags for the VPCs and subnets.

```js
const pkg = require("./package.json");
module.exports = ({ region }) => ({
  projectName: pkg.name,
  vpc: {
    vpc: { Tags: [] },
    subnets: {
      publicTags: [],
      privateTags: [],
    },
  },
});
```

## iac.js

The file will export the _createStack_ function. It uses the _createResources_ and _config_ function from this module: _@grucloud/module-aws-vpc_.

```js
const { AwsProvider } = require("@grucloud/provider-aws");
const ModuleAwsVpc = require("@grucloud/module-aws-vpc");
// const ModuleAwsVpc = require("../iac"); When the package is not published yet.

exports.createStack = async ({ config }) => {
  const provider = AwsProvider({ configs: [config, ModuleAwsVpc.config] });
  const resources = await ModuleAwsVpc.createResources({
    provider,
  });
  return {
    provider,
    resources,
  };
};
```

## Generate the dependency graph

Things can get quickly complicated, especially in term of dependencies. Some resources needs to created before others. Same for destruction, the order is paramount.

The `graph` command generates a graph from the _iac.js_ file in the form of a _.dot_ file and an SVG.

```
gc graph
```

## Running with gc

At this stage, one can use the usual _gc_ commands: _plan_, _apply_, _list_ and _destroy_

# Testing with mocha

Testing the module is not an option. We'll use mocha to write and run the test suite.

First of all create the file _.mocharc.json_ and the following content:

```json
{
  "watch-files": ["**/*.js"],
  "extension": ["js"],
  "exclude": "node_modules",
  "reporter": "spec",
  "timeout": 300e3,
  "ui": "bdd",
  "bail": false,
  "recursive": true
}
```

Now we'll add a new entry in the _scripts_ section of our _package.json_

```json
//package.json
  "scripts": {
    "test": "mocha 'test/**/*.test.js'"
  },
```

Finally let's create a test suite for this module.
Create the _test_ directory and add _iac.test.js_ with the following content:

```js
// test/iac.test.js
const assert = require("assert");
const cliCommands = require("@grucloud/core/cli/cliCommands");
const { createStack } = require("../example/iac");
const config = require("../example/config");

describe("AWS VPC Module", async function () {
  before(async function () {});
  it("run workflow", async function () {
    const infra = await createStack({ config });

    await cliCommands.planDestroy({
      infra,
      commandOptions: { force: true },
    });
    await cliCommands.planApply({
      infra,
      commandOptions: { force: true },
    });
    await cliCommands.planDestroy({
      infra,
      commandOptions: { force: true },
    });
    // TODO list should be empty
    const result = await cliCommands.list({
      infra,
      commandOptions: { our: true },
    });
    assert(result);
  }).timeout(35 * 60e3);
});
```

Ready to execute the test suite ?

```sh
npm test
```
