import React from 'react';

export const InputField = ({ label, id, type = 'text', register, error, placeholder, className = '', ...props }) => (
  <div className="w-full">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      id={id}
      type={type}
      {...register(id)}
      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none transition-colors ${error ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-400'} ${className}`}
      placeholder={placeholder}
      {...props}
    />
    {error && <p className="text-red-600 text-xs mt-1">{error.message}</p>}
  </div>
);
