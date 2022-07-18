/**
 * Select corresponding CodeMirror editor mode for the file name.
 * @param {String} filename - the filename with extension
 * @returns a valid CodeMirror mode
 */
export const selectEditorMode = (filename) => {
  const { extension } = extractFilenameAndExtension(filename);
  return fileExtensionToEditorMode(extension);
};

/**
 * Separate file name from file extension.
 * @param {String} filename - the filename with extension
 * @returns {String, String} - an object with the filename and the extension
 */
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

/**
 * Convert a file extension to the corresponding mode
 * for the 'mode' parameter in CodeMirror.
 * @param {String} extension - a file extension
 * @returns {String} a valid CodeMirror mode
 */
export const fileExtensionToEditorMode = (extension) => {
  switch (extension) {
    case "go":
      return "go";
    case "js":
    case "json":
      return "javascript";
    case "py":
      return "python";
    case "c":
    case "h":
      return "text/x-csrc"
    case "cpp":
    case "cc":
    case "hpp":
    case "hh":
      return "text/x-c++src"
    case "java":
    case "class":
      return "text/x-java"
    case "sh":
      return "text/x-sh"
    case "rs":
    case "rslib":
      return "text/x-rustsrc"
    case "toml":
      return "text/x-toml"
    default:
      return "null";
  }
};
