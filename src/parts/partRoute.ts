import { Router } from 'express';
import PartController from './PartController';
import isLogin from '../../utils/isLogin';
import { catchAsync, catchErr } from '../../utils/catchErrors';

const router = Router();
const partController = new PartController();

/**
 * @route GET /api/parts/:id
 * @description Get a part by its ID.
 */
router.get('/:id', catchErr(partController.getPart));

/**
 * @route GET /api/parts
 * @description Get all parts with optional filters, pagination, and sorting.
 */
router.get('/', catchErr(partController.getAllParts));

/**
 * @route POST /api/parts
 * @description Add a new part to the database.
 */
router.use(isLogin);
router.post('/', catchAsync(partController.addPart));

/**
 * @route POST /api/cart/:id
 * @description Add a part to the user's cart.
 */
router.post('/:id/addToCart', catchErr(partController.addPartToCart));

/**
 * @route DELETE /api/cart/:partId
 * @description Remove a part from the user's cart.
 */
router.delete('/:partId', catchErr(partController.deletePartFromCart));
const partRoute = router;
export default partRoute;
