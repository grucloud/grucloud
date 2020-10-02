---
id: DeveloperGuide
title: Developer's guide
---

This describes how to contribute to this software.

Node 14 is the minimum version to support [Optional Chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)

```
node -v
v14.0.0
```

Make sure the git user name and email are configured properly:

```
git config --global user.name
git config --global user.email
```

Now you are ready to clone the code, install the dependencies and run the functional testing against a mock cloud provider.

    git clone https://github.com/grucloud/grucloud
    cd grucloud
    npm install
    npm run test:ci

### CircleCI

Create an _.env_ file at the root directory and set the _KEY_ environment variable to a random value:

```sh
KEY=527C35A7-E186-44B0-AA38-1B8E18D897CC
```

Encrypt the _default.env_ and the google credential file:

```
npm run encrypt-data-ci
```

Go the the _circleCI_ interface and set the _ENV_ variable used to decrypt the secrets
