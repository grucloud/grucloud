---
id: AwsResourceHowto
title: How to implement a new AWS Resources
---

This document will guide you through implementing a new AWS Resource for the [GruCloud AWS provider](https://www.npmjs.com/package/@grucloud/provider-aws).

Case study: [Elastic Load Balancer (ELB)](https://docs.aws.amazon.com/elasticloadbalancing/)

The implementation leverages the [aws-sdk](https://www.npmjs.com/package/aws-sdk) for Node, bookmark the [the Javascropt SDK documentaion](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELB.html) as it is the main source of information to develop this code.

# Requirements

- AWS account
- AWS CLI: `aws --version`
- AWS access and secret key
- Configure authentication ans region with `aws configure`
- Node 14: `node --version`
- VS code for editing and debugging.

# Getting Started

## Clone the code

Visit the [Grucloud github page](https://github.com/grucloud/grucloud) and fork the monorepo.
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

This monorepo contains a lot a packages that depends on each others. [lerna](https://github.com/lerna/lerna) is helping us to manage this situation.

## Aws Provider

Change to the aws provider package directory:

```sh
cd packages/providers/aws
```

Run the existing test suite and ensure they pass.

```
npm test
```

## Creating the files & directories

Create the ELB directory that will contain the ELB resources: LoadBalancer. Create as well as a test directory:

```sh
packages/providers/aws $ mkdir ELB
packages/providers/aws $ mkdir ELB/test
```

# Documentation

We'll describe how to add documentation for this resources.

Create the ELB directory in _docusurus/docs/aws/resources/ELB_.

Create the markdown file _docusurus/docs/aws/resources/ELB/AwsLoadBalancer.md_ and fill it with this basic information:

```md
---
id: AwsLoadBalancer
title: Load Balancer
---

Manage an AWS Load Balancer.
```

Edit _docusaurus/sidebars.js_, Add the ELB section as well as _AwsLoadBalancer.md_

```json
//sidebars.js
[...]
{
  "ELB": ["aws/resources/ELB/AwsLoadBalancer"]
}
[...]
```

To view the documentation locally, start the docusaurus development server:

```sh
cd docusaurus
npm install
npm start
```

### README.md

Edit _packages/providers/aws/README.md_ and add the new resource in the _Resources_ section:

```md
- ELB: [Load Balancer](https://grucloud.com/docs/aws/resources/ELB/Loadbalancer),
```

# Boiler plate code

The following section describes the files to create and edit.

## AwsCommon.js

In order to handle various errors, all AWS calls goes through a facade. We need to create this facade for _ELB_:

```js
// AwsCommon.js
exports.ELBNew = (config) => () =>
  createEndpoint({ endpointName: "ELB" })(config);
```

## AwsLoadBalancer.js

Create the file _packages/providers/aws/ELB/AwsLoadBalancer.js_ and add the following boilerplate code:

```js
// ELB/AwsLoadBalancer.js
const assert = require("assert");
const { map, pipe, tap, tryCatch, get, switchCase, eq } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const logger = require("@grucloud/core/logger")({
  prefix: "LoadBalancer",
});
const { retryCall } = require("@grucloud/core/Retry");
const { tos } = require("@grucloud/core/tos");
const {
  getByNameCore,
  isUpByIdCore,
  isDownByIdCore,
} = require("@grucloud/core/Common");
const {
  ELBNew,
  buildTags,
  findNameInTags,
  shouldRetryOnException,
} = require("../AwsCommon");

const findName = () => {
  throw Error("TODO findName");
};
const findId = () => {
  throw Error("TODO findId");
};

exports.AwsLoadBalancer = ({ spec, config }) => {
  const elb = ELBNew(config);

  const getList = ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.info(`getList ${tos(params)}`);
      }),
      () => {
        throw Error("TODO getList");
      },
      (items = []) => ({
        total: items.length,
        items,
      }),
      tap(({ total }) => {
        logger.info(`getList: ${total}`);
      }),
    ])();

  const getByName = getByNameCore({ getList, findName });

  const getById = pipe([
    tap(({ id }) => {
      logger.info(`getById ${id}`);
    }),
    () => {
      throw Error("TODO getById");
    },
    tap((result) => {
      logger.debug(`getById result: ${tos(result)}`);
    }),
  ]);

  const isInstanceUp = (instance) => {
    throw Error("TODO isInstanceUp");
  };

  const isUpById = isUpByIdCore({ isInstanceUp, getById });
  const isDownById = isDownByIdCore({ getById });

  const create = ({ name, payload = {} }) =>
    pipe([
      tap(() => {
        logger.debug(`create: ${name}, ${tos(payload)}`);
      }),
      () => {
        throw Error("TODO create");
      },
      tap(() =>
        retryCall({
          name: `isUpById: ${name} id: ${id}`,
          fn: () => isUpById({ name, id }),
          config,
        })
      ),
      tap(() => {
        logger.info(`created:`);
      }),
    ])();

  const destroy = ({ live, lives }) =>
    pipe([
      () => ({ id: findId({ live }), name: findName({ live, lives }) }),
      ({ id, name }) =>
        pipe([
          tap(() => {
            logger.info(`destroy ${JSON.stringify({ name, id })}`);
          }),
          () => {
            throw Error("TODO destroy");
          },
          tap(() =>
            retryCall({
              name: `isDownById: ${id}`,
              fn: () => isDownById({ id }),
              config,
            })
          ),
          tap(() => {
            logger.info(`destroyed ${JSON.stringify({ name, id })}`);
          }),
        ])(),
    ])();

  const configDefault = async ({ name, properties, dependencies }) =>
    defaultsDeep({})(properties);

  return {
    spec,
    isInstanceUp,
    isUpById,
    isDownById,
    findId,
    getByName,
    getById,
    findName,
    create,
    destroy,
    getList,
    configDefault,
    shouldRetryOnException,
  };
};
```

We'll implement the following functions later on:

- findId,
- findName,
- getList
- isInstanceUp,
- getById
- create
- destroy
- configDefault

### ELB/testAwsLoadBalancer.test.js

Create the test file _packages/providers/aws/ELB/test/AwsLoadBalancer.test.js_, add this boilerplate code:

```js
// ELB/testAwsLoadBalancer.test.js
const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/E2ETestUtils");

describe("AwsLoadBalancer", async function () {
  let config;
  let provider;
  let loadBalancer;
  let loadBalancerName = "lb";
  const types = ["LoadBalancer"];

  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({
      config: () => ({ projectName: "gru-test" }),
    });

    await provider.start();

    loadBalancer = provider.elb.makeLoadBalancer({
      name: loadBalancerName,
      properties: () => ({
        // TODO
      }),
    });
  });
  after(async () => {});
  it("load balancer apply plan", async function () {
    await testPlanDeploy({
      provider,
      types,
    });

    await testPlanDestroy({ provider, types });
  });
});
```

### ELB/ELBSpec.js

In _ELBSpec.js_, we declare the list of resources belonging to ELB, for now just a the _AwsLoadBalancer_
For each resources, we specify the _type_, the list of dependencies through _dependsOn_.

```js
// packages/providers/aws/ELB/ELBSpec.js
const { isOurMinion } = require("../AwsCommon");
const { AwsLoadBalancer } = require("./AwsLoadBalancer");

module.exports = [
  {
    type: "LoadBalancer",
    dependsOn: ["Subnet", "SecurityGroup", "Certificate"],
    Client: AwsLoadBalancer,
    isOurMinion,
  },
];
```

### ELB/index.js

Create the file _ELB/index.js_:

```js
// ELB/index.js
module.exports = require("./ELBSpec");
```

### AwsProvider.js

The _ELB/ELBSpec.js_ and _index.js_ created in the previous step is imported in _AwsProvider.js_

```js
// AwsProvider.js
const AwsELB = require("./ELB");

const fnSpecs = () => [
  // Other module here
  ...AwsELB,
];
```

Now let's set the ELB api versions:

```js
// AwsProvider.js
AWS.config.apiVersions = {
  // Other versions
  elb: "2012-06-01",
};
```

# Testing

At the stage, we have the necessary boilerplate code to start testing.

To only execute our new load balancer test suite, we'll add **.only** to the _describe_ function in _ELB/testAwsLoadBalancer.test.js_

We are ready to test by running this command in the _packages/providers/aws_ directory

```
npm test
```

At this stage, the expected result is a one failed test as we still have to implement _AwsLoadBalancer.js_

The log files _grucloud-debug.log_, _grucloud-info.log_ and _grucloud-error.log_ will inform you about what happened.

Open _grucloud-debug.log_ and search for "Error:"

```
08:57:21.122 error: Common       Error: TODO getList
    at items (/Users/fredericheem/grucloud/packages/providers/aws/ELB/AwsLoadBalancer.js:38:15)
```

The exception **getList** has been thrown, as expected.

# Debugging

We recommend VS Code for debugging, many debug configuration has already been created.

- Open the GruCloud project source code as its root.
- Open _AwsLoadBalancer.js_
- Set a breakpoint in **getList** and the **logger.info** line.
- Click on the debug icon on the left navigration bar
- Select the "Debug Aws Provider" and click on the green arrow to start debugging.
- You should expect the program to stop at the breakpoint.

# Implementation code

## AwsLoadBalancer.js

To list all the load balancers for a given account, we'll use the (describeLoadBalancers)[https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELB.html#describeLoadBalancers-property] function.

The _describeLoadBalancers_ _json_ output is:

```js
{
  LoadBalancerDescriptions: [
    {
      AvailabilityZones: ["us-west-2a"],
      BackendServerDescriptions: [
        {
          InstancePort: 80,
          PolicyNames: ["my-ProxyProtocol-policy"],
        },
      ],
      CanonicalHostedZoneName:
        "my-load-balancer-1234567890.us-west-2.elb.amazonaws.com",
      CanonicalHostedZoneNameID: "Z3DZXE0EXAMPLE",
      CreatedTime: "",
      DNSName: "my-load-balancer-1234567890.us-west-2.elb.amazonaws.com",
      HealthCheck: {
        HealthyThreshold: 2,
        Interval: 30,
        Target: "HTTP:80/png",
        Timeout: 3,
        UnhealthyThreshold: 2,
      },
      Instances: [
        {
          InstanceId: "i-207d9717",
        },
        {
          InstanceId: "i-afefb49b",
        },
      ],
      ListenerDescriptions: [
        {
          Listener: {
            InstancePort: 80,
            InstanceProtocol: "HTTP",
            LoadBalancerPort: 80,
            Protocol: "HTTP",
          },
          PolicyNames: [],
        },
        {
          Listener: {
            InstancePort: 443,
            InstanceProtocol: "HTTPS",
            LoadBalancerPort: 443,
            Protocol: "HTTPS",
            SSLCertificateId:
              "arn:aws:iam::123456789012:server-certificate/my-server-cert",
          },
          PolicyNames: ["ELBSecurityPolicy-2015-03"],
        },
      ],
      LoadBalancerName: "my-load-balancer",
      Policies: {
        AppCookieStickinessPolicies: [],
        LBCookieStickinessPolicies: [
          {
            CookieExpirationPeriod: 60,
            PolicyName: "my-duration-cookie-policy",
          },
        ],
        OtherPolicies: [
          "my-PublicKey-policy",
          "my-authentication-policy",
          "my-SSLNegotiation-policy",
          "my-ProxyProtocol-policy",
          "ELBSecurityPolicy-2015-03",
        ],
      },
      Scheme: "internet-facing",
      SecurityGroups: ["sg-a61988c3"],
      SourceSecurityGroup: {
        GroupName: "my-elb-sg",
        OwnerAlias: "123456789012",
      },
      Subnets: ["subnet-15aaab61"],
      VPCId: "vpc-a01106c2",
    },
  ];
}
```

#### getList()

From the shape of the result we can now write the _getList_ function:

```js
const getList = async ({ params } = {}) =>
  pipe([
    tap(() => {
      logger.info(`getList ${tos(params)}`);
    }),
    () => elb().describeLoadBalancers(params),
    get("LoadBalancerDescriptions"),
    tap((results) => {
      logger.debug(`getList: result: ${tos(results)}`);
    }),
    (items = []) => ({
      total: items.length,
      items,
    }),
    tap(({ total }) => {
      logger.info(`getList: #total: ${total}`);
    }),
  ])();
```

#### findName()

Again by looking at the shape of the output of **LoadBalancerName**, we find the key name which is in this case **LoadBalancerName**.
Hence the _findName_ function:

```js
const findName = ({ live }) => live.LoadBalancerName;
```

Which could be simplify with _rubico_:

```js
const findName = get("live.LoadBalancerName");
```

#### findId()

The _describeLoadBalancers_ _json_ input is

```js
var params = {
  LoadBalancerNames: ["my-load-balancer"],
};
```

In this case the id the same as the name:

```js
const findId = findName;
```

#### getByName()

The _describeLoadBalancers_ can also be used to retrieve just one load balancer.

```js
const getByName = ({ name }) =>
  pipe([
    tap(() => {
      logger.info(`getByName ${name}`);
    }),
    () => ({ LoadBalancerNames: [name] }),
    (params) => elb().describeLoadBalancers(params),
    get("LoadBalancerDescriptions"),
    first,
    tap((result) => {
      logger.debug(`getByName result: ${tos(result)}`);
    }),
  ])();
```

#### getById()

In the case of the load balancer resource, the name and id means the same:

```js
const getById = ({ id }) => getByName({ name: id });
```

## Resource Creation

To create a load balancer, we'll use [createLoadBalancer](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELB.html#createLoadBalancer-property) function.

From the offical documentation, here are the parameters to create a HTTPS Load Balancer in a VPC:

```js
var params = {
  Listeners: [
    {
      InstancePort: 80,
      InstanceProtocol: "HTTP",
      LoadBalancerPort: 80,
      Protocol: "HTTP",
    },
    {
      InstancePort: 80,
      InstanceProtocol: "HTTP",
      LoadBalancerPort: 443,
      Protocol: "HTTPS",
      SSLCertificateId:
        "arn:aws:iam::123456789012:server-certificate/my-server-cert",
    },
  ],
  LoadBalancerName: "my-load-balancer",
  SecurityGroups: ["sg-a61988c3"],
  Subnets: ["subnet-15aaab61"],
};
```

This tells us that the load balancer depends on the following resources that need to be created before:

- SecurityGroups
- Subnets
- SSL Certificate

Subnets and SecurityGroups depends on a VPC so we'll create one too.
The load balancer also requires an Internet Gateway to be attached to the gateway.
We have now all the informations on how to create a load balancer and its dependencies. Have a look at [ELB/test/AwsLoadBalancer.test.js] for the final result.

#### configDefault()

The _configDefault_ function infers the parameters for the resource creation.
The load balancer depends on an array of subnets and security groups. We'll retrieve these values with the help of the **getField** function.

```js
const configDefault = async ({
  name,
  properties,
  dependencies: { subnets, securityGroups },
}) =>
  pipe([
    tap(() => {
      assert(Array.isArray(securityGroups));
      assert(Array.isArray(subnets));
    }),
    () => properties,
    defaultsDeep({
      LoadBalancerName: name,
      SecurityGroups: map((securityGroup) =>
        getField(securityGroup, "GroupId")
      )(securityGroups),
      Subnets: map((subnet) => getField(subnet, "SubnetId"))(subnets),
    }),
  ])();
```

#### isInstanceUp()

_isInstanceUp_ is going to be used by _isUpById_ and indicates if the resource is up. The load balancer does not contains any state or status field, therefore we consider the load balancer is if it exists.

```js
const isInstanceUp = (live) => live;
```

Simplify with rubico with:

```js
const isInstanceUp = not(isEmpty);
```

### Create

Now that the _configDefault_ and _isInstanceUp_ are implemented, we can write the _create_ function.
We start calling the [aws createLoadBalancer](<(https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELB.html#createLoadBalancer-property)>) function, we check that the resource is up.

We tag the resource with [addTags](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELB.html#addTags-property) to so we know they have been created by GruCloud.

```js
const create = async ({ name, payload }) =>
  pipe([
    tap(() => {
      logger.debug(`create: ${name}, ${tos(payload)}`);
    }),
    () => elb().createLoadBalancer(payload),
    tap(() =>
      retryCall({
        name: `load balancer isUpById: ${name} id: ${id}`,
        fn: () => isUpById({ name, id }),
        config,
      })
    ),
    tap(() =>
      elb().addTags({
        LoadBalancerNames: [name],
        Tags: buildTags({ name, config, UserTags: payload.Tags }),
      })
    ),
    tap(({ DNSName }) => {
      logger.info(`created: ${DNSName}`);
    }),
  ])();
```

### Destroy

We'll use [deleteLoadBalancer](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELB.html#deleteLoadBalancer-property) to destroy the load baancer. We then check that the resource is down.

```js
const destroy = async ({ live }) =>
  pipe([
    () => ({ id: findId({ live }), name: findName({ live }) }),
    ({ id, name }) =>
      pipe([
        tap(() => {
          logger.info(`destroy ${JSON.stringify({ name })}`);
        }),
        () => ({
          LoadBalancerName: name,
        }),
        (params) => elb().deleteLoadBalancer(params),
        tap(() =>
          retryCall({
            name: `load balancer isDownById: ${id}`,
            fn: () => isDownById({ id }),
            config,
          })
        ),
        tap(() => {
          logger.info(`destroyed ${JSON.stringify({ name })}`);
        }),
      ])(),
  ])();
```

Congratulation, the load balancer has been implemented, tested and documented.

The remaining task it to use the load balancer in the EKS module.
