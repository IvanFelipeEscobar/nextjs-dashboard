"use server";
import { z } from "zod";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn } from "@/auth"
const InvoiceSchema = z.object({
  id: z.string(),
  customerId: z.string({invalid_type_error: 'please select a customer'}),
  amount: z.coerce.number().gt(0, {message: 'please enter amount greater than $0'}),
  status: z.enum(["pending", "paid"], {invalid_type_error: 'please select an invoice status'}),
  date: z.string(),
});
const CreateInvoice = InvoiceSchema.omit({ id: true, date: true });
const UpdateInvoice = InvoiceSchema.omit({ id: true, date: true });
export type State = {
  errors?: {
    customerId?: string[]
    amount?: string[]
    status?: string[]
  }
  message?: string | null
}
export async function createInvoice(prevState: State, formData: FormData) {
    
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }
const { customerId, amount, status} = validatedFields.data
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];
  try {
  await sql`
  INSERT INTO invoices (customer_id, amount, status, date)
  VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
} catch(err) {
    console.error(err)
    return {message: 'db error, failed to craete invoice'}
}
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");

}

export const updateInvoice = async (id: string, prevState: State, formData: FormData) => {
  
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }
  const { customerId, amount, status} = validatedFields.data
  const amountInCents = amount * 100;
  try  {
  await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
      `;}
      catch(err ){
        console.error(err)
        return {message: 'db error, failed to update'}
      }
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
};

export const deleteInvoice = async (id: string) => {
 try { await sql`DELETE FROM invoices where id = ${id}`;
  revalidatePath("/dashboard/invoices");}
  catch(err){
    console.error(err)
    return {message: 'db error, failed to delete'}
  }
};

export const authenticate = async (
  prevState: string | undefined,
  formData: FormData) => {
    try {
      await signIn('credentials', Object.fromEntries(formData))
    } catch (error) {
      if((error as Error).message.includes('CredentialSignin')){
        return 'CredentialSignin'} 
      throw error
    }
  }