const assert = require("assert");
const { pipe, tap, assign, get } = require("rubico");
const { replaceAccountAndRegion } = require("../AwsCommon");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "resourceName",
  TagsKey: "tags",
  UnTagsKey: "tagKeys",
});

exports.filterLiveDefault = ({ lives, providerConfig }) =>
  pipe([
    assign({
      availabilityZone: pipe([
        get("availabilityZone"),
        replaceAccountAndRegion({ lives, providerConfig }),
      ]),
    }),
  ]);
