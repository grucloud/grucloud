const assert = require("assert");
const crypto = require("crypto");

describe("GoogleHash", function () {
  it.skip("hash", async function () {
    const sharedSecret = "tMlAgmatqxI9ET5qe8J7bhsXIkcKCNON";
    const sharedSecretHash = "ACaaRZTpDxP1teAWT2n3BtLjlyRy";
    const hashes = crypto.getHashes();
    console.log(hashes);
    let hash = crypto.createHash("sha1").update(sharedSecret).digest("base64");
    console.log(hash);
  });
});
