import { z } from 'zod'

export const contactInquiryFormSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters.'),
  email: z.string().trim().email('Enter a valid email address.'),
  phone: z.string(),
  firm: z.string(),
  service: z.string().min(1, 'Select a service.'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters.'),
})
