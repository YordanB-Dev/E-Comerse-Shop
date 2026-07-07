import productRepository from "../repositories/product.repository.js";
import { AppError } from "../middleware/types/AppError.js";
import orderRepositoy from "../repositories/orders.repository.js";


interface CreateOrderInput {
    userId: number;
    items: {
        productId: number;
        quantity: number;
    }[];
}


export const orderService: any = {
    async createOrder(input: CreateOrderInput) {
        if (!input || input.items.length === 0) {
            throw new AppError(`Order need to be at least 1 product`, 400);
        }

        const orderItems = [];

        for (const item of input.items) {
            const productResult = await productRepository.findById(item.productId);
            const product = productResult?.rows?.[0];

            if (!product) {
                throw new AppError(`Product with ID ${item.productId} not exist`, 404);
            }

            if (product.stock.quantity < item.quantity) {
                throw new AppError(`Not enough amount for ${product.name}`, 404);
            }

            orderItems.push({
                productId: item.productId,
                quantity: item.quantity,
                price: product.price
            });

            const order = await orderRepositoy.create({
                userId: input.userId,
                items: orderItems
            });

            return order;
        };
    },

    async getOrderByUserId(userId: number) {
        const order = await orderRepositoy.findUserById(userId);
        return order;
    },

    async getOrderById(orderId: number) {
        const order = await orderRepositoy.findById(orderId);
        if (!order) {
            throw new AppError(`Order not found`, 404);
        }

        const items = await orderRepositoy.findItemByOrderId(orderId);

        return {
            order,
            items
        };
    },

    async updateStatus(orderId: number, status: `pending` | `paid` | `cancelled`) {
        const order = await orderRepositoy.updateStatus(orderId, status);

        if (!order) {
            throw new AppError(`Order not found`, 404);
        }

        if (order.status === `paid`) {
            throw new AppError(`You cant change paid order`, 400);
        }
        
        return order;
    }
};

export default orderService
