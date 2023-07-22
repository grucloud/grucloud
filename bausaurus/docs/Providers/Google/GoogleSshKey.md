---
id: GoogleSshKey
title: GCP SSH Key
---

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
