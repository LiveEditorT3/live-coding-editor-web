import { createContext, useContext, useState } from "react";

const RepoContext = createContext({});

export const useRepoContext = () => {
  const {
    name,
    isPrivate,
    fileContent,
    sha,
    path,
    message,
    mode,
    setName,
    setPrivate,
    setFileContent,
    setSha,
    setPath,
    setMessage,
  } = useContext(RepoContext);

  const setRepoName = (name) => setName(name);

  const setRepoPrivate = (value) => setPrivate(value);

  const setContent = (content, refresh = false) =>
    setFileContent({ content, refresh });

  const setCommitMessage = (message) => setMessage(message);

  const setFile = (name) => setPath(name);

  const setFileSha = (sha) => setSha(sha);

  const clearFile = () => {
    setPath("");
    setMessage("");
    setSha("");
    setFileContent({ content: "", refresh: true });
  };

  return {
    name,
    isPrivate,
    fileContent,
    sha,
    path,
    message,
    mode,
    setRepoName,
    setRepoPrivate,
    setContent,
    setFileSha,
    setCommitMessage,
    setFile,
    clearFile,
  };
};

const RepoProvider = ({ children }) => {
  const [name, setName] = useState("");
  const [isPrivate, setPrivate] = useState(true);
  const [fileContent, setFileContent] = useState({
    content: "",
    refresh: false,
  });
  const [path, setPath] = useState("");
  const [message, setMessage] = useState("");

  const [sha, setSha] = useState("");

  return (
    <RepoContext.Provider
      value={{
        name,
        isPrivate,
        fileContent,
        sha,
        path,
        message,
        setName,
        setPrivate,
        setFileContent,
        setSha,
        setPath,
        setMessage,
      }}
    >
      {children}
    </RepoContext.Provider>
  );
};

export default RepoProvider;
