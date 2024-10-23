// import React from 'react';
// import { Search, UserPlus } from 'lucide-react';
// import AddVoterModal from '../components/popu.jsx';

// const VoterListPage = () => {
//   const [isModalOpen, setIsModalOpen] = React.useState(false);
//   const [voters, setVoters] = React.useState([
//     { voterId: "V001", name: "John Smith", email: "john.smith@email.com", gender: "Male" },
//     { voterId: "V002", name: "Sarah Johnson", email: "sarah.j@email.com", gender: "Female" },
//     { voterId: "V003", name: "Michael Chen", email: "m.chen@email.com", gender: "Male" },
//     { voterId: "V004", name: "Emma Wilson", email: "emma.w@email.com", gender: "Female" },
//     { voterId: "V005", name: "Alex Thompson", email: "alex.t@email.com", gender: "Non-binary" },
//   ]);

//   const handleAddVoter = (newVoter) => {
//     setVoters([...voters, newVoter]);
//   };

//   return (
//     <div className="px-4 py-10 sm:px-6 lg:px-8">
//       {/* Voter Count Card */}
//       <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 md:p-10 mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">
//           Voter Count: {voters.length}
//         </h2>
//       </div>

//       {/* Table Section */}
//       <div className="flex flex-col">
//         <div className="-m-1.5 overflow-x-auto">
//           <div className="p-1.5 min-w-full inline-block align-middle">
//             <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
//               {/* Header with Search and Add Button */}
//               <div className="px-6 py-4 flex justify-between items-center border-b border-gray-200">
//                 <h2 className="text-xl font-semibold text-gray-800">
//                   Voters List
//                 </h2>
//                 <div className="flex items-center gap-4">
//                   <div className="relative">
//                     <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4">
//                       <Search className="h-4 w-4 text-gray-400" />
//                     </div>
//                     <input
//                       type="text"
//                       className="py-2 px-4 ps-11 block w-72 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
//                       placeholder="Search voters..."
//                     />
//                   </div>
//                   <button 
//                     type="button"
//                     className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
//                     data-hs-overlay="#add-voter-modal"
//                     onClick={() => setIsModalOpen(true)}
//                   >
//                     <UserPlus className="h-4 w-4" />
//                     Add Voter
//                   </button>
//                 </div>
//               </div>

//               {/* Table */}
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead>
//                   <tr>
//                     <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Voter ID</th>
//                     <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Name</th>
//                     <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Email</th>
//                     <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Gender</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {voters.map((voter) => (
//                     <tr key={voter.voterId}>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{voter.voterId}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{voter.name}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{voter.email}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{voter.gender}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>

//               {/* Pagination */}
//               <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200">
//                 <div>
//                   <p className="text-sm text-gray-600">
//                     Showing <span className="font-semibold text-gray-800">1</span> to <span className="font-semibold text-gray-800">{voters.length}</span> of entries
//                   </p>
//                 </div>

//                 <div className="inline-flex gap-x-2">
//                   <button
//                     type="button"
//                     className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
//                   >
//                     <svg className="flex-shrink-0 w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                       <path d="m15 18-6-6 6-6"/>
//                     </svg>
//                     Previous
//                   </button>

//                   <button
//                     type="button"
//                     className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
//                   >
//                     Next
//                     <svg className="flex-shrink-0 w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                       <path d="m9 18 6-6-6-6"/>
//                     </svg>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <AddVoterModal 
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onSubmit={handleAddVoter}
//       />
//     </div>
//   );
// };

// export default VoterListPage;


import React from 'react';
import { Search, UserPlus, Trash2 } from 'lucide-react';
import AddVoterModal from '../components/popu.jsx';

const VoterListPage = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [voters, setVoters] = React.useState([
    { voterId: "V001", name: "John Smith", email: "john.smith@email.com", gender: "Male" },
    { voterId: "V002", name: "Sarah Johnson", email: "sarah.j@email.com", gender: "Female" },
    { voterId: "V003", name: "Michael Chen", email: "m.chen@email.com", gender: "Male" },
    { voterId: "V004", name: "Emma Wilson", email: "emma.w@email.com", gender: "Female" },
    { voterId: "V005", name: "Alex Thompson", email: "alex.t@email.com", gender: "Non-binary" },
  ]);

  const handleAddVoter = (newVoter) => {
    setVoters([...voters, newVoter]);
  };

  const handleDeleteVoter = (voterId) => {
    setVoters(voters.filter(voter => voter.voterId !== voterId));
  };

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      {/* Voter Count Card */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 md:p-10 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Voter Count: {voters.length}
        </h2>
      </div>

      {/* Table Section */}
      <div className="flex flex-col">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              {/* Header with Search and Add Button */}
              <div className="px-6 py-4 flex justify-between items-center border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  Voters List
                </h2>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="py-2 px-4 ps-11 block w-72 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                      placeholder="Search voters..."
                    />
                  </div>
                  <button 
                    type="button"
                    className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <UserPlus className="h-4 w-4" />
                    Add Voter
                  </button>
                </div>
              </div>

              {/* Table */}
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Voter ID</th>
                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Gender</th>
                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {voters.map((voter) => (
                    <tr key={voter.voterId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{voter.voterId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{voter.voterId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{voter.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{voter.gender}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleDeleteVoter(voter.voterId)}
                          className="inline-flex items-center gap-x-1 text-sm font-semibold rounded-lg border border-transparent bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:pointer-events-none px-3 py-2 transition-colors duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-600">
                    Showing <span className="font-semibold text-gray-800">1</span> to <span className="font-semibold text-gray-800">{voters.length}</span> of entries
                  </p>
                </div>

                <div className="inline-flex gap-x-2">
                  <button
                    type="button"
                    className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <svg className="flex-shrink-0 w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="m15 18-6-6 6-6"/>
                    </svg>
                    Previous
                  </button>

                  <button
                    type="button"
                    className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    Next
                    <svg className="flex-shrink-0 w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="m9 18 6-6-6-6"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddVoterModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddVoter}
      />
    </div>
  );
};

export default VoterListPage;