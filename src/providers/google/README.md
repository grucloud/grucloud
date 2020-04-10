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

### Service Account

Create a [service account](https://cloud.google.com/iam/docs/creating-managing-service-accounts) and download the credential file.

Edit _.env_ and set the _GOOGLE_APPLICATION_CREDENTIALS_ environment variable.

Active the service account:

    gcloud auth activate-service-account --key-file=/replace/with/your/credential1118fd0337b2.json
    gcloud auth list
    gcloud config set account accountname@yourproject.iam.gserviceaccount.com

## Setup authentication key

Get the authentication token:

    gcloud auth print-access-token
    gcloud auth print-identity-token ???

Edit _.env_ and set _GOOGLE_SERVICE_ACCOUNT_KEY_ to the previous key.

## Useful commands

    gcloud info
    gcloud init
    gcloud config list
    gcloud config configurations list
    gcloud compute instances list
    gcloud compute images list

## gurl

Add the _gcurl_ alias to your _.zshrc_:

    alias gcurl='curl --header "Authorization: Bearer \$(gcloud auth print-access-token)"'

Then use it to retrieve resources:

    gcurl https://compute.googleapis.com/compute/v1/projects/<yourproject>/regions/europe-west4/addresses/

## Useful Links

- https://googleapis.dev/nodejs/compute/latest/Address.html
- https://github.com/googleapis/nodejs-compute
- https://cloud.google.com/compute/docs/reference/rest/v1/addresses
- https://cloud.google.com/run/docs/authenticating/developers
