import { CheckCircle, Ban, Shield, XCircle } from 'lucide-react';

const UserTable = ({ users, showActions, onUpdateStatus, onUpdateRole }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            {showActions && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
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
                                {showActions && (
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex gap-2">
                                            {user.status === 'pending' && (
                                                <button onClick={() => onUpdateStatus(user._id, 'approved')} className="text-green-600 hover:text-green-900" title="Approve">
                                                    <CheckCircle className="h-5 w-5" />
                                                </button>
                                            )}
                                            {user.status !== 'blocked' && user.role !== 'main_admin' && (
                                                <button onClick={() => onUpdateStatus(user._id, 'blocked')} className="text-red-600 hover:text-red-900" title="Block">
                                                    <Ban className="h-5 w-5" />
                                                </button>
                                            )}
                                            {user.status === 'blocked' && (
                                                <button onClick={() => onUpdateStatus(user._id, 'approved')} className="text-green-600 hover:text-green-900" title="Unblock">
                                                    <CheckCircle className="h-5 w-5" />
                                                </button>
                                            )}

                                            {user.role === 'voter' && (
                                                <button onClick={() => onUpdateRole(user._id, 'admin')} className="text-blue-600 hover:text-blue-900" title="Make Admin">
                                                    <Shield className="h-5 w-5" />
                                                </button>
                                            )}
                                            {user.role === 'admin' && (
                                                <button onClick={() => onUpdateRole(user._id, 'voter')} className="text-gray-600 hover:text-gray-900" title="Remove Admin">
                                                    <XCircle className="h-5 w-5" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserTable;
