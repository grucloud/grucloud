---
id: IdentityProvider
title: Identity Provider
---

Manages a [Cognito Identity Provider](https://console.aws.amazon.com/cognito/v2/idp/user-pools).

## Sample code

```js
exports.createResources = () => [];
```

## Properties

- [CreateIdentityProviderCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-cognito-identity-provider/interfaces/createidentityprovidercommandinput.html)

## Dependencies

- [User Pool](./UserPool.md)

## Used By

## Full Examples

- [Simple identity provider](https://github.com/grucloud/grucloud/tree/main/examples/aws/CognitoIdentityServiceProvider/identity-provider)

## List

The user pools can be filtered with the _IdentityProvider_ type:

```sh
gc l -t IdentityProvider
```
