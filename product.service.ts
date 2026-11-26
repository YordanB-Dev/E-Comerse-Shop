import productRepository from "../repositories/productRepository.js";
import { AppError } from "../../utils/AppError.js";
import type { UpdateProduct } from "../repositories/productRepository.js";
import type { ProductFilters } from "../repositories/productRepository.js";
import { get } from "node:http";
import { Query } from "pg";

export const productSerivce = {

    async getAllProducts(queryResult: any) {

        const page = Number(queryResult.page) || 1;
        const limit = Number(queryResult.limit) || 10;

        if (!Number.isInteger(page || page <= 0)) {
            throw new AppError("Invalid page", 400);
        }

        if (!Number.isInteger(limit || limit <= 0 || limit > 50)) {
            throw new AppError("Invalid limit", 400);
        }

        const offset = (page - 1) * limit;

        const filters: ProductFilters = {
            sortBy: queryResult.sortBy || "created_at",
            order: queryResult.order || "asc" ? "asc" : "desc",
            limit,
            offset
        };

        if (queryResult.search !== undefined) {
            filters.search = String(queryResult.search);
        }

        if (queryResult.minPrice !== undefined) {
            filters.minPrice = Number(queryResult.minPrice);

            if (!Number.isFinite(filters.minPrice) || filters.minPrice < 0) {
            throw new AppError("Invlaid price", 400);

            }
        }

        if (queryResult.maxPrice !== undefined) {
            filters.maxPrice = Number(queryResult.maxPrice);

            if (!Number.isFinite(filters.maxPrice) || filters.maxPrice < 0) {
                throw new AppError("Invalid price", 400);
            }
        }

        if (
            filters.minPrice !== undefined &&
            filters.maxPrice !== undefined &&
            filters.minPrice > filters.maxPrice
        ) {
            throw new AppError("Minimum price cannot exceed maximum price", 400);
        }

        if (queryResult.categoryId !== undefined) {
            filters.categoryId = Number(queryResult.categoryId);

            if (!Number.isFinite(filters.categoryId) || filters.categoryId <= 0) {
                throw new AppError("Invalid category ID", 400);
            }
        }

        const [product, total] = await Promise.all([
            productRepository.getAllProducts(filters),
            productRepository.count(filters)
        ]);

        return {
            data: product,
            meta: {
                page,
                limit,
                count: total,
                totalPage: Math.ceil(total / limit)
            }
        };
    },

    async getProductById(id: number) {
        
    }
}
