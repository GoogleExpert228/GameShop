import { CartItem } from "@/models/User";
import CartItemCounter from "./CartItemCounter";

interface CartItemComponentProps {
    cartItem: CartItem;
}

export default function CartItemComponent({ cartItem }: CartItemComponentProps) {
    const userId = "671d735d5a34337e9a796832"; // Установка постоянного userId

    return (
        <div className="flex items-center justify-between mb-6 last:mb-0 rounded-lg shadow-sm bg-gray-100 p-4">
            {/* Изображение товара */}
            <div className="flex-shrink-0">
                <img
                    src={cartItem.img}
                    alt={cartItem.name}
                    className="w-24 h-24 rounded-lg object-cover border border-gray-200"
                />
            </div>

            {/* Название товара */}
            <div className="flex-1 px-4">
                <h4 className="text-lg font-semibold text-gray-800 line-clamp-1">
                    {cartItem.name}
                </h4>
                <p className="text-sm text-gray-500 line-clamp-2">
                    {cartItem.description}
                </p>
            </div>

            {/* Цена и количество */}
            <div className="flex flex-col items-end">
                <div className="text-xl font-semibold text-gray-800">
                    ${cartItem.price}
                </div>

                <CartItemCounter
                userId= {userId}
                productId={cartItem.product._id.toString()}
                initialQty={3} // Текущее количество
                initialPrice={cartItem.price} // Цена за единицу товара
                />
            </div>
        </div>
    );
}