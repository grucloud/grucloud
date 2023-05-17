const assert = require("assert");
const { tap, pipe, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");
const { RAMPermission } = require("./RAMPermission");
const { RAMPrincipalAssociation } = require("./RAMPrincipalAssociation");
const { RAMResourceAssociation } = require("./RAMResourceAssociation");
const { RAMResourceShare } = require("./RAMResourceShare");

const GROUP = "RAM";
const tagsKey = "tags";
const compare = compareAws({ tagsKey, key: "key" });

module.exports = pipe([
  () => [
    RAMPermission({}),
    RAMPrincipalAssociation({}),
    RAMResourceAssociation({}),
    RAMResourceShare({}),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        tagsKey,
        compare: compare({}),
      }),
    ])
  ),
]);
