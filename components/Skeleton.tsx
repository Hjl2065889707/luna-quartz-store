import React from 'react'

const Skeleton = ({ className = '' }: { className?: string }) => {
  return <div className={`animate-pulse rounded-lg bg-zinc-200 ${className}`} />
}

export default Skeleton
