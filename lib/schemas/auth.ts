import * as z from 'zod'
import { State } from 'country-state-city'

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  country: z.string().min(1, 'Please select a country'),
  state: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
}).superRefine((data, ctx) => {
  if (data.country) {
    const availableStates = State.getStatesOfCountry(data.country)
    
    if (availableStates.length > 0 && !data.state) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['state'],
        message: 'This country requires a state selection',
      })
    }
  }
})

export type SignupFormValues = z.infer<typeof signupSchema>
