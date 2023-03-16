// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const { QLDBKVS } = require('amazon-qldb-kvs-nodejs');
const util = require('util');
const parseErrorMessage = require('./errorHandler');

const LEDGER_NAME = process.env.LEDGER_NAME || 'keyvaluestore';
const TABLE_NAME = process.env.TABLE_NAME || 'keyvaluedata';

const qldbKVS = new QLDBKVS(LEDGER_NAME, TABLE_NAME);

const checkForDuplicateKeys = (array) => new Set(array).size !== array.length;

const main = async (event) => {
  try {
    const { ops } = event;
    const { payload } = event;
    let res;

    switch (ops) {
      case 'getValue':
        if (payload.length === 1) {
          res = await qldbKVS.getValue(payload[0]);
        } else {
          res = await qldbKVS.getValues(payload);
        }
        break;

      case 'setValue':
        if (payload.length === 1) {
          res = await qldbKVS.setValue(payload[0].key, payload[0].value);
        } else {
          const keyArray = payload.map((p) => p.key);
          if (checkForDuplicateKeys(keyArray) === true) {
            throw new Error('Client Error: Duplicate keys detected');
          }
          const valueArray = payload.map((p) => p.value);
          res = await qldbKVS.setValues(keyArray, valueArray);
        }
        break;

      case 'getMetadataByKey':
        res = await qldbKVS.getMetadata(payload);
        break;

      case 'getMetadataByDoc':
        res = await qldbKVS.getMetadataByDocIdAndTxId(payload.documentId, payload.txId);
        break;

      case 'verifyLedgerMetadata':
        await qldbKVS.verifyLedgerMetadata(payload);
        res = { result: 'valid' };
        break;

      case 'getDocumentRevisionByLedgerMetadata':
        res = await qldbKVS.getDocumentRevisionByLedgerMetadata(payload);
        break;

      case 'verifyDocumentRevisionHash':
        res = await qldbKVS.verifyDocumentRevisionHash(payload);
        if (res === true) {
          res = { result: 'valid' };
        } else {
          res = { result: 'invalid' };
        }
        break;

      case 'getHistory':
        res = await qldbKVS.getHistory(payload.key, payload.from || '2020-01-01T00:00:00Z', payload.to || null);
        break;

      default:
        throw new Error(`Server Error: Operation ${ops} is not supported.`);
    }

    console.log(util.inspect(res, { depth: 3 }));
    return res;
  } catch (error) {
    const msg = parseErrorMessage(error);
    console.log(msg);
    throw msg;
  }
};

module.exports.main = main;
