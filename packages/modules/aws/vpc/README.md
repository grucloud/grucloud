# AWS VPC GruCloud module

The AWS VPC Grucloud module creates a base set of EC2 resources to be used by an EKS cluster.

Once again, a picture is worth a thousands words. This modules packs and configures all these resources ready to be consumed by others.

![Graph](https://github.com/grucloud/grucloud/tree/main/packages/modules/aws/vpc/example/grucloud.svg)

## Resources

Below is the list of the resources involved as well a link towards their documentations:

- [Vpc](https://www.grucloud.com/docs/aws/resources/EC2/Vpc)
- [Subnet](https://www.grucloud.com/docs/aws/resources/EC2/Subnet)
- [SecurityGroup](https://www.grucloud.com/docs/aws/resources/EC2/SecurityGroup)
- [Elastic IP Address](https://www.grucloud.com/docs/aws/resources/EC2/ElasticIpAddress)
- [Internet Gateway](https://www.grucloud.com/docs/aws/resources/EC2/InternetGateway)
- [Nat Gateway](https://www.grucloud.com/docs/aws/resources/EC2/NatGateway)
- [Route Table](https://www.grucloud.com/docs/aws/resources/EC2/RouteTables)
- [Route](https://www.grucloud.com/docs/aws/resources/EC2/Route)

All these resources are just the foundation to build real world application on top of it, for instance Kubernetes cluster

## TL;DR, How to use this module in my project ?

Follow this simple 4 steps to use this module in your project:

Install the _@grucloud/module-aws-vpc_ module with _npm_:

```sh
npm install @grucloud/module-aws-vpc
```

In your _iac.js_, import the module:

```js
const ModuleAwsVpc = require("@grucloud/module-aws-vpc");
```

In your _createStack_, set the config to the AWS provider through the _configs_ array

```js
const provider = AwsProvider({ configs: [config, ModuleAwsVpc.config] });
```

Create the resources:

```js
const vpcResources = await ModuleAwsVpc.createResources({
  provider,
});
```

That's it, as simple as that.

Refer to the [example](./example/iac.js) for the complete code.

## Code

The Javascript describing this module is implemented in [iac.js](./iac.js), which exports:

- _createResources_: creates the resources for this provider.
- [config.js](./config.js): the default configuration

## Example

Refer to the [example](./example/README.md) which show off the usage of this module.

## Testing

This module can be tested with the `npm test` command. It executes mocha test suite in the _test_ directory.
