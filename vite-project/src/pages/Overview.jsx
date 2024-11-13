import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from "recharts";
import videoFile from "../assets/giphy.mp4";

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
  const [electionHasNotStarted, setElectionHasNotStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timeRemainingEnd, setTimeRemainingEnd] = useState(0);
  const [votersVotedNow, setVotersVotedNow] = useState(0);
  const electionId = localStorage.getItem("election_id");
  const serverUrl = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${serverUrl}/api/election/${electionId}/results`
        ); // Replace with your API endpoint
        const data = await response.json();
        if (!response.ok && response.status === 403) {
          setElectionOngoing(true);
          setEndTime(data.end_time);
          setVotersVotedNow(data.voters_voted);
          setLoading(false);
          return;
        }

        if (!response.ok && response.status === 402) {
          setElectionHasNotStarted(true);
          setStartTime(data.start_time);
          setLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch election data");
        }
        console.log(data);
        setStats(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Set up an interval to update the countdown every second
    const interval = setInterval(() => {
      const currentTime = Date.now();
      const remainingTime = startTime - currentTime;
      const remainingTimeEnd = currentTime - endTime;
      if (remainingTime <= 0) {
        // If time is up, clear the interval
        clearInterval(interval);
        setTimeRemaining(0);
      } else {
        setTimeRemaining(remainingTime);
      }

      if (remainingTimeEnd<=0) {
        clearInterval(interval);
        setTimeRemainingEnd(0);
      } else {
        setTimeRemainingEnd(remainingTimeEnd);
      }
    }, 1000);

    // Clean up interval when the component unmounts
    return () => clearInterval(interval);
  }, [startTime,endTime]);

  const COLORS = ["#4F46E5", "#38BDF8", "#94A3B8"];
  const RADIAN = Math.PI / 180;

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const formatTime = (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (electionHasNotStarted) {
    return (
      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 mx-auto">
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Election has not started yet.
        </h2>
        <p className="text-center text-gray-600">
          Please check back after the election starts.
        </p>
        <p className="text-center text-gray-600 mt-4">
          Time remaining until election: <span className="font-bold">{formatTime(timeRemaining)}</span>
        </p>
      </div>
    </div>
    );
  }
  if (electionOngoing)
    return (
      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 mx-auto">
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Election is still ongoing.
          </h2>
          <p className="text-center text-gray-600">
            Results will be available after the election ends.
          </p>

          <div className="mt-4">
            <video className="w-full max-w-md mx-auto" autoPlay loop muted>
              <source src={videoFile} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <p className="text-center text-gray-600 mt-4">
          Time remaining until election ends: <span className="font-bold">{formatTime(timeRemainingEnd)}</span>
          </p>
          <p className="text-center text-gray-600 mt-4">
            Voters voted now: <span className="font-bold">{votersVotedNow}</span>
          </p>
        </div>
      </div>
    );

  return (
    <div className="w-full p-6 bg-white">
      {/* Header */}
      <div className="text-center mb-8 p-4 bg-indigo-50 rounded-lg">
        <h1 className="text-2xl font-bold text-indigo-900">
          {stats.electionTitle}
        </h1>
      </div>

      {/* Date and Voter Stats */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            Election Start Date
          </h3>
          <p className="text-2xl font-bold text-blue-600">{stats.startDate}</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-sm font-medium text-green-800 mb-2">
            Election End Date
          </h3>
          <p className="text-2xl font-bold text-green-600">{stats.endDate}</p>
        </div>
        <div className="bg-indigo-50 p-6 rounded-lg">
          <h3 className="text-sm font-medium text-indigo-800 mb-2">
            Total Voters
          </h3>
          <p className="text-2xl font-bold text-indigo-600">
            {stats.totalVoters}
          </p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg">
          <h3 className="text-sm font-medium text-purple-800 mb-2">
            Voters Voted
          </h3>
          <p className="text-2xl font-bold text-purple-600">
            {stats.votersVoted}
          </p>
        </div>
      </div>

       {/* Winner Section */}
    <div className="bg-yellow-50 p-6 mb-8 rounded-lg text-center">
      <h2 className="text-xl font-semibold text-yellow-800 mb-2">The Winner</h2>
      <p className="text-3xl font-bold text-yellow-600">{stats.winner_name}</p>
      <p className="text-lg text-gray-700">Votes: {stats.winner_votes}</p>
    </div>

      {/* Charts */}
      <div className="space-y-8">
        {/* Voting Statistics */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            Voting Statistics
          </h2>
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
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            Gender Distribution
          </h2>
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
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
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
