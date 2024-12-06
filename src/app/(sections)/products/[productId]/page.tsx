import { Types } from 'mongoose';
import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/handlers';
import ProductDescription from '@/components/ProductDescription';

export default async function Product({
  params,
}: {
  params: { productId: string };
}) {
  // Проверяем, является ли productId допустимым ObjectId
  if (!Types.ObjectId.isValid(params.productId)) {
    notFound();
  }

  try {
    // Получаем продукт по productId
    const product = await getProduct(params.productId);
    
    // Если продукт не найден, отображаем 404 ошибку
    if (!product) {
      notFound();
    }

    return <ProductDescription product={product} />;
  } catch (error) {
    console.error('Error fetching product:', error);
    notFound(); // В случае ошибки при запросе возвращаем 404
  }
}