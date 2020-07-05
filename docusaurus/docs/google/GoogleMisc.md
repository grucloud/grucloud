---
id: GoogleMisc
title: Miscellaneous
---

## Useful commands

    gcloud info
    gcloud init
    gcloud config list
    gcloud projects list
    gcloud config configurations list
    gcloud compute instances list
    gcloud compute images list
    gcloud compute addresses list
    gcloud compute addresses delete ip-webserver  --region us-central1
    gcloud compute ssh --zone "europe-west4-a" "web-server" --project "starhackit"
    ssh sa_117372125631104771883@34.91.246.236

## gurl

Add the _gcurl_ alias to your _.zshrc_:

    alias gcurl='curl --header "Authorization: Bearer \$(gcloud auth print-access-token)"'

Then use it to retrieve resources:

    gcurl https://compute.googleapis.com/compute/v1/projects/<yourproject>/regions/europe-west4/addresses/

## Useful Links

- https://cloud.google.com/compute/docs/reference/rest/v1/addresses
- https://cloud.google.com/run/docs/authenticating/developers
