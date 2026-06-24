import { State } from 'country-state-city'
import * as z from 'zod'

// 定义多步注册表单的整体数据结构与校验规则
export const checkoutSchema = z
  .object({
    firstName: z.string().min(1, '名字不能为空'),
    lastName: z.string().min(1, '姓氏不能为空'),
    country: z.string().min(1, 'Please select a country'),
    state: z.string().optional(),
    address: z.string().min(1, '地址不能为空'),
    postcode: z.string().min(1, '邮编不能为空'),
    phone: z.string().min(1, '手机号不能为空'),
  })
  .superRefine((data, ctx) => {
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
export type CheckoutFormValues = z.infer<typeof checkoutSchema>
