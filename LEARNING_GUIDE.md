# Task 3: 简易电商购物车 (Next.js API Routes 版)

恭喜你开启 [Task 3]！通过加入 **Next.js Route Handlers (API 路由)** 来模拟真实的后端接口，这个项目不仅能让你横向巩固 React 状态管理，还能纵向体验“全栈”的数据流转过程。

## 🎯 核心学习目标

完成这个项目后，你将完全掌握以下技能：
1. **全局状态管理实践**：彻底理解并在实际项目中运用 `Context API` + `useReducer`，替代简单的 `useState` 应对复杂的状态逻辑。
2. **Next.js API 路由 (Route Handlers)**：掌握如何在 App Router 模式下，利用 `app/api/.../route.ts` 编写简单的 RESTful 接口（GET / POST 请求）。
3. **前后端数据交互**：在客户端组件（Client Components）中通过 `fetch` 或 `SWR/React Query` 请求我们自己写的 API，并处理 Loading 与 Error 状态。
4. **TypeScript 进阶**：为 Action、State、Product 模型定义严谨的接口（Interfaces/Types）。

---

## 🏗️ 推荐的目录结构

为了保持代码的清晰可维护，建议采用以下目录结构：

```text
task3-shopping-cart/
├── app/
│   ├── api/
│   │   └── products/
│   │       └── route.ts         # 📍 提供商品列表的后端 API 接口
│   ├── globals.css              # 全局样式 (Tailwind)
│   ├── layout.tsx               # 根布局 (在这里包裹 CartProvider)
│   └── page.tsx                 # 首页：展示商品列表、购物车触发按钮
├── components/
│   ├── ProductList.tsx          # 商品列表组件
│   ├── ProductCard.tsx          # 单个商品卡片
│   ├── Cart/
│   │   ├── CartSidebar.tsx      # 购物车侧边栏浮层
│   │   └── CartItem.tsx         # 购物车内的单品项
├── context/
│   ├── CartContext.tsx          # 📍 购物车 Context Provider 与自定义 Hook
│   └── cartReducer.ts           # 📍 提取出的 Reducer 函数与纯逻辑
└── types/
    └── index.ts                 # 📍 全局 TypeScript 类型声明 (Product, CartItem, Action...)
```

---

## 🚀 步骤拆解指南

按照以下顺序开发，能让你思路最清晰地一步步深入：

### 第一步：定义数据模型 (Types)
在 `types/index.ts` 中定义基础数据结构。
- `Product` (商品：id, name, price, description, image)
- `CartItem` (购物车项：继承或包含 Product，并增加 quantity 数量)

### 第二步：编写简易后端接口 (API Route)
在 `app/api/products/route.ts` 中，使用 Next.js 的 `GET` 方法返回本地的 JSON 数组（即假装数据库里取出的商品列表）。
```typescript
import { NextResponse } from 'next/server'
// import type { Product } from '@/types'

const mockProducts = [
  { id: 1, name: 'React 进阶指南', price: 99, /* ... */ },
  // ... 其他商品
]

export async function GET() {
  // 可以用 setTimeout 模拟一次网络延迟
  return NextResponse.json(mockProducts)
}
```

### 第三步：攻克核心 - Context 与 useReducer (最重要)
这是这个 Task 的**重中之重**！
1. **定义业务动作 (Actions)**：
   - `ADD_TO_CART`
   - `REMOVE_FROM_CART`
   - `UPDATE_QUANTITY`
   - `CLEAR_CART`
2. **编写 `cartReducer.ts`**：
   处理上述的所有 action，确保返回**全新 (immutable)** 的 state 对象。在更新数量时，要注意如果数量变为 0 则应该从购物车中移除商品。
3. **编写 `CartContext.tsx`**：
   创建 Context 并提供 `CartProvider`，向子组件暴露 state 以及封装好的方法（例如 `addToCart(product)` 而不是直接把 `dispatch` 暴露出去），保持 UI 的整洁。

### 第四步：构建前端 UI 组件
1. 在 `page.tsx` 中 fetch 你的 API (`/api/products`) 获取数据，映射渲染出 `ProductCard`。
2. 在 `CartSidebar.tsx` 中，使用 Context 里的数据渲染购物车商品列表，计算 **总价 (Total Price)** 和 **总数 (Total Quantity)**。
3. 结合 TailwindCSS，给购物车做一个从右侧滑出的侧边栏（Off-canvas Sidebar）效果，增加交互体验。

---

## 💡 最佳实践与思考题

在编写代码时，时刻将这些“行业规范”放在心上：

1. **为什么在 Context 中向外暴露封装好的业务方法，而不是暴露 `dispatch`？**
   *思考*：如果直接暴露 `dispatch`，UI 组件里就会混杂各种拼装 Action payload 的逻辑，导致逻辑分散且难以测试。封装成 `addToCart(product)`，组件只需调用即可，真正做到了**关注点分离**。
2. **Immutability (不可变性)**
   *思考*：在 Reducer 内部修改 state 时，绝对不要直接写 `state.items.push()`。永远使用 `[...state.items, newItem]` 或 `.map` / `.filter` 返回全新的数组引用。
3. **使用 `useMemo` 优化性能（可选进阶）**
   如果判断总价、购物车商品总数的过程很复杂，可以将其封装，也可以结合 `useMemo` 缓存 Provider 传递下去的 `value`。

## 下一步怎么做？

你可以根据上面的目录结构先搭建基础框架。如果你在 **"设计 API 路由的数据结构"** 或是 **"写 useReducer/Context 骨架"** 的任何一步遇到了卡顿，请随时告诉我，我们可以采取结对编程的方式，写一步测一步！
