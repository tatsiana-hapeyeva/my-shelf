import { Pagination, Box } from "@mui/material";

type ItemPaginationProps = {
  totalItems: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
};

export function ItemPagination({
  totalItems,
  currentPage,
  onPageChange,
  itemsPerPage,
}: ItemPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  if (totalPages <= 1) return null;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        marginTop: "24px",
        "& .MuiPaginationItem-root": {
          color: "var(--color-text)",
        },
        "& .MuiPaginationItem-root.Mui-selected": {
          color: "var(--color-accent)",
        },
      }}
    >
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(_, page) => onPageChange(page)}
      />
    </Box>
  );
}
