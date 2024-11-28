import { Op } from 'sequelize';
import AppError from '../../utils/AppError';
import Cart from '../models/Cart';
import { getAllMyCartItemsType, getAllPartsType } from '../../types/partApi';
import Part from '../models/Part';
import sequelize from '../../config/database';
import Sequelize from 'sequelize';
import PartDao from '../parts/partsDao';

class cartDao {
  model: typeof Cart;
  constructor() {
    this.model = Cart;
  }
  /**
   * Remove a part from the user's cart.
   * @param userId - ID of the user.
   * @param PartId - ID of the part to remove.
   * @throws AppError if the operation fails.
   */
  public async deletePartFromCart({
    userId,
    partId,
  }: {
    userId: number;
    partId: number;
  }): Promise<void> {
    const deleted = await Cart.destroy({
      where: { [Op.and]: [{ userId }, { partId }] },
    });
    if (!deleted) throw new AppError('Part not found in cart', 404);
  }

  public async getTotalCartPrice(userId: number): Promise<number> {
    const query = `
        SELECT SUM(p.price) AS totalPrice
        FROM Carts c 
        JOIN Parts p 
        ON c.partId = p.id  
        WHERE c.userId = ?;
      `;

    // Assuming you're using a database library that supports raw queries
    const [result]: any[] = await sequelize.query(query, {
      replacements: [userId],
      type: Sequelize.QueryTypes.SELECT,
    });

    // Extract total price, defaulting to 0 if the result is null
    const totalPrice = result?.totalPrice || 0;
    return Number(totalPrice);
  }

  public async buyAllCart(userId: number) {
    const carts: Cart[] = await Cart.findAll({ where: { userId } });
    for (const cart of carts) {
      console.log('we buying the part with id :' + cart.partId);
    }
  }
}
