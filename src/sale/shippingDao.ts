import { Address } from '../../types/types';
import Part from '../models/Part';
import Sale from '../models/Sale';
import Shipment from '../models/Shipment';
// ex : prices list
enum pricesList {
  sameCountryBase = 5.0, // without add any price for specific item
  anotherCountryBase = 15.0, // the same
  additionalForStore = 1.75, // for item with country already exist and new store
  additionalForItem = 0.75, // for items with same store
}

class ShippingDao {
  model: typeof Shipment;
  constructor() {
    this.model = Shipment;
  }
  async createShipment(obj: {
    sales: Sale[];
    address: Address;
    customerId: number;
  }) {
    const { sales, address, customerId } = obj;
    const cost = await this.calcPrice({ sales, address });
    const salesId: number[] = sales.map((sale) => sale.id);
    const shipment = await this.model.create({
      sales: salesId,
      customerId,
      customerLocation: address,
      cost,
    });
  }
  async calcPrice(obj: {
    sales: { partId: number; quantity: number }[];
    address: Address;
  }): Promise<number> {
    const {
      sales,
      address: { country },
    } = obj;
    let result: number = 0;
    const stores = new Set();
    const countries = new Set();
    for (const sale of sales) {
      const part = await Part.findByPk(sale.partId);
      // countryCost
      if (!countries.has(part?.country)) {
        result +=
          country == part?.country
            ? pricesList.sameCountryBase
            : pricesList.anotherCountryBase;
        countries.add(country);
      }
      // StoreCost
      if (!stores.has(part?.owner)) {
        result += pricesList.additionalForStore;
        stores.add(part?.owner);
      }
      // itemCost
      result += sale.quantity * pricesList.additionalForItem;
    }
    return result;
  }
}

export default ShippingDao;
