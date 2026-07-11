import TextField from "@mui/material/TextField";

type SearchFormProps = {
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  placeholder?: string;
};

export default function SearchForm({
  searchValue,
  setSearchValue,
  placeholder,
}: SearchFormProps) {
  return (
    <form>
      <TextField
        fullWidth
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder={placeholder}
        size="small"
        sx={{
          "& .MuiOutlinedInput-root": {
            backgroundColor: "var(--color-bg)",
            color: "var(--color-text)",
          },
          "& .MuiInputBase-input": {
            color: "var(--color-text)",
          },
          "& .MuiInputBase-input::placeholder": {
            color: "var(--color-text)",
            opacity: 0.6,
          },
        }}
      />
    </form>
  );
}
