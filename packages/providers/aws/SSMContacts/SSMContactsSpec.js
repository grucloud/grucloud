const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");

const GROUP = "SSMContacts";
const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

const { SSMContactsContact } = require("./SSMContactsContact");
const { SSMContactsContactChannel } = require("./SSMContactsContactChannel");
const { SSMContactsPlan } = require("./SSMContactsPlan");

module.exports = pipe([
  () => [
    //
    SSMContactsContact({}),
    SSMContactsContactChannel({}),
    SSMContactsPlan({}),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        compare: compare({}),
      }),
    ])
  ),
]);
