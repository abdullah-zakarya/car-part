import Sale from '../models/Sale';
class SaleDao {
  model: typeof Sale;
  constructor() {
    this.model = Sale;
  }
  // create sale
  async createSale(obj: {
    partId: number;
    userId: number;
    quantity: number;
  }): Promise<Sale> {
    const sale: Sale = await this.model.create(obj);
    return sale;
  }
  async deleteSale(id: number) {
    this.model.destroy({ where: { id } });
  }
}
