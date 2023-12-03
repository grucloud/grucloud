import assert from "assert";
import rubico from "rubico";
const { pipe, tap } = rubico;
import { describe, it } from "node:test";

import GcRunner from "../src/GcRunner.js";

const flowSimple = {
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
        assert(process.env.S3_BUCKET);
        assert(process.env.S3_BUCKET_KEY);
      }),
      () => ({
        argv: [""],
        ...process.env,
        GC_FLOW: flowSimple,
      }),
      GcRunner,
      tap((result) => {
        assert(true);
      }),
    ])());
});
