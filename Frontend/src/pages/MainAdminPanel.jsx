import { useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { Users, CheckCircle, XCircle, Shield, Ban, UserPlus } from 'lucide-react';
import LiveBackground from '../components/LiveBackground';
import UserTable from '../components/UserTable';

const MainAdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCreateAdmin, setShowCreateAdmin] = useState(false);
    const [adminFormData, setAdminFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const { name, email, password } = adminFormData;

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
    const onChange = (e) => {
        setAdminFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        try {
            await api.post('/users/create-admin', adminFormData);
            toast.success('Admin created successfully');
            setShowCreateAdmin(false);
            setAdminFormData({ name: '', email: '', password: '' });
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create admin');
        }
    };

    if (loading) return <div className="text-center py-10">Loading admin panel...</div>;

    return (
        <LiveBackground>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center justify-between">
                    <span className="flex items-center gap-2"><Shield className="h-8 w-8 text-indigo-600" /> Main Admin Control</span>
                    <button
                        onClick={() => setShowCreateAdmin(!showCreateAdmin)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
                    >
                        <UserPlus className="h-5 w-5" />
                        {showCreateAdmin ? 'Cancel' : 'Create Admin'}
                    </button>
                </h1>

                {showCreateAdmin && (
                    <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-indigo-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Create New Admin</h2>
                        <form onSubmit={handleCreateAdmin}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={name}
                                        onChange={onChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={email}
                                        onChange={onChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={password}
                                        onChange={onChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded"
                                >
                                    Create Admin
                                </button>
                            </div>
                        </form>
                    </div>
                )}

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
                    <UserTable
                        users={users}
                        showActions={true}
                        onUpdateStatus={updateUserStatus}
                        onUpdateRole={updateUserRole}
                    />
                </div>
            </div>
        </LiveBackground>
    );
};

export default MainAdminPanel;
