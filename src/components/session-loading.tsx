"use client"

export function SessionLoading() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white px-6 py-8 shadow">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-500" />
        <p className="text-sm text-slate-500">Checking session...</p>
      </div>
    </div>
  )
}

type ProtectedShellProps = {
  isLoading: boolean
  isAuthenticated: boolean
  loadingView?: React.ReactNode
  unauthenticatedView: React.ReactNode
  children: React.ReactNode
}

export function ProtectedShell({
  isLoading,
  isAuthenticated,
  loadingView,
  unauthenticatedView,
  children,
}: Readonly<ProtectedShellProps>) {
  if (isLoading) {
    return <>{loadingView ?? <SessionLoading />}</>
  }

  if (!isAuthenticated) {
    return <>{unauthenticatedView}</>
  }

  return <>{children}</>
}
