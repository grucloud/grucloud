---
id: IamUser
title: Iam User
---

Provides an Iam User

```js
const iamUser = await provider.makeIamUser({
  name: "Alice",
  properties: () => ({}),
});
```

### Add a user to groups

```js
const iamGroup = await provider.makeIamGroup({
  name: "Admin",
  properties: () => ({}),
});

const iamUser = await provider.makeIamUser({
  name: "Alice",
  dependencies: { iamGroups: [iamGroup] },
  properties: () => ({}),
});
```

### Examples

- [simple example](https://github.com/FredericHeem/grucloud/blob/master/examples/aws/iam/iac.js)

### Properties

- [properties list](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#createUser-property)

### Dependencies

- [IamGroup](./IamGroup)

### AWS CLI

List all iam users

```
aws iam list-users
```

List the tags for a given user

```
aws iam list-user-tags --user-name Alice

```

Delete a user:

```
aws iam delete-user --user-name Alice
```
