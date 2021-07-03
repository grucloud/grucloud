---
id: GoogleGettingStarted
title: GCP Getting Started
---

## Objective

Let's automate the deployment of a virtual machine on GCP, the Google Cloud Platform.

This basic infrastructure is going to be described and configured in Javascript with the GruCloud GCP provider, distributed as the NPM package [@grucloud/provider-google](https://www.npmjs.com/package/@grucloud/provider-google)

This diagram represents the target resources that will be deployed:

![graph-target-gpc-vm](https://raw.githubusercontent.com/grucloud/grucloud/main/examples/google/vm-simple/diagram-target.svg)

> The diagram is generated with `gc graph`

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

### SSH keys

The section describes how to manage SSH keys to access the virtual machine.

First of all, let's list the SSH keys that may have been already created:

```sh
gcloud compute os-login ssh-keys list
```

Describe a specific key with:

```sh
gcloud compute os-login ssh-keys describe --key=ad1811081881c04dad627f96b5d20ddd41fd44e31e76fc259c3e2534f75a190b
```

Let's create a new SSH key pair for this project and call it for instance `gcp-vm_rsa`

```sh
ssh-keygen -t rsa
```

Upload your ssh keys:

```sh
gcloud compute os-login ssh-keys add --key-file gcp-vm_rsa.pub
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

## Code Architecture

The infrastructure will be configured and described as Javascript code, defined in the following file

- [package.json](https://github.com/grucloud/grucloud/blob/main/examples/google/vm-simple/package.json): contains the project dependencies.
- [config.js](https://github.com/grucloud/grucloud/blob/main/examples/google/vm-simple/config.js): the configuration function.
- [iac.js](https://github.com/grucloud/grucloud/blob/main/examples/google/vm-simple/iac.js): the infrastructure as code
- [hook.js](https://github.com/grucloud/grucloud/blob/main/examples/google/vm-simple/hook.js): user defined function executed after deployment or destruction.

The next sections show how to create a new project from scratch.

> FYI, the [source code](https://github.com/grucloud/grucloud/blob/main/examples/google/vm-simple) for this example.

First of all, create a new folder called for instance `vm-simple` and `cd` to it.

```sh
mkdir vm-simple
cd vm-simple
```

### package.json

The _package.json_ file is usually created with:

```sh
npm init
```

The project depends on libraries distributed on NPM. For this example targeting GCP, install [@grucloud/provider-google](https://www.npmjs.com/package/@grucloud/provider-google) and `@grucloud/core`

```
npm install @grucloud/core @grucloud/provider-google
```

### config.js

The configuration is defined in [config.js](https://github.com/grucloud/grucloud/blob/main/examples/google/vm-simple/config.js)

```js
// config.js
module.exports = ({ stage }) => ({
  projectId: "vm-tuto1-must-be-globally-unique",
  vm: {
    name: "web-server",
    properties: {
      diskSizeGb: "20",
      machineType: "f1-micro",
      sourceImage:
        "projects/ubuntu-os-cloud/global/images/family/ubuntu-2004-lts",
      metadata: {
        items: [
          {
            key: "enable-oslogin",
            value: "True",
          },
        ],
      },
    },
  },
});
```

#### Project Name and Id

Set the `projectId` and eventually ther `projectName`.

GruCloud will take care of creating the project if necessary.

#### stage

The `stage` parameter by default is `dev`. It could be any value such as `production`, `uat`, or any other stages of your deployment.

Notice how the `projectName` could be prefixed or suffixed with stage. Or the `machineType` could be a function of the `stage`, hence allowing to use cheaper machines for a specific stage.

#### Machine name

Feel free to choose a machine name, in this case _web-server_. Right now it is a static string but could be a function of the stage, or some function could be applied to enforce a style: camelCase, snake-case, PascalCase, or whatever what the requirements are.

#### machineType

The list of available _machineType_ for a given region is just a command away:

```
gcloud compute machine-types list --filter="zone:( southamerica-east1 )"
```

Choosing the right type of machine for your workload is out of scope for this tutorial.

#### sourceImage

The Operating System to boot on the machine is set with the `sourceImage` field.
How to find out the value of this field ? Start list the available images:

```sh
gcloud compute images list
```

The list is long so only the first lines are displayed.

```txt
NAME                                                  PROJECT              FAMILY                            DEPRECATED  STATUS
centos-7-v20210420                                    centos-cloud         centos-7                                      READY
centos-8-v20210420                                    centos-cloud         centos-8                                      READY
ubuntu-2004-focal-v20210429                           ubuntu-os-cloud      ubuntu-2004-lts                               READY
```

The current value for `sourceImage` is `projects/ubuntu-os-cloud/global/images/family/ubuntu-2004-lts`.
Hence, to use the lastest _centos_, the sourceImage should be: `projects/centos-cloud/global/images/family/centos-8`, isn'it ?

#### enable-oslogin

The `enable-oslogin` key in the `metadata` section tells GCP that the machine will be accesible though a method called [OS Login](https://cloud.google.com/compute/docs/instances/managing-instance-access). It is an alternative way of provisioning SSH access to your machine, without worrying about SSH keys sitting on your local computer that could vanished any time.

### iac.js

Now it is time to create the infrastructure **iac.js** file that describes the architecture:

```js
// iac.js
const { GoogleProvider } = require("@grucloud/provider-google");

const createResources = async ({ provider }) => {
  const { config } = provider;
  const server = await provider.compute.makeVmInstance({
    name: config.vm.name,
    properties: () => config.vm.properties,
  });

  return {
    server,
  };
};

exports.createStack = async ({ config, stage }) => {
  const provider = GoogleProvider({ config, stage });
  const resources = await createResources({ provider });

  return {
    provider,
    resources,
  };
};
```

This file must export the `createStack` at least, this function instantiate the provider, in this case the `GoogleProvider`.
The helper function `createResources` creates the resources for this provider and return an object with the resources created.
The last part is to return an object from `createStack` containing the provider and the resources created from this provider.

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

What to expect now? The next sections explains how to use some _gcloud_ command to verify what has been created during the _init_ command.

### Project

In the GCP world, resources are grouped into a [project](https://cloud.google.com/resource-manager/docs/creating-managing-projects), which are defined by `projectName` and `projectId` in the config file.

Let's verify the project has been created:

```sh
gcloud projects list
```

```txt
PROJECT_ID                      NAME                   PROJECT_NUMBER
vm-tuto                         vm-tuto                623960601462
```

Perfect, the project has been created automatically based on our config.

### API Services

The `init` command takes care of enabling the minimum set of API services:

- cloudbilling.googleapis.com
- cloudresourcemanager.googleapis.com
- iam.googleapis.com
- serviceusage.googleapis.com

Let's check all the services in the _enabled_ state:

```sh
gcloud services list --enabled
```

```txt
NAME                                 TITLE
bigquery.googleapis.com              BigQuery API
bigquerystorage.googleapis.com       BigQuery Storage API
cloudbilling.googleapis.com          Cloud Billing API
clouddebugger.googleapis.com         Cloud Debugger API
cloudresourcemanager.googleapis.com  Cloud Resource Manager API
cloudtrace.googleapis.com            Cloud Trace API
compute.googleapis.com               Compute Engine API
datastore.googleapis.com             Cloud Datastore API
dns.googleapis.com                   Cloud DNS API
domains.googleapis.com               Cloud Domains API
iam.googleapis.com                   Identity and Access Management (IAM) API
iamcredentials.googleapis.com        IAM Service Account Credentials API
logging.googleapis.com               Cloud Logging API
monitoring.googleapis.com            Cloud Monitoring API
networkmanagement.googleapis.com     Network Management API
oslogin.googleapis.com               Cloud OS Login API
servicemanagement.googleapis.com     Service Management API
serviceusage.googleapis.com          Service Usage API
sql-component.googleapis.com         Cloud SQL
storage-api.googleapis.com           Google Cloud Storage JSON API
storage-component.googleapis.com     Cloud Storage
storage.googleapis.com               Cloud Storage API
```

### Service Account

A service account called in the form of `grucloud@YouProjecId.iam.gserviceaccount.com` is created and will be used by GruCloud to talk to the GCP API.

Let's retrieve the list of service accounts:

```sh
gcloud iam service-accounts list
```

```txt
DISPLAY NAME              EMAIL                                                    DISABLED
grucloud service account  grucloud@grucloud-test.iam.gserviceaccount.com            False
```

Bingo, the service account has been created successfully.

### Roles Binding

Next, the operation is to bind the following roles to the service account `grucloud@vm-tuto1.iam.gserviceaccount.com`

- iam.serviceAccountAdmin
- compute.admin
- storage.admin
- storage.objectAdmin
- dns.admin
- editor
- resourcemanager.projectIamAdmin

Ensure the correct roles are bound to the right service account for a given project, here `vm-tuto1`

```sh
gcloud projects get-iam-policy  vm-tuto1
```

```txt
bindings:
- members:
  - serviceAccount:grucloud@vm-tuto1.iam.gserviceaccount.com
  role: roles/compute.admin
- members:
  - serviceAccount:service-571739547473@compute-system.iam.gserviceaccount.com
  role: roles/compute.serviceAgent
- members:
  - serviceAccount:grucloud@vm-tuto1.iam.gserviceaccount.com
  role: roles/dns.admin
- members:
  - serviceAccount:571739547473-compute@developer.gserviceaccount.com
  - serviceAccount:571739547473@cloudservices.gserviceaccount.com
  - serviceAccount:grucloud@vm-tuto1.iam.gserviceaccount.com
  role: roles/editor
- members:
  - serviceAccount:grucloud@vm-tuto1.iam.gserviceaccount.com
  role: roles/iam.serviceAccountAdmin
- members:
  - user:frederic.heem@gmail.com
  role: roles/owner
- members:
  - serviceAccount:grucloud@vm-tuto1.iam.gserviceaccount.com
  role: roles/resourcemanager.projectIamAdmin
- members:
  - serviceAccount:grucloud@vm-tuto1.iam.gserviceaccount.com
  role: roles/storage.admin
- members:
  - serviceAccount:grucloud@vm-tuto1.iam.gserviceaccount.com
  role: roles/storage.objectAdmin
etag: BwXBNb1KkZg=
version: 1
```

As expected, the roles are bounded to our service account.

### Credential file

A credential file is generated and will be stored at `/Users/yourusername/.config/gcloud/YourProjectId.json`

For your information, here what it looks like:

```
{
  "type": "service_account",
  "project_id": "vm-tuto1",
  "private_key_id": "112233445566aabb00d4e4071478a7ca74c",
  "private_key": "-----BEGIN PRIVATE KEY-----\nTHE PRIVATE KEY HERE\n-----END PRIVATE KEY-----\n",
  "client_email": "grucloud@vm-tuto1.iam.gserviceaccount.com",
  "client_id": "123456789858242482",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/grucloud%40vm-tuto1.iam.gserviceaccount.com"
}
```

Ensure to protect the content of this file as it contains sensitive information such as the private key to access the GCP account, and can potentially deploy some costly resources.

**gc** requires this credential file to connect to the GCP API.

### Info

The `info` provides useful information about the project and its configuration:

```sh
gc info
```

```txt
  - provider:
      name: google
      type: google
    projectId: vm-tuto1
    projectName: vm-tuto1
    applicationCredentialsFile: /Users/yourusername/.config/gcloud/vm-tuto1.json
    serviceAccountName: grucloud
    hasGCloud: true
    config:
      vm:
        name: web-server
        properties:
          diskSizeGb: 20
          machineType: f1-micro
          sourceImage: projects/ubuntu-os-cloud/global/images/family/ubuntu-2004-lts
          metadata:
            items:
              - key: enable-oslogin
                value: True
      managedByTag: -managed-by-gru
      managedByKey: managed-by
      managedByValue: grucloud
      region: southamerica-east1
      zone: southamerica-east1-b

Command "gc info" executed in 1s
```

At this stage, the system is ready for deployment.

## CLI Workflow

The infrastructure can be managed with a bunch of commands:

- `gc plan`
- `gc apply`
- `gc list`
- `gc destroy`

### Plan

Find out which resources are going to be created, modified or destroyed with the [plan](https://www.grucloud.com/docs/cli/PlanQuery) command.
No change wuill be made, it is an informative command which queries the GCP API for all the supported resources, compare these lives resources with the resources that shoudl be deployed, as defined in the code.

```sh
gc plan
```

```txt
Querying resources on 1 provider: google
✓ google
  ✓ Initialising
  ✓ Listing 6/6
  ✓ Querying
    ✓ VmInstance 1/1
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 VmInstance from google                                                                     │
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────────────────────────┐  │
│ │ CREATE: web-server                                                                      │  │
│ ├─────────────────────────────────────────────────────────────────────────────────────────┤  │
│ │ kind: compute#instance                                                                  │  │
│ │ name: web-server                                                                        │  │
│ │ zone: https://www.googleapis.com/compute/v1/projects/vm-tuto1/zones/southamerica-east1… │  │
│ │ machineType: https://www.googleapis.com/compute/v1/projects/vm-tuto1/zones/southameric… │  │
│ │ labels:                                                                                 │  │
│ │   managed-by: grucloud                                                                  │  │
│ │   stage: dev                                                                            │  │
│ │ metadata:                                                                               │  │
│ │   items:                                                                                │  │
│ │     - key: enable-oslogin                                                               │  │
│ │       value: True                                                                       │  │
│ │   kind: compute#metadata                                                                │  │
│ │ disks:                                                                                  │  │
│ │   - kind: compute#attachedDisk                                                          │  │
│ │     type: PERSISTENT                                                                    │  │
│ │     boot: true                                                                          │  │
│ │     mode: READ_WRITE                                                                    │  │
│ │     autoDelete: true                                                                    │  │
│ │     deviceName: web-server-managed-by-gru                                               │  │
│ │     initializeParams:                                                                   │  │
│ │       sourceImage: projects/ubuntu-os-cloud/global/images/family/ubuntu-2004-lts        │  │
│ │       diskType: projects/vm-tuto1/zones/southamerica-east1-b/diskTypes/pd-standard      │  │
│ │       diskSizeGb: 20                                                                    │  │
│ │     diskEncryptionKey:                                                                  │  │
│ │ networkInterfaces:                                                                      │  │
│ │   - kind: compute#networkInterface                                                      │  │
│ │     subnetwork: projects/vm-tuto1/regions/southamerica-east1/subnetworks/default        │  │
│ │     accessConfigs:                                                                      │  │
│ │       - kind: compute#accessConfig                                                      │  │
│ │         name: External NAT                                                              │  │
│ │         type: ONE_TO_ONE_NAT                                                            │  │
│ │         networkTier: PREMIUM                                                            │  │
│ │     aliasIpRanges: []                                                                   │  │
│ │ displayDevice:                                                                          │  │
│ │   enableDisplay: false                                                                  │  │
│ │ canIpForward: false                                                                     │  │
│ │ scheduling:                                                                             │  │
│ │   preemptible: false                                                                    │  │
│ │   onHostMaintenance: MIGRATE                                                            │  │
│ │   automaticRestart: true                                                                │  │
│ │   nodeAffinities: []                                                                    │  │
│ │ deletionProtection: false                                                               │  │
│ │ reservationAffinity:                                                                    │  │
│ │   consumeReservationType: ANY_RESERVATION                                               │  │
│ │ shieldedInstanceConfig:                                                                 │  │
│ │   enableSecureBoot: false                                                               │  │
│ │   enableVtpm: true                                                                      │  │
│ │   enableIntegrityMonitoring: true                                                       │  │
│ │ confidentialInstanceConfig:                                                             │  │
│ │   enableConfidentialCompute: false                                                      │  │
│ │                                                                                         │  │
│ └─────────────────────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────────────────────┘


┌───────────────────────────────────────────────────────────────────────────────────────┐
│ Plan summary for provider google                                                      │
├───────────────────────────────────────────────────────────────────────────────────────┤
│ DEPLOY RESOURCES                                                                      │
├────────────────────┬──────────────────────────────────────────────────────────────────┤
│ VmInstance         │ web-server                                                       │
└────────────────────┴──────────────────────────────────────────────────────────────────┘
1 resource to deploy on 1 provider
Command "gc plan" executed in 6s
```

Have the opportunity to review the change that will be applied next.

### Deploy

Happy with the expected plan? Deploy it now with the [apply](https://www.grucloud.com/docs/cli/PlanApply) command:

```sh
gc apply
```

```txt
Querying resources on 1 provider: google
✓ google
  ✓ Initialising
  ✓ Listing 6/6
  ✓ Querying
    ✓ VmInstance 1/1
┌───────────────────────────────────────────────────────────────────────────────────────┐
│ Plan summary for provider google                                                      │
├───────────────────────────────────────────────────────────────────────────────────────┤
│ DEPLOY RESOURCES                                                                      │
├────────────────────┬──────────────────────────────────────────────────────────────────┤
│ VmInstance         │ web-server                                                       │
└────────────────────┴──────────────────────────────────────────────────────────────────┘
Deploying resources on 1 provider: google
✓ google
  ✓ Initialising
  ✓ Deploying
    ✓ VmInstance 1/1
1 resource deployed of 1 type and 1 provider
Running OnDeployedGlobal resources on 1 provider: google
Command "gc a -f" executed in 29s

```

Congratulations! Your first cloud resource deployed automativally with GruCloud.

As always, trust but verify, the newly created server should be accessible through SSH:

```sh
gcloud compute ssh web-server --project vm-tuto1
```

Mission accomplished! The server is installed, up and running.

Triple check the instance is running on the [gcp compute console](https://console.cloud.google.com/compute/instances)

Not convinced ? Try with _gcloud_:

```sh
gcloud compute instances list --project vm-tuto1
```

```txt
NAME        ZONE                  MACHINE_TYPE  PREEMPTIBLE  INTERNAL_IP  EXTERNAL_IP   STATUS
web-server  southamerica-east1-b  f1-micro                   10.158.0.4   35.198.52.62  RUNNING
```

Does the machine responds our ping request ?

```
ping 35.198.52.62
```

```txt
PING 35.198.52.62 (35.198.52.62): 56 data bytes
64 bytes from 35.198.52.62: icmp_seq=0 ttl=59 time=176.973 ms
64 bytes from 35.198.52.62: icmp_seq=1 ttl=59 time=180.442 ms
64 bytes from 35.198.52.62: icmp_seq=2 ttl=59 time=183.338 ms
```

No firewall is blocking our ping request.

### List

The command queries the GCP API and lists the available resources. It gives an overall view of the resources under the current project.

The `--graph` options generate a diagram of the live resources, showing their dependencies.

```sh
gc list --graph
```

```
[...TRUNCATED]
List Summary:
Provider: google
┌───────────────────────────────────────────────────────────────────────┐
│ google                                                                │
├────────────────────┬──────────────────────────────────────────────────┤
│ Network            │ default                                          │
├────────────────────┼──────────────────────────────────────────────────┤
│ Firewall           │ default-allow-icmp                               │
│                    │ default-allow-internal                           │
│                    │ default-allow-rdp                                │
│                    │ default-allow-ssh                                │
├────────────────────┼──────────────────────────────────────────────────┤
│ SubNetwork         │ default                                          │
├────────────────────┼──────────────────────────────────────────────────┤
│ ServiceAccount     │ 571739547473-compute                             │
│                    │ grucloud                                         │
├────────────────────┼──────────────────────────────────────────────────┤
│ VmInstance         │ web-server                                       │
└────────────────────┴──────────────────────────────────────────────────┘
9 resources, 5 types, 1 provider
Command "gc l" executed in 12s
```

![graph-live-gcp-vm](https://raw.githubusercontent.com/grucloud/grucloud/main/examples/google/vm-simple/diagram-live.svg)

Notice the default `Network`, `Subnet`, and 4 `Firewall` rules.

There are many options to the _list command_, for instance, list only the resources created by GruCloud

```sh
gc list --our
```

Would you like to display only the virtual machines?

```sh
gc l -t VmInstance
```

```txt
Listing resources on 1 provider: google
✓ google
  ✓ Initialising
  ✓ Listing 6/6
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 VmInstance from google                                                                                            │
├────────────┬─────────────────────────────────────────────────────────────────────────────────────────────────┬──────┤
│ Name       │ Data                                                                                            │ Our  │
├────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────┼──────┤
│ web-server │ id: 8015745025887516797                                                                         │ Yes  │
│            │ creationTimestamp: 2021-04-30T15:37:06.858-07:00                                                │      │
│            │ name: web-server                                                                                │      │
│            │ tags:                                                                                           │      │
│            │   fingerprint: 42WmSpB8rSM=                                                                     │      │
│            │ machineType: https://www.googleapis.com/compute/v1/projects/vm-tuto1/zones/southamerica-east1-… │      │
│            │ status: RUNNING                                                                                 │      │
│            │ zone: https://www.googleapis.com/compute/v1/projects/vm-tuto1/zones/southamerica-east1-b        │      │
│            │ canIpForward: false                                                                             │      │
│            │ networkInterfaces:                                                                              │      │
│            │   - network: https://www.googleapis.com/compute/v1/projects/vm-tuto1/global/networks/default    │      │
│            │     subnetwork: https://www.googleapis.com/compute/v1/projects/vm-tuto1/regions/southamerica-e… │      │
│            │     networkIP: 10.158.0.4                                                                       │      │
│            │     name: nic0                                                                                  │      │
│            │     accessConfigs:                                                                              │      │
│            │       - type: ONE_TO_ONE_NAT                                                                    │      │
│            │         name: External NAT                                                                      │      │
│            │         natIP: 35.198.52.62                                                                     │      │
│            │         networkTier: PREMIUM                                                                    │      │
│            │         kind: compute#accessConfig                                                              │      │
│            │     fingerprint: vFCpWqyPPis=                                                                   │      │
│            │     kind: compute#networkInterface                                                              │      │
│            │ disks:                                                                                          │      │
│            │   - type: PERSISTENT                                                                            │      │
│            │     mode: READ_WRITE                                                                            │      │
│            │     source: https://www.googleapis.com/compute/v1/projects/vm-tuto1/zones/southamerica-east1-b… │      │
│            │     deviceName: web-server-managed-by-gru                                                       │      │
│            │     index: 0                                                                                    │      │
│            │     boot: true                                                                                  │      │
│            │     autoDelete: true                                                                            │      │
│            │     licenses:                                                                                   │      │
│            │       - "https://www.googleapis.com/compute/v1/projects/ubuntu-os-cloud/global/licenses/ubuntu… │      │
│            │     interface: SCSI                                                                             │      │
│            │     guestOsFeatures:                                                                            │      │
│            │       - type: VIRTIO_SCSI_MULTIQUEUE                                                            │      │
│            │       - type: SEV_CAPABLE                                                                       │      │
│            │       - type: UEFI_COMPATIBLE                                                                   │      │
│            │     diskSizeGb: 20                                                                              │      │
│            │     kind: compute#attachedDisk                                                                  │      │
│            │ metadata:                                                                                       │      │
│            │   fingerprint: xJ9rqloLGTU=                                                                     │      │
│            │   items:                                                                                        │      │
│            │     - key: enable-oslogin                                                                       │      │
│            │       value: True                                                                               │      │
│            │   kind: compute#metadata                                                                        │      │
│            │ selfLink: https://www.googleapis.com/compute/v1/projects/vm-tuto1/zones/southamerica-east1-b/i… │      │
│            │ scheduling:                                                                                     │      │
│            │   onHostMaintenance: MIGRATE                                                                    │      │
│            │   automaticRestart: true                                                                        │      │
│            │   preemptible: false                                                                            │      │
│            │ cpuPlatform: Intel Broadwell                                                                    │      │
│            │ labels:                                                                                         │      │
│            │   managed-by: grucloud                                                                          │      │
│            │   stage: dev                                                                                    │      │
│            │ labelFingerprint: 2XCNew8FA10=                                                                  │      │
│            │ startRestricted: false                                                                          │      │
│            │ deletionProtection: false                                                                       │      │
│            │ reservationAffinity:                                                                            │      │
│            │   consumeReservationType: ANY_RESERVATION                                                       │      │
│            │ displayDevice:                                                                                  │      │
│            │   enableDisplay: false                                                                          │      │
│            │ shieldedInstanceConfig:                                                                         │      │
│            │   enableSecureBoot: false                                                                       │      │
│            │   enableVtpm: true                                                                              │      │
│            │   enableIntegrityMonitoring: true                                                               │      │
│            │ shieldedInstanceIntegrityPolicy:                                                                │      │
│            │   updateAutoLearnPolicy: true                                                                   │      │
│            │ confidentialInstanceConfig:                                                                     │      │
│            │   enableConfidentialCompute: false                                                              │      │
│            │ fingerprint: C1buoQdRfn4=                                                                       │      │
│            │ lastStartTimestamp: 2021-04-30T15:37:18.374-07:00                                               │      │
│            │ kind: compute#instance                                                                          │      │
│            │                                                                                                 │      │
└────────────┴─────────────────────────────────────────────────────────────────────────────────────────────────┴──────┘


List Summary:
Provider: google
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ google                                                                                                             │
├────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────────┤
│ VmInstance         │ web-server                                                                                    │
└────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────────┘
1 resource, 5 types, 1 provider
Command "gc l -t VmInstance" executed in 12s
```

> The public address for this machine can be found at the field `networkInterfaces[0].accessConfigs[0].natIP`. Take anote, it will be used later to grab this IP address with the `gc output` command.

Remember the service account created in the `init` phase?

```sh
gc l -t ServiceAccount
```

```txt
Listing resources on 1 provider: google
✓ google
  ✓ Initialising
  ✓ Listing 1/1
┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 2 ServiceAccount from google                                                                        │
├──────────────────────┬───────────────────────────────────────────────────────────────────────┬──────┤
│ Name                 │ Data                                                                  │ Our  │
├──────────────────────┼───────────────────────────────────────────────────────────────────────┼──────┤
│ 571739547473-compute │ name: projects/vm-tuto1/serviceAccounts/571739547473-compute@develop… │ NO   │
│                      │ projectId: vm-tuto1                                                   │      │
│                      │ uniqueId: 100537252433166772587                                       │      │
│                      │ email: 571739547473-compute@developer.gserviceaccount.com             │      │
│                      │ displayName: Compute Engine default service account                   │      │
│                      │ etag: MDEwMjE5MjA=                                                    │      │
│                      │ oauth2ClientId: 100537252433166772587                                 │      │
│                      │ iamPolicy:                                                            │      │
│                      │   etag: ACAB                                                          │      │
│                      │                                                                       │      │
├──────────────────────┼───────────────────────────────────────────────────────────────────────┼──────┤
│ grucloud             │ name: projects/vm-tuto1/serviceAccounts/grucloud@vm-tuto1.iam.gservi… │ NO   │
│                      │ projectId: vm-tuto1                                                   │      │
│                      │ uniqueId: 105136741134058242482                                       │      │
│                      │ email: grucloud@vm-tuto1.iam.gserviceaccount.com                      │      │
│                      │ displayName: grucloud service account                                 │      │
│                      │ etag: MDEwMjE5MjA=                                                    │      │
│                      │ oauth2ClientId: 105136741134058242482                                 │      │
│                      │ iamPolicy:                                                            │      │
│                      │   etag: ACAB                                                          │      │
│                      │                                                                       │      │
└──────────────────────┴───────────────────────────────────────────────────────────────────────┴──────┘


List Summary:
Provider: google
┌────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ google                                                                                             │
├────────────────────┬───────────────────────────────────────────────────────────────────────────────┤
│ ServiceAccount     │ 571739547473-compute                                                          │
│                    │ grucloud                                                                      │
└────────────────────┴───────────────────────────────────────────────────────────────────────────────┘
2 resources, 1 type, 1 provider
Command "gc l -t ServiceAccount" executed in 5s
```

Notice here GCP has created a default service account for the compute engine.

### Update

The machine type selected in the first place may be over-sized or under-sized. Let's modify the `machineType` to `e2-micro`, and execute the `apply` or `plan` command:

```sh
gc plan
```

```txt
Querying resources on 1 provider: google
✓ google
  ✓ Initialising
  ✓ Listing 6/6
  ✓ Querying
    ✓ VmInstance 1/1
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 VmInstance from google                                                                     │
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────────────────────────┐  │
│ │ UPDATE: name: web-server, id: 8693552609646106284                                       │  │
│ ├─────────────────────────────────────────────────────────────────────────────────────────┤  │
│ │ Key: machineType                                                                        │  │
│ ├────────────────────────────────────────────┬────────────────────────────────────────────┤  │
│ │ - f1-micro                                 │ + f2-micro                                 │  │
│ └────────────────────────────────────────────┴────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────────────────────┘


┌───────────────────────────────────────────────────────────────────────────────────────┐
│ Plan summary for provider google                                                      │
├───────────────────────────────────────────────────────────────────────────────────────┤
│ DEPLOY RESOURCES                                                                      │
├────────────────────┬──────────────────────────────────────────────────────────────────┤
│ VmInstance         │ web-server                                                       │
└────────────────────┴──────────────────────────────────────────────────────────────────┘
1 resource to deploy on 1 provider
Command "gc p" executed in 6s

```

A difference between the live server and its desired state has been detected.

### Output

In the previous step, the machine's public IP address was discovered with _gcloud_, then it was manually cut and pasted to infer to ping command.

An alternative way to get the public ip address is with the `gc output` command. Specify a `type`, a `name` and a (nested) field:

```sh
gc output -t VmInstance --name web-server --field 'networkInterfaces[0].accessConfigs[0].natIP'
```

```sh
35.198.52.62
```

Seems to work as expected. Let's combine in one shell command to ping the machine:

```
ping `gc output -t VmInstance --name web-server --field 'networkInterfaces[0].accessConfigs[0].natIP'`
```

### Destroy

When the resources are no longer needed, delete them with the `destroy` command

```sh
gc destroy
```

```txt
Find Deletable resources on 1 provider: google
✓ google
  ✓ Initialising
  ✓ Listing 6/6
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 VmInstance from google                                                                     │
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────────────────────────┐  │
│ │ DESTROY web-server                                                                      │  │
│ ├─────────────────────────────────────────────────────────────────────────────────────────┤  │
│ │ id: 4915621396658280948                                                                 │  │
│ │ creationTimestamp: 2021-05-01T16:41:16.034-07:00                                        │  │
│ │ name: web-server                                                                        │  │
│ │ tags:                                                                                   │  │
│ │   fingerprint: 42WmSpB8rSM=                                                             │  │
│ │ machineType: https://www.googleapis.com/compute/v1/projects/vm-tuto1/zones/southameric… │  │
│ │ status: RUNNING                                                                         │  │
│ │ zone: https://www.googleapis.com/compute/v1/projects/vm-tuto1/zones/southamerica-east1… │  │
│ │ canIpForward: false                                                                     │  │
│ │ networkInterfaces:                                                                      │  │
│ │   - network: https://www.googleapis.com/compute/v1/projects/vm-tuto1/global/networks/d… │  │
│ │     subnetwork: https://www.googleapis.com/compute/v1/projects/vm-tuto1/regions/southa… │  │
│ │     networkIP: 10.158.0.6                                                               │  │
│ │     name: nic0                                                                          │  │
│ │     accessConfigs:                                                                      │  │
│ │       - type: ONE_TO_ONE_NAT                                                            │  │
│ │         name: External NAT                                                              │  │
│ │         natIP: 35.198.52.62                                                             │  │
│ │         networkTier: PREMIUM                                                            │  │
│ │         kind: compute#accessConfig                                                      │  │
│ │     fingerprint: GzKDoyPVgZI=                                                           │  │
│ │     kind: compute#networkInterface                                                      │  │
│ │ disks:                                                                                  │  │
│ │   - type: PERSISTENT                                                                    │  │
│ │     mode: READ_WRITE                                                                    │  │
│ │     source: https://www.googleapis.com/compute/v1/projects/vm-tuto1/zones/southamerica… │  │
│ │     deviceName: web-server-managed-by-gru                                               │  │
│ │     index: 0                                                                            │  │
│ │     boot: true                                                                          │  │
│ │     autoDelete: true                                                                    │  │
│ │     licenses:                                                                           │  │
│ │       - "https://www.googleapis.com/compute/v1/projects/ubuntu-os-cloud/global/license… │  │
│ │     interface: SCSI                                                                     │  │
│ │     guestOsFeatures:                                                                    │  │
│ │       - type: VIRTIO_SCSI_MULTIQUEUE                                                    │  │
│ │       - type: SEV_CAPABLE                                                               │  │
│ │       - type: UEFI_COMPATIBLE                                                           │  │
│ │     diskSizeGb: 20                                                                      │  │
│ │     kind: compute#attachedDisk                                                          │  │
│ │ metadata:                                                                               │  │
│ │   fingerprint: xJ9rqloLGTU=                                                             │  │
│ │   items:                                                                                │  │
│ │     - key: enable-oslogin                                                               │  │
│ │       value: True                                                                       │  │
│ │   kind: compute#metadata                                                                │  │
│ │ selfLink: https://www.googleapis.com/compute/v1/projects/vm-tuto1/zones/southamerica-e… │  │
│ │ scheduling:                                                                             │  │
│ │   onHostMaintenance: MIGRATE                                                            │  │
│ │   automaticRestart: true                                                                │  │
│ │   preemptible: false                                                                    │  │
│ │ cpuPlatform: Intel Broadwell                                                            │  │
│ │ labels:                                                                                 │  │
│ │   managed-by: grucloud                                                                  │  │
│ │   stage: dev                                                                            │  │
│ │ labelFingerprint: 2XCNew8FA10=                                                          │  │
│ │ startRestricted: false                                                                  │  │
│ │ deletionProtection: false                                                               │  │
│ │ reservationAffinity:                                                                    │  │
│ │   consumeReservationType: ANY_RESERVATION                                               │  │
│ │ displayDevice:                                                                          │  │
│ │   enableDisplay: false                                                                  │  │
│ │ shieldedInstanceConfig:                                                                 │  │
│ │   enableSecureBoot: false                                                               │  │
│ │   enableVtpm: true                                                                      │  │
│ │   enableIntegrityMonitoring: true                                                       │  │
│ │ shieldedInstanceIntegrityPolicy:                                                        │  │
│ │   updateAutoLearnPolicy: true                                                           │  │
│ │ confidentialInstanceConfig:                                                             │  │
│ │   enableConfidentialCompute: false                                                      │  │
│ │ fingerprint: Xh4hKPeAOUk=                                                               │  │
│ │ lastStartTimestamp: 2021-05-01T16:41:25.313-07:00                                       │  │
│ │ kind: compute#instance                                                                  │  │
│ │                                                                                         │  │
│ └─────────────────────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────────────────────┘


┌───────────────────────────────────────────────────────────────────────────────────────┐
│ Destroy summary for provider google                                                   │
├────────────────────┬──────────────────────────────────────────────────────────────────┤
│ VmInstance         │ web-server                                                       │
└────────────────────┴──────────────────────────────────────────────────────────────────┘
? Are you sure to destroy 1 resource, 1 type on 1 provider? › (y/N)
Destroying resources on 1 provider: google
✓ google
  ✓ Initialising
  ✓ Destroying
    ✓ VmInstance 1/1
1 resource destroyed, 1 type on 1 provider
Running OnDestroyedGlobal resources on 1 provider: google
Command "gc destroy" executed in 46s
```

If the `destroy` command is executed again, no resources should be destroyed.

Double-check with `gc list --our`.

## Next Steps

- Browse the various [examples](https://github.com/grucloud/grucloud/tree/main/examples/google) which helps to find out how to use this software.

- Available [GCP Resources](https://grucloud.com/docs/Introduction)
