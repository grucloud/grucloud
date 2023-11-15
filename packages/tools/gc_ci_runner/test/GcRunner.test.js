import assert from "assert";
import rubico from "rubico";
const { pipe, tap } = rubico;
import { describe, it } from "node:test";

import GcRunner from "../GcRunner.js";

const flowSimple = {
  name: "Bau",
  on: {
    push: {
      branches: ["*"],
    },
  },
  steps: [
    {
      name: "ls",
      run: "ls",
      workingDirectory: "node_modules",
    },
  ],
};

describe("GcRunner", () => {
  it("happy case", async () =>
    pipe([
      tap((result) => {
        assert(true);
      }),
      () => ({ argv: [""], flow: flowSimple, Bucket: process.env.S3_BUCKET }),
      GcRunner,
      tap((result) => {
        assert(true);
      }),
    ])());
});
