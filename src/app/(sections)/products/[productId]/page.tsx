import { Types } from 'mongoose';
import { notFound, redirect } from 'next/navigation';
import { getProduct } from '@/lib/handlers';
import ProductDescription from '@/components/ProductDescription';
import { getSession } from '@/lib/auth';


export default async function Product({params,}: {params: { productId: string };}) {

  const session = await getSession();
  
      if (!session || !session.userId) {
          console.error("No session or userId found");
          redirect('/auth/signin');
      }
      
  if (!Types.ObjectId.isValid(params.productId)) {
    notFound();
  }

  try {
    // Получаем продукт по productId
    const product = await getProduct(params.productId);

    if (!product) {
      notFound();
    }

    return (
      <div className="product-page">
        {/* Описание товара */}
        <ProductDescription product={product} userId={session.userId} />

        {/* Компонент для обновления количества в корзине */}
        <div className="mt-6">
          <h3 className="text-lg font-bold">Добавить в корзину</h3>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching product:', error);
    notFound(); // В случае ошибки при запросе возвращаем 404
  }
}
