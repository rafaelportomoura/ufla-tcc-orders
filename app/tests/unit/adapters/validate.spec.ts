import { expect } from 'chai';
import { Validator } from '../../../src/adapters/validate';
import { ValidationError } from '../../../src/exceptions/ValidationError';
import { create_order_body_schema } from '../../../src/schemas/create';
import { ProductData } from '../../data/product';

describe('Adapters -> Validate', async () => {
  it('Should validate schema', async () => {
    const product_id = ProductData._id();
    const result = await Validator.validate({ products: { [product_id]: 1 } }, create_order_body_schema);
    expect(result).deep.eq({ products: { [product_id]: 1 } });
  });
  it('Should not validate schema', async () => {
    const result = await Validator.validate({ product_id: 1, quantity: 1 }, create_order_body_schema).catch((e) => e);
    expect(result).instanceOf(ValidationError);
    expect(result.issues).deep.eq({ products: ['Required'] });
  });
});
