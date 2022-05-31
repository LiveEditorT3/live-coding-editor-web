import { createContext, useContext, useState } from "react";

const RepoContext = createContext({});

export const useRepo = () => {
  const {
    name,
    isPrivate,
    fileContent,
    path,
    message,
    mode,
    setName,
    setPrivate,
    setFileContent,
    setPath,
    setMessage,
    setMode,
  } = useContext(RepoContext);

  const setRepoName = (name) => setName(name);

  const setRepoPrivate = (value) => setPrivate(value);

  const setContent = (content) => setFileContent(content);

  const setCommitMessage = (message) => setMessage(message);

  const setFileName = (name) => setPath({ ...path, name });

  const setFileExtension = (extension) => setPath({ ...path, extension });

  const setEditorMode = (mode) => setMode(mode);

  return {
    name,
    isPrivate,
    fileContent,
    path,
    message,
    mode,
    setRepoName,
    setRepoPrivate,
    setContent,
    setCommitMessage,
    setFileName,
    setFileExtension,
    setEditorMode,
  };
};

const RepoProvider = ({ children }) => {
  const [name, setName] = useState("");
  const [isPrivate, setPrivate] = useState(true);
  const [fileContent, setFileContent] = useState("");
  const [path, setPath] = useState({
    name: "untitled",
    extension: ".py"
  });
  const [message, setMessage] = useState("");

  const [mode, setMode] = useState("python");

  return (
    <RepoContext.Provider
      value={{
        name,
        isPrivate,
        fileContent,
        path,
        message,
        mode,
        setName,
        setPrivate,
        setFileContent,
        setPath,
        setMessage,
        setMode,
      }}
    >
      {children}
    </RepoContext.Provider>
  );
};

export default RepoProvider;
