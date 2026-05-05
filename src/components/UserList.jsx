"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";

export default function UserList({ onEditUser, onViewUser}) {
  const {
    users,
    fetchUsers,
    deleteUser,
    updateUser,
    loading,
    error
  } = useUserStore();

  
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);


  return (
    <div className="mt-8 w-full max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Users</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {users.length === 0 && <p>No users found</p>}

      <ul className="space-y-3">
        {users.map((user) => (
          <li
            key={user.id}
            className="p-4 bg-gray-100 rounded-xl flex justify-between items-center"
          >
            
            <div
                className="cursor-pointer"
                onClick={() => onViewUser(user)}
                >
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
             <button
                onClick={(e) => {
                    e.stopPropagation();
                    onEditUser(user);
                    }}
                className="bg-yellow-400 px-2 py-1 rounded"
                >
                    Edit
             </button>

              <button
                onClick={() => deleteUser(user.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}