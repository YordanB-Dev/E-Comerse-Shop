import productRepository  from "../repositories/task.repository.js";
import { AppError } from "../middleware/types/AppError.js";
import { profileEnd } from "node:console";

interface productFilters {
    search?: string,
    minPrice?: number,
    maxPrice?: number,
    sortBy?: string,
    order?: "asc" | "desc",
    limit?: number,
    offset?: number;
}

interface CreateProductData {
    name: string,
    description: string,
    price: number,
    stock: number,
    categoryId: number;
}

export const productService = {
    async getAll(queryParams: any) {
        const page = Math.max(1, Number(queryParams.page) || 1);
        const limit = Math.min(50, Number(queryParams.limit) || 10);
        const offset = (page - 1) * limit;

        const filters: productFilters = {
            search: queryParams.search,
            minPrice: queryParams.minPrice && { minPrice: Number(queryParams.minPrice)},
            maxPrice: queryParams.maxPrice && { maxPrice: Number(queryParams.maxPrice)},
            sortBy: queryParams.sortBy || "created_at",
            order: queryParams.order === "asc" ? "asc" : "desc",
            limit,
            offset 
        };

        const [products, total] = await Promise.all([
            productRepository.findAll(filters),
            productRepository.count(filters)
        ]);

        return {
            data: products,
            meta: {
                page,
                limit,
                count: products.length,
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

    async createProduct(productdata: any) {
        const {name, price, stock} = productdata;

        if (!name || name.trim().length < 3) {
            throw new AppError("Invalid name", 400);
        }

        if (price <= 0) {
            throw new AppError("Invalid price", 400);
        }

        if (stock < 0) {
            throw new AppError("invalid stock", 400);
        }

        return await productRepository.createProduct(productdata);
    }
};

export default productService;
