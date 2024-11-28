/**
 * shipping well take group of sales and return the shipping id and shipping
 * shipping will do those things
 * 1) create shipping
 *  --- description
 * go throw all the sales and count the sale for every country
 * if if the sale from the
 *
 *
 * 2) update shipping statues
 * 3) track the shipping
 * 4) delete the shipping
 *
 *  */
// ex : prices list
enum pricesList {
  sameCountryBase = 5.0, // without add any price for specific item
  anotherCountryBase = 15.0, // the same
  additionalForStore = 1.75, // for item with country already exist and new store
  additionalForItem = 0.75, // for items with same store
}
import { Address } from '../../types/types';
import Part from '../models/Part';
import Sale from '../models/Sale';
import Shipment from '../models/Shipment';

class shippingDao {
  model: typeof Shipment;
  constructor() {
    this.model = Shipment;
  }
  createShipment(obj: { sales: Sale[]; address: Address }) {}
  private async calcPrice(obj: {
    sales: Sale[];
    country: string;
  }): Promise<number> {
    const { sales, country } = obj;
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
