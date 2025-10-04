import { Link } from "react-router-dom";

export default function ErrorPage({ error }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4 p-8 max-w-md">
        <h1 className="text-4xl font-bold text-red-600">Oops!</h1>
        <p className="text-xl text-gray-700">
          Sorry, an unexpected error has occurred.
        </p>

        {error && (
          <div className="bg-gray-100 p-4 rounded-lg text-sm text-left">
            <p className="font-semibold">Error details:</p>
            <p className="text-red-600 break-words">
              {error.message || "Unknown error"}
            </p>
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go Home
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 rounded-md transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    </div>
  );
}
