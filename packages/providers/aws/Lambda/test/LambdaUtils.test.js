const assert = require("assert");
const AdmZip = require("adm-zip");

describe("Lambda", async function () {
  before(async function () {});
  after(async () => {});
  it("zip", async function () {
    const Data =
      "UEsDBBQAAAAIANFE+1JLjaw72AAAAHABAAANAAAAaGVsbG93b3JsZC5qc3WQzWqDUBBG9z7FhxsVxBCzq9hdNiWk0DyBvY4/5HamjFeNlL57by0Fs8h6DufwjREexFJmpY3Dk1R1zy2akY3rhcOkCAK6fYq6Iesqri0pSlTDwgYxTcQuhRF2dHMJymd8BcBuZzbO6I0M9RPVWPGnKMXL5fWcDU59qW+Wfw2P1qbIE58EtoZwquxIe5Rh+ufIrrTsH2D5PZY/wA732GHFlNyovGkUfguOphO8V+YK1xGaXgcHf8TqWef6g8oMphlHVdE4usgHue73k7N3YVbhNvKN7yL4AVBLAQIUAxQAAAAIANFE+1JLjaw72AAAAHABAAANAAAAAAAAAAAAAACkgQAAAABoZWxsb3dvcmxkLmpzUEsFBgAAAAABAAEAOwAAAAMBAAAAAA==";
    const zip = new AdmZip(Buffer.from(Data, "base64"));
    const zipEntries = zip.getEntries();

    zipEntries.forEach(function (zipEntry) {
      //console.log(zipEntry.toString()); // outputs zip entries information
      //console.log(zip.readAsText(zipEntry.entryName));
    });
    //zip.extractAllTo(/*target path*/ "/home/me/zipcontent/", /*overwrite*/ true);
  });
});
