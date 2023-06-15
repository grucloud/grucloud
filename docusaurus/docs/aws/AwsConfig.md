---
id: AwsConfig
title: Configuration
---

By default, credentials and config are obtained through files managed by the AWS CLI. These credentials and config can be overidden.

## Config file

Edit **config.js** and set region and zone, and eventually the profile and the partition for US gov cloud:

```js
module.exports = () => ({
  region: "eu-west-2",
  credentials: { profile: "default" },
  //partition: "aws-us-gov",
});
```

## Environment file

The AWS access and secret can also be set through environment variable.
Create **default.env** and set the correct values.

```sh
AWSAccessKeyId=
AWSSecretKey=
```
