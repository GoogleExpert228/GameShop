interface CreateOrderButtonProps {
    userId: string;
    address: string;
    cardHolder: string;
    cardNumber: string;
    onSuccess?: () => void; // Callback для обновления состояния или редиректа после успешного заказа
  }
  
  export default function CreateOrderButton({
    userId,
    address,
    cardHolder,
    cardNumber,
    onSuccess,
  }: CreateOrderButtonProps) {
    const placeOrder = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address, cardHolder, cardNumber }),
        });
  
        if (response.ok) {
         // const data = await response.json();
          alert('Order placed successfully!');
          if (onSuccess) onSuccess(); // Вызываем callback при успехе
        } else {
          const error = await response.json();
          alert(`Error placing order: ${error.error}`);
        }
      } catch (error) {
        console.error('Error placing order:', error);
        alert('An unexpected error occurred.');
      }
    };
  
    return (
      <button
        type="button"
        onClick={placeOrder}
        className="w-full bg-gray-600 text-white py-2 px-4 rounded-md text-lg hover:bg-gray-700 transition"
      >
        Place Order
      </button>
    );
  }