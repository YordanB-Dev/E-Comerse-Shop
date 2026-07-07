import cartRepository from "../repositories/cart.repository.js";
import productRepository from "../repositories/product.repository.js";
import { AppError } from "../middleware/types/AppError.js";
import { threadId } from "node:worker_threads";


interface CartItem {
    id: number;
    cart_id: number;
    product_id: number;
    quantity: number;
    price: number;
    name: string;
}

interface CartResult {
    cartId: number;
    items: CartItem[];
    total: number;
}


export const cartSerivce = {
    async getCart(userId: number): Promise<CartResult> {
        const cart = await cartRepository.getOrCreateCart(userId);
        const items = await cartRepository.getOrCreateCart(cart.id) as unknown as CartItem[];

        return {
            cartId: cart.id,
            items,
            total: items.reduce((sum, item) => sum + item.price * item.quantity, 0)
        }
    },

    async addItem(userId: number, productId: number, quantity: number) {
        if (quantity <= 0) {
            throw new AppError(`Cart need to be at least 1 product`, 400);
        }

        const product = await productRepository.findById(productId);
        if (!product) {
            throw new AppError(`Product not found`, 404);
        }

        if (product.stock.quantiy < quantity) {
            throw new AppError(`Not enough amount for this product`, 400);
        }

        const cart = await cartRepository.getOrCreateCart(userId);
        await cartRepository.addItem(userId, productId, quantity);
        return this.getCart(userId);
    },

    async removeItem(userId: number, productId: number, quantity: number) {
        const cart = await cartRepository.getOrCreateCart(userId);
        await cartRepository.removeItem(userId, productId, quantity);
        return this.getCart(userId);
    },

    async clearCart(userId: number) {
        const cart = await cartRepository.getOrCreateCart(userId);
        await cartRepository.clearCart(userId);
        return {message: `Cart is clear`};
    }
};

export default cartSerivce;