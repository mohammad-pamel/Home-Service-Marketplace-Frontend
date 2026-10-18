
import CreateCategoryForm from "@/components/form/create-category-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

export default function CategoryCreateDialog() {

  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="lg" />}>
        Create Category
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Category</DialogTitle>
          <DialogDescription>
            This category will be visible to customer
          </DialogDescription>
        </DialogHeader>
        <CreateCategoryForm handleClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}