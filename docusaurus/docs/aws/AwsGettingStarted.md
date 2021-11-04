This tutorial explains the code generation from a live infrastructure.
Instead of manually coding the infrastructure, GruCloud automatically creates the infrastructure as code.

## Requirements

The following chart explains the AWS requirements:

- AWS Account
- AWS CLI
- Access and Secret Key

![AWS Requirements](https://raw.githubusercontent.com/grucloud/grucloud/main/docusaurus/plantuml/aws-requirements.svg)

### AWS Account

Ensure access to the [Amazon Console](https://console.aws.amazon.com) and create an account if necessary.

### AWS CLI

Ensure the _AWS CLI_ is installed and configured:

```sh
aws --version
```

If not, visit https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html

### Access and Secret Key

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

## Create a new project

The _new_ command guides you on how to create anf configured new project.

```sh
gc new
```

```txt
✔ Cloud Provider › AWS
✔ Project's name … my-aws-project
✓ aws --version
✖ aws sts get-caller-identity --region us-east-1
Unable to locate credentials. You can configure credentials by running "aws configure".

Create and retrieve the AWS Access Key ID and AWS Secret Access Key by visiting the following page:
✔ Open https://console.aws.amazon.com/iam/home#/security_credentials … yes
✔ AWS Access Key ID … XXXXX64Y2BD7AGAXXXXX
✔ AWS Secret Access Key … ****************************************
✓ aws configure set aws_access_key_id XXXXX64Y2BD7AGAXXXXX
✓ aws configure set aws_secret_access_key XXXXXXXXXXXXXXX
✓ aws sts get-caller-identity --region us-east-1
✓ aws ec2 describe-regions --region us-east-1
✖ aws configure get region
✔ Select a region › us-east-2
✓ aws configure set region us-east-2
cd /Users/fredericheem/test/my-aws-project
npm install
added 217 packages from 198 contributors and audited 218 packages in 8.098s

New aws project created in /Users/fredericheem/test/my-aws-project
What to do next ?
Step 1: cd /Users/joe/test/my-aws-project
Step 2: gc init
Step 3: gc list --graph
Step 5: gc gencode
Step 6: gc destroy
Step 7: gc apply
```

The boilerplate project is now created and configured.

## List the live resources

Visualize your current infrastructure with the _list_ command:

```sh
gc list --graph
```

## Generate the code

```sh
gc gencode
```

The live resources will be fetched and the code generated in _resource.js_.
A diff between the current file and the new one is displayed.

## Resource mind map

Given the target resources defined in _resources.js_, let's generate a mindmap of the target resources by group and type.

```sh
gc tree
```

## Target Graph

The _graph_ command creates a dependency graph of the target resources:

```sh
gc graph
```

## Destroy

Resources can be destroyed in the right order with the _destroy_ command:

```sh
gc destroy
```
