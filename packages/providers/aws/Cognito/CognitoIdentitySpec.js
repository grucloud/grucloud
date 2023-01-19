const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");
const { createAwsService } = require("../AwsService");

const GROUP = "Cognito";

const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

const {
  CognitoIdentityIdentityPool,
} = require("./CognitoIdentityIdentityPool");

const {
  CognitoIdentityIdentityPoolProviderPrincipalTag,
} = require("./CognitoIdentityIdentityPoolProviderPrincipalTag");

const {
  CognitoIdentityIdentityPoolRolesAttachments,
} = require("./CognitoIdentityIdentityPoolRolesAttachments");

module.exports = pipe([
  () => [
    CognitoIdentityIdentityPool({}),
    CognitoIdentityIdentityPoolProviderPrincipalTag({}),
    CognitoIdentityIdentityPoolRolesAttachments({}),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        compare: compare({}),
        tagsKey,
      }),
    ])
  ),
]);
