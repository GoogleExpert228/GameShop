import { Product } from "@/models/Product";
import { Types } from "mongoose";
import CartItemCounter from "./CartItemCounter";

interface ProductDescriptionProps {
    product: Product & {_id: Types.ObjectId};
    userId: string;
}

export default function ProductDescription ({product, userId}: ProductDescriptionProps) {
    return (
        <div className="flex flex-col px-4 sm:px-6 lg:px-8">
        <h3 className="pb-4 text-3xl font-bold text-gray-900 sm:pb-6 lg:pb-8">
          {product.name}
        </h3>
        
        <div className="w-full h-auto mb-6" key={product._id.toString()}>
          {/* Адаптивная сетка */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4">
            {/* Первый блок (изображение) */}
            <div className="md:col-span-4 flex flex-col items-center">
              <img 
                src={product.img} 
                alt={product.name} 
                className="w-full h-80 mb-4 object-cover rounded" 
              />
              <p className="mt-2 text-3xl font-semibold">{product.price.toFixed(2)} €</p>
               <CartItemCounter productId={product._id.toString()} userId={userId}/>
            </div>  

            {/* Второй блок (описание) */}
            <div className="md:col-span-8 flex flex-col justify-center">
              <p className="text-xl font-bold mb-4">Product details</p> 
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>
    </div>
    );
}
