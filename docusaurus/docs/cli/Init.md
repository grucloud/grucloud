---
id: Init
title: Init
---

The **init** commands initialises the providers.

```sh
gc init
```

The exact procedure depends on the provider, however, most of them perform the following tasks:

- Check if the provider's CLI is installed.
- Authenticate to the cloud provider.
- Set region and zone.

## Providers

### AWS

![gc-init-aws](../../plantuml/gc-init-aws.svg)

### Azure

![gc-init-azure](../../plantuml/gc-init-azure.svg)

### Google

![gc-init-google](../../plantuml/gc-init-google.svg)
