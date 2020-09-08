---
id: AwsRequirements
title: Requirements
---

Ensure that you have the AWS necessary tools, accounts, keys, etc...

## AWS account

Ensure access to the [amazon cloud console](https://console.aws.amazon.com) and create an account if necessary.

## AWS CLI

Ensure the _AWS CLI_ is installed and configured:

```sh
aws --version
```

If not, visit https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2-mac.html

## Access Key

Visit the [security credentials](https://console.aws.amazon.com/iam/home#/security_credentials)

- Click on **Access key (access key ID and secret access key).**
- Click on the button **Create New Access Key**.

Write down the **AWSAccessKeyId** and **AWSSecretKey**

## Configure AWS CLI

Configure the account, region and zone:

```
aws configure
```

## Key Pair

Let's create an ssh key pair to access the server.

Some key pairs may already have been created, here is how to list all existing key pairs:

```bash
aws ec2 describe-key-pairs
```

If you need to create a new key pair, go to the [AWS documentation for ec2 key pair](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html)
