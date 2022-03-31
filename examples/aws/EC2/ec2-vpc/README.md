# EC2 - VPC

The purpose of this example is to deploy an EC2 instance attached to an elastic public IP address, inside a VPC, secured by firewall rules with a security group.

```sh
gc tree
```

![resources-mindmap](./artifacts/resources-mindmap.svg)

```sh
gc graph
```

![diagram-target.svg](./artifacts/diagram-target.svg)

# Workflow

Here are the steps to deploy, destroy and document this infrastructure:

![gc-example-workflow](https://raw.githubusercontent.com/grucloud/grucloud/main/docusaurus/plantuml/gc-example-workflow.svg)
