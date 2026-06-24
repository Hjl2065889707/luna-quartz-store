import { State } from 'country-state-city'
import * as z from 'zod'

// 定义多步注册表单的整体数据结构与校验规则
export const checkoutSchema = z.object({
  firstName: z.string().min(1, '名字不能为空'),
  lastName: z.string().min(1, '姓氏不能为空'),
  address: z.string().min(1, '地址不能为空'),
  phone: z.string().min(1, '手机号不能为空'),
})

// 顺便让 TypeScript 帮我们把这份法律条文自动翻译成 Type 类型，到处都能复用！
export type CheckoutFormValues = z.infer<typeof checkoutSchema>
