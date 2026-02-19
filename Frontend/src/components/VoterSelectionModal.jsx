import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllVoters } from '../redux/authSlice';
import { X, Check } from 'lucide-react';

const VoterSelectionModal = ({ election, onClose, onSave }) => {
    const dispatch = useDispatch();
    const { users } = useSelector((state) => state.auth);

    // Eligibility State
    const [eligibility, setEligibility] = useState(election.eligibility || 'open');
    const [allowedVoters, setAllowedVoters] = useState(election.allowedVoters || []);
    const [blockedVoters, setBlockedVoters] = useState(election.blockedVoters || []);

    // Search State
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(getAllVoters());
    }, [dispatch]);

    // Filter users based on search
    const filteredUsers = users.filter(user =>
        user.role === 'voter' &&
        (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const toggleVoter = (userId, listType) => {
        if (listType === 'allowed') {
            if (allowedVoters.includes(userId)) {
                setAllowedVoters(allowedVoters.filter(id => id !== userId));
            } else {
                setAllowedVoters([...allowedVoters, userId]);
            }
        } else if (listType === 'blocked') {
            if (blockedVoters.includes(userId)) {
                setBlockedVoters(blockedVoters.filter(id => id !== userId));
            } else {
                setBlockedVoters([...blockedVoters, userId]);
            }
        }
    };

    const handleSave = () => {
        onSave({ eligibility, allowedVoters, blockedVoters });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-[80vh] flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-bold">Manage Eligibility: {election.title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto flex-1">
                    {/* Eligibility Mode Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Eligibility Mode</label>
                        <div className="flex gap-4">
                            {['open', 'invite_only', 'blacklisted'].map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => setEligibility(mode)}
                                    className={`px-4 py-2 rounded-md border capitalize ${eligibility === mode
                                            ? 'bg-indigo-600 text-white border-indigo-600'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    {mode.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            {eligibility === 'open' && 'All registered voters can vote.'}
                            {eligibility === 'invite_only' && 'Only selected voters in the "Allowed" list can vote.'}
                            {eligibility === 'blacklisted' && 'All voters can vote EXCEPT those in the "Blocked" list.'}
                        </p>
                    </div>

                    {/* Voter Selection (Only for invite_only or blacklisted) */}
                    {eligibility !== 'open' && (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-lg">
                                    Select Voters to {eligibility === 'invite_only' ? 'Allow' : 'Block'}
                                </h3>
                                <input
                                    type="text"
                                    placeholder="Search voters..."
                                    className="border p-2 rounded w-64"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="border rounded-md max-h-64 overflow-y-auto">
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map(user => (
                                        <div key={user._id} className="flex justify-between items-center p-3 border-b last:border-b-0 hover:bg-gray-50">
                                            <div>
                                                <p className="font-medium">{user.name}</p>
                                                <p className="text-sm text-gray-500">{user.email}</p>
                                            </div>
                                            <button
                                                onClick={() => toggleVoter(user._id, eligibility === 'invite_only' ? 'allowed' : 'blocked')}
                                                className={`p-2 rounded-full ${(eligibility === 'invite_only' ? allowedVoters.includes(user._id) : blockedVoters.includes(user._id))
                                                        ? 'bg-green-100 text-green-600'
                                                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                                    }`}
                                            >
                                                <Check className="h-5 w-5" />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="p-4 text-center text-gray-500">No voters found.</p>
                                )}
                            </div>

                            <div className="mt-2 text-sm text-gray-600">
                                {eligibility === 'invite_only'
                                    ? `${allowedVoters.length} voters allowed.`
                                    : `${blockedVoters.length} voters blocked.`}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t flex justify-end gap-3 bg-gray-50 rounded-b-lg">
                    <button onClick={onClose} className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Save Changes</button>
                </div>
            </div>
        </div>
    );
};

export default VoterSelectionModal;
