"use client";

import React, { useState, useEffect } from "react";
import * as z from "zod";
import { useUserStore } from "@/store/useUserStore";


const formSchema = z.object({
  name: z
    .string()
    .min(2, "Minimum length must be 2")
    .max(20, "Maximum length must be 20"),
  email: z.string().email("Invalid email"),
});


function UserForm({selectedUser, clearSelection}) {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});


  useEffect(()=>{
    if(selectedUser){
        setName(selectedUser.name || "")
        setEmail(selectedUser.email || "")
    }else{
        setName("")
        setEmail("")
    }
  },[selectedUser])

  const { createUser, updateUser, loading, error } = useUserStore();

  
  const createUsers = async (e) => {
    e.preventDefault();

    
    setErrors({});

   
    const result = formSchema.safeParse({ name, email });

    if (!result.success) {
      const fieldErrors = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] ;
        fieldErrors[field] = issue.message;
      });

      setErrors(fieldErrors);
      return;
    }


  if (selectedUser) {
    
    await updateUser(selectedUser.id, { name, email });
    clearSelection()
  } else {
    
    await createUser({ name, email });
  }

    if (!useUserStore.getState().error) {
      setName("");
      setEmail("");
      setErrors({});
     
    }
  };

  
  return (
    <div className="flex flex-col items-center pt-10">
      <form
        onSubmit={createUsers}
        className="border rounded-2xl p-10 w-96 bg-blue-200 flex flex-col"
      >
       
        <label className="text-sm font-semibold">Name</label>
        <input
          type="text"
          value={name}
          placeholder="Enter your Name"
          onChange={(e) => {
            setName(e.target.value);
            setErrors((prev) => ({ ...prev, name: undefined }));
          }}
          className="border rounded-xl bg-gray-300 p-2 mt-2"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}

        
        <label className="text-sm font-semibold mt-4">Email</label>
        <input
          type="text"
          value={email}
          placeholder="Enter your Email"
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((prev) => ({ ...prev, email: undefined }));
          }}
          className="border rounded-xl bg-gray-300 p-2 mt-2"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}

       
        {error && (
          <p className="text-red-600 text-sm mt-3 text-center">{error}</p>
        )}

       
    <button
        type="submit"
        disabled={loading}
        className="mt-6 bg-black text-white p-2 rounded-xl disabled:opacity-50"
        >
        {loading
            ? "Saving..."
            : selectedUser
            ? "Update User"
            : "Create User"}
        </button>
      </form>
    </div>
  );
}

export default UserForm;