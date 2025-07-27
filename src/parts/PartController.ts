import PartDao from './partsDao';
import AppError from '../../utils/AppError';
import {
  addPartToCartType,
  addPartType,
  deletePartFromCartType,
  deletePartType,
  GetAllPartsPrams,
  getAllPartsType,
  getPartType,
  IPart,
  updatePartType,
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
  public addPart: addPartType = async (req, res, next) => {
    const newPart = { ...req.body, owner: res.locals.userId };

    const part = await this.dao.addPart(newPart);
    res.status(201).json({ part });
  };

  /**
   * Add a part to the user's cart.
   *
   * @route POST /api/cart/:id
   * @param next - Next middleware function
   * @returns Success message if the part is added to the cart.
   */
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
  // public deletePartFromCart: deletePartFromCartType = async (
  //   req,
  //   res,
  //   next
  // ) => {
  //   const partId = Number(req.params.partId);
  //   const userId = res.locals.userId;
  //   await this.dao.deletePartFromCart({ userId, partId });
  //   res.status(204).send();
  // };

  public updatePart: updatePartType = async (req, res, next) => {};

  /**
   * Extract filters from query parameters for part listing.
   *
   * @param query - The query parameters from the request.
   * @returns An object containing valid filter fields.
   */

  public deletePart: deletePartType = async (req, res, next) => {
    const partId = Number(req.params.id);
    const userId = res.locals.userId;
    if (!partId) throw new AppError('the part is not exist', 404);
    const part = await this.dao.getPart(partId);
    if (!part || part.owner !== userId)
      throw new AppError('you are not the owner of this part', 403);
    await part.destroy();
    res.status(204).send();
  };
  private getFilterFromPrams(query: GetAllPartsPrams): filterFields {
    const result = { ...query };
    result.limit = result.sort = result.page = undefined;
    return result as filterFields;
  }
}
export default PartController;
