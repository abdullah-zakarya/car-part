import { Op } from 'sequelize';
import { Category, CarType } from '../../types/partsTypes';
import AppError from '../../utils/AppError';
/**
 * Applies a filter strategy to the category filter.
 *
 * @remarks
 * This function takes a filter value as a string, splits it by commas, converts each element to lowercase,
 * and checks if it exists in the set of valid categories. If an invalid category is found, it throws an error.
 * The function then returns a Sequelize query object with an OR operator, using the valid categories.
 *
 * @param filterValue - The filter value as a string, representing categories separated by commas.
 * @returns A Sequelize query object with an OR operator, using the valid categories.
 * @throws Will throw an error if an invalid category is found in the filter value.
 *
 * @example
 *
}
*/

interface FilterStrategy {
  applyFilter(filterValue: any): {};
}
const categories = new Set<string>(Object.values(Category));
const cartTypes = new Set<string>(Object.keys(CarType));
class CategoryFilterStrategy implements FilterStrategy {
  applyFilter(filterValue: string): any {
    console.log(filterValue.split(','));
    const values = filterValue.split(',').map((el) => el.toLowerCase());
    values.forEach((el) => {
      if (!categories.has(el))
        throw new AppError('invalid category filter', 403);
    });
    console.log(values);
    return values.length > 1 ? { [Op.or]: values } : values[0];
  }
}

class StatusFilterStrategy implements FilterStrategy {
  applyFilter(filterValue: string): boolean {
    const filter = filterValue.toLowerCase();
    if (filter !== 'true' && filter !== 'false')
      throw new AppError('Invalid filter new value', 403);
    return filter == 'true';
  }
}
class OriginalFilterStrategy implements FilterStrategy {
  applyFilter(filterValue: string): boolean {
    const filter = filterValue.toLowerCase();
    if (filter !== 'true' && filter !== 'false')
      throw new AppError('Invalid filter new value', 403);
    return filter == 'true';
  }
}

class CarTypeFilterStrategy implements FilterStrategy {
  applyFilter(filterValue: string): {} {
    const value = filterValue.split(',').map((el) => {
      const result = el.toLowerCase();
      if (!cartTypes.has(result))
        throw new AppError('Invalid filter value for car type', 403);
      return result;
    });
    return { [Op.or]: value };
  }
}

class YearFilterStrategy implements FilterStrategy {
  applyFilter(filterValue: number): {} {
    if (filterValue < 1950 || filterValue > new Date().getFullYear())
      throw new AppError('invalid filter for year', 403);
    return { [Op.eq]: new Date(`${filterValue}-01-01`) };
  }
}

class PriceFilterStrategy implements FilterStrategy {
  applyFilter(filterValue: string): {} {
    const filter = filterValue.split(',').map(Number);
    console.log(filter);
    if (filter.length > 2 || filter.length < 1 || (!filter[0] && !filter[1]))
      throw new AppError('invalid filter for price', 403);

    if (filter.length === 1 || !filter[0]) return { [Op.lte]: filter[1] };

    if (!filter[1]) return { [Op.gte]: filter[0] };

    return { [Op.between]: filter };
  }
}

export {
  PriceFilterStrategy,
  YearFilterStrategy,
  CarTypeFilterStrategy,
  CategoryFilterStrategy,
  StatusFilterStrategy,
  OriginalFilterStrategy,
  FilterStrategy,
};
