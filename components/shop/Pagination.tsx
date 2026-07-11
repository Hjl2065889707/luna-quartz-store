import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

type PaginationProps = {
  currentPage: number
  totalPages: number
  basePath: string
}

const getPageHref = (basePath: string, page: number) => {
  return page === 1 ? basePath : `${basePath}?page=${page}`
}

const getVisiblePages = (currentPage: number, totalPages: number) => {
  const start = Math.max(1, currentPage - 1)
  const end = Math.min(totalPages, currentPage + 1)

  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}

const PageNumber = ({
  page,
  currentPage,
  basePath,
}: {
  page: number
  currentPage: number
  basePath: string
}) => {
  const isCurrentPage = page === currentPage

  if (isCurrentPage) {
    return (
      <span
        aria-current="page"
        className="flex h-10 min-w-10 items-center justify-center rounded-full bg-[#0064E0] px-3 text-sm font-medium text-white"
      >
        {page}
      </span>
    )
  }

  return (
    <Link
      href={getPageHref(basePath, page)}
      aria-label={`Go to page ${page}`}
      className="flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-medium text-[#1C2B33] transition-colors hover:bg-[#F1F4F7]"
    >
      {page}
    </Link>
  )
}

const Pagination = ({
  currentPage,
  totalPages,
  basePath,
}: PaginationProps) => {
  if (totalPages <= 1) {
    return null
  }

  const hasPreviousPage = currentPage > 1
  const hasNextPage = currentPage < totalPages
  const visiblePages = getVisiblePages(currentPage, totalPages)

  return (
    <nav
      aria-label="Pagination"
      className="mt-14 flex flex-col items-center gap-4 border-t border-[#DEE3E9] pt-8"
    >
      <div className="flex items-center gap-2 rounded-full bg-white p-1 shadow-[0_1px_3px_rgba(0,0,0,0.08)] ring-1 ring-[#DEE3E9]">
        {hasPreviousPage ? (
          <Link
            href={getPageHref(basePath, currentPage - 1)}
            aria-label="Go to previous page"
            className="flex h-10 items-center gap-1 rounded-full px-3 text-sm font-medium text-[#1C2B33] transition-colors hover:bg-[#F1F4F7]"
          >
            <ChevronLeft size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Previous</span>
          </Link>
        ) : (
          <span className="flex h-10 cursor-not-allowed items-center gap-1 rounded-full px-3 text-sm font-medium text-[#BCC0C4]">
            <ChevronLeft size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Previous</span>
          </span>
        )}

        {visiblePages[0] > 1 && (
          <>
            <PageNumber page={1} currentPage={currentPage} basePath={basePath} />
            {visiblePages[0] > 2 && (
              <span className="px-1 text-sm font-medium text-[#65676B]">
                ...
              </span>
            )}
          </>
        )}

        {visiblePages.map((page) => (
          <PageNumber
            key={page}
            page={page}
            currentPage={currentPage}
            basePath={basePath}
          />
        ))}

        {visiblePages[visiblePages.length - 1] < totalPages && (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
              <span className="px-1 text-sm font-medium text-[#65676B]">
                ...
              </span>
            )}
            <PageNumber
              page={totalPages}
              currentPage={currentPage}
              basePath={basePath}
            />
          </>
        )}

        {hasNextPage ? (
          <Link
            href={getPageHref(basePath, currentPage + 1)}
            aria-label="Go to next page"
            className="flex h-10 items-center gap-1 rounded-full px-3 text-sm font-medium text-[#1C2B33] transition-colors hover:bg-[#F1F4F7]"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight size={16} aria-hidden="true" />
          </Link>
        ) : (
          <span className="flex h-10 cursor-not-allowed items-center gap-1 rounded-full px-3 text-sm font-medium text-[#BCC0C4]">
            <span className="hidden sm:inline">Next</span>
            <ChevronRight size={16} aria-hidden="true" />
          </span>
        )}
      </div>

      <p className="text-sm text-[#65676B]">
        Page{' '}
        <span className="font-medium text-[#1C2B33]">{currentPage}</span> of{' '}
        <span className="font-medium text-[#1C2B33]">{totalPages}</span>
      </p>
    </nav>
  )
}

export default Pagination
