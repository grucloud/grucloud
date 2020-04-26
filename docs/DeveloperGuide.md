# Developer's guide

This describes how to contribute to this software.

Node 14 is the minimum version to support [Optional Chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)

```
node -v
v14.0.0
```

Make sure git user name and email are configured properly:

```
git config --global user.name
git config --global user.email
```

Now you are ready to clone the code, install the dependencies and run the functional testing against a mock cloud provider.

    git clone https://github.com/FredericHeem/grucloud
    cd grucloud
    npm install
    npm run test:ci
