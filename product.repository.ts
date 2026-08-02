import productRepository from "../repositories/product.repository.js";
import { AppError } from "../middleware/types/AppError.js";

interface productFilters {
    search?: string | undefined;
    minPrice?: number | undefined;
    maxPrice?: number | undefined;
    categoryId: number | undefined;
    sortBy?: string | undefined;
    order?: "asc" | "desc" | undefined;
    limit?: number | undefined;
    offset?: number | undefined;
}

interface CreateOrderInput {
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryId: number;
}


export const productService = {
    async getAll(querParams: any) {
        const page = Math.max(1, Number(querParams.page) || 1);
        const limit = Math.min(50, Number(querParams.limit) || 10);
        const offset = (page - 1) * limit;

        const filters: productFilters = {
            search: querParams.search,
            minPrice: querParams.minPrice ? Number(querParams.minPrice) : undefined,
            maxPrice: querParams.maxPrice ? Number(querParams.maxPrice) : undefined,
            categoryId: querParams.categoryId ? Number(querParams.categoryId) : undefined,
            sortBy: querParams.sortBy || `created_at`,
            order: querParams.order === "asc" ? "asc" : "desc",
            limit,
            offset
        };

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
            throw new AppError(`Product not found`, 404);
        }

        return product;
    },

    async createProduct(productData: any) {
        const {name, price, stock} = productData;

        if (!name || name.trim().length < 3) {
            throw new AppError(`Invalid name`, 400);
        }

        if (price <= 0) {
            throw new AppError(`Invalid price`, 400);
        }

        if (stock < 0) {
            throw new AppError(`Invalid stock`, 400)
        }

        return await productRepository.createProduct(productData);
    }
};

export default productService;
