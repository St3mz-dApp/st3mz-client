import { useState } from "react";
import { FileInput } from "./common/FileInput";

const MAX_FILE_SIZE = 1024 * 1024 * 100; // 100MB = 1024 * 1024 * 100

interface Props {
  onUpload: (files: File[]) => void;
  multiple?: boolean;
  className?: string;
}

export const UploadAudio = ({
  onUpload,
  multiple,
  className,
}: Props): JSX.Element => {
  const [dropZoneActive, setDropZoneActive] = useState<boolean>(false);

  const processFiles = (files: FileList): void => {
    const filesArray = Array.from(files);
    filesArray.forEach((file) => {
      if (!file.type.match(/audio.*/)) throw new Error("Invalid file type");
      if (file.size > MAX_FILE_SIZE) throw new Error("File too large");
    });

    onUpload(filesArray);
  };

  return (
    <div
      className={`p-4 overflow-hidden flex flex-col justify-center items-center text-sec-text border-2 border-dashed
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
        processFiles(e.dataTransfer.files);
      }}
    >
      <div className="flex flex-col text-center">
        <span>Drop or upload audio {multiple ? "files" : "file"}</span>
        <span>max size 100MB</span>
      </div>
      <FileInput
        onFilesUpload={(files: FileList) => processFiles(files)}
        accept="audio/*"
        multiple={multiple}
      ></FileInput>
    </div>
  );
};
