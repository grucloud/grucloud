const assert = require("assert");
const { head, tap, props } = require("ramda");
const { pipe } = require("rubico");

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
});
