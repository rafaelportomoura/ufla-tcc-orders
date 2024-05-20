import { expect } from 'chai';
import { decodeArray, decodeObject } from '../../../src/utils/uriDecodeComponent';

describe('Utils -> UriDecodeComponent', () => {
  it('Should decode empty object', () => {
    const response = decodeObject({});
    expect(response).deep.equal({});
  });
  it('Should decode object', () => {
    const response = decodeObject({ a: { b: '%24%25%20%26*' } });
    expect(response).deep.equal({ a: { b: '$% &*' } });
  });
  it('Should decode array', () => {
    const response = decodeArray(['%24%25%20%26*', ['%24%25%20%26*']]);
    expect(response).deep.equal(['$% &*', ['$% &*']]);
  });
  it('Should decode object with array', () => {
    const response = decodeObject({ a: { b: ['%24%25%20%26*'] } });
    expect(response).deep.equal({ a: { b: ['$% &*'] } });
  });
  it('Should decode array with object', () => {
    const response = decodeArray([{ a: [{ b: '%24%25%20%26*' }] }]);
    expect(response).deep.equal([{ a: [{ b: '$% &*' }] }]);
  });
});
