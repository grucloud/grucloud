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

Initialise gcloud in order to authenticate your user, as well and setting the default region and zone:

```sh
gcloud init
```

Check the config at any time with:

```sh
gcloud config list
```

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
