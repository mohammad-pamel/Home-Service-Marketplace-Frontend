
import UpdateCategoryForm from "@/components/form/update-category-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

export default function CategoryUpdateDialog() {

  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" className="mr-2" />}>
        Edit
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Category</DialogTitle>
          <DialogDescription>
            This category will be visible to customer
          </DialogDescription>
        </DialogHeader>
        <UpdateCategoryForm handleClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}