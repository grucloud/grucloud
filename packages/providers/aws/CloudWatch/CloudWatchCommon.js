const assert = require("assert");
const { pipe, tap, get, assign, tryCatch } = require("rubico");
const { callProp, find } = require("rubico/x");
const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "ResourceARN",
  TagsKey: "Tags",
  UnTagsKey: "TagKeys",
});

exports.assignTags = ({ buildArn, endpoint }) =>
  pipe([
    assign({
      Tags: tryCatch(
        pipe([
          buildArn,
          (ResourceARN) => ({ ResourceARN }),
          endpoint().listTagsForResource,
          get("Tags"),
        ]),
        (error) => []
      ),
    }),
  ]);
exports.dependenciesSnsAlarms = {
  snsTopicAlarmActions: {
    type: "Topic",
    group: "SNS",
    dependencyId: ({ lives, config }) =>
      pipe([get("AlarmActions"), find(callProp("startsWith", "arn:aws:sns"))]),
  },
  snsTopicOKActions: {
    type: "Topic",
    group: "SNS",
    dependencyId: ({ lives, config }) =>
      pipe([get("OKActions"), find(callProp("startsWith", "arn:aws:sns"))]),
  },
  snsTopicInsufficientDataActions: {
    type: "Topic",
    group: "SNS",
    dependencyId: ({ lives, config }) =>
      pipe([
        get("InsufficientDataActions"),
        find(callProp("startsWith", "arn:aws:sns")),
      ]),
  },
};
