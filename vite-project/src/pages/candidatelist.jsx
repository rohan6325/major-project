// CandidateListPage.jsx
import { useState, useEffect } from 'react';
import { Search, UserPlus } from 'lucide-react';
import AddCandidateModal from '../components/pop2.jsx';
import axios from 'axios';

const CandidateListPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const electionId = localStorage.getItem('election_id'); // Retrieve the election ID from local storage

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/candidates/${electionId}`);
        setCandidates(response.data.candidates);
      } catch (error) {
        setError('Failed to fetch candidates. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [electionId, serverUrl, candidates]);

  const handleAddCandidate = async (newCandidate) => {
    try {
      // Call your API to add a candidate
      console.log(newCandidate)
      const response = await axios.post(`${serverUrl}/api/candidate/create`, {...newCandidate, election_id:electionId}); // Adjust the endpoint if necessary
      setCandidates([...candidates, response.data]);
      setIsModalOpen(false);
    } catch (error) {
      setError('Failed to add candidate. Please try again.');
    }
  };

  const handleRemoveCandidate = (candidateId) => {
    setCandidates(candidates.filter(candidate => candidate.id !== candidateId));
  };

  if (loading) {
    return <div>Loading candidates...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      {/* Candidate Count Card */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 md:p-10 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Candidate Count: {candidates.length}
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
                  Candidates List
                </h2>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="py-2 px-4 ps-11 block w-72 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                      placeholder="Search candidates..."
                    />
                  </div>
                  <button 
                    type="button"
                    className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <UserPlus className="h-4 w-4" />
                    Add Candidate
                  </button>
                </div>
              </div>

              {/* Table */}
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Avatar</th>
                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Candidate ID</th>
                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Party Name</th>
                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {candidates.map((candidate) => (
                    <tr key={candidate.candidate_id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={candidate.avatar_url}
                          alt={`${candidate.name}'s avatar`}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{candidate.candidate_id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{candidate.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{candidate.party_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        <button
                          onClick={() => handleRemoveCandidate(candidate.candidate_id)}
                          className="py-1 px-2 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all text-sm"
                        >
                          Remove
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
                    Showing <span className="font-semibold text-gray-800">1</span> to <span className="font-semibold text-gray-800">{candidates.length}</span> of entries
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

      <AddCandidateModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddCandidate}
      />
    </div>
  );
};

export default CandidateListPage;
