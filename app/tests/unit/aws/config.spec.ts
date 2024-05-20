/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import { aws_config } from '../../../src/aws/config';

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
});
