"use client"

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useGetAllUsers } from '@/hooks/admin.hook'
import { User } from '@/types';
import React from 'react'

export default function UserListTable() {
  
    const { data } = useGetAllUsers();

    const users = data?.data || []

    console.log("users", users)
  return (
    <div>
        <Table>
  <TableCaption>A list of your all users: {users.length}</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Phone</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Role</TableHead>
      <TableHead>Auth Provider</TableHead>
      <TableHead className="text-right">Action</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {
      users.map((user: User) => (<TableRow key={user.id}>
      <TableCell className="font-medium">{user.name}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.phone ? user.phone : "---"}</TableCell>
      <TableCell>{user.status}</TableCell>
      <TableCell>{user.role}</TableCell>
      <TableCell>{user.authProvider}</TableCell>
      <TableCell className="text-right"></TableCell>
    </TableRow>))
    }
  </TableBody>
</Table>
    </div>
  )
}
