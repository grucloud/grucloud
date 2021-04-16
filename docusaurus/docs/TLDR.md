---
id: TLDR
title: TL;DR
---

Let's create a fake infrastructure with the mock provider.

First of all, install the command line utility **gc**

```bash
npm i -g @grucloud/core
```

Clone the source code and install the dependencies

```
git clone git@github.com:grucloud/grucloud.git
cd grucloud
npm install
npm run bootstrap
```

Start the mock cloud service provider located at `package/tools/mockServer`

```
cd package/tools/mockServer
npm run start
```

Open another console, go the mock example directory and install the dependencies:

```
cd examples/mock
```

Now it is time to edit the infrastructure file that describes the architecture:

    <your favorite editor> iac.js

Find out which resources are going to be allocated:

```sh
gc plan
```

Happy with the expected plan ? Deploy it now:

```sh
gc apply
```

Time to destroy the resouces allocated:

```sh
gc destroy
```

Well done. Infrastrucure as code in a few commands.
