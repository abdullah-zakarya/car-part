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
const catagori = new CategoryFilterStrategy();
const status = new StatusFilterStrategy();
export { status, catagori };
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
        [Op.eq]: new Date(`${filterValue}-01-01`), // مقارنة السنة بشكل دقيق
      },
    };
  }
}

class PriceFilterStrategy implements FilterStrategy {
  applyFilter(filterValue: { start: number; end: number }): {} {
    return {
      price: {
        [Op.between]: [filterValue.start, filterValue.end],
      },
    };
  }
}
