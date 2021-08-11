const assert = require("assert");
const { pipe, omit, tap, assign } = require("rubico");
const { callProp } = require("rubico/x");

exports.buildPayloadDescriptionTags = pipe([
  tap((params) => {
    assert(true);
  }),
  assign({
    Description: pipe([
      ({ Description = "", Tags }) =>
        `${Description} tags:${JSON.stringify(Tags)}`,
      callProp("trim"),
    ]),
  }),
  omit(["Tags"]),
]);
