import { createContext, useContext, useState } from "react";

const RepoContext = createContext({});

export const useRepo = () => {
  const { name, isPrivate, commit, mode, setName, setPrivate, setCommit, setMode } =
    useContext(RepoContext);

  const setRepoName = (name) => setName(name);

  const setRepoPrivate = (value) => setPrivate(value);

  const setContent = (content) => setCommit({ ...commit, content });

  const setCommitMessage = (message) => setCommit({ ...commit, message });

  const setFileName = (path) => setCommit({ ...commit, path });

  const setEditorMode = (mode) => setMode(mode)

  return {
    name,
    isPrivate,
    commit,
    mode,
    setRepoName,
    setRepoPrivate,
    setContent,
    setCommitMessage,
    setFileName,
    setEditorMode
  };
};

const RepoProvider = ({ children }) => {
  const [name, setName] = useState("");
  const [isPrivate, setPrivate] = useState(true);
  const [commit, setCommit] = useState({
    content: "",
    path: "untitled.py",
    message: "",
  });
  const [mode, setMode] = useState('python')

  return (
    <RepoContext.Provider
      value={{ name, isPrivate, commit, mode, setName, setPrivate, setCommit, setMode }}
    >
      {children}
    </RepoContext.Provider>
  );
};

export default RepoProvider;
