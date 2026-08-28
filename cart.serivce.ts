import cartRepository from "../repositories/cart.repository.js";
import productRepository from "../repositories/product.repository.js";
import { AppError } from "../middleware/types/AppError.js";

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

interface CartItemWithProduct extends CartItem {
    name: string;
    price: number;
}

export const cartSerice = {
    async getCart(userId: number): Promise<CartResult> {
        const cart = await cartRepository.getOrCreateCart(userId);
        const items = await cartRepository.getCartWithItems(cart.id);

        return {
            cartId: cart.id,
            items,
            total: items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0)
        };
    },

    async addItem(userId: number, productctId: number, quantity: number) {
        if (quantity <= 0) {
            throw new AppError("Cart need to be at least 1 product", 400);
        }

        const product = await productRepository.findById(productctId);
        if (!product) {
            throw new AppError("Product not found", 404);
        }

        if (product.stock_quantity < quantity) {
            throw new AppError("Not enough amount for this product", 400);
        }

        const cart = await cartRepository.getOrCreateCart(userId);
        await cartRepository.addItem(cart.id, productctId, quantity);
        return this.getCart(userId);
    },

    async removeItem(userId: number, productId: number) {
        const cart = await cartRepository.getOrCreateCart(userId);
        await cartRepository.removeItem(cart.id, productId);
        return this.getCart(userId);
    },

    async clearCart(userId: number, productId: number) {
        const cart = await cartRepository.getOrCreateCart(userId);
        await cartRepository.clearCart(cart.id);
        return { message: "Cart is clear"};
    }
};

export default cartSerice;
