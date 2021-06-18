# Deploying a server on OVH with GruCloud

The purpose of this example is to deploy automatically a server on the OVH Cloud provider

![diagram-target](diagram-target.svg)

The infrastructure is described in [iac.js](./iac.js), and configured in [config.js](./config.js).

## Requirements

### OVH

Ensure access to the [OVH public cloud portal](https://www.ovh.com/manager/public-cloud)

Create a [new user for horizon](https://docs.ovh.com/gb/en/public-cloud/configure_user_access_to_horizon/)

Create or edit **default.env** and set the correct values:

```sh
OS_REGION_NAME=UK1
OS_AUTH_URL=https://auth.cloud.ovh.net/v3
OS_PROJECT_ID=
OS_PROJECT_NAME=
OS_USERNAME=
OS_PASSWORD=
```

> See [OvhRequirements](./OvhRequirements.md) to retrieve these informations

### GruCloud

Ensure _node_ is installed:

```sh
node --version
```

Install the GruCloud CLI globally:

```sh
npm i @grucloud/core -g
```

Check if **gc** is installed correctly:

```sh
gc --version
```

The _info_ commands show some information about installation:

```sh
gc info
```

```txt
  - provider:
      name: openstack
      type: openstack
    stage: dev
    username: user-TxqcQTaZsAnB
```

Let's install the npm dependencies such as the [@grucloud/provider-openstack](https://www.npmjs.com/package/@grucloud/provider-openstack)

```sh
npm i
```

## Workflow

### Target Diagram

Based on the infrastructure code [iac.js](./iac.js), GruCloud is able to create a diagram of the target resources showing their dependencies.

```sh
gc graph
```

### List

```sh
gc list --all
```
