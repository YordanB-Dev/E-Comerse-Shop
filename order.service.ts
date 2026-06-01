import orderRepository from "../repositories/orders.repository.js";
import productRepository from "../repositories/product.repository.js";
import { AppError } from "../middleware/types/AppError.js";

interface CreateOrderInput {
    userId: number;
    items: {
        productId: number;
        quantity: number;
    }[];
}



export const orderService: any = {
    async createOrder(input: CreateOrderInput) {
        if (!input || input.items.length) {
            throw new AppError(`Order neet to be at least 1 product`, 400);
        }

        const orderItems = [];

        for (const item of input.items) {
            const product = await productRepository.findById(item.productId);
            if (!product) {
                throw new AppError(`Order with ID ${item.productId} not exist`, 400);
            }

            if (product.stock.quantity < item.quantity) {
                throw new AppError(`Not enough amount for order ${product.name}`, 400);
            }

            orderItems.push({
                productId: item.productId,
                quantity: item.quantity,
                price: product.price
            });
        }

        const order = await orderRepository.create({
            userId: input.userId,
            items: orderItems
        });

        return order;
    },

    async getOrderByUserId(userId: number) {
        const order = await orderRepository.findUserById(userId);
        return order;
    },

    async getORderById(orderId: number, userId: number) {
        const order = await orderRepository.findById(orderId);

        if (!order) {
            throw new AppError("Order not found", 404);
        }

        if (order.user_id !== userId) {
            throw new AppError("You dont have permison fro this order", 403);
        }

        const items = await orderRepository.findItemByOrderId(orderId);

        return {
            order,
            items
        };
    },

    async updateOrderStatus(orderId: number, status: `pending` | `paid` | `cancelled`) {
        const order = await orderRepository.findById(orderId);

        if (!order) {
            throw new AppError("Order not found", 404);
        }

        if(order.status === `paid`) {
            throw new AppError("You cant change paid order", 400);
        }

        return await orderRepository.UpdateStatus(orderId, status);
    }
};

export default orderService;
