"use client";

export default function UserDetails({ user, onClose }) {
  if (!user) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl w-80">
        <h2 className="text-lg font-bold mb-4">User Details</h2>

        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p className="text-xs text-gray-500 mt-2">
          Created: {user.createdAt}
        </p>

        <button
          onClick={onClose}
          className="mt-4 bg-black text-white px-3 py-1 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}