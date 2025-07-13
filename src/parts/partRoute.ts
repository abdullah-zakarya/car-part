import { Router } from 'express';
import PartController from './PartController';
import isLogin from '../../utils/isLogin';
import { catchAsync, catchErr } from '../../utils/catchErrors';
import { addPartValidation } from './PartsValidations';

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
router.post('/', addPartValidation, catchAsync(partController.addPart));

/**
 * @route POST /api/cart/:id
 * @description Add a part to the user's cart.
 */
router.post('/:id/addToCart', catchErr(partController.addPartToCart));

/**
 * @route DELETE /api/cart/:partId/cart
 * @description Remove a part from the user's cart.
 */

/**
 * @route PUT /api/v1/parts/:id
 * @description update the part information in the store
 */
router.put('/:id', catchErr(partController.updatePart));

// router.delete('/:partId/cart', catchErr(partController.deletePartFromCart));
/**
 * @ route DELETE /api/cart/:partId
 *@description Remove a part from the store
 */
router.delete('/:id', catchErr(partController.deletePart));
const partRoute = router;
export default partRoute;
