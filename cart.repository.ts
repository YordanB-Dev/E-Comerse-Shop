import { runInNewContext } from "node:vm";
import productController from "../controllers/product.controller.js";
import pool from "../db.js";
import { AppError } from "../middleware/types/AppError.js";


interface Cart {
    id: number,
    user_id: number,
    created_at: Date
};

interface CartItem {
    id: number,
    cart_id: number,
    product_id: number,
    quantity: number,
    added_at: Date
};

interface CartItemWithProduct extends CartItem {
    name: string,
    price: number
};

export const cartRepository = {
    async getOrCreateCart(userId: number): Promise<Cart> {
        const existing = await pool.query<Cart> (
            `SELECT * FROM carts WHERE user_id = $1`,
            [userId]
        );

        if (existing.rows[0]) {
            return existing.rows[0];
        }

        const newCart = await pool.query<Cart> (
            `INSERT INTO carts (user_id) VALUES ($1) RETURNING *`,
            [userId]
        );

        if (!newCart.rows[0]) {
            throw new AppError(`Failed to create cart`, 500);
        }

        return newCart.rows[0];
    },

    async addItem(cartId: number, productId: number, quantity: number): Promise<CartItem> {
        const result = await pool.query<CartItem> (
            `INSERT INTO cart_items (cart_id, product_id, quantity)
            VALUES ($1, $2, $3)
            ON CONFLICT (cart_id, product_id)
            DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
            RETURNING *`,
            [cartId, productId, quantity]
        );

        if (!result) {
            throw new AppError(`Failed to create or update cart`, 400);
        }

        return result.rows[0]!;
    },

    async removeItem(cartId: number, productId: number, quantity: number): Promise<void> {
        await pool.query (
            `DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2 AND quantity = $3`,
            [cartId, productId, quantity]
        );
    },

    async getCartWithItems(cartId: number): Promise<CartItemWithProduct[]> {
        const result = await pool.query<CartItemWithProduct> (
            `SELECT ci.*, p.name, p.price
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.cart_id = $1`,
            [cartId]
        );

        return result.rows;
    },

    async clearCart(cartId: number): Promise<void> {
        await pool.query(
            `DELETE FROM cart_items WHERE cart_id = $1`,
            [cartId]
        );
    }
};

export default cartRepository;