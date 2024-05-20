/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import { aws_config, aws_params } from '../../../src/aws/config';
import { CONFIGURATION } from '../../../src/constants/configuration';

describe('AWS -> Config', () => {
  it('Should get default config', () => {
    const config = aws_config();
    expect(config).deep.eq({ region: 'us-east-2', credentials: undefined });
  });
  it('Should get populated config', () => {
    const config = aws_config({ region: 'us-east-1', profile: 'default' });
    expect(config).deep.eq({
      region: 'us-east-1',
      credentials: config.credentials
    });
  });
  it('Should get aws_params', () => {
    const params = aws_params(CONFIGURATION);
    expect(params).deep.equal({
      region: CONFIGURATION.REGION,
      profile: CONFIGURATION.PROFILE
    });
  });
  it('Should get aws_params', () => {
    const params = aws_params();
    expect(params).deep.equal({
      region: CONFIGURATION.REGION,
      profile: CONFIGURATION.PROFILE
    });
  });
});
