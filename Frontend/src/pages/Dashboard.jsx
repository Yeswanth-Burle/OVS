import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getElections, reset } from '../redux/electionSlice';
import { Link } from 'react-router-dom';
import { ClipboardList, AlertCircle } from 'lucide-react';
import LiveBackground from '../components/LiveBackground';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { elections, isLoading, isError, message } = useSelector(
        (state) => state.election
    );

    useEffect(() => {
        dispatch(getElections());

        return () => {
            dispatch(reset());
        };
    }, [dispatch]);

    if (isLoading) {
        return <div className="text-center py-10">Loading elections...</div>;
    }

    if (isError) {
        return <div className="text-center text-red-500 py-10">Error: {message}</div>;
    }

    return (
        <LiveBackground>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <ClipboardList className="h-8 w-8 text-indigo-600" />
                    Dashboard
                </h1>

                {elections.length === 0 ? (
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600 text-lg">No elections found at the moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {elections.map((election) => (
                            <div key={election._id} className="bg-white hover:shadow-lg transition-shadow duration-300 rounded-lg overflow-hidden border border-gray-200">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h2 className="text-xl font-bold text-gray-800 line-clamp-1">{election.title}</h2>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full
                                            ${election.status === 'active' ? 'bg-green-100 text-green-800' :
                                                election.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                            }
                                        `}>
                                            {election.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mb-4 line-clamp-2">{election.description}</p>

                                    <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                                        <span>Ends: {new Date(election.endDate).toLocaleDateString()}</span>
                                    </div>

                                    <div className="flex gap-2">
                                        {election.status === 'active' && (
                                            <Link
                                                to={`/election/${election._id}`}
                                                className="flex-1 bg-indigo-600 text-white text-center py-2 rounded-md hover:bg-indigo-700 transition-colors"
                                            >
                                                Vote Now
                                            </Link>
                                        )}
                                        {election.status === 'completed' && (
                                            <Link
                                                to={`/results/${election._id}`}
                                                className="flex-1 bg-gray-600 text-white text-center py-2 rounded-md hover:bg-gray-700 transition-colors"
                                            >
                                                See Results
                                            </Link>
                                        )}
                                        {election.status === 'draft' && (
                                            <button disabled className="flex-1 bg-gray-300 text-gray-500 text-center py-2 rounded-md cursor-not-allowed">
                                                Coming Soon
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </LiveBackground>
    );
};

export default Dashboard;
