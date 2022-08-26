// const assert = require("assert");

// const { pipe, tryCatch, tap, get } = require("rubico");

// const { getResourcesDeep } = require("../GcpGetResourcesDeep");
// const runSchema = require("./fixture/run-v1.json");
// const iamSchema = require("./fixture/iam-v1.json");

// describe("getResourcesDeep", async function () {
//   it(
//     "run schema",
//     tryCatch(
//       pipe([
//         () => runSchema,
//         getResourcesDeep({}),
//         tap((params) => {
//           assert(true);
//         }),
//       ]),
//       (error) => {
//         throw error;
//       }
//     )
//   );
//   it(
//     "iam schema",
//     tryCatch(
//       pipe([
//         () => iamSchema,
//         getResourcesDeep({}),
//         tap((params) => {
//           assert(true);
//         }),
//       ]),
//       (error) => {
//         throw error;
//       }
//     )
//   );
// });
