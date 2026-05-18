import pool from "../db.js";

interface CreateOrderData {
    userId: number;
    items: {
        productId: number;
        quantity: number;
        price: number;
    }[];
}

interface Order {
    id: number;
    user_id: number;
    status: "pending" | "paid" | "cancelled";
    total_price: number;
    created_at: Date;
}

interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    price: number;
}

export const orderRepository = {
    
    async create(data: CreateOrderData): Promise<Order> {
        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            const totalPrice = data.items.reduce(
                (sum, item) => sum + item.price * item.quantity, 0
            );

            const orderResult = await client.query<Order> (
                `INSERT INTO orders (user_id, status, total_price)
                VALUES ($1, $2, $3)
                RETURNING *`,
                [data.userId, "pending", totalPrice]
            );

            const order = orderResult.rows[0];
            
            if (!order) {
                throw new Error("Failed to create order");
            }

            for (const item of data.items) {
                await client.query(
                    `INSERT INTO order_items (order_id, product_id, quantity, price)
                    VALUES ($1, $2, $3, $4)`,
                    [order.id, item.productId, item.quantity, item.price]
                );
            }

            await client.query("COMMIT");
            return order;
        } catch (error) {
            await client.query("ROLLBACK");
            throw Error;
        } finally {
            client.release();
        }
    },

    async findByUserId(userId: number): Promise<Order[]> {
        const result = await pool.query<Order>(
            `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
            [userId]
        );
        return result.rows;
    },

    async findById(orderId: number): Promise<Order | null> {
        const reuslt = await pool.query<Order>(
            `SELECT * FROM order WHERE id = $1`,
            [orderId]
        );

        return reuslt.rows[0] || null;
    },

    async findItemsByOrderId(orderId: number): Promise<OrderItem[]> {
        const result = await pool.query<OrderItem> (
            `SELECT * FROM order_items WHERE order_id = $1`,
            [orderId]
        );

        return result.rows;
    },

    async updateStatus(orderId: number, status: "pending" | "paid" | "cancelled"): Promise<Order> {
        const result = await pool.query<Order>(
            `UPDATE orders SET status = $1 WHERE id = $2 RETURNING *`,
            [status, orderId]
        );

        return result.rows[0]!;
    }
};

export default orderRepository;
