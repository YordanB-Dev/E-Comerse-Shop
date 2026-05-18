import pool from "../db.js";

interface ProductFilters {
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    order?: "asc" | "desc";
    limit?: number;
    offset?: number;
}

interface CreateProductData {
    name: string;
    description?: string;
    price: number;
    stock: number;
    categoryId: number;
}

const ALLOWED_SORT_COLUMNS = [`name`, `price`, `stock_quantity`, `category_id`];

export const productRepository = {
    async findAll(filters: any) {
        let query = ` SELECT * FROM products WHERE 1=1`;
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
            values.push(filters.maxPrice)
            query += ` AND price <= $${values.length}`;
        }

        if (filters.sortBy && ALLOWED_SORT_COLUMNS.includes(filters.sortBy)) {
            const order = filters.sortBy === "asc" ? "ASC" : "DESC";

            query += ` ORDER BY ${filters.sortBy} ${order}`;
        }else {
            query += ` ORDER BY created_at DESC`;
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
        return result.rows;
    },

    async count(filters: ProductFilters): Promise<number> {
        let query = ` SELECT COUNT (*) FROM products WHERE 1=1`;
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

    async findById(id: number) {
        const result = await pool.query(
            `SELECT * FROM products WHERE id = $1`,
            [id]
        );

        return result.rows[0];
    },

    async createProduct(data: any) {
        const [name, description, price, stock, categoryId] = data;

        const result = await pool.query(
            `ISNERT INTO products (name, description, price, stock_quantity, categoryId)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [name, description, price, stock, categoryId]
        );

        return result.rows[0];
    }
};

export default productRepository;
