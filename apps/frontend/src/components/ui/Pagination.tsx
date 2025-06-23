import React from "react";
import { Button } from "./Button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  maxButtons?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  maxButtons = 5,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Calculate the range of page numbers to display
  let startPage = Math.max(
    1,
    Math.min(
      currentPage - Math.floor(maxButtons / 2),
      totalPages - maxButtons + 1
    )
  );
  let endPage = Math.min(totalPages, startPage + maxButtons - 1);

  // if the end page is less than the total pages, adjust the start page
  if (endPage - startPage + 1 < maxButtons) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex items-center justify-between pt-4 border-t border-dark-700">
      <div className="text-sm max-md:hidden text-gray-400">
        Showing {startItem} to {endItem} of {totalItems} results
      </div>
      <div className="flex items-center gap-1 md:gap-2">
        {/* Previous page button */}
        <Button
          className="max-md:w-6 md:h-3"
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {/* Page numbers */}
        {pageNumbers.map((pageNum) => (
          <Button
            key={pageNum}
            variant={currentPage === pageNum ? "primary" : "outline"}
            size="icon"
            onClick={() => onPageChange(pageNum)}
          >
            {pageNum}
          </Button>
        ))}

        {/* Next page button */}
        <Button
          className="max-md:w-6 md:h-3"
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
