The aim of this tutorial is to automatically create and destroy the AWS resources required by [kops](https://kops.sigs.k8s.io/), a tool to create a Kubernetes cluster.

The section ['setup your environment'](https://kops.sigs.k8s.io/getting_started/aws/#setup-your-environment) from the official _kops_ documentation will be automated with [GruCloud](https://grucloud.com)

Below is the diagram generated from the target code, it illustrates the resources and their association with each other:

![kops-graph](https://raw.githubusercontent.com/grucloud/grucloud/main/examples/aws/kops/artifacts/diagram-target.svg)

> Regarding this DNS scenario, the case of a subdomain where a top-level hosted zone already exists is implemented.

## TD;DR

1. Get this [example code](https://github.com/grucloud/grucloud/tree/main/examples/aws/kops) and install the dependencies.
2. Edit the configuration file and set the domain name, the subdomain name, the region, and the zone.
3. `gc apply`

All the AWS resources required by kops should have been created. The environment file _kops.env_ containing the necessary information should have been generated too.

You are now ready to [create a cluster with kops](https://kops.sigs.k8s.io/getting_started/aws/#creating-your-first-cluster),

Here are a few npm scripts wrapper: `npm run kops:create`, `npm run kops:update` and `npm run kops:validate`.

## Steps

Here is a description of the steps that are automated:

#### IAM

- create a kops group, attach 5 IAM policies.
- create a kops user, attach the user to the kops group.
- create access and secret key for the kops user.

#### Route53

- create a hosted zone for a subdomain.
- create a DNS record of type _NS_ in the top-level hosted zone with the DNS servers as values from the subdomain hosted zone.

#### S3

- create an S3 bucket with encryption and versioning.

#### kops.env file

- create a file containing the environment variable for _kops_

You will be free from performing all these commands manually. The same applies to the destruction of all these resources.

## Requirements

- [Access to the AWS console](https://console.aws.amazon.com)
- AWS CLI configured
- A domain name registered on Route53.
- [Node.js](https://nodejs.org)
- [GruCloud CLI](https://www.grucloud.com/docs/cli/gc)

## Install

Clone this [code](https://github.com/grucloud/grucloud), change to the [kops folder](https://github.com/grucloud/grucloud/tree/main/examples/aws/kops), install the npm dependencies:

```sh
git clone https://github.com/grucloud/grucloud
cd grucloud/examples/aws/kops
npm install
```

## Configuration

Edit [config.js](https://github.com/grucloud/grucloud/blob/main/examples/aws/kops/config.js) and set the _domainName_, the _subDomainName_, the _zone_ and the region:

Double check your configuration with `gc info`:

```txt
  - provider:
      name: aws
      type: aws
    stage: dev
    config:
      projectName: @grucloud/create-aws-kops
      kops:
        domainName: grucloud.org
        subDomainName: kops.example.grucloud.org
        groupName: kops
        userName: kops
      stage: dev
      zone: us-east-1a
      accountId: 4444454555555
      region: us-east-1
```

The domain name must be registered with Route53 **for the current AWS user**.
Let's also verify that a top level hosted zone already exists.
You could use the _gc list_ command with the _Route53Domain_ and _HostedZone_ type filter:

```sh
gc list  -t Route53Domain -t HostedZone
```

```txt
[...Truncated]
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                         │
├────────────────────┬────────────────────────────────────────────────────────────────────────┤
│ Route53Domain      │ grucloud.org                                                           │
├────────────────────┼────────────────────────────────────────────────────────────────────────┤
│ HostedZone         │ grucloud.org.                                                          │
└────────────────────┴────────────────────────────────────────────────────────────────────────┘
```

## iac.js

For your information, the architecture is described in [iac.js](https://github.com/grucloud/grucloud/blob/main/examples/aws/kops/iac.js).
In this use, the cloud provider is AWS, so we'll use the [GruCloud AWS Provider](https://www.npmjs.com/package/@grucloud/provider-aws) to create the resources.

## Target Graph

Another way to explore the _iac.js_ is to generate a diagram of the target resources:

```sh
gc graph
```

## Deploying

Ready to deploy the user, group, s3 bucket, route53 hosted zone and record ?

```sh
gc apply
```

The AWS resources should have been deployed.
Let's find out our live resources as well as a diagram showing the dependencies between these resources:

```sh
gc list --graph --our
```

```txt
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                         │
├────────────────────┬────────────────────────────────────────────────────────────────────────┤
│ IamPolicy          │ AmazonEC2FullAccess                                                    │
│                    │ AmazonRoute53FullAccess                                                │
│                    │ AmazonS3FullAccess                                                     │
│                    │ IAMFullAccess                                                          │
│                    │ AmazonVPCFullAccess                                                    │
├────────────────────┼────────────────────────────────────────────────────────────────────────┤
│ IamGroup           │ kops                                                                   │
├────────────────────┼────────────────────────────────────────────────────────────────────────┤
│ S3Bucket           │ kops.example.grucloud.org                                              │
├────────────────────┼────────────────────────────────────────────────────────────────────────┤
│ IamUser            │ kops                                                                   │
├────────────────────┼────────────────────────────────────────────────────────────────────────┤
│ HostedZone         │ kops.example.grucloud.org.                                             │
│                    │ grucloud.org.                                                          │
├────────────────────┼────────────────────────────────────────────────────────────────────────┤
│ Route53Record      │ kops.example.grucloud.org-ns                                           │
└────────────────────┴────────────────────────────────────────────────────────────────────────┘
11 resources, 15 types, 1 provider
```

![diagram-live.partial.svg](https://raw.githubusercontent.com/grucloud/grucloud/main/examples/aws/kops/diagram-live-partial.svg)

## Envirornment variables

At the end of the deployment, the environment file **kops.env** is generated with the variables required by _kops_:

```sh
# kops.env
export AWS_ACCESS_KEY_ID=XXXXXXNBM2ZQEPXXXXX
export AWS_SECRET_ACCESS_KEY=XXXXXiXmSB3aZTK/AxOOvSPcGby3XXXXXX
export NAME=kops.example.grucloud.org
export KOPS_STATE_STORE=s3://kops.example.grucloud.org
export REGION=eu-west-2
export ZONE=eu-west-2a
```

Source with variables with:

```sh
source kops.env
```

When the deploment is destroyed with _gc destroy_, **kops.env** is removed.

The file [hook.js](https://github.com/grucloud/grucloud/blob/main/examples/aws/kops/hook.js) is the place where this logic is implemented.

## NPM kops scripts

The following npm scripts manage the kops commands, the environment variables are sourced from **kops.env**.

```sh
npm run kops:create
npm run kops:update
npm run kops:validate
```

## List Resources

Let's fetch all the live resources, we'll see that _kops_ creates many resources such as autoscaling groups, ec2 instances, subnets, vpc, internet gateway, volumes, key pair and so on:

```sh
gc list --graph --all --default-exclude --types-exclude Certificate --types-exclude Route53Domain --types-exclude NetworkInterface
```

![kops-diagram-live-all](https://raw.githubusercontent.com/grucloud/grucloud/main/examples/aws/kops/diagram-live-all.svg)

> You could inspect and generate a diagram of any existing AWS infrastruture for the [most used resources](https://github.com/grucloud/grucloud/tree/main/packages/providers/aws#resources)

## Destroy

To destroy the resources created by GruCloud, use the _destroy_ command.

> Ensure the cluster is destroyed before.

```sh
npm run kops:destroy
gc destroy
```

Alternatively, _gc_ could also destroy all the resources created by _kops_, use the _all_ flag:

```
gc destroy --all
```

## Further Step

Congratulations, you know how to create and destroy a Kubernetes cluster with _kops_.
What about a load balancer, DNS records, SSL certificates ? Grucloud provides some ready made modules distributed with _npm_, the node package manager.

Have a look at:

- [@grucloud/module-aws-certificate](https://www.npmjs.com/package/@grucloud/module-aws-certificate): Create a certificate and a Route53 record for validation.
- [@grucloud/module-aws-load-balancer](https://www.npmjs.com/package/@grucloud/module-aws-load-balancer): Manage a load balancer, target groups, listeners and rules. A leaner alternative the AWS Load Balancer Controller which runs on the cluster.
- [@grucloud/module-aws-vpc](https://www.npmjs.com/package/@grucloud/module-aws-vpc): Contains the base resources required to create a Kubernetes cluster.

On the Kubernetes side, be aware of the [GruCloud Kubernetes Provider](https://www.npmjs.com/package/@grucloud/provider-k8s). In a nutshell, instead of writing YAML manifest, Javascript is used instead to define the manifests, no more templating engine, enjoy a real programming language instead.

Would you like to deploy a [full stack application](https://github.com/FredericHeem/starhackit) on EKS ? Choose the flavour depending on who is reponsible to create the load balancer, target groups, listener and rules:

- Load balancer resources created inside the cluster with the AWS Load Balancer Controller: [eks-lbc](https://github.com/grucloud/grucloud/tree/main/examples/starhackit/eks-lbc).

- A leaner solution where the load balancer resources are created by GruCloud outside the cluster: [eks-lean](https://github.com/grucloud/grucloud/tree/main/examples/starhackit/eks-lean).

## Links

- [GitHub](https://github.com/grucloud/grucloud)
- [Documentation](https://www.grucloud.com/docs/Introduction)
- [Website](https://www.grucloud.com)
- [Twitter](https://twitter.com/grucloud_iac)
