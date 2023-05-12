const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RolesAnywhere.html
const { RolesAnywhereCrl } = require("./RolesAnywhereCrl");
const { RolesAnywhereProfile } = require("./RolesAnywhereProfile");
const { RolesAnywhereTrustAnchor } = require("./RolesAnywhereTrustAnchor");

const GROUP = "RolesAnywhere";

const tagsKey = "tags";
const compare = compareAws({ tagsKey, key: "key" });

module.exports = pipe([
  () => [
    //
    RolesAnywhereCrl({}),
    RolesAnywhereProfile({}),
    RolesAnywhereTrustAnchor({}),
  ],
  map(createAwsService),
  map(
    defaultsDeep({
      group: GROUP,
      tagsKey,
      compare: compare({}),
    })
  ),
]);
