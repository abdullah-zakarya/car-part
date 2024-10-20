import { Op } from 'sequelize';

interface FilterStrategy {
  applyFilter(filterValue: any): {};
}

class CategoryFilterStrategy implements FilterStrategy {
  applyFilter(filterValue: string[]): {} {
    return {
      category: {
        [Op.or]: filterValue,
      },
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
  applyFilter(filterValue: [number, number]): {} {
    return {
      price: {
        [Op.between]: filterValue,
      },
    };
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
