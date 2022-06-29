---
id: Introduction
title: Introduction
---

# What is GruCloud ?

GruCloud is a tool for Cloud Solution Architect and DevOps people which allows them to describe and manage cloud infrastructures as Javascript code.

![gc-usecase](../plantuml/gc-usecase.svg)

Do you need to create virtual machines, object storage for websites, maintain DNS records, handle SSL certificates, or manage Kubernetes clusters? GruCloud lets you describe and configure these resources with simple Javascript code. The GruCloud CLI interprets this description, connects to the various cloud provider API, and decides what to create, update and destroy.

> A key feature is the ability to generate automatically the target code from the live infrastructure.

![target-live-infra.dot.svg](../plantuml/target-live-infra.dot.svg)

The next flowchart describes how to use the GruCloud CLI `gc` to manage your infrastructure:

![gc-workflow](../plantuml/gc-workflow.svg)

# Getting Started

- [AWS Getting Started](./aws/AwsGettingStarted.md)
- [Google Cloud Getting Started](./google/GoogleGettingStarted.md)
- [Microsoft Azure Getting Started](./azure/AzureGettingStarted.md)
- [Kubernetes Getting Started](./k8s/K8sGettingStarted.md)

# Resources List

- [AWS Resources](./aws/AwsResources.md)
- [Google Cloud Resources](./google/GcpResources.md)
- [Microsoft Azure Resources](./azure/AzureResources.md)
- [Kubernetes Resources](./k8s/K8sResources.md)

# Links

- [Comparison between GruCloud, Terraform and AWS CDK](./GruCloudComparison.md)
