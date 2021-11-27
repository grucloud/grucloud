---
id: AwsGettingStarted
title: Aws Getting Started
---

This tutorial explains the code generation from a live infrastructure.
Instead of manually coding the infrastructure, GruCloud automatically creates the infrastructure as code.

## Workflow

![gc-new-aws](https://raw.githubusercontent.com/grucloud/grucloud/main/docusaurus/plantuml/gc-new-workflow.svg)

### AWS Requirements

- AWS Account
- AWS CLI
- Access and Secret Key

#### AWS Account

Ensure access to the [Amazon Console](https://console.aws.amazon.com) and create an account if necessary.

#### AWS CLI

Ensure the _AWS CLI_ is installed and configured:

```sh
aws --version
```

If not, visit https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html

#### Access and Secret Key

Visit the [security credentials](https://console.aws.amazon.com/iam/home#/security_credentials)

- Click on **Access key (access key ID and secret access key).**
- Click on the button **Create New Access Key**.

Write down the **AWSAccessKeyId** and **AWSSecretKey**

> In a further episode, the access and secret key will be obtained from a dedicated IAM user with the correct role and policy.

### Getting the GruCloud CLI

This chart describes the way to install **gc**, the GruCloud CLI:

![gc-cli-install](https://raw.githubusercontent.com/grucloud/grucloud/main/docusaurus/plantuml/grucloud-cli-install.svg)

GruCloud is written in Javascript running on [Node.js](https://nodejs.org/). Check if `node` is present on your system

```
node --version
```

> The version must be greater than 14

Install the _GrucCloud_ command-line utility **gc** with _npm_

```sh
npm i -g @grucloud/core
```

Check the current version of **gc**:

```sh
gc --version
```

### Create a new project

The **new** command guides you on how to create and configure a new project.

![gc-new-aws](https://raw.githubusercontent.com/grucloud/grucloud/main/docusaurus/plantuml/gc-new-aws.svg)

Below is the screencast of **gc new**:

 <div>
    <iframe
    data-autoplay
    src="https://asciinema.org/a/daLrxnF4qNuuUksSugIBjmi2F/embed?autoplay=true&amp;speed=2&amp;loop=true"
    id="asciicast-iframe-13761"
    name="asciicast-iframe-13761"
    scrolling="no"
    style={{ width: "900px", height: "400px" }}
    ></iframe>
</div>
            
The boilerplate project is now created and configured.

### List the live resources

Visualize your current infrastructure with the _list_ command:

```sh
gc list --graph
```

![diagram-live.svg](https://raw.githubusercontent.com/grucloud/grucloud/main/examples/aws/ec2/ec2-vpc/artifacts/diagram-live.svg)

### Generate the code

```sh
gc gencode
```

The live resources will be fetched and the code generated in _resource.js_.
A diff between the current file and the new one is displayed.

### Target Graph

The _graph_ command creates a dependency graph of the target resources:

```sh
gc graph
```

### Resource mind map

Given the target resources defined in _resources.js_, let's generate a mindmap of the target resources by group and type.

```sh
gc tree
```

![diagram-live.svg](https://raw.githubusercontent.com/grucloud/grucloud/main/examples/aws/ec2/ec2-vpc/artifacts/resources-mindmap.svg)

### Update

To update the infrastructure, either use the AWS console and run **gc gencode**, or modify directly the file **resource.js**.
Once done, use the **apply** command to update the infrastructure:

```sh
gc apply
```

### Destroy

Resources can be destroyed in the right order with the _destroy_ command:

```sh
gc destroy
```
