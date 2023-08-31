/* eslint-disable no-console */
const { md5, md5UID, simpleRandomHash, simpleRandomUid, xxHash64, xxHash32 } = require('../dist/cjs');

const anyString = 'any string';
const anyObj = { a: 'any string', b: [1, 2, 3] };

console.log('md5: ', md5(anyString));
console.log('md5UID: ', md5UID(anyString));

console.log('simpleRandomHash: ', simpleRandomHash());
console.log('simpleRandomHash: ', simpleRandomHash());
console.log('simpleRandomHash: ', simpleRandomHash());

console.log('simpleRandomUid: ', simpleRandomUid());
console.log('simpleRandomUid: ', simpleRandomUid());
console.log('simpleRandomUid: ', simpleRandomUid());

console.log('xxHash32: ', xxHash32(anyObj));
console.log('xxHash64: ', xxHash64(anyObj));
