
import { useState } from 'react';
import plants from '../../assets/plants';
import { useWallet } from '../../context/WalletContext'; // Import useWallet

const PlantForm = () => {
  const { creditWallet, debitWallet } = useWallet(); // Only use debitWallet and creditWallet
  const [amount, setAmount] = useState(0);
  const [message, setMessage] = useState('');
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [address, setAddress] = useState({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('money'); // 'money' or 'tokens'

  const handlePlantChange = (e) => {
    const plant = plants.find(p => p.name === e.target.value);
    setSelectedPlant(plant);
  };

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
  };

  const calculatePrice = () => {
    if (!selectedPlant) return;
    let basePrice = 10; // base price for any plant
    if (selectedPlant.type === 'tree') {
      basePrice += 20;
    } else if (selectedPlant.type === 'houseplant' || selectedPlant.type === 'succulent') {
      basePrice += 5;
    }

    if (selectedPlant.size === 'large') {
      basePrice += 15;
    } else if (selectedPlant.size === 'medium') {
      basePrice += 10;
    }

    const totalPrice = basePrice * quantity;
    setPrice(totalPrice);
  };

  const handleOrder = () => {
    setIsModalOpen(true);
  };

  const handlePayment = async () => {
    setIsModalOpen(false);
    try {
      let success = false;

      if (paymentMethod === 'money') {
        success = debitWallet(price);
        if (success) {
          creditWallet(2);
          // No need to credit tokens here since we're using money
          setOrderConfirmed(true);
          setMessage('Order placed successfully with money and you got your green creds!');
        } else {
          setOrderConfirmed(false);
          setMessage('Insufficient funds.');
        }
      } else if (paymentMethod === 'tokens') {
        // Assuming 1 token = $1 for simplicity, adjust as needed
        const tokenCost = price; // Tokens required for purchase
        success = debitWallet(tokenCost);
        if (success) {
          creditWallet(2); // Add 2 extra tokens
          setOrderConfirmed(true);
          setMessage('Order placed successfully with tokens! You got green creds also as our gift to you :).');
        } else {
          setOrderConfirmed(false);
          setMessage('Insufficient tokens.');
        }
      }

      if (success) {
        console.log('Order confirmed with total price:', price);
      }
    } catch (error) {
      setOrderConfirmed(false);
      setMessage('Error processing payment.');
      console.error('Payment error:', error);
    }
  };

  return (
    <div className="mt-20 mb-20 p-30 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="mb-10 text-2xl font-bold text-center">Plant Order Form</h1>
      <div>
        <label className="block text-sm font-medium text-gray-700">Select Plant</label>
        <select
          onChange={handlePlantChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">Select plant</option>
          {plants.map((plant) => (
            <option key={plant.name} value={plant.name}>
              {plant.name}
            </option>
          ))}
        </select>
      </div>
      {selectedPlant && (
        <div className="mt-4">
          <h2 className="text-lg font-bold">{selectedPlant.name}</h2>
          <img
            src={selectedPlant.image}
            alt={selectedPlant.name}
            className="mt-2 w-full h-48 object-cover rounded-md"
          />
          <p>Type: {selectedPlant.type}</p>
          <p>Size: {selectedPlant.size}</p>
          <p>Oxygen Output: {selectedPlant.oxygenOutput}</p>
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700">Quantity</label>
        <input
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <button
        onClick={calculatePrice}
        className="mt-4 bg-blue-500 text-white p-2 rounded-md w-full"
      >
        Calculate Price
      </button>
      {price > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Total Price: GC - {price}</h2>
        </div>
      )}
      {price > 0 && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="money">Pay with Money</option>
            <option value="tokens">Pay with Tokens</option>
          </select>
        </div>
      )}
      {price > 0 && (
        <button
          onClick={handleOrder}
          className="mt-4 bg-green-500 text-white p-2 rounded-md w-full"
        >
          Place Your Order
        </button>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-md w-96">
            <h2 className="text-lg font-bold mb-4">Enter Your Address</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Address Line 1</label>
              <input
                type="text"
                name="addressLine1"
                value={address.addressLine1}
                onChange={handleAddressChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Address Line 2</label>
              <input
                type="text"
                name="addressLine2"
                value={address.addressLine2}
                onChange={handleAddressChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                name="city"
                value={address.city}
                onChange={handleAddressChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">State</label>
              <input
                type="text"
                name="state"
                value={address.state}
                onChange={handleAddressChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Zip Code</label>
              <input
                type="text"
                name="zipCode"
                value={address.zipCode}
                onChange={handleAddressChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <input
                type="text"
                name="country"
                value={address.country}
                onChange={handleAddressChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <button
              onClick={handlePayment}
              className="bg-blue-500 text-white p-2 rounded-md w-full"
            >
              Pay Now
            </button>
          </div>
       


        </div>
      )}
      {orderConfirmed && (
        <div className="mt-4 text-green-600 font-bold">
          Order placed successfully!
        </div>
      )}
      {message && (
        <div className="mt-4 text-red-600 font-bold">
          {message}
        </div>
      )}
    </div>
  );
};

export default PlantForm;
