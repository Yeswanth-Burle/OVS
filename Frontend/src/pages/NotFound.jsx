import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-6xl font-bold text-indigo-600 mb-4">404</h1>
            <p className="text-2xl text-gray-700 mb-8">Page Not Found</p>
            <Link
                to="/"
                className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
            >
                Go Home
            </Link>
        </div>
    );
};

export default NotFound;
