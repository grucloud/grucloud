---
id: GoogleRequirements
title: Google Requirements
---

## Gcloud

Ensure **gcloud** is installed:

```
$ gcloud -v
Google Cloud SDK 288.0.0
bq 2.0.56
core 2020.04.03
gsutil 4.49

```

## Initialise gcloud

Initialise gcloud in order to authenticate your user, as well and seting default region and zone:

```sh
gcloud init
```

Check the config at any time with:

```sh
gcloud config list
```

## Project Id

Create a new project and retrieve the project id
by visiting [google cloud console](https://console.cloud.google.com/home/dashboard)

Check your projects with:

```sh
gcloud projects list
```

## Enable Google API

Ensure these API are enabled for your newly created project:

- [Google Engine API](https://console.cloud.google.com/apis/library/compute.googleapis.com)
- [Service Usage API](https://console.cloud.google.com/apis/library/serviceusage.googleapis.com)
- [Cloud Resource Manager](https://console.developers.google.com/apis/library/cloudresourcemanager.googleapis.com)
- [IAM](https://console.developers.google.com/apis/library/iam.googleapis.com)

Get the list of all API [here](https://console.cloud.google.com/apis/library)

## Service Account

Create a [service account](https://console.cloud.google.com/iam-admin/serviceaccounts) and download the credential file.

Active the service account:

    gcloud auth activate-service-account --key-file=/replace/with/your/credential1118fd0337b2.json
    gcloud auth list
    gcloud config set account accountname@yourproject.iam.gserviceaccount.com

## SSH keys

```sh
gcloud compute os-login ssh-keys list
```

Upload your ssh keys:

```sh
gcloud compute os-login ssh-keys add --key-file .ssh/id_rsa.pub
```

Describe a key

```sh
gcloud compute os-login ssh-keys describe --key=ad1811081881c04dad627f96b5d20ddd41fd44e31e76fc259c3e2534f75a190b
```
