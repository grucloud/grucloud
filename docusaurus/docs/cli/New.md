---
id: New
title: New Project
---

The **new** commands create an empty project for AWS, Azure and GCP.

## Command Options

```
gc help new
```

```
Usage: gc new [options]

Create a new project

Options:
  -h, --help  display help for command
```

## Providers

### AWS

![gc-new-aws](https://raw.githubusercontent.com/grucloud/grucloud/main/docusaurus/plantuml/gc-new-aws.svg)

### Azure

![gc-new-azure](https://raw.githubusercontent.com/grucloud/grucloud/main/docusaurus/plantuml/gc-new-azure.svg)

### Google

![gc-new-google](https://raw.githubusercontent.com/grucloud/grucloud/main/docusaurus/plantuml/gc-new-google.svg)

Example of the CLI output:

```txt
✔ Cloud Provider › GCP
✔ Project's name … mygcp
✓ gcloud version
✓ gcloud auth list
✓ gcloud config get-value project
✓ gcloud projects list
✔ Select the project Id › grucloud-test
✓ gcloud config set project grucloud-test
✓ gcloud config get-value compute/region
✓ gcloud compute regions list
✔ Select the region › southamerica-east1
✓ gcloud config set compute/region southamerica-east1
✓ gcloud config get-value compute/zone
✓ gcloud compute zones list
✔ Select the zone › southamerica-east1-b
✓ gcloud config set compute/zone southamerica-east1-b
cd /Users/joe/test/mygcp
npm install
```
