const assert = require("assert");
const { pipe, omit, tap, assign, fork, map, get } = require("rubico");
const { callProp, values, flatten, isObject } = require("rubico/x");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "resourceArn",
  TagsKey: "tags",
  UnTagsKey: "tagKeys",
});

exports.ignoreErrorCodes = ["NotFoundException"];

exports.buildPayloadDescriptionTags = pipe([
  tap((params) => {
    assert(true);
  }),
  assign({
    description: pipe([
      ({ Description = "", Tags }) =>
        `${Description} tags:${JSON.stringify(Tags)}`,
      callProp("trim"),
    ]),
  }),
  omit(["tags"]),
]);

exports.diffToPatch = ({ diff }) =>
  pipe([
    () => diff,
    tap((params) => {
      assert(true);
    }),

    fork({
      add: pipe([
        get("liveDiff.added", {}),
        Object.entries,
        map(([key, value]) => ({
          op: "replace",
          path: `/${key}`,
          value: diff.target[key],
        })),
      ]),
      replace: pipe([
        get("liveDiff.updated", {}),
        Object.entries,
        map(([key, value]) => ({
          op: "replace",
          path: `/${key}`,
          value: diff.target[key],
        })),
      ]),
    }),
    values,
    flatten,
  ])();

exports.filterPayloadRestApiPolicy = ({ policy, id }) =>
  pipe([
    tap((name) => {
      assert(id);
      assert(policy);
    }),
    () => policy,
    JSON.stringify,
    (value) => ({ op: "replace", path: "/policy", value }),
    (patchOperation) => ({
      restApiId: id,
      patchOperations: [patchOperation],
    }),
  ])();
