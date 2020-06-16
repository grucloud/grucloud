const assert = require("assert");
const { head, tap, props } = require("ramda");
const { pipe } = require("rubico");
const urljoin = require("url-join");

const list = {
  data: {
    items: [
      {
        id: "11",
      },
    ],
  },
};

describe("Playground", function () {
  it.skip("ramda extract", async function () {
    const result = pipe([
      tap(console.log),
      ({ data: { items } }) => items,
      tap(console.log),
      head,
      tap(console.log),
    ])(list);
    assert(result);
  });
  it.skip("urljoin", async function () {
    const result = urljoin("", "/test");
    assert.equal(result, "/test");
  });
});
