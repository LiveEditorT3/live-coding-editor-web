// Select corresponding CodeMirror editor mode for the file name
export const selectEditorMode = (filename) => {
  const { extension } = extractFilenameAndExtension(filename);
  return fileExtensionToEditorMode(extension);
};

// Separate file name from file extension
export const extractFilenameAndExtension = (filename) => {
  const lastDotIndex = filename.lastIndexOf(".");
  // The file name starts with a dot or there is no dot, so there is no extension
  if (lastDotIndex <= 0) {
    return { filename, extension: "" };
  } else {
    return {
      filename: filename.slice(0, lastDotIndex),
      extension: filename.slice(lastDotIndex + 1),
    };
  }
};

// Convert a file extension to the corresponding mode
// for the 'mode' parameter in CodeMirror.
export const fileExtensionToEditorMode = (mode) => {
  switch (mode) {
    case "go":
      return "go";
    case "js":
      return "javascript";
    case "py":
      return "python";
    default:
      return "null";
  }
};
