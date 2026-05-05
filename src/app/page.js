"use client"
import UserDetails from "@/components/UserDetails";
import UserForm from "@/components/UserFrom";
import UserList from "@/components/UserList";
import { useState } from "react";


export default function Home() {
  const [selectedUser, setSelectedUser] = useState(null)
  const [viewUser, setViewUser] = useState(null)
  return (
    <>
    <div className="min-h-screen flex flex-col items-center justify-start pt-10 gap-6">
      <UserForm selectedUser={selectedUser} clearSelection={() => setSelectedUser(null)}/>
    
    <UserList onEditUser={setSelectedUser} onViewUser={setViewUser}/>

    <UserDetails user={viewUser} onClose={() => setViewUser(null)} />
    </div>
    
    </>
  );
}

