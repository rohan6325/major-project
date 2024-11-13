import { useEffect, useState } from "react";
import { Search, UserPlus, Trash2 } from "lucide-react";
import AddVoterModal from "../components/AddVoterModal.jsx";
import axios from "axios";

const VoterListPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [voters, setVoters] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const electionId = localStorage.getItem("election_id");
  // Fetch voters from API when component loads
  useEffect(() => {
    const fetchVoters = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/voters/${electionId}`);
        console.log("Server response:", response.data);
        setVoters(response.data.voters);
        return
      } catch (error) {
        console.error("Error fetching voters:", error);
      }
    };
    fetchVoters();
  }, [electionId, serverUrl]); 
  

  const handleAddVoter = async (newVoter) => {

    try {
      // Call your API to add a candidate
      console.log(newVoter)
      const response = await axios.post(`${serverUrl}/api/voter/register`, {...newVoter, election_id: electionId});

      const addedVoter = await response.data;
      setVoters([...voters, addedVoter]);
      setIsModalOpen(false);

    } catch (error) {
      console.error("Error adding voter:", error);
    }
  };

  const handleDeleteVoter = async (voterId) => {
    try {
      const response = await fetch(`${serverUrl}/api/voter/${voterId}`, {
        // <-- Include serverUrl here
        method: "DELETE",
      });

      if (response.ok) {
        setVoters(voters.filter((voter) => voter.voter_id !== voterId));
      } else {
        console.error("Failed to delete voter");
      }
    } catch (error) {
      console.error("Error deleting voter:", error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredVoters = voters.filter(
    (voter) =>
      voter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voter.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voter.voter_d.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('election_id', electionId);

    setUploading(true);
    setUploadStatus("Uploading...");

    try {
      const response = await axios.post(`${serverUrl}/api/voter/bulk-register`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadStatus(`${response.data.count} voters registered successfully!`);
    } catch (error) {
      setUploadStatus(`Error: ${error.response ? error.response.data.error : error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      {/* Voter Count Card */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Total Voters: {voters.length}
          </h2>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex flex-col">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              {/* Header with Search and Add Button */}
              <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Voters List
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Manage your voters database
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="py-2 px-4 ps-11 block w-full sm:w-72 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                      placeholder="Search voters..."
                      value={searchTerm}
                      onChange={handleSearch}
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
                    <th
                      scope="col"
                      className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                    >
                      Voter ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                    >
                      Gender
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredVoters.map((voter) => (
                    <tr key={voter.voter_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                        {voter.voter_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {voter.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {voter.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {voter.gender}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleDeleteVoter(voter.voter_id)}
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
              <div className="px-4 py-10 sm:px-6 lg:px-8">

              {/* Pagination */}
              <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-600">
                    Showing{" "}
                    <span className="font-semibold text-gray-800">1</span> to{" "}
                    <span className="font-semibold text-gray-800">
                      {filteredVoters.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-gray-800">
                      {voters.length}
                    </span>{" "}
                    entries
                  </p>
                </div>

                <div className="inline-flex gap-x-2">
                  <button
                    type="button"
                    className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <svg
                      className="flex-shrink-0 w-4 h-4"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                    Previous
                  </button>

                  <button
                    type="button"
                    className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    Next
                    <svg
                      className="flex-shrink-0 w-4 h-4"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                </div>
              </div>
                    {/* Upload Section */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800">Bulk Voter Registration</h2>
          <p className="text-sm text-gray-600 mt-1">Upload an Excel file to register multiple voters at once.</p>
        </div>
      </div>

      {/* Upload Form */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          disabled={uploading}
        />
        <button
          className="ml-4 py-2 px-4 bg-blue-600 text-white rounded-lg"
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>

      {uploadStatus && <p className="text-center text-lg text-gray-800">{uploadStatus}</p>}
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
