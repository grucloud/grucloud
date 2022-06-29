---
id: comparison
title: comparison
---

Let's compare GruCloud with Terraform and the AWS CDK:

|                                            | GruCloud | Terraform | AWS CDK |
| ------------------------------------------ | -------- | --------- | ------- |
| Generate code from existing infrastructure | Yes      | No        | No      |
| General-purpose language                   | Yes      | No        | Yes     |
| Statelessness                              | Yes      | No        | No      |
| Multi-cloud                                | Yes      | Yes       | No      |
| Diagram of existing infrastructure         | Yes      | No        | No      |
| Diagram of target infrastructure           | Yes      | Yes       | No      |
| Debugging                                  | Yes      | No        | Yes     |
| Easy Testing                               | Yes      | No        | Yes     |
| Direct calls to the underlying cloud API   | Yes      | Yes       | No      |

# Code generation

Terraform, CDK and other IAC tools are unidirectional, they deploy, update and destroy infrastructures from code, but they don't generate code from existing infrastructure. Writing infrastructure code requires skilled engineers and takes time, therefore it is costly and time-consuming.
GruCloud is bidirectional, one can use the cloud provider's web interface or CLI to create or modify infrastructure, and let GruCloud generate the code on your behalf, hence, saving you time and money.

# General purpose language

GruCloud infrastructure code is written in Javascript, the most ubiquitous and easiest programming language out there.

> [The Atwood's Law](https://en.wikipedia.org/wiki/Jeff_Atwood#:~:text=In%202007%2C%20Jeff%20Atwood%20made,eventually%20be%20written%20in%20JavaScript.%E2%80%9D): Any application that can be written in Javascript will be eventually written in Javascript.

Terraform code is written in a declarative language called HCL, unfortunately, there is no or weak support for conditional, loop, using off-the-shelf libraries, debugging, testing, and so on, all the things that come for free by using a general-purpose language.

# Statelessness

Unlike Terraform and CDK, GruCloud does not use a "state file" as the source of truth, instead, the live infrastructure is the source of truth. Using a "state file" is a source of problems, for instance, secrets are stored in this source file with is a security concern, moreover, the state file format has changed over time which is a cause of issues. The statelessness feature is achieved by tagging resources and fetching the live infrastructure.

# Multi-cloud

The AWS CDK is only available on AWS, sometimes companies end up having resources on multiple clouds for whatever reasons, Both GruCloud and Terraform support multiple clouds.

# Diagrams

GruCloud generates 3 types of diagrams:

- target and live infrastructure diagrams showing the resource and their dependencies.

![route53 resolver](https://raw.githubusercontent.com/grucloud/grucloud/main/examples/aws/Route53/vpc-association-authorization/artifacts/diagram-target.svg)

- mind map of the target infrastructure indicating only the type of resources involved.

![reosurce map](https://raw.githubusercontent.com/grucloud/grucloud/main/examples/aws/Route53/vpc-association-authorization/artifacts/resources-mindmap.svg)

# Debugging

Being written in Javascript, infrastructure can be debugged with for instance VS Code. There is not yet a Terraform debugger.

![grucloud-debug](grucloud-debug.png)

# Easy Testing

Testing the deployment and destruction of the infrastructure can be easily performed. All examples provided are tested, ensuring quality and assurance.

# Direct calls to the underlying cloud API

The AWS CDK is not directly calling the AWS API, instead, it compiles down to CloudFormation templates which are then uploaded, as a consequence, the AWS CDK inherits all the CloudFormation limitations and issues. For instance, it is currently impossible to use a [SSM parameter SecureString](https://github.com/aws/aws-cdk/issues/3520). Another drawback of CloudFormation is the lag between the release of a new feature and the CloudFormation support for these features, it could be weeks or months. For instance, the [RDS Aurora V2 CDK support](https://github.com/aws/aws-cdk/issues/20197) is not supported yet 2 months after the release.

Terraform directly calls the AWS API through the AWS GO SDK, however, Terraform has a layer of abstraction between the terraform parameters and the AWS GO SDK parameters, for instance, the terraform parameters use snake case whereas the AWS GO SDK uses a pascal case. As a consequence, every time a new feature is added to the AWS GO SDK, terraform engineers need to manually implement the new change, adding costs for them and delays for their users.

GruCloud removes all of these useless layers, it directly calls the AWS API through the AWS JS SDK, without transforming any parameters. Therefore, when a new feature is released from the AWS SDK, supporting this new feature is straightforward: update the AWS JS SDK, create an example, run the end-to-end test suite, and finally release the new version.
