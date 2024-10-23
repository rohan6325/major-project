// AddCandidateModal.jsx
import React, { useState } from 'react';
import { X } from 'lucide-react';

const AddCandidateModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    partyName: '',
    avatarUrl: '/api/placeholder/40/40' // Default placeholder
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newId = `C${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    onSubmit({
      id: newId,
      ...formData
    });
    setFormData({
      name: '',
      partyName: '',
      avatarUrl: '/api/placeholder/40/40'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity"></div>
      
      <div className="fixed inset-0 overflow-hidden">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative transform overflow-hidden rounded-xl bg-white shadow-xl transition-all w-full max-w-lg">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b py-3 px-4">
              <h3 className="font-semibold text-gray-800">
                Add New Candidate
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-transparent text-sm font-semibold text-gray-800 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-4">
              <div className="space-y-4">
                {/* Name Input */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">Candidate Name</label>
                  <input
                    type="text"
                    id="name"
                    className="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                {/* Party Name Input */}
                <div>
                  <label htmlFor="partyName" className="block text-sm font-medium mb-2">Party Name</label>
                  <input
                    type="text"
                    id="partyName"
                    className="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                    value={formData.partyName}
                    onChange={(e) => setFormData(prev => ({ ...prev, partyName: e.target.value }))}
                  />
                </div>

                {/* Photo Upload */}
                <div>
                  <label htmlFor="photo" className="block text-sm font-medium mb-2">Photo</label>
                  <input
                    type="file"
                    id="photo"
                    accept="image/*"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-6 flex justify-end gap-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700"
                >
                  Add Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCandidateModal;