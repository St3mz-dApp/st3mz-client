import { useState } from "react";
import { FileInput } from "./common/FileInput";

const MAX_FILE_SIZE = 1024 * 1024 * 10; // 10MB = 1024 * 1024 * 10

interface Props {
  onUpload: (file: File) => void;
  className?: string;
}

export const UploadImage = ({ onUpload, className }: Props): JSX.Element => {
  const [dropZoneActive, setDropZoneActive] = useState<boolean>(false);
  const [fileData, setFileData] = useState<string>("");

  const processFile = (file: File): void => {
    if (!file.type.match(/image.*/)) throw new Error("Invalid file type");
    if (file.size > MAX_FILE_SIZE) throw new Error("File too large");

    const reader = new FileReader();
    reader.onload = (readerEvent: ProgressEvent<FileReader>) =>
      setFileData(readerEvent.target?.result as string);
    reader.readAsDataURL(file);

    onUpload(file);
  };

  return (
    <div
      className={`overflow-hidden flex flex-col justify-center items-center text-sec-text border-2 border-dashed
          rounded-lg bg-black bg-opacity-20 ${className} ${
        dropZoneActive ? "border-gray-300" : "border-sec-text"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setDropZoneActive(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setDropZoneActive(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        processFile(e.dataTransfer.files[0]);
      }}
    >
      {fileData ? (
        <img src={fileData} className="object-cover" />
      ) : (
        <>
          <div className="flex flex-col text-center">
            <span>Drop or upload image file</span>
            <span>max size 10MB</span>
          </div>
          <FileInput
            onFilesUpload={(files: FileList) => processFile(files[0])}
            accept="image/*"
          ></FileInput>
        </>
      )}
    </div>
  );
};
