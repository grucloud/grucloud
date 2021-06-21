# OpenStack inventory with GruCloud

The purpose of this project is to fetch the live inventory of an OpenStack infrastruture such as _OVH_ or _RedHat_

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

## List the inventory

Run the following command to retrieve the live inventory:

```sh
gc list --graph --default-exclude --all --json gc-list.json
```

For instance, here is an example of a server running inside a private network, with an extra disk attached to it:

![diagram-live](diagram-live.svg)

The inventory file is written to `gc-list.json` and will be used by `openstack2gcp`, a tool to generate the GCP infrastructure code from an OpenStack deployment.
