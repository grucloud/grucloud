---
id: AwsConfig
title: Configuration
---

By default, credentials and config are obtained through files managed by the AWS CLI. These credentials and config can be overidden.

## Environment file

```sh
cp config/default.env.example config/default.env
```

Edit **config/default.env** and set the correct values:

```sh
AWSAccessKeyId=
AWSSecretKey=
```

## Config file

Edit **config/default.js** and set region and zone:

```js
module.exports = () => ({
  region: "eu-west-2",
  zone: "eu-west-2a",
});
```

To find out the list of regions:

```
aws ec2 describe-regions
```

Choose a region close to your location, at this point select a zone name in the given region:

```
aws ec2 describe-availability-zones --region eu-west-2
```
