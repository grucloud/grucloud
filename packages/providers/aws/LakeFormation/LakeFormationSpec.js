const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");
const { createAwsService } = require("../AwsService");

const GROUP = "LakeFormation";

const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

const {
  LakeFormationDataLakeSettings,
} = require("./LakeFormationDataLakeSettings");
const { LakeFormationLFTag } = require("./LakeFormationLFTag");
const { LakeFormationResource } = require("./LakeFormationResource");

module.exports = pipe([
  () => [
    LakeFormationDataLakeSettings({}),
    LakeFormationLFTag({}),
    LakeFormationResource({}),
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
