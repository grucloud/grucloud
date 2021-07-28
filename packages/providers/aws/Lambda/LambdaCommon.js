const assert = require("assert");
const { pipe, tap, get } = require("rubico");
const { callProp } = require("rubico/x");
const Axios = require("axios");

exports.fetchZip =
  () =>
  ({ Location }) =>
    pipe([
      tap(() => {
        assert(Location);
      }),
      () => Axios.create({}),
      (axios) => axios.get(Location, { responseType: "arraybuffer" }),
      get("data"),
      callProp("toString", "base64"),
    ])();
