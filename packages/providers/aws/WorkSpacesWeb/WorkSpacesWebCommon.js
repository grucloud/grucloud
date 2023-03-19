const assert = require("assert");
const { pipe, tap, assign, get, tryCatch, map } = require("rubico");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "resourceArn",
  TagsKey: "tags",
  UnTagsKey: "tagKeys",
});

exports.assignTags = ({ buildArn, endpoint }) =>
  pipe([
    assign({
      tags: tryCatch(
        pipe([
          buildArn,
          (resourceArn) => ({ resourceArn }),
          endpoint().listTagsForResource,
          get("tags"),
        ]),
        (error) => []
      ),
    }),
  ]);

exports.associate =
  ({ endpoint, method, arnKey, portals }) =>
  (live) =>
    pipe([
      tap(() => {
        assert(live);
        assert(live[arnKey]);
      }),
      () => portals,
      map(
        pipe([
          tap((portal) => {
            assert(portal.live.portalArn);
          }),
          (portal) => ({
            portalArn: portal.live.portalArn,
            [arnKey]: live[arnKey],
          }),
          endpoint()[method],
        ])
      ),
    ])();

exports.disassociate = ({ endpoint, method }) =>
  pipe([
    get("associatedPortalArns"),
    map(pipe([(portalArn) => ({ portalArn }), endpoint()[method]])),
  ]);
