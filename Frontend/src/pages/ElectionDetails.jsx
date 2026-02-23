import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getElectionById, getCandidates, castVote, checkVoteStatus, reset } from '../redux/electionSlice';
import { toast } from 'react-toastify';
import { Vote, CheckCircle } from 'lucide-react';
import LiveBackground from '../components/LiveBackground';

const ElectionDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { currentElection, candidates, isLoading, isError, message, isSuccess } = useSelector(
        (state) => state.election
    );

    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [hasVoted, setHasVoted] = useState(false);
    const [checkingVote, setCheckingVote] = useState(true);

    useEffect(() => {
        dispatch(getElectionById(id));
        dispatch(getCandidates(id));

        // Check if user has already voted
        dispatch(checkVoteStatus(id))
            .unwrap()
            .then((data) => {
                if (data.hasVoted) {
                    setHasVoted(true);
                }
                setCheckingVote(false);
            })
            .catch(() => setCheckingVote(false));

        return () => {
            dispatch(reset());
        };
    }, [dispatch, id]);

    useEffect(() => {
        if (isError) {
            toast.error(message);
            // Don't reset immediately if we want to show error
        }
    }, [isError, message]);

    const handleVote = () => {
        if (!selectedCandidate) {
            toast.error('Please select a candidate');
            return;
        }

        dispatch(castVote({ electionId: id, candidateId: selectedCandidate }))
            .unwrap()
            .then(() => {
                toast.success('Vote cast successfully!');
                setHasVoted(true);
                // Optionally navigate to results or dashboard
                setTimeout(() => navigate('/dashboard'), 2000);
            })
            .catch((msg) => {
                toast.error(msg);
            });
    };

    if (isLoading || checkingVote) {
        return <div className="text-center py-10">Loading election details...</div>;
    }

    if (!currentElection) {
        return <div className="text-center py-10">Election not found.</div>;
    }

    if (hasVoted) {
        return (
            <div className="flex flex-col items-center justify-center py-10 bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto mt-10">
                <CheckCircle className="h-20 w-20 text-green-500 mb-4" />
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Thank You for Voting!</h2>
                <p className="text-gray-600 mb-6">Your vote has been recorded for <strong>{currentElection.title}</strong>.</p>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <LiveBackground>
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">{currentElection.title}</h1>
                        <p className="text-gray-600 text-lg mb-4">{currentElection.description}</p>
                        <div className="flex gap-4 text-sm text-gray-500">
                            <span>Start: {new Date(currentElection.startDate).toLocaleDateString()}</span>
                            <span>End: {new Date(currentElection.endDate).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Vote className="h-6 w-6 text-indigo-600" />
                        Select Your Candidate
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {candidates.map((candidate) => (
                            <div
                                key={candidate._id}
                                onClick={() => setSelectedCandidate(candidate._id)}
                                className={`bg-white rounded-lg shadow-sm border-2 cursor-pointer transition-all duration-200 transform hover:scale-102 p-4 flex items-center gap-4
                                    ${selectedCandidate === candidate._id ? 'border-indigo-600 ring-2 ring-indigo-100' : 'border-gray-200 hover:border-indigo-300'}
                                `}
                            >
                                <div className="h-16 w-16 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden">
                                    {/* Placeholder for image */}
                                    <img src={`https://ui-avatars.com/api/?name=${candidate.name}&background=random`} alt={candidate.name} className="h-full w-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">{candidate.name}</h3>
                                    <p className="text-gray-600">{candidate.party}</p>
                                </div>
                                <div className="ml-auto">
                                    <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center
                                        ${selectedCandidate === candidate._id ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'}
                                    `}>
                                        {selectedCandidate === candidate._id && <div className="h-2 w-2 bg-white rounded-full" />}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={handleVote}
                            disabled={!selectedCandidate}
                            className={`px-8 py-3 rounded-md text-white font-bold text-lg shadow-lg
                                ${selectedCandidate ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'}
                            `}
                        >
                            Submit Vote
                        </button>
                    </div>
                </div>
            </div>
        </LiveBackground>
    );
};

export default ElectionDetails;
