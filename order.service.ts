import productRepository from "../repositories/product.repository.js";
import { AppError } from "../middleware/types/AppError.js";
import orderRepositoy from "../repositories/order.repository.js";


interface CreateOrderInput {
    userId: number;
    items: {
        productId: number;
        quantity: number;
    }[];
}


export const orderSerivce: any = {

    async createOrder(input: CreateOrderInput) {
        if (!input || input.items.length === 0 ) {
            throw new AppError(`Order need to be at least 1 product`, 400);
        }

        const orderItems = [];

        for (const item of input.items) {
            const productResult = await productRepository.findById(item.productId);
            const product = await productResult?.rows?.[0];

            if (!product) {
                throw new AppError(`Product with id ${product.id} not found`, 404);
            }

            if (product.stock.quantiy < item.quantity) {
                throw new AppError(`Not enough amount for product ${product.name}`, 400);
            }

            orderItems.push({
                productId: item.productId,
                quantity: item.quantity,
                price: product.price
            });

            const order = await orderRepositoy.create ({
                userId: input.userId,
                items: orderItems
            });

            return order;
        };
    },

    async getOrdersByUser(userId: number) {
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

export default orderSerivce;
