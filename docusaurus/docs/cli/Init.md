---
id: Init
title: Init
---

The **init** commands initialises the providers.

For instance, in the case of the google provider, this command performs the following actions:

- create the project
- setup billing for that project
- enable the api services
- create a service account
- create and save the credential file for this service account
- update the iam policy by binding roles to the service account

```
gc init
```
