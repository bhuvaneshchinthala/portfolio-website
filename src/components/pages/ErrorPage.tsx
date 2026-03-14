import React from 'react';

export default function ErrorPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Oops! Something went wrong.</h1>
            <p className="text-gray-400 mb-8">The page you're looking for doesn't exist or an error occurred.</p>
            <a href="/" className="px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition-colors">
                Go Home
            </a>
        </div>
    );
}
