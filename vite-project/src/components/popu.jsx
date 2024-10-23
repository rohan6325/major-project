import React, { useEffect } from 'react';
import { UserPlus, X, Mail, User, IdCard } from 'lucide-react';

const AddVoterModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = React.useState({
    voterId: '',
    name: '',
    email: '',
    gender: ''
  });

  useEffect(() => {
    // Import Preline from the window object
    const init = async () => {
      if (typeof window !== 'undefined') {
        const { HSOverlay } = await import('preline');
        HSOverlay.autoInit();
      }
    };
    
    init();
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ voterId: '', name: '', email: '', gender: '' });
    onClose();
  };

  return (
    <div 
      id="add-voter-modal" 
      className={`hs-overlay ${isOpen ? 'open' : ''} hidden w-full h-full fixed top-0 start-0 z-[60] overflow-x-hidden overflow-y-auto bg-black bg-opacity-60 backdrop-blur-sm`}
      data-hs-overlay="#add-voter-modal"
    >
      <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <UserPlus className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Add New Voter
                </h2>
              </div>
              <button 
                type="button"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex items-center justify-center"
                data-hs-overlay="#add-voter-modal"
                onClick={onClose}
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="voterId" className="flex items-center gap-2 text-sm font-medium mb-2">
                  <IdCard className="w-4 h-4" />
                  Voter ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="voterId"
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                    required
                    value={formData.voterId}
                    onChange={(e) => setFormData({ ...formData, voterId: e.target.value })}
                    placeholder="Enter voter ID number"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium mb-2">
                  <User className="w-4 h-4" />
                  Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="gender" className="flex items-center gap-2 text-sm font-medium mb-2">
                  <User className="w-4 h-4" />
                  Gender
                </label>
                <div className="relative">
                  <select
                    id="gender"
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                    required
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-x-2 mt-8">
                <button
                  type="button"
                  className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                  data-hs-overlay="#add-voter-modal"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                >
                  Add Voter
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddVoterModal;