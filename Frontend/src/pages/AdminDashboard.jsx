import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getElections, createElection, reset, updateElectionEligibility } from '../redux/electionSlice';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { Plus, UserPlus, Play, Square, CheckSquare, Users } from 'lucide-react';
import VoterSelectionModal from '../components/VoterSelectionModal';

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const { elections, isLoading } = useSelector((state) => state.election);

    // Create Election Form State
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newElection, setNewElection] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
    });

    // Add Candidate State
    const [selectedElectionId, setSelectedElectionId] = useState(null);
    const [showCandidateForm, setShowCandidateForm] = useState(false);
    const [newCandidate, setNewCandidate] = useState({
        name: '',
        party: '',
        image: 'https://via.placeholder.com/150', // Default placeholder
    });

    // Eligibility Modal State
    const [showEligibilityModal, setShowEligibilityModal] = useState(false);

    useEffect(() => {
        dispatch(getElections());
        return () => { dispatch(reset()); };
    }, [dispatch]);

    const handleCreateElection = (e) => {
        e.preventDefault();
        dispatch(createElection(newElection)).unwrap()
            .then(() => {
                toast.success('Election created successfully');
                setShowCreateForm(false);
                setNewElection({ title: '', description: '', startDate: '', endDate: '' });
                dispatch(getElections()); // Refresh
            })
            .catch((err) => toast.error(err));
    };

    const handleStatusChange = async (id, status) => {
        try {
            await api.patch(`/elections/${id}/status`, { status });
            toast.success(`Election status updated to ${status}`);
            dispatch(getElections());
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleUpdateEligibility = (eligibilityData) => {
        dispatch(updateElectionEligibility({ id: selectedElectionId, eligibilityData }))
            .unwrap()
            .then(() => {
                toast.success('Election eligibility updated');
                setShowEligibilityModal(false);
                dispatch(getElections());
            })
            .catch((err) => toast.error(err));
    };

    const handleAddCandidate = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/elections/${selectedElectionId}/candidates`, newCandidate);
            toast.success('Candidate added successfully');
            setShowCandidateForm(false);
            setNewCandidate({ name: '', party: '', image: 'https://via.placeholder.com/150' });
        } catch (error) {
            toast.error('Failed to add candidate');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2"
                >
                    <Plus className="h-5 w-5" /> Create Election
                </button>
            </div>

            {/* Create Election Form */}
            {showCreateForm && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-8 animate-fade-in">
                    <h2 className="text-xl font-bold mb-4">Create New Election</h2>
                    <form onSubmit={handleCreateElection} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="Title" required
                            className="border p-2 rounded"
                            value={newElection.title} onChange={(e) => setNewElection({ ...newElection, title: e.target.value })} />
                        <input type="text" placeholder="Description" required
                            className="border p-2 rounded"
                            value={newElection.description} onChange={(e) => setNewElection({ ...newElection, description: e.target.value })} />
                        <input type="datetime-local" required
                            className="border p-2 rounded"
                            value={newElection.startDate} onChange={(e) => setNewElection({ ...newElection, startDate: e.target.value })} />
                        <input type="datetime-local" required
                            className="border p-2 rounded"
                            value={newElection.endDate} onChange={(e) => setNewElection({ ...newElection, endDate: e.target.value })} />
                        <div className="md:col-span-2 flex justify-end gap-2">
                            <button type="button" onClick={() => setShowCreateForm(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded">Cancel</button>
                            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Create</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Candidate Form Modal/Inline */}
            {showCandidateForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Add Candidate</h2>
                        <form onSubmit={handleAddCandidate} className="flex flex-col gap-4">
                            <input type="text" placeholder="Candidate Name" required
                                className="border p-2 rounded"
                                value={newCandidate.name} onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })} />
                            <input type="text" placeholder="Party / Affiliation" required
                                className="border p-2 rounded"
                                value={newCandidate.party} onChange={(e) => setNewCandidate({ ...newCandidate, party: e.target.value })} />
                            <div className="flex justify-end gap-2 mt-2">
                                <button type="button" onClick={() => setShowCandidateForm(false)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add Candidate</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Eligibility Modal */}
            {showEligibilityModal && (
                <VoterSelectionModal
                    election={elections.find(e => e._id === selectedElectionId)}
                    onClose={() => setShowEligibilityModal(false)}
                    onSave={handleUpdateEligibility}
                />
            )}

            {/* Elections List */}
            <div className="grid gap-6">
                {isLoading ? <p>Loading...</p> : elections.map(election => (
                    <div key={election._id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-indigo-500">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    {election.title}
                                    <span className={`text-xs px-2 py-1 rounded-full ${election.status === 'active' ? 'bg-green-100 text-green-800' : election.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {election.status}
                                    </span>
                                </h3>
                                <p className="text-gray-600 mt-1">{election.description}</p>
                                <div className="text-sm text-gray-500 mt-2">
                                    {new Date(election.startDate).toLocaleString()} - {new Date(election.endDate).toLocaleString()}
                                </div>
                                <div className="mt-2 text-sm">
                                    <span className="font-semibold text-gray-700">Eligibility: </span>
                                    <span className="capitalize text-indigo-600">{election.eligibility?.replace('_', ' ') || 'Open'}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                {(election.status === 'draft' || election.status === 'active') && (
                                    <button
                                        onClick={() => { setSelectedElectionId(election._id); setShowEligibilityModal(true); }}
                                        className="bg-purple-50 text-purple-600 px-3 py-1 rounded hover:bg-purple-100 flex items-center gap-1 text-sm font-medium"
                                    >
                                        <Users className="h-4 w-4" /> Eligibility
                                    </button>
                                )}

                                {election.status === 'draft' && (
                                    <button
                                        onClick={() => { setSelectedElectionId(election._id); setShowCandidateForm(true); }}
                                        className="bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100 flex items-center gap-1 text-sm font-medium"
                                    >
                                        <UserPlus className="h-4 w-4" /> Add Candidate
                                    </button>
                                )}

                                {election.status === 'draft' && (
                                    <button onClick={() => handleStatusChange(election._id, 'active')} className="bg-green-50 text-green-600 px-3 py-1 rounded hover:bg-green-100 flex items-center gap-1 text-sm font-medium">
                                        <Play className="h-4 w-4" /> Start
                                    </button>
                                )}
                                {election.status === 'active' && (
                                    <button onClick={() => handleStatusChange(election._id, 'completed')} className="bg-red-50 text-red-600 px-3 py-1 rounded hover:bg-red-100 flex items-center gap-1 text-sm font-medium">
                                        <Square className="h-4 w-4" /> End
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
