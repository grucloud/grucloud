const assert = require("assert");
const { pipe, tap, assign, get, tryCatch, map } = require("rubico");
const { compareAws } = require("../AwsCommon");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "addTagsToResource",
  methodUnTagResource: "removeTagsFromResource",
  ResourceArn: "ResourceName",
  TagsKey: "Tags",
  UnTagsKey: "TagKeys",
});

const tagsKey = "Tags";
exports.tagsKey = tagsKey;
exports.compare = compareAws({ tagsKey, key: "Key" });

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElastiCache.html#addTagsToResource-property
exports.tagResource =
  ({ buildArn }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      tap((params) => {
        assert(live);
      }),
      (Tags) => ({ ResourceName: buildArn(live), Tags }),
      endpoint().addTagsToResource,
    ]);
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElastiCache.html#removeTagsFromResource-property
exports.untagResource =
  ({ buildArn }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      (TagKeys) => ({ ResourceName: buildArn(live), TagKeys }),
      endpoint().removeTagsFromResource,
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElastiCache.html#listTagsForResource-property
exports.assignTags = ({ endpoint, buildArn }) =>
  pipe([
    assign({
      Tags: tryCatch(
        pipe([
          buildArn,
          (ResourceName) => ({ ResourceName }),
          endpoint().listTagsForResource,
          get("TagList"),
        ]),
        (error) => pipe([() => []])()
      ),
    }),
  ]);

exports.cloudWatchLogGroupsDeps = {
  cloudWatchLogGroups: {
    type: "LogGroup",
    group: "CloudWatchLogs",
    list: true,
    dependencyIds: ({ lives, config }) =>
      pipe([
        get("LogDeliveryConfigurations"),
        map(
          pipe([
            get("DestinationDetails.CloudWatchLogsDetails.LogGroup"),
            (name) =>
              lives.getByName({
                name,
                providerName: config.providerName,
                type: "LogGroup",
                group: "CloudWatchLogs",
              }),
            get("id"),
          ])
        ),
      ]),
  },
};

exports.firehoseDeliveryStreamsDeps = {
  firehoseDeliveryStreams: {
    type: "DeliveryStream",
    group: "Firehose",
    list: true,
    dependencyIds: ({ lives, config }) =>
      pipe([
        get("LogDeliveryConfigurations"),
        map(
          pipe([
            get("DestinationDetails.KinesisFirehoseDetails.DeliveryStream"),
            (name) =>
              lives.getByName({
                name,
                type: "DeliveryStream",
                group: "Firehose",
                providerConfig: config.providerConfig,
              }),
            get("id"),
          ])
        ),
      ]),
  },
};
