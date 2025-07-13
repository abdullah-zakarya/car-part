import { Address, orderCreation } from '../../types/types';
import AppError from '../../utils/AppError';
import Order from '../models/order';
import Part from '../models/Part';
import ShippingDao from './shippingDao';
// TODO : improve the way to calculate the prices and create order
// DISCRETION : we need to lock on DB every time when we either calculate shipping or order
// it is not optimal
class orderDao {
  model: typeof Order;
  shipping: ShippingDao;
  constructor() {
    this.model = Order;
    this.shipping = new ShippingDao();
  }
  async calcOrder(
    obj: orderCreation
  ): Promise<{ price: number; total: number }> {
    const { sales, address } = obj;
    let price = 0;
    for (const { partId, quantity } of sales) {
      const part = await Part.findByPk(partId);
      if (!part) throw new AppError('this part is no longer exist', 404);
      if (quantity > part.stock)
        throw new AppError('there is no enough parts of ' + part.id, 403);
      price += part.price * quantity;
    }
    const total = await this.shipping.calcPrice(obj);
    return { price, total };
  }

  async createOrder() {}
  // async deleteOrder(){

  // }
  // async showOrder(){

  // }
}
