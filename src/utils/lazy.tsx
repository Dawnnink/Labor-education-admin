import { ComponentProps, ComponentType, Suspense, lazy } from 'react'

// We use the same parameter types as React.lazy
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const makeLazy = <T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) => {
  const Lazy = lazy(factory)
  const WrappedLazy = (props: ComponentProps<T>) => (
    <Suspense>
      <Lazy {...props} />
    </Suspense>
  )
  return WrappedLazy
}
