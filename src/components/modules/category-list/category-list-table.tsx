"use client"

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useDeleteCategory, useGetAllCategories } from '@/hooks/admin.hook'
import { Category } from '@/types';
import { useState } from 'react'
import CategoryCreateDialog from './category-create-dialog';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import CategoryUpdateDialog from './category-update-dialog';

export default function CategoryListTable() {

    const [confirmDelete, setConfirmDelete] = useState(false);
    
    const { data } = useGetAllCategories();
    const { mutate: remove, isPending: deletePending } = useDeleteCategory();

    const categories= data?.data || [];


     const handleDelete = (id: string) => {
    remove(id, {
      onSuccess: (res) => {
        if (!res.success) {
          toast.add({
            title: "Server Failure",
            description: "Something went wrong. Please try again",
            type: "error",
          });
          return;
        }
        toast.add({
          title: "Category Deleted",
          description: "Category removed successfully",
          type: "success",
        });
        setConfirmDelete(false);
      },
      onError: (err) => {
        toast.add({
          title: "Delete failed",
          description: err.message || "Something went wrong. Please try again",
          type: "error",
        });
      },
    });
  };



  return (
    <div>
        <div className='flex justify-between my-5'>
            <div>

          <Input
            // onChange={(e) => handleSearch(e)}
            type="search"
            placeholder="Search by name"
            />
            </div>
        <CategoryCreateDialog></CategoryCreateDialog>
        </div>
        <Table>
  <TableCaption>A list of your all categories: {categories.length}</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]">Name</TableHead>
      <TableHead>Slug</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="text-right">Action</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {
      categories.map((category: Category) => (<TableRow key={category.id}>
      <TableCell className="font-medium">{category.name}</TableCell>
      <TableCell>{category.slug}</TableCell>
      <TableCell>{category.isActive ? "true" : "false"}</TableCell>
      <TableCell className="text-right">
        {/* <Button className="bg-red-100 hover:bg-red-400 text-red-600" onClick={() => handleDelete(category.id)}>Delete</Button> */}
        <CategoryUpdateDialog></CategoryUpdateDialog>
        {!confirmDelete && (
            <Button className="bg-red-100 hover:bg-red-400 text-red-600" variant="destructive" onClick={() => setConfirmDelete(true)}>Delete</Button>
        )}

        {
            confirmDelete && (
                 <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setConfirmDelete(false)}
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          size="sm"
        //   onClick={handleDelete}
        onClick={() => handleDelete(category.id)}
          disabled={deletePending}
        >
          Confirm
        </Button>
      </div>
            )
        }
        
      </TableCell>
    </TableRow>))
    }
  </TableBody>
</Table>

    </div>
  )
}
