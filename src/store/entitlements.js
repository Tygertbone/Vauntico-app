import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useEntitlements = create(
  persist(
    (set, get) => ({
      entitlements: {}, // { [email]: { tier: 'Practitioner'|'Guild'|'Oracle', status: 'active'|'inactive' } }
      setEntitlement(email, data) {
        set((state) => ({ entitlements: { ...state.entitlements, [email]: data } }))
      },
      removeEntitlement(email) {
        set((state) => {
          const next = { ...state.entitlements }
          delete next[email]
          return { entitlements: next }
        })
      },
    }),
    {
      name: 'vauntico-entitlements'
    }
  )
)

export default useEntitlements
