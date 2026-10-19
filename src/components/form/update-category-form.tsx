import { useForm } from "@tanstack/react-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
// import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
// import { Calendar } from "../ui/calendar";
// import { format } from "date-fns";
import { toast } from "../ui/toast";
// import { useCreateSchedule } from "@/hooks";
// import { scheduleSchema } from "@/validation";
import { Spinner } from "../ui/spinner";
import { useUpdateCategory } from "@/hooks/admin.hook";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

export default function UpdateCategoryForm({
  handleClose,
  category
}: {
  handleClose: () => void;
  category: Category;
}) {
  const { mutate: update, isPending } = useUpdateCategory();

  console.log("category", category)

  const form = useForm({
    defaultValues: {
      name: category.name,
      slug: category.slug,
      description: category.description
    },
    // validators: {
    //   onSubmit: categorySchema,
    // },
    onSubmit: ({ value }) => {
      const categoryValue = {
        name: value.name,
        slug: value.slug,
        description: value.description,
      };

      console.log("categoryValue", categoryValue)

    //   update(categoryValue, {
    //     onSuccess: (res) => {
    //       if (!res.success) {
    //         toast.add({
    //           title: "Server Failure",
    //           description: "Something went wrong. Please try again",
    //           type: "error",
    //         });
    //         return;
    //       }
    //       toast.add({
    //         title: "Category Updated",
    //         description: "Your category is saved as a draft",
    //         type: "success",
    //       });
    //       handleClose();
    //     },
    //     onError: (err: { message: any; }) => {
    //       toast.add({
    //         title: "Category upadate failed",
    //         description:
    //           err.message || "Something went wrong. Please try again",
    //         type: "error",
    //       });
    //       handleClose();
    //     },
    //   });
    update(
  {
    payload: categoryValue,
    categoryId: category.id,
  },
  {
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
        title: "Category Updated",
        description: "Category updated successfully",
        type: "success",
      });

      handleClose();
    },
    onError: (err) => {
      toast.add({
        title: "Category update failed",
        description: err.message || "Something went wrong. Please try again",
        type: "error",
      });
    },
  },
);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        
        {/* <form.Field name="date">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            const selected = field.state.value
              ? new Date(`${field.state.value}T00:00:00`)
              : undefined;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Date</FieldLabel>
                <Popover>
                  <PopoverTrigger render={<Button variant="outline" />}>
                    {selected ? `${format(selected, "PPP")}` : "Select Date"}
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selected}
                      disabled={{ before: new Date() }}
                      onSelect={(date) => {
                        if (date) {
                          field.handleChange(format(date, "yyyy-MM-dd"));
                          field.handleBlur();
                        }
                      }}
                    />
                  </PopoverContent>
                </Popover>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field> */}


        <form.Field name="name">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  autoComplete="off"
                  aria-invalid={isInvalid}
                  value={field.state.value}
                  
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="slug">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Slug</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  autoComplete="off"
                  aria-invalid={isInvalid}
                  value={field.state.value}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="description">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  autoComplete="off"
                  aria-invalid={isInvalid}
                  value={field.state.value}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Spinner /> Submitting
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}