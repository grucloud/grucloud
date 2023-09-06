---
id: Introduction
title: Introduction
---

## What is GruCloud ?

GruCloud is a tool for Cloud Solution Architect and DevOps people which allows them to describe and manage cloud infrastructures as Javascript code.

![grucloud-usecase](https://raw.githubusercontent.com/grucloud/grucloud/main/docusaurus/plantuml/gc-usecase.svg)

Do you need to create virtual machines, object storage for websites, maintain DNS records, handle SSL certificates, or manage Kubernetes clusters? GruCloud lets you describe and configure these resources with simple Javascript code. The GruCloud CLI interprets this description, connects to the various cloud provider API, and decides what to create, update and destroy.

> A key feature is the ability to generate automatically the target code from the live infrastructure.

![target-live-infra.dot.svg](https://raw.githubusercontent.com/grucloud/grucloud/main/docusaurus/plantuml/target-live-infra.dot.svg)

The next flowchart describes how to use the GruCloud CLI `gc` to manage your infrastructure:

![gc-workflow](https://raw.githubusercontent.com/grucloud/grucloud/main/docusaurus/plantuml/gc-workflow.svg)

## Getting Started

- [AWS Getting Started](./Providers/AWS/AwsGettingStarted.md)
- [Google Cloud Getting Started](./Providers/Google/GoogleGettingStarted.md)
- [Microsoft Azure Getting Started](./Providers/Azure/AzureGettingStarted.md)
- [Kubernetes Getting Started](./Providers/Kubernetes/K8sGettingStarted.md)

## Resources List

- [AWS Resources](./Providers/AWS/Resources/AwsResources.md)
- [Google Cloud Resources](./Providers/Google/Resources/GcpResources.md)
- [Microsoft Azure Resources](./Providers/Azure/Resources/AzureResources.md)
- [Kubernetes Resources](./Providers/Kubernetes/Resources/K8sResources.md)

## Links

- [Comparison between GruCloud, Terraform and AWS CDK](./GruCloudComparison.md)
