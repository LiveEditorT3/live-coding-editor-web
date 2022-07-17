import { createContext, useState } from "react";

export const RepoContext = createContext({});

const RepoProvider = ({ children }) => {
  const [repoName, setRepoName] = useState("");
  const [repoIsPrivate, setRepoIsPrivate] = useState(true);
  const [fileContent, setFileContent] = useState({
    content: "",
    refresh: false,
  });
  const [filepath, setFilepath] = useState("");
  const [commitMessage, setCommitMessage] = useState("");
  const [fileSHA, setFileSHA] = useState("");

  const clearFile = () => {
    setFilepath("");
    setCommitMessage("");
    setFileSHA("");
    setFileContent({ content: "", refresh: true });
  };

  return (
    <RepoContext.Provider
      value={{
        repoName,
        repoIsPrivate,
        fileContent,
        filepath,
        commitMessage,
        fileSHA,
        setRepoName,
        setRepoIsPrivate,
        setFileContent,
        setFilepath,
        setCommitMessage,
        setFileSHA,
        clearFile,
      }}
    >
      {children}
    </RepoContext.Provider>
  );
};

export default RepoProvider;
