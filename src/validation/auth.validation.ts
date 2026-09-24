import z from "zod";

export const LoginSchema = z.object({
    email: z.email("Invalid email address"),

      password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(
            /[a-z]/,
            "Password must contain at least 1 lowercase letter",
        )
        .regex(
            /[A-Z]/,
            "Password must contain at least 1 uppercase letter",
        )
        .regex(
            /[0-9]/,
            "Password must contain at least 1 number",
        )
        .regex(
            /[^A-Za-z0-9]/,
            "Password must contain at least 1 special character",
        ),
});


export const userRegistrationSchema = z
  .object({
    name: z
      .string("Not A String!!!!!")
      .min(3, "Name must atleast 3 characters long!!!")
      .max(10),
    email: z.email("Not email!!"),
    password: z
      .string()
      .min(8, "Password Must Minimum 8 Characters Long.")
      .regex(/[a-z]/, "Password must contain atleast 1 Lowercase Letter")
      .regex(/[A-Z]/, "Password must contain atleast 1 Uppercase Letter")

      .regex(/[0-9]/, "Password must contain atleast 1 Number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain atleast 1 Special Character",
      ),
    role: z.string(),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    phone: z
      .string()
      .refine((val) => val === "" || /^(?:\+?880|0)1[3-9]\d{8}$/.test(val), {
        message: "Please provide valid Bangladeshi number",
      })
    //   .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"],
  });

//* GP - 017, 013
//* BL - 019, 014
//* Airtel - 016
//* Robi - 018
//* TeleTalk - 01512345678
//! City Cell - 011 (Already dead)
//! there is no 012
//todo we need to confirm from [3-9]

//? Either +880, 880, 0