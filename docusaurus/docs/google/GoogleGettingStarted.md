---
id: GoogleGettingStarted
title: Getting Started
---

# Deployment on Google Cloud

Make sure _gcloud_ is installed:

```
$ gcloud -v
Google Cloud SDK 288.0.0
bq 2.0.56
core 2020.04.03
gsutil 4.49

```

Go the [google cloud console](https://console.cloud.google.com/home/dashboard)

- Create a new project and retrieve the project id

- Enable the Google Engine API

## Service Account

Create a [service account](https://cloud.google.com/iam/docs/creating-managing-service-accounts) and download the credential file.

Edit _.env_ and set the _GOOGLE_APPLICATION_CREDENTIALS_ environment variable.

Active the service account:

    gcloud auth activate-service-account --key-file=/replace/with/your/credential1118fd0337b2.json
    gcloud auth list
    gcloud config set account accountname@yourproject.iam.gserviceaccount.com
