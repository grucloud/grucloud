const assert = require("assert");
const { pipe, tap, get, assign, omit } = require("rubico");

exports.assignDiffTags = ({ diff }) =>
  pipe([
    omit(["Tags"]),
    assign({
      AddTags: pipe([() => diff, get("liveDiff.added.Tags", [])]),
      RemoveTags: pipe([() => diff, get("targetDiff.added.Tags", [])]),
    }),
  ]);
