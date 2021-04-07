# The AWS Load Balancer Controller GruCLoud Module

The purpose of the [module-aws-load-balancer-controller](https://www.npmjs.com/package/@grucloud/module-aws-load-balancer-controller) is to create the AWS resources require to run the [AWS Load Balancer Controller](https://docs.aws.amazon.com/eks/latest/userguide/aws-load-balancer-controller.html).

## Resources

- [IamOpenIDConnectProvider](https://www.grucloud.com/docs/aws/resources/IAM/IamOpenIDConnectProvider): [The Open ID Connect Provider](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc.html), depends on [EKS Cluster](https://www.grucloud.com/docs/aws/resources/EKS/EksCluster)
- [IamPolicy](https://www.grucloud.com/docs/aws/resources/IAM/IamPolicy): The load balancer policy from [load-balancer-policy.json](https://github.com/grucloud/grucloud/tree/main/packages/modules/aws/load-balancer-controller/load-balancer-policy.json)
- [IamRole](https://www.grucloud.com/docs/aws/resources/IAM/IamRole): An IAM role attaching the _load-balancer-policy_, assuming role from the _IamOpenIDConnectProvider_

## How to use this module

Install this module and its dependencies in your GruCloud project:

```
npm i @grucloud/module-aws-load-balancer-controller @grucloud/module-aws-vpc @grucloud/module-aws-eks @grucloud/provider-aws
```

In your _iac.js_, create a EKS Cluster module and pass the resource to _ModuleAwsLoadBalancerController.createResources_

```js
// iac.js
const { AwsProvider } = require("@grucloud/provider-aws");
const ModuleAwsVpc = require("@grucloud/module-aws-vpc");
const ModuleAwsEks = require("@grucloud/module-aws-eks");
const ModuleAwsLoadBalancerController = require("@grucloud/module-aws-load-balancer-controller");

exports.createStack = async ({ config }) => {
  const provider = AwsProvider({
    configs: [
      ModuleAwsEks.config,
      ModuleAwsVpc.config,
      ModuleAwsLoadBalancerController.config,
      config,
    ],
  });

  const resourceVpc = await ModuleAwsVpc.createResources({ provider });

  const resourceEks = await ModuleAwsEks.createResources({
    provider,
    resources: resourceVpc,
  });

  const resourceLbc = await ModuleAwsLoadBalancerController.createResources({
    provider,
    resources: resourceEks,
  });

  return {
    provider,
    resources: { vpb: resourceVpc, resourceEks, lbc: resourceLbc },
  };
};
```

The role balancer role is now available to the [Kubernetes Service Account resource](https://www.grucloud.com/docs/k8s/resources/ServiceAccount)
