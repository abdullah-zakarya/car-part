import { Op } from 'sequelize';
import Part from '../../models/Part';
import AppError from '../../../utils/AppError';
import {
  CategoryFilterStrategy,
  PriceFilterStrategy,
  StatusFilterStrategy,
  FilterStrategy,
  YearFilterStrategy,
  CarTypeFilterStrategy,
  OriginalFilterStrategy,
} from './filter/filters';
import Cart from '../../models/Cart';
import { filterFields } from '../../../types/partsTypes';
import { addPartRequest } from '../../../types/api';

/**
 * PartDao class handles operations related to Part objects, such as fetching, adding, and filtering parts.
 */
class PartDao {
  model: typeof Part;
  filters: { [filter: string]: any };
  constructor() {
    this.model = Part;
    this.filters = {
      category: new CategoryFilterStrategy(),
      price: new PriceFilterStrategy(),
      status: new StatusFilterStrategy(),
      year: new YearFilterStrategy(),
      carType: new CarTypeFilterStrategy(),
      original: new OriginalFilterStrategy(),
    };
  }

  /**
   * Get a specific part by its ID.
   * @param id - The ID of the part to fetch.
   * @returns The part object if found, otherwise throws an AppError.
   */
  public async getPart(id: number): Promise<Part | null> {
    const part = await this.model.findByPk(id);
    if (!part) throw new AppError('Part not found', 404);
    return part;
  }

  /**
   * Fetch all parts with optional filters, pagination, and sorting.
   * @param filters - Array of filters to apply.
   * @param limit - Maximum number of parts to fetch per page.
   * @param page - The page number to fetch.
   * @param sorted - Field to sort the parts by.
   * @returns Array of parts matching the filter criteria.
   */
  public async getAllPart({
    filters = {},
    limit = 10,
    page = 1,
    sort,
  }: {
    filters: filterFields;
    limit?: number;
    page?: number;
    sort?: string;
  }): Promise<Part[]> {
    try {
      const queryFilters = this.filterFactory(filters);
      const orderDirection = sort && sort[0] === '-' ? 'DESC' : 'ASC';
      const field = sort && sort[0] == '-' ? sort.slice(1) : 'createdAt';
      const parts = await this.model.findAll({
        where: queryFilters,
        order: [[field, orderDirection]],
        limit,
        offset: (page - 1) * limit,
      });

      return parts;
    } catch (err) {
      const error = err as Error;
      throw new AppError(`Error fetching parts: ${error.message}`, 500);
    }
  }

  /**
   * Add a new part to the database.
   * @param partData - Object containing the part data to be added.
   * @returns The newly created part.
   */
  public async addPart(part: any): Promise<Part> {
    const newPart = await this.model.create(part);
    return newPart;
  }

  /**
   * Add a part to the user's cart.
   * @param PartId - ID of the part to add to the cart.
   * @param userId - ID of the user.
   * @throws AppError if the operation fails.
   */
  public async addPartToCart({
    partId,
    userId,
  }: {
    partId: number;
    userId: number;
  }): Promise<void> {
    await Cart.create({ partId, userId });
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

  /**
   * Dynamically generate filtering conditions based on the provided filters.
   * @param filters - Array of filter objects.
   * @returns Sequelize where clause for filtering.
   */

  private filterFactory(filters: { [key: string]: any }): any {
    const queryFilters: any = {};
    const fields = Object.keys(filters);

    for (const field of fields) {
      if (filters[field] !== undefined && filters[field] !== null) {
        const fn: FilterStrategy = this.filters[field];
        const value = filters[field];
        queryFilters[field] = fn.applyFilter(value);
      }
    }

    return queryFilters;
  }

  /**
   * Dynamically generate sorting conditions.
   * @param sort - Field name to sort by.
   * @returns Sequelize order clause for sorting.
   */
}

export default PartDao;
// api part?sort=-price& price=[50,70],catagory=[Air-filter,battery]
// price :[number, number]
//
