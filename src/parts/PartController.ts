import PartDao from './partsDao/partsDao';
import AppError from '../../utils/AppError';
import {
  addPartToCartType,
  addPartType,
  GetAllPartsPrams,
  getAllPartsType,
  getPartType,
} from './../../types/partApi';
import { ExpressHandlerWithParams } from '../../types/types';
import { catchError } from '../../utils/catchErrors';
import { filterFields } from '../../types/partsTypes';

/**
 * PartController handles requests related to 'Part' such as fetching, adding, and managing parts in the cart.
 * Each method is wrapped with a custom error handler using the @catchError decorator.
 */
// need to test this class

class PartController {
  private dao: PartDao;

  constructor() {
    this.dao = new PartDao();
  }

  /**
   * Get a specific part by its ID.
   *
   * @route GET /api/parts/:id
   * @returns Returns the part if found, otherwise returns an error.
   */

  public getPart: getPartType = async (req, res, next) => {
    const { id } = req.params;
    if (!Number(id)) return next(new AppError('Invalid Part ID', 403));
    const part = await this.dao.getPart(Number(id));
    if (!part) throw new AppError('Part not found', 404);
    res.status(200).json({ part });
  };

  /**
   * Get all parts, with optional filters, sorting, and pagination.
   *
   * @route GET /api/parts
   * @returns Returns a list of parts matching the filter and sorting criteria.
   */
  @catchError
  public getAllParts: getAllPartsType = async (req, res, next) => {
    const { limit = 10, page = 1, sort } = req.query;
    const filters = this.getFilterFromPrams(req.query);
    const parts = await this.dao.getAllPart({
      filters,
      limit: Number(limit),
      page: Number(page),
      sort,
    });
    res.status(200).json({ total: parts.length, parts });
  };

  /**
   * Add a new part to the database.
   *
   * @route POST /api/parts
   * @returns The newly added part.
   */
  @catchError
  public addPart: addPartType = async (req, res, next) => {
    const {
      category,
      price,
      carType,
      new: isNew,
      brand,
      madeIn,
      year,
      mainPhoto,
      stock,
      photos = [],
    } = req.body;
    const owner: number = res.locals.userId;

    if (
      !category ||
      !price ||
      !carType ||
      isNew === undefined ||
      !brand ||
      !madeIn ||
      !year ||
      !mainPhoto ||
      !stock
    ) {
      throw new AppError(
        'Category, price, car type, status, brand, madeIn, year, and main photo are required',
        400
      );
    }

    const part = await this.dao.addPart({
      category,
      price,
      carType,
      new: isNew,
      brand,
      madeIn,
      year,
      mainPhoto,
      stock,
      photos,
      owner,
    });
    res.status(201).json({ part });
  };

  /**
   * Add a part to the user's cart.
   *
   * @route POST /api/cart/:id
   * @param next - Next middleware function
   * @returns Success message if the part is added to the cart.
   */
  @catchError
  public addPartToCart: addPartToCartType = async (req, res, next) => {
    const partId = Number(req.params.id);
    const userId = res.locals.userId;
    await this.dao.addPartToCart({ partId, userId });
    res.status(204).send();
  };

  /**
   * Remove a part from the user's cart.
   *
   * @route DELETE /api/cart/:partId
   * @returns Success message if the part is removed from the cart.
   */
  public deletePartFromCart: ExpressHandlerWithParams<
    { partId: number },
    null,
    {}
  > = async (req, res, next) => {
    const partId = Number(req.params.partId);
    const userId = res.locals.userId;
    await this.dao.deletePartFromCart({ userId, partId });
    res.status(204).send();
  };

  /**
   * Extract filters from query parameters for part listing.
   *
   * @param query - The query parameters from the request.
   * @returns An object containing valid filter fields.
   */
  private getFilterFromPrams(query: GetAllPartsPrams): filterFields {
    const result = { ...query };
    result.limit = result.sort = result.page = undefined;
    return result as filterFields;
  }
}
export default PartController;
