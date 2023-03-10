// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const parseErrorMessage = (error) => {
  let msg = error.message || error.toString();

  if (msg.includes('Requested record does not exist') // getValue
        || msg.includes('Requested documents do not exist') // getValues
        || msg.includes('Could not get metadata') // getMetadata
        || msg.includes('Could not verify the metadta') // verifyLedgerMetadata
        || msg.includes('Could not get document revision') // getDocumentRevisionByLedgerMetadata
        || msg.includes('Could not get history') // getHistory
  ) {
    msg = `Client Error: ${msg}`;
  }
  return new Error(msg);
};

module.exports = parseErrorMessage;
