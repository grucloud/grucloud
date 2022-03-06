// const assert = require("assert");
// const { pipe, tap } = require("rubico");

// const { AwsCloudControl } = require("../AwsCloudClontrol");

// describe("AwsCloudControl", async function () {
//   it("CRUD", async function () {
//     try {
//       const config = () => ({
//         region: "eu-west-2",
//         zone: "eu-west-2-a",
//       });
//       const cloudControl = AwsCloudControl({})({
//         spec: { type: "ApiKey", group: "ApiGateway" },
//         config,
//       });
//       await pipe([
//         cloudControl.getList,
//         tap((params) => {
//           assert(true);
//         }),
//         () => ({ name: "my-key", payload: { Name: "my-key" } }),
//         cloudControl.create,
//         tap((params) => {
//           assert(true);
//         }),
//         ({ Identifier }) => ({ live: { Identifier } }),
//         cloudControl.destroy,
//       ])();
//     } catch (error) {
//       throw error;
//     }
//   });
// });
