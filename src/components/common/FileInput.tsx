import { Button } from "@material-tailwind/react";
import { ChangeEvent, useRef } from "react";
import { MdUpload } from "react-icons/md";

interface Props {
  onFilesUpload: (files: FileList) => void;
  accept?: string;
  multiple?: boolean;
}

export const FileInput = ({
  onFilesUpload,
  accept,
  multiple,
}: Props): JSX.Element => {
  const refFileInput = useRef<HTMLInputElement>(null);

  const handleUpload = (e: ChangeEvent<HTMLInputElement>): void => {
    if (!e?.target?.files?.length) return;
    onFilesUpload(e.target.files);
  };

  return (
    <>
      <input
        ref={refFileInput}
        type="file"
        accept={accept}
        onChange={(e) => handleUpload(e)}
        className="hidden"
        multiple={multiple}
      ></input>
      <Button
        color="yellow"
        variant="gradient"
        className="p-2"
        onClick={() => {
          refFileInput.current?.click();
        }}
      >
        <MdUpload className="h-5 w-5"></MdUpload>
      </Button>
    </>
  );
};
