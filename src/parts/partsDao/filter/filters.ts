import { Op } from 'sequelize';
import { Catagory } from '../../../../types/partsTypes';
import AppError from '../../../../utils/AppError';
interface FilterStrategy {
  applyFilter(filterValue: any): {};
}

class CategoryFilterStrategy implements FilterStrategy {
  applyFilter(filterValue: string): {} {
    const filter = filterValue.split(',');
    return {
      [Op.or]: filter,
    };
  }
}

class StatusFilterStrategy implements FilterStrategy {
  applyFilter(filterValue: boolean): any {
    return {
      isNew: filterValue,
    };
  }
}
class OriginalFilterStrategy implements FilterStrategy {
  applyFilter(filterValue: boolean): {} {
    return {
      isOriginal: filterValue,
    };
  }
}

class CarTypeFilterStrategy implements FilterStrategy {
  applyFilter(filterValue: string[]): {} {
    return {
      carType: {
        [Op.or]: filterValue,
      },
    };
  }
}

class YearFilterStrategy implements FilterStrategy {
  applyFilter(filterValue: number): {} {
    return {
      year: {
        [Op.eq]: new Date(`${filterValue}-01-01`),
      },
    };
  }
}

class PriceFilterStrategy implements FilterStrategy {
  applyFilter(filterValue: string): {} {
    const filter = filterValue.split(',').map(Number);
    console.log(filter);
    if (filter.length > 2 || filter.length < 1 || (!filter[0] && !filter[1]))
      throw new AppError('invalid fitler for price', 403);

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
