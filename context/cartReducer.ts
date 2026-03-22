import { CartState, CartAction, CartItem } from '@/types'

const calculateTotalAmount = (items: CartItem[]) => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

export function cartReducer(state: CartState, action: CartAction) {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id,
      )
      if (existingItem) {
        const newItems = state.items.map((item) =>
          item.id === action.payload.id
            ? { ...action.payload, quantity: item.quantity + 1 }
            : item,
        )
        return {
          items: newItems,
          totalAmount: calculateTotalAmount(newItems),
        }
      } else {
        const newItems = [...state.items, { ...action.payload, quantity: 1 }]
        return {
          items: newItems,
          totalAmount: calculateTotalAmount(newItems),
        }
      }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter((item) => item.id !== action.payload)
      return {
        items: newItems,
        totalAmount: calculateTotalAmount(newItems),
      }
    }

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity < 1) {
        return state
      }

      const newItems = state.items.map((item) =>
        item.id !== action.payload.id
          ? item
          : { ...item, quantity: action.payload.quantity },
      )
      return {
        items: newItems,
        totalAmount: calculateTotalAmount(newItems),
      }
    }

    case 'CLEAR_CART': {
      return {
        items: [],
        totalAmount: 0,
      }
    }

    case 'SET_CART': {
      return {
        items: action.payload,
        totalAmount: calculateTotalAmount(action.payload),
      }
    }
    default:
      return state
  }
}
