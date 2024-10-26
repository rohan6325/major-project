import React, { useState } from 'react';

const AddVoterModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: '', email: '', gender: '' });
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-x-hidden overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
      
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="relative bg-white w-full max-w-lg rounded-xl shadow-lg p-6 mx-4">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl font-bold text-gray-800">
              Add New Voter
            </h3>
            <button
              type="button"
              className="flex justify-center items-center w-7 h-7 text-sm font-semibold rounded-lg border border-transparent text-gray-800 hover:bg-gray-100"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <svg className="flex-shrink-0 w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              {/* <div>
                <label htmlFor="voterId" className="block text-sm font-medium mb-2 text-gray-800">Voter ID</label>
                <input
                  type="text"
                  id="voterId"
                  name="voterId"
                  className="py-2 px-3 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                  value={formData.voterId}
                  onChange={handleChange}
                />
              </div> */}

              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-800">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="py-2 px-3 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-800">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="py-2 px-3 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium mb-2 text-gray-800">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  className="py-2 px-3 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-x-2">
              <button
                type="button"
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700"
              >
                Add Voter
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddVoterModal;