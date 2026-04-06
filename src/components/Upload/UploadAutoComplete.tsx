'use client';
import { Option } from "@/models/option";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Autocomplete, TextField } from "@mui/material";

const UploadAutoComplete = ({
  label,
  values,
  selectedValues,
  setSelectedValues,
}: {
  label: string;
  values: Option[];
  selectedValues: Option[];

  setSelectedValues: (value: Option[]) => void;
}) => {
  return (
    <Autocomplete
      multiple
      className={`border border-gray-200 rounded-lg w-full min-h-[45px] px-3 flex justify-center items-center placeholder:text-gray-600`}
      id="tags-standard"
      options={values}
      getOptionLabel={(option) => option.name}
      onChange={(_event, values) => {
        setSelectedValues(values);
      }}
      value={selectedValues}
      renderTags={(value: Option[], getTagProps) => {
        return value.map((val, index) => (
          <div
            key={val.id}
            className="rounded-md px-2 py-1 border bg-secondary mx-1 text-white text-sm flex gap-2 items-center"
          >
            <FontAwesomeIcon
              icon={faClose}
              className="size-[12px] cursor-pointer"
              onClick={(e) => getTagProps({ index }).onDelete(e)}
            />
            {val.name}
          </div>
        ));
      }}
      renderInput={(params) => {
        params.InputProps.endAdornment = "";
        return (
          <TextField
            sx={{
              "& .MuiInput-root:before": {
                borderBottom: "none !important",
              },
              "& .MuiAutocomplete-inputRoot": {
                padding: "0px !important",
              },
              // Removes the purple/blue border on focus
              "& .MuiInput-root:after": {
                borderBottom: "none !important",
              },
              // Removes the border when you hover
              "& .MuiInput-root:hover:not(.Mui-disabled):before": {
                borderBottom: "none !important",
              },
            }}
            className="!min-h-[45px] !m-0 !p-0 !flex  justify-center items-center !placeholder:text-red-600 border-none"
            {...params}
            variant="standard"
            placeholder={label}
          />
        );
      }}
    />
  );
};

export default UploadAutoComplete;
