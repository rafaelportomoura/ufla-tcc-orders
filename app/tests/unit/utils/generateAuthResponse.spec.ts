/* eslint-disable import/no-extraneous-dependencies */
import { faker } from '@faker-js/faker';
import { expect } from 'chai';
import Sinon from 'sinon';
import { GenerateAuthResponse } from '../../../src/utils/generateAuthResponse';
import { AuthorizerData } from '../../data/authorizer';

describe('Utils -> GenerateAuthResponse', () => {
  const username = faker.internet.userName();
  const token = AuthorizerData.decodedToken(username);
  const arn = AuthorizerData.create();
  const method_arn = AuthorizerData.methodArn('POST', '/*');
  it('Should allow policy', () => {
    const response = GenerateAuthResponse.success(token, arn);
    expect(response).deep.equal(AuthorizerData.allowPolicyDocument(username, token.sub, method_arn));
  });
  it('Should deny policy', () => {
    const response = GenerateAuthResponse.error(token.sub, method_arn);
    expect(response).deep.equal(AuthorizerData.denyPolicyDocument(token.sub, method_arn));
  });
  it('Should deny policy with default sub', () => {
    Sinon.restore();
    const spy = Sinon.spy(GenerateAuthResponse, 'defaultSub');
    const response = GenerateAuthResponse.error(undefined, method_arn);
    expect(response).deep.equal(AuthorizerData.denyPolicyDocument(spy.returnValues[0], method_arn));
  });
});
