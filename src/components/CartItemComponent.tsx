import { CartItem } from "@/models/User";

interface CartItemComponentProps {
    cartItem: CartItem;
}
export default function CartItemComponent({ cartItem }: CartItemComponentProps) {
    return(
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
                <div className="mt-2 flex items-center">
                {/* Кнопка уменьшения */}
                <button className="px-3 py-1 bg-gray-300 text-white rounded-l hover:bg-gray-400">
                    −
                </button>
                {/* Поле для количества */}
                <input
                    type="text"
                    value={cartItem.qty}
                    readOnly
                    className="w-20 h-9 text-center border-t border-b border-gray-300 text-gray-700"
                />
                {/* Кнопка увеличения */}
                <button className="px-3 py-1 bg-gray-300 text-white rounded-r hover:bg-gray-400">
                    +
                </button>
                </div>
            </div>
        </div>
    );
}