# Mock provider

The mock provider is a fake provider which does not require to sign for an account and pay for a service cloud provider.

This provider works alongside a mock cloud provider.

The purposes are for the testing, training and bug reports.

### Installation:

In the _examples/mock_ directory:

```
npm i
```

### Mock Cloud Service Povider

Open a new terminal and go to the root directory:

```
npm run start:mock
```

## Commands

List the live resources:

```
gc list
```

List the resources that will be deployed:

```
gc plan
```

Deploy the resources:

```
gc apply
```

Destroy the resources:

```
gc destroy
```

## Dependency Graph

```sh
gc graph
```

![Graph](grucloud.svg)
