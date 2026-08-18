import productRepository from "../repositories/product.repository.js";
import { AppError } from "../middleware/types/AppError.js";

interface ProductFilters {
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    categoryId?: number;
    sortBy?: string;
    order?: "asc" | "desc";
    limit?: number;
    offset?: number;
}

interface CreateOrderInput {
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryId: number;
}

export const productService = {
    async getAll(queryResult: any) {
        const page = Math.max(1, Number(queryResult.page) || 1);

        const limit = Math.min(
            50,
            Number(queryResult.limit) || 10
        );

        const offset = (page - 1) * limit;

        const filters: ProductFilters = {
            sortBy: queryResult.sortBy || "created_at",
            order: queryResult.order === "asc" ? "asc" : "desc",
            limit,
            offset
        };

        if (queryResult.search) {
            filters.search = queryResult.search;
        }

        if (queryResult.minPrice !== undefined) {
            filters.minPrice = Number(queryResult.minPrice);
        }

        if (queryResult.maxPrice !== undefined) {
            filters.maxPrice = Number(queryResult.maxPrice);
        }

        if (queryResult.categoryId !== undefined) {
            filters.categoryId = Number(queryResult.categoryId);
        }

        const [product, total] = await Promise.all([
            productRepository.findAll(filters),
            productRepository.count(filters)
        ]);

        return {
            data: product,
            meta: {
                page,
                limit,
                count: product.length,
                totalPages: Math.ceil(total / limit)
            }
        };
    },

    async getById(id: number) {
        const product = await productRepository.findById(id);

        if (!product) {
            throw new AppError("Product not found", 404);
        }

        return product;
    },

    async createProduct(productData: any) {
        const {name, price, stock} = productData;

        if (!name || name.trim().length < 3) {
            throw new AppError("Invalid name", 400);
        }

        if (price <= 0) {
            throw new AppError("Invalid price", 400);
        }

        if (stock < 0) {
            throw new AppError("Invalid stock", 400);
        }

        return await productRepository.createProduct(productData);
    }
};

export default productService;
