import assert from "assert";
import rubico from "rubico";
const { pipe, tap, tryCatch, assign, get } = rubico;

import GcRunner from "./src/GcRunner.js";
import defaultsDeep from "rubico/x/defaultsDeep.js";
import when from "rubico/x/when.js";
import isString from "rubico/x/isString.js";

export const handler = async (event, _context) =>
  tryCatch(
    pipe([
      () => event,
      tap((result) => {
        assert(true);
      }),
      defaultsDeep({ ...process.env }),
      tap((env) => {
        process.env = { ...process.env, ...event };
        console.log("Gc Runner", env);

        assert(env.GC_FLOW);
        assert(env.S3_BUCKET);
        assert(env.S3_BUCKET_KEY);
        assert(env.S3_AWS_REGION);
        assert(env.WS_ROOM);
        assert(env.WS_URL);

        console.log("GC_FLOW", env.GC_FLOW);
        console.log("S3_BUCKET", env.S3_BUCKET);
        console.log("S3_BUCKET_KEY", env.S3_BUCKET_KEY);
        console.log("WS_URL", env.WS_URL);
        console.log("WS_ROOM", env.WS_ROOM);
      }),
      when(
        () => isString(process.env.GC_FLOW),
        assign({
          GC_FLOW: pipe([() => process.env.GC_FLOW, JSON.parse]),
        })
      ),
      GcRunner,
      tap((result) => {
        assert(true);
      }),
    ]),
    (error) => {
      console.error(error);
      process.exit(1);
    }
  )();
