import { useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { Users, CheckCircle, XCircle, Shield, Ban } from 'lucide-react';

const MainAdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const usersRes = await api.get('/users');
            setUsers(usersRes.data);

            const statsRes = await api.get('/users/stats');
            setStats(statsRes.data);

            setLoading(false);
        } catch (error) {
            toast.error('Failed to fetch data');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const updateUserStatus = async (id, status) => {
        try {
            await api.patch(`/users/${id}/status`, { status });
            toast.success(`User status updated to ${status}`);
            fetchData();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const updateUserRole = async (id, role) => {
        try {
            if (!window.confirm(`Are you sure you want to make this user an ${role}?`)) return;
            await api.patch(`/users/${id}/status`, { role }); // Reusing status endpoint which handles role too
            toast.success(`User role updated to ${role}`);
            fetchData();
        } catch (error) {
            toast.error('Failed to update role');
        }
    };

    if (loading) return <div className="text-center py-10">Loading admin panel...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
                <Shield className="h-8 w-8 text-indigo-600" /> Main Admin Control
            </h1>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                        <h3 className="text-gray-500 text-sm font-uppercase">Total Users</h3>
                        <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                        <h3 className="text-gray-500 text-sm font-uppercase">Total Elections</h3>
                        <p className="text-3xl font-bold text-gray-800">{stats.totalElections}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
                        <h3 className="text-gray-500 text-sm font-uppercase">Candidates</h3>
                        <p className="text-3xl font-bold text-gray-800">{stats.totalCandidates}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                        <h3 className="text-gray-500 text-sm font-uppercase">Total Votes</h3>
                        <p className="text-3xl font-bold text-gray-800">{stats.totalVotes}</p>
                    </div>
                </div>
            )}

            {/* User Management Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Users className="h-6 w-6 text-gray-600" /> User Management
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${user.role === 'main_admin' ? 'bg-purple-100 text-purple-800' :
                                                user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${user.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                user.status === 'blocked' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex gap-2">
                                            {user.status === 'pending' && (
                                                <button onClick={() => updateUserStatus(user._id, 'approved')} className="text-green-600 hover:text-green-900" title="Approve">
                                                    <CheckCircle className="h-5 w-5" />
                                                </button>
                                            )}
                                            {user.status !== 'blocked' && user.role !== 'main_admin' && (
                                                <button onClick={() => updateUserStatus(user._id, 'blocked')} className="text-red-600 hover:text-red-900" title="Block">
                                                    <Ban className="h-5 w-5" />
                                                </button>
                                            )}
                                            {user.status === 'blocked' && (
                                                <button onClick={() => updateUserStatus(user._id, 'approved')} className="text-green-600 hover:text-green-900" title="Unblock">
                                                    <CheckCircle className="h-5 w-5" />
                                                </button>
                                            )}

                                            {user.role === 'voter' && (
                                                <button onClick={() => updateUserRole(user._id, 'admin')} className="text-blue-600 hover:text-blue-900" title="Make Admin">
                                                    <Shield className="h-5 w-5" />
                                                </button>
                                            )}
                                            {user.role === 'admin' && (
                                                <button onClick={() => updateUserRole(user._id, 'voter')} className="text-gray-600 hover:text-gray-900" title="Remove Admin">
                                                    <XCircle className="h-5 w-5" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MainAdminPanel;
