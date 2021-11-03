This tutorial explains the code generation from a live infrastructure.
Instead of manually coding the infrastructure, GruCloud automatically creates the infrastructure as code.

## Requirements

The following chart explains the AWS requirements:

- AWS Account
- AWS CLI
- Access and Secret Key
- Configure the AWS CLI

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

### Configure AWS CLI

Configure the account with the previously obtained **AWSAccessKeyId** and **AWSSecretKey**, as well as the region, for instance `us-east-1`

```
aws configure
```

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

The _new_ command guides you on how to create a new project.

```sh
gc new
```

```txt
? Cloud Provider › - Use arrow-keys. Return to submit.
❯   AWS - Amazon Web Service
    Azure
    GCP
```

Choose _AWS_

```txt
✔ Cloud Provider › AWS
? Project's name ›
```

Now choose a name, _ec2-instance_ for instance.

```txt
New aws project created in /Users/joe/test/ec2-instance
What to do next ?
Step 1: cd /Users/joe/test/ec2-instance
Step 2: npm run list
Step 3: npm run gencode
```

The code generated is written to _resource.js_ and ready to be commited to a source code repository.
