import Button from "./Button";
import Box from "@mui/material/Box";

export type StatusFilter = "all" | "read" | "unread";

type ReadUnreadFilterProps = {
  statusFilter: StatusFilter;
  onStatusFilterChange: (filter: StatusFilter) => void;
};

export default function ReadUnreadFilter({
  statusFilter,
  onStatusFilterChange,
}: ReadUnreadFilterProps) {
  return (
    <Box sx={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
      <Button
        variant={statusFilter === "all" ? "contained" : "outlined"}
        onClick={() => onStatusFilterChange("all")}
      >
        Все
      </Button>
      <Button
        variant={statusFilter === "read" ? "contained" : "outlined"}
        onClick={() => onStatusFilterChange("read")}
      >
        Прочитанные
      </Button>
      <Button
        variant={statusFilter === "unread" ? "contained" : "outlined"}
        onClick={() => onStatusFilterChange("unread")}
      >
        Непрочитанные
      </Button>
    </Box>
  );
}
