import { expect } from 'chai';
import sinon from 'sinon';
import { Logger } from '../../../src/adapters/logger';
import { CreateOrderBusiness } from '../../../src/business/Create';
import { LoggerLevel } from '../../../src/constants/loggerLevel';
import { OrderRepository } from '../../../src/repositories/order';
import { EventBus } from '../../../src/services/EventBus';
import { ProductsService } from '../../../src/services/Products';
import { StockService } from '../../../src/services/Stock';
import { OrderData } from '../../data/order';
import { ProductData } from '../../data/product';
import { StockData } from '../../data/stock';

describe('Business -> Create', async () => {
  let get_products_price: sinon.SinonStub;
  let reserve_stock: sinon.SinonStub;
  let create_order_stub: sinon.SinonStub;
  let event_bus: sinon.SinonStub;
  let business: CreateOrderBusiness;

  beforeEach(() => {
    sinon.restore();
    get_products_price = sinon.stub(ProductsService.prototype, 'getProductsPrice');
    reserve_stock = sinon.stub(StockService.prototype, 'reserve');
    create_order_stub = sinon.stub(OrderRepository.prototype, 'create');
    event_bus = sinon.stub(EventBus.prototype, 'pub');
    business = new CreateOrderBusiness({
      aws_params: {},
      event_bus_topic: 'topic',
      logger: new Logger(LoggerLevel.silent, ''),
      stock_base_url: '',
      products_base_url: '',
      request_id: ''
    });
  });
  it('should create order', async () => {
    const create = OrderData.create();
    const product_price = Object.keys(create.products).map((_id) => ProductData.price({ _id }));
    const reserve = product_price.map(({ _id }) => StockData.reserve({ product_id: _id }));
    const order = OrderData.createToOrder(create, product_price);
    get_products_price.resolves(product_price);
    reserve_stock.resolves(reserve);
    create_order_stub.resolves(order);
    event_bus.resolves();
    const response = await business.create(create);
    expect(response).deep.equal(order);
    expect(event_bus.calledOnce).equal(true);
    expect(event_bus.args[0][0]).deep.equal(order);
  });
});
