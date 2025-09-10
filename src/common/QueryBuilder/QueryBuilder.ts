// src/common/QueryBuilder.ts
import { Document, Model } from 'mongoose';

type QueryBuilderOptions<T> = {
  page?: number;
  limit?: number;
  search?: string;
  searchFields?: (keyof T)[];
  sortField?: keyof T;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>; // ✅ add filters
};

export class QueryBuilder<T extends Document> {
  private model: Model<T>;
  private options: QueryBuilderOptions<T>;

  constructor(model: Model<T>, options: QueryBuilderOptions<T> = {}) {
    this.model = model;
    this.options = options;
  }

  async execute() {
    const page = Number(this.options.page) || 1;
    const limit = Number(this.options.limit) || 10;
    const skip = (page - 1) * limit;

    // ✅ Build search query
    let searchQuery: any = {};
    if (this.options.search && this.options.searchFields?.length) {
      searchQuery = {
        $or: this.options.searchFields.map((field) => ({
          [field]: { $regex: this.options.search, $options: 'i' },
        })),
      };
    }

    // ✅ Merge role/status filters
    if (this.options.filters) {
      searchQuery = { ...searchQuery, ...this.options.filters };
    }

    // ✅ Sorting
    const sort: any = {};
    if (this.options.sortField) {
      sort[this.options.sortField as string] =
        this.options.sortOrder === 'desc' ? -1 : 1;
    }

    // ✅ Execute query
    const [total, data] = await Promise.all([
      this.model.countDocuments(searchQuery),
      this.model.find(searchQuery).sort(sort).skip(skip).limit(limit),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      total,
      totalPages,
      page,
      limit,
      data,
    };
  }
}
