---
id: GoogleGettingStarted
title: GCP Getting Started
---

## Objective

Let's automatically generate the infrastructure code of resources living on the Google Cloud Platform.

## Requirements

### GCP Account

Access to the [GCP console](https://console.cloud.google.com/home/dashboard) is required to run this tutorial.

### gcloud

Ensure the GCP CLI called [gcloud](https://cloud.google.com/sdk/docs/install) is installed:

```sh
$ gcloud -v
```

```txt
Google Cloud SDK 318.0.0
beta 2020.11.06
bq 2.0.62
core 2020.11.06
gsutil 4.54
```

### Initialise gcloud

Initialize _gcloud_ in order to authenticate your user, as well and setting the default region and zone:

```sh
gcloud init
```

Check the config at any time with:

```sh
gcloud config list
```

### Node.js

GruCloud is written in Javascript running on [Node.js](https://nodejs.org)

Verify the presence of _node_ and check the version:

```sh
node --version
```

Any version above 14 should be fine.

### GruCloud CLI

The GruCloud CLI called `gc` can be installed globally with NPM:

```sh
npm i -g @grucloud/core
```

As a sanity check, display the version with:

```sh
gc --version
```

That's all for these requirements.

### Create new project

```sh
gc new
```

Select GCP and choose a project.

## Initialisation

A few actions need to be performed prior to deploying the resources.

- Create the project
- Setup billing for that project
- Enable the API services
- Create a service account
- Create and save the credential file for this service account
- Update the IAM policy by binding roles to the service account

Don't worry, these preparations steps are fully automated:

```sh
gc init
```

### Code Generation

Here we assume some resources are already deployed.

```sh
gc gencode
```

This command fetches the resources inventory and generated the code in _resource.js_.

Congratulation, the infrastructure code has been created automatically.

### Destroy

To destroy the infrastructure, use the _destroy_ command:

```sh
gc destroy
```

## Next Steps

- Browse the various [examples](https://github.com/grucloud/grucloud/tree/main/examples/google) which helps to find out how to use this software.

- Available [GCP Resources](https://grucloud.com/docs/Introduction)
