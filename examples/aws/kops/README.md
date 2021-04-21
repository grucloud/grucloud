# KOPS

This GrucCloud code manages the users, groups, policies and S3 buckets required for the use of [kops](https://kops.sigs.k8s.io/), a tool to create Kubernetes control plane.

We'll refer to the [kops guide for AWS](https://kops.sigs.k8s.io/getting_started/aws/)

## Requirements

- AWS Account
- AWS CLI configured
- GruCloud CLI

## Resource

### Policies

We will reference the following policies with _useIamPolicy_:

```sh
AmazonEC2FullAccess
AmazonRoute53FullAccess
AmazonS3FullAccess
IAMFullAccess
AmazonVPCFullAccess
```

### Group

### User

### Bucket
