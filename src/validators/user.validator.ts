import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).max(255, { message: "Name must be 255 characters or less" }),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, { message: "CPF must follow the pattern XXX.XXX.XXX-XX" }),
  birth: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, { message: "Birth date must follow the format DD/MM/YYYY" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
  cep: z.string().min(8, { message: "CEP must be at least 8 characters long" }),
  qualified: z.enum(['yes', 'no'], { message: "Qualified must be either 'yes' or 'no'" }),
}).refine(data => {
  const birthDateParts = data.birth.split('/');
  const birthDate = new Date(+birthDateParts[2], +birthDateParts[1] - 1, +birthDateParts[0]);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 18;
}, {
  message: 'You must be at least 18 years old.',
  path: ['birth'],
});

// Example of how to use the schema with an example user object

export {userSchema}