import pool from "../../db.js";
import type { QueryResult } from "pg";

export interface Product {
    id: number;
    name: string;
    description: string;
    price: string | number;
    stock: number;
    category_id: number;
    image_url: string;
    is_active: boolean;
    created_at: Date;
}

export interface UpdateProduct {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    image_url?: string;
    category_id?: number;
    is_active?: boolean;
}

export interface ProductFilters {
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    categoryId?: number;
    sortBy?: string;
    page?: number;
    order?: "asc" | "desc";
    limit?: number;
    offset?: number;
}

const ALLOWED_SORT_COLUMNS = [`name`, `price`, `stock_quantity`, `category_id`];

export const productRepository = {
    async getAllProducts(filters: any) {
        let query = `SELECT & FROM products WHERE 1=1`;
        const values: any[] = [];

        if (filters.search) {
            values.push(`%${filters.search}%`);
            query += `AND name ILIKE $${values.length}`;
        }

        if (filters.minPrice) {
            values.push(filters.minPrice);
            query += `AND price >= $${values.length}`;
        }

        if (filters.maxPrice) {
            values.push(filters.maxPrice);
            query += `AND price <= $${values.length}`;
        }

        if (filters.categoryId) {
            values.push(filters.categoryId);
            query += ` AND category_id $${values.length}`;
        }

        if (filters.sortBy && ALLOWED_SORT_COLUMNS.includes(filters.sortBy)) {
            const order = filters.sortBy === "asc" ? "ASC" : "DESC";
            query += ` ORDER BY ${filters.sortBy} ${order}`;
        } else {
            query += ` ORDER BY created_at`;
        }

        if (filters.limit) {
            values.push(filters.limit);
            query += ` LIMIT $${values.length}`;
        }

        if (filters.offset) {
            values.push(filters.offset);
            query += ` OFFSET $${values.length}`;
        }

        const result = await pool.query(query, values);
        return result
    },

    async count(filters: ProductFilters): Promise<number> {
        let query = `SELECT COUNT (*) FROM products WHERE 1=1`;
        const values: any[] = [];

        if (filters.search) {
            values.push(`%${filters.search}%`);
            query += ` AND name ILIKE $${values.length}`;
        }

        if (filters.minPrice) {
            values.push(filters.minPrice);
            query += ` AND price >= $${values.length}`;
        }

        if (filters.maxPrice) {
            values.push(filters.maxPrice);
            query += ` AND price <= $${values.length}`;
        }

        const result = await pool.query(query, values);
        return result.rows[0].count;
    },

    async getProductById(id: number, is_active: boolean) {
        const result: QueryResult<Product> = await pool.query<Product> (
            `SELECT * FROM products WHERE id = $1 AND is_active = TRUE`,
            [id, is_active]
        );

        return result.rows[0];
    },

    async createProduct(
        name: string, 
        description: string,
        price: number,
        stock: number,
        image_url: string,
        category_id: number,
    ) {
        const result: QueryResult<Product> = await pool.query<Product> (
            `INSERT INTO products (name, description, price, stock, image_url, category_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [name, description, price, stock, image_url, category_id]
        );

        return result.rows[0];
    },

    async updateProduct (
        id: number,
        data: UpdateProduct
    ) {
        const result: QueryResult<Product> = await pool.query<Product> (
            `UPDATE products SET
            name = COALESCE($1, name),
            description = COALESCE($2, description),
            price = COALESCE($3, price),
            stock = COALESCE($4, stock),
            image_url = COALESCE($5, image_url),
            category_id = COALESCE($6, category_id),
            is_active = COALESCE($7, is_active)
            WHERE id = $8 RETURNING *`,
            [
                data.name ?? null,
                data.description ?? null,
                data.price ?? null,
                data.stock ?? null,
                data.image_url ?? null,
                data.category_id ?? null,
                data.is_active ?? null,
                id
            ]
        );

        return result.rows[0];
    },

    async deleteProduct(id: number) {
        const result: QueryResult<Product> = await pool.query<Product> (
            `DELETE FROM products WHERE id = $1 RETURNING *`,
            [id]
        );

        return result.rows[0];
    }
};

export default productRepository;
