const assert = require("assert");
const { pipe, tap } = require("rubico");
const { when, defaultsDeep } = require("rubico/x");

exports.createTagger =
  ({
    methodTagResource = "tagResource",
    methodUnTagResource = "untagResource",
    ResourceArn = "ResourceArn",
    TagsKey = "Tags",
    UnTagsKey = "TagKeys",
  }) =>
  ({ buildArn, additionalParams }) => ({
    tagResource:
      ({ endpoint }) =>
      ({ live }) =>
        pipe([
          tap((Tags) => {
            assert(Tags);
            assert(endpoint);
            assert(endpoint()[methodTagResource]);
            assert(buildArn(live));
          }),
          (Tags) => ({ [ResourceArn]: buildArn(live), [TagsKey]: Tags }),
          when(
            () => additionalParams,
            (input) => ({ ...input, ...additionalParams(live) })
          ),
          tap((params) => {
            assert(true);
          }),

          endpoint()[methodTagResource],
        ]),
    untagResource:
      ({ endpoint }) =>
      ({ live }) =>
        pipe([
          tap((TagKeys) => {
            assert(TagKeys);
            assert(endpoint()[methodUnTagResource]);
            assert(buildArn(live));
          }),
          (TagKeys) => ({
            [ResourceArn]: buildArn(live),
            [UnTagsKey]: TagKeys,
          }),
          endpoint()[methodUnTagResource],
        ]),
  });
