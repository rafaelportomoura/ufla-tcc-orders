import { expect } from 'chai';
import { two_decimals_number } from '../../../src/utils/number';

describe('Utils -> Number', () => {
  describe('two_decimals_number', () => {
    it('Should return false when has more than two decimals', () => {
      expect(two_decimals_number(1.111)).eq(false);
    });
    it('Should return true when has two decimals', () => {
      expect(two_decimals_number(1.11)).eq(true);
    });
    it('Should return true when has one decimal', () => {
      expect(two_decimals_number(1.1)).eq(true);
    });
    it('Should return true when is integer', () => {
      expect(two_decimals_number(1)).eq(true);
    });
  });
});
