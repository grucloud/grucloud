const assert = require("assert");
const { pipe, tap, get, pick, map, filter, set, tryCatch } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { throwIfNotAwsError } = require("../AwsCommon");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagQueue",
  methodUnTagResource: "untagQueue",
  ResourceArn: "QueueUrl",
  TagsKey: "Tags",
  UnTagsKey: "TagKeys",
});

const decorate = ({ endpoint, live }) =>
  pipe([
    tap((params) => {
      assert(live);
    }),
    defaultsDeep({
      QueueUrl: live.QueueUrl,
    }),
  ]);

const filterPayloadSNSAttribute = ({ attributeName }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    set(
      `Attributes.${attributeName}`,
      pipe([get(`Attributes.${attributeName}`), JSON.stringify])
    ),
  ]);

const pickId = ({ attributeName }) =>
  pipe([
    tap((params) => {
      assert(attributeName);
    }),
    pick(["QueueUrl"]),
    defaultsDeep({ AttributeNames: [attributeName] }),
  ]);

exports.createSNSAttribute = ({ attributeName }) => ({
  filterPayload: filterPayloadSNSAttribute({ attributeName }),
  method: "setQueueAttributes",
  pickCreated: ({ payload }) => pipe([() => payload]),
  isInstanceUp: () => true,
});

exports.updateSNSAttribute = ({ attributeName }) => ({
  filterParams: ({ payload, live }) =>
    pipe([() => payload, filterPayloadSNSAttribute({ attributeName })])(),
  method: "setQueueAttributes",
});

exports.getByIdSNSAttribute = ({ attributeName }) => ({
  pickId: pickId({ attributeName }),
  method: "getQueueAttributes",
  decorate,
});

exports.destroySNSAttribute = ({ attributeName }) => ({
  pickId: pipe([
    ({ QueueUrl }) => ({ QueueUrl, Attributes: { [attributeName]: "" } }),
  ]),
  method: "setQueueAttributes",
  isInstanceDown: () => true,
});

exports.getListSQSAttribute =
  ({ attributeName }) =>
  ({ client, endpoint, getById }) =>
  ({ lives, config }) =>
    pipe([
      tap((params) => {
        assert(lives);
        assert(config);
      }),
      lives.getByType({
        type: "Queue",
        group: "SQS",
        providerName: config.providerName,
      }),
      tap((params) => {
        assert(true);
      }),
      filter(get(`live.Attributes.${attributeName}`)),
      map(
        pipe([
          get("live"),
          pick([
            "QueueName",
            "QueueUrl",
            `Attributes.${attributeName}`,
            "Attributes.QueueArn",
          ]),
          set(
            `Attributes.${attributeName}`,
            pipe([get(`Attributes.${attributeName}`), JSON.parse])
          ),
        ])
      ),
    ])();

exports.getByNameSQSAttribute =
  ({ attributeName }) =>
  ({ endpoint, getById }) =>
    pipe([
      tryCatch(
        pipe([
          ({ name }) => ({ QueueName: name }),
          endpoint().getQueueUrl,
          tap((params) => {
            assert(true);
          }),
          getById({}),
        ]),
        throwIfNotAwsError("QueueDoesNotExist")
      ),
    ]);

exports.ignoreErrorCodes = [
  "AWS.SimpleQueueService.NonExistentQueue",
  "QueueDoesNotExist",
];
