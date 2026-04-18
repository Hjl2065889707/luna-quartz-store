import * as z from 'zod'
import { State } from 'country-state-city'

// 定义多步注册表单的整体数据结构与校验规则
export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  country: z.string().min(1, 'Please select a country'),
  // 因为像 Christmas Island 这种没有省份的国家，所以可以设置为 optional 或者在使用时单独跳过校验
  state: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
}).superRefine((data, ctx) => {
  if (data.country) {
    const availableStates = State.getStatesOfCountry(data.country)
    
    // 如果这个国家明明有可以选的省份，但嫌疑犯留空了
    if (availableStates.length > 0 && !data.state) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['state'], // 👈 这一行是全场 MVP，稍后向你解释
        message: 'This country requires a state selection',
      })
    }
  }
})

// 顺便让 TypeScript 帮我们把这份法律条文自动翻译成 Type 类型，到处都能复用！
export type SignupFormValues = z.infer<typeof signupSchema>
