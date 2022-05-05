---
id: IpamPool
title: IPAM Pool
---

Provides a [VPC IP Address Manager Pool](https://console.aws.amazon.com/ipam/home#:)

```js
exports.createResources = () => [
```

### Examples

- [ipam](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/ipam)

### Properties

- [CreateIpamPoolCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/createipampoolcommandinput.html)

### Dependencies

- [IpamScope](./IpamScope.md)

## Listing

List the ipam pools with the _IpamPool_ filter:

```sh
gc l -t IpamPool
```

```txt

```
