import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList } from 'recharts';

const ElectionDashboard = () => {
  const [stats, setStats] = useState({
    electionTitle: "",
    startDate: "",
    endDate: "",
    totalVoters: 0,
    votersVoted: 0,
    votingStats: [],
    genderDistribution: [],
  });
  const [electionOngoing, setElectionOngoing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const electionId = localStorage.getItem('election_id');
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await fetch(`${serverUrl}/api/election/${electionId}/results`); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch election data');
        } else if (response.status === 403) {
          setElectionOngoing(true);
        } else {
          const data = await response.json();
          console.log(data);
          setStats(data);
          setLoading(false);
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const COLORS = ['#4F46E5', '#38BDF8', '#94A3B8'];
  const RADIAN = Math.PI / 180;

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (electionOngoing) return <div className='font-bold'>Election is still ongoing. Results will be available after the election ends.</div>;

  return (
    <div className="w-full p-6 bg-white">
      {/* Header */}
      <div className="text-center mb-8 p-4 bg-indigo-50 rounded-lg">
        <h1 className="text-2xl font-bold text-indigo-900">{stats.electionTitle}</h1>
      </div>

      {/* Date and Voter Stats */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Election Start Date</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.startDate}</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-sm font-medium text-green-800 mb-2">Election End Date</h3>
          <p className="text-2xl font-bold text-green-600">{stats.endDate}</p>
        </div>
        <div className="bg-indigo-50 p-6 rounded-lg">
          <h3 className="text-sm font-medium text-indigo-800 mb-2">Total Voters</h3>
          <p className="text-2xl font-bold text-indigo-600">{stats.totalVoters}</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg">
          <h3 className="text-sm font-medium text-purple-800 mb-2">Voters Voted</h3>
          <p className="text-2xl font-bold text-purple-600">{stats.votersVoted}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="space-y-8">
        {/* Voting Statistics */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Voting Statistics</h2>
          <div className="h-64 flex justify-center">
            <BarChart
              width={800}
              height={200}
              data={stats.votingStats}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Bar dataKey="votes" fill="#4F46E5">
                <LabelList dataKey="votes" position="center" fill="white" />
              </Bar>
            </BarChart>
          </div>
        </div>

        {/* Gender Distribution */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Gender Distribution</h2>
          <div className="h-64 flex justify-center">
            <PieChart width={400} height={200}>
              <Pie
                data={stats.genderDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {stats.genderDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {stats.genderDistribution.map((entry, index) => (
              <div key={entry.name} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm text-gray-600">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectionDashboard;
