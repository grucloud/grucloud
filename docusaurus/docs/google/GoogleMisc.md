---
id: GoogleMisc
title: Miscellaneous
---

## Useful commands

    gcloud info
    gcloud init
    gcloud config list
    gcloud config configurations list
    gcloud compute instances list
    gcloud compute images list
    gcloud compute addresses list
    gcloud compute addresses delete ip-webserver  --region us-central1

## gurl

Add the _gcurl_ alias to your _.zshrc_:

    alias gcurl='curl --header "Authorization: Bearer \$(gcloud auth print-access-token)"'

Then use it to retrieve resources:

    gcurl https://compute.googleapis.com/compute/v1/projects/<yourproject>/regions/europe-west4/addresses/

## Useful Links

- https://github.com/googleapis/nodejs-compute
- https://cloud.google.com/compute/docs/reference/rest/v1/addresses
- https://cloud.google.com/run/docs/authenticating/developers
- https://googleapis.dev/nodejs/compute/latest/Address.html
