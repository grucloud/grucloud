# GruCloud AWS Nuke

`gc-aws-nuke` is a command line tool to destroy over 800 AWS resources across various regions.

## Requirements

Ensure the following are installed and configured properly:

- [Node.js](https://nodejs.org)
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
- The `aws` CLI must be configured with the [AWS Secret and Access Key](https://console.aws.amazon.com/iam/home#/security_credentials)

## Installation

Install the CLI `gc-aws-nuke` globally:

```sh
npm i -g @grucloud/aws-nuke
```

## Usage

### Default Usage

Run the following command in a terminal:

```sh
gc-aws-nuke
```

### Specify regions

Specify one region:

```sh
gc-aws-nuke --regions us-east-1
```

Specify multiple regions:

```sh
gc-aws-nuke --regions us-east-1 us-west-1
```

### Specify an AWS profile

One can specify an AWS profile to use:

```sh
gc-aws-nuke --profile my-profile
```

### Help

```sh
gc-aws-nuke --help
```

```txt
Usage: gc-aws-nuke [options]

Options:
  -V, --version              output the version number
  -p, --profile <string>     the AWS profile (default: "default")
  -r, --regions <string...>  regions, for instance us-east-1
  -h, --help                 display help for command
```
