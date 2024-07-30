import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

function Success() {
  return (
    <div className="success-page container mx-auto p-6 flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
        <FaCheckCircle size={64} className="text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-gray-700 mb-6">Thank you for your purchase. Your transaction has been completed successfully.</p>
        
        <Link to="/" className="text-white bg-blue-500 hover:bg-blue-700 rounded-lg px-6 py-3 text-lg">
          Go to Home
        </Link>
      </div>
    </div>
  );
}

export default Success;
