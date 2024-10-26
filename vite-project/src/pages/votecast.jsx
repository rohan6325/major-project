import { useEffect, useState } from "react";
import { Check, Circle } from "lucide-react";

const VotingInterface = () => {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const voterId = localStorage.getItem("voter_id")
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await fetch(`${serverUrl}/api/election/candidates/${voterId}`);
        const data = await response.json();
        if (response.ok) {
          setCandidates(data.candidates || []);
        } else {
          setError(data.error || "Failed to load candidates.");
        }
      } catch (err) {
        setError("An error occurred while fetching candidates.");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [voterId, serverUrl]);

  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 mx-auto">
      <div className="flex flex-col">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Election Title
                  </h2>
                </div>
              </div>

              {loading ? (
                <p className="text-center p-4">Loading candidates...</p>
              ) : error ? (
                <p className="text-center text-red-500 p-4">{error}</p>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left">
                        <span className="text-xs font-semibold uppercase tracking-wide text-gray-800">
                          Symbol
                        </span>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left">
                        <span className="text-xs font-semibold uppercase tracking-wide text-gray-800">
                          Candidate Name
                        </span>
                      </th>
                      <th scope="col" className="px-6 py-3 text-right">
                        <span className="text-xs font-semibold uppercase tracking-wide text-gray-800">
                          Select
                        </span>
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {candidates.map((candidate) => (
                      <tr key={candidate.id} className="hover:bg-gray-100">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-x-3">
                            <Circle className="w-6 h-6 text-gray-400" />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-900">
                            {candidate.name}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            <button
                              onClick={() => setSelectedCandidate(candidate.id)}
                              className={`w-6 h-6 rounded border ${
                                selectedCandidate === candidate.id
                                  ? "bg-blue-500 border-blue-500 text-white"
                                  : "border-gray-300 hover:border-blue-500"
                              } flex items-center justify-center transition-colors`}
                            >
                              {selectedCandidate === candidate.id && (
                                <Check className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200">
                <button
                  className={`py-3 px-4 w-full inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent ${
                    selectedCandidate
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={!selectedCandidate}
                >
                  Cast my Vote
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingInterface;
