import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { BarChart, Trophy, ArrowLeft } from 'lucide-react';
import LiveBackground from '../components/LiveBackground';
import { toast } from 'react-toastify';

const Results = () => {
    const { id } = useParams();
    const [results, setResults] = useState([]);
    const [election, setElection] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch election details for title
                const electionRes = await api.get(`/elections/${id}`);
                setElection(electionRes.data);

                // Fetch results
                const resultsRes = await api.get(`/results/${id}`);
                setResults(resultsRes.data);
            } catch (error) {
                toast.error('Failed to fetch results');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) return <div className="text-center py-10">Loading results...</div>;

    if (!election) return <div className="text-center py-10">Election not found</div>;

    const totalVotes = results.reduce((acc, curr) => acc + curr.voteCount, 0);
    const winner = results.length > 0 ? results[0] : null;

    return (

        <LiveBackground>
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <Link to="/dashboard" className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Dashboard
                    </Link>

                    <div className="bg-white p-8 rounded-lg shadow-md mb-8 text-center">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">{election.title} - Results</h1>
                        <p className="text-gray-600">Total Votes Cast: <span className="font-bold text-indigo-600">{totalVotes}</span></p>

                        {winner && (
                            <div className="mt-6 flex flex-col items-center animate-bounce-slow">
                                <Trophy className="h-16 w-16 text-yellow-500 mb-2" />
                                <h2 className="text-2xl font-bold text-gray-800">Winner: {winner.name}</h2>
                                <p className="text-gray-600 text-lg">{winner.party}</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <BarChart className="h-6 w-6 text-indigo-600" />
                            Vote Breakdown
                        </h2>

                        <div className="space-y-6">
                            {results.map((candidate, index) => {
                                const percentage = totalVotes === 0 ? 0 : ((candidate.voteCount / totalVotes) * 100).toFixed(1);

                                return (
                                    <div key={candidate._id}>
                                        <div className="flex justify-between items-end mb-1">
                                            <span className="font-semibold text-gray-800">{candidate.name} <span className="text-gray-500 text-sm">({candidate.party})</span></span>
                                            <span className="font-bold text-indigo-600">{candidate.voteCount} votes ({percentage}%)</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                            <div
                                                className={`h-4 rounded-full transition-all duration-1000 ease-out ${index === 0 ? 'bg-green-500' : 'bg-indigo-500'}`}
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {results.length === 0 && (
                            <p className="text-center text-gray-500 py-4">No votes recorded yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </LiveBackground>
    );
};

export default Results;
