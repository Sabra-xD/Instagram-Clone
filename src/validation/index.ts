import * as z from "zod";
export const SignUpValidation = z.object({
    name:z.string().min(2, {message: "Too Short"}),
    username: z.string().min(2, {message:"Too Short"}).max(50),
    email:z.string().email(),
    password: z.string().min(8,{message: "Password must atleast be 8 characters"}),
  });
  

export const SignInValidation = z.object({
  email:z.string().email(),
  password: z.string().min(8,{message: "Please enter your password"}),
})