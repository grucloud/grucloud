const assert = require("assert");
const { pipe, tap, get, assign, omit, switchCase } = require("rubico");
const { getField } = require("@grucloud/core/ProviderCommon");

exports.assignDiffTags = ({ diff }) =>
  pipe([
    omit(["Tags"]),
    assign({
      AddTags: pipe([() => diff, get("liveDiff.added.Tags", [])]),
      RemoveTags: pipe([() => diff, get("targetDiff.added.Tags", [])]),
    }),
  ]);

exports.resourceId = ({ portfolio, product }) =>
  pipe([
    switchCase([
      () => portfolio,
      () => getField(portfolio, "Id"),
      () => product,
      () => getField(product, "Id"),
      () => {
        assert(false, "missing portfolio or product");
      },
      tap((ResourceId) => {
        assert(ResourceId);
      }),
    ]),
  ])();
