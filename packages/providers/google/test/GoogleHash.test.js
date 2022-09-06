const assert = require("assert");
const crypto = require("crypto");
const { pipe, tap, map, assign, get } = require("rubico");
const { size, callProp } = require("rubico/x");

const sharedSecret1 = "tMlAgmatqxI9ET5qe8J7bhsXIkcKCNON";
const sharedSecretHash = "ACaaRZTpDxP1teAWT2n3BtLjlyRy";

const displayAllHashes = ({ sharedSecret }) =>
  pipe([
    crypto.getHashes,
    map((hashMethod) =>
      pipe([
        () =>
          crypto
            .createHash(hashMethod)
            .update(sharedSecret, "base64")
            .digest("base64"),
        (hash) => ({ hashMethod, hash }),
        assign({ length: pipe([get("hash"), size]) }),
      ])()
    ),
  ])();

describe("GoogleHash", function () {
  it.skip("hash", async function () {
    pipe([
      () => ({ sharedSecret: sharedSecret1 }),
      displayAllHashes,
      tap((params) => {
        assert(true);
      }),
      callProp("sort", (a, b) => (a.length > b.length ? 1 : -1)),
      map(pipe([JSON.stringify, console.log])),
    ])();
  });
});
