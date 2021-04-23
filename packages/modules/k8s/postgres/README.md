# GruCloud Module for Postgres on K8s

This module defines the kubernetes resources required to run a Postgres database.

![GraphTarget](diagram-target.svg)

## Config

The [config.js](./config.js) file gathers the configuration for this module.

## Resources

This module exports 3 kubernetes resources through the _createResources_ function from the [iac.js](./iac.js) file.

#### ConfigMap

Define variables for the StatefulSet: username, database name and password.

#### StatefulSet

Define the postgres stateful set:

- image name, version and port
- **readinessProbe** and **livenessProbe** using the _psql_ command to find out if the database is up and running
- persistent volume claim to set the size of the disk.

#### Service

A headless service forwards traffic to the postgres database. The idea behind using a headless service is to get a unique dns entry that can be referenced by the backend and other (micro)services.

## Usage

This module is being used in the following projects:

- [this example](./example/README.md)
- [starhackit](https://github.com/grucloud/grucloud/tree/main/examples/k8s/starhackit/base)
