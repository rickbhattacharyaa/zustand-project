"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";


async function apiRequest(url,options) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Invalid server response");
  }

  if (!res.ok || !data.success) {
    throw new Error(data?.error || "Something went wrong");
  }

  return data.data;
}


export const useUserStore = create()(
  devtools(
    immer((set) => ({
      users: [],
      loading: false,
      error: null,

  
      setUsers: (users) =>
        set(
          (state) => {
            state.users = users;
          },
          false,
          "users/setUsers"
        ),

      addUser: (user) =>
        set(
          (state) => {
            state.users.push(user);
          },
          false,
          "users/addUser"
        ),

      updateUserInStore: (user) =>
        set(
          (state) => {
            const index = state.users.findIndex(
              (u) => u.id === user.id
            );
            if (index !== -1) {
              state.users[index] = user;
            }
          },
          false,
          "users/updateUser"
        ),

      removeUserFromStore: (id) =>
        set(
          (state) => {
            state.users = state.users.filter(
              (u) => u.id !== id
            );
          },
          false,
          "users/removeUser"
        ),

  

      fetchUsers: async () => {
        set(
          (state) => {
            state.loading = true;
            state.error = null;
          },
          false,
          "users/fetch/start"
        );

        try {
          const users = await apiRequest("/api/users");

          set(
            (state) => {
              state.users = users;
              state.loading = false;
            },
            false,
            "users/fetch/success"
          );
        } catch (err) {
          set(
            (state) => {
              state.loading = false;
              state.error = err.message;
            },
            false,
            "users/fetch/error"
          );
        }
      },

      createUser: async (data) => {
        set(
          (state) => {
            state.loading = true;
            state.error = null;
          },
          false,
          "users/create/start"
        );

        try {
          const newUser = await apiRequest("/api/users", {
            method: "POST",
            body: JSON.stringify(data),
          });

          set(
            (state) => {
              state.users.push(newUser);
              state.loading = false;
            },
            false,
            "users/create/success"
          );
        } catch (err) {
          set(
            (state) => {
              state.loading = false;
              state.error = err.message;
            },
            false,
            "users/create/error"
          );
        }
      },


      updateUser: async (id, updates) => {
        set(
          (state) => {
            state.loading = true;
            state.error = null;
          },
          false,
          "users/update/start"
        );

        try {
          const updatedUser = await apiRequest(
            `/api/users/${id}`,
            {
              method: "PUT",
              body: JSON.stringify(updates),
            }
          );

          set(
            (state) => {
              const index = state.users.findIndex(
                (u) => u.id === id
              );
              if (index !== -1) {
                state.users[index] = updatedUser;
              }
              state.loading = false;
            },
            false,
            "users/update/success"
          );
        } catch (err) {
          set(
            (state) => {
              state.loading = false;
              state.error = err.message;
            },
            false,
            "users/update/error"
          );
        }
      },


      deleteUser: async (id) => {
        set(
          (state) => {
            state.loading = true;
            state.error = null;
          },
          false,
          "users/delete/start"
        );

        try {
          await apiRequest(`/api/users/${id}`, {
            method: "DELETE",
          });

          set(
            (state) => {
              state.users = state.users.filter(
                (u) => u.id !== id
              );
              state.loading = false;
            },
            false,
            "users/delete/success"
          );
        } catch (err) {
          set(
            (state) => {
              state.loading = false;
              state.error = err.message;
            },
            false,
            "users/delete/error"
          );
        }
      },
    }))
  )
);