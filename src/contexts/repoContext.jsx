import { createContext, useContext, useEffect, useReducer } from "react";
import { LoginContext } from "./loginContext";
import ReposService from "../services/ReposService";
import reposReducer from "../stores/repos/reducer";
import { actions } from "../stores/repos/actions";

export const RepoContext = createContext({});

const RepoProvider = ({ children }) => {
  const { user } = useContext(LoginContext);
  const [repos, dispatchRepos] = useReducer(reposReducer, {
    repoName: undefined,
    repoIsPrivate: undefined,
    reposList: [],
    filesList: [],
    filepath: undefined,
    fileContent: { content: "", refresh: true },
    fileSHA: undefined,
    commitMessage: "",
  });

  function clearFile() {
    dispatchRepos({ type: actions.CLEAR_FILE });
  }

  function selectCurrentRepo(repoName) {
    dispatchRepos({ type: actions.SET_CURRENT_REPO, payload: repoName });
  }

  function selectCurrentFile(filepath, fileContent, fileSHA) {
    dispatchRepos({
      type: actions.SET_CURRENT_FILE,
      payload: {
        filepath,
        fileContent,
        fileSHA,
      },
    });
  }

  function setCommitMessage(commitMessage) {
    dispatchRepos({ type: actions.SET_COMMIT_MESSAGE, payload: commitMessage });
  }

  function setFileContent(fileContent) {
    dispatchRepos({ type: actions.SET_FILE_CONTENT, payload: fileContent });
  }

  useEffect(() => {
    // Get the list of repos if the current repo or the user changes
    const getReposList = async () => {
      try {
        const res = await ReposService.get();
        dispatchRepos({ type: actions.SET_REPOS_LIST, payload: res });
      } catch (err) {
        console.error(err);
      }
    };
    if (user && user.login) {
      getReposList();
    }
    // Get the list of files in the repo if the current repo or the user changes
    const getFiles = async () => {
      try {
        const res = await ReposService.getFiles(user.login, repos.repoName);
        dispatchRepos({ type: actions.SET_FILES_LIST, payload: res });
      } catch (err) {
        console.error(err);
      }
    };
    if (user && user.login && repos.repoName) {
      getFiles();
    }
  }, [user, repos.repoName]);

  // Clear everything is the user signs out
  useEffect(() => {
    if (!user && !user.login) {
      dispatchRepos({ type: actions.CLEAR_REPOS });
    }
  }, [user]);

  return (
    <RepoContext.Provider
      value={{
        ...repos,
        selectCurrentRepo,
        selectCurrentFile,
        setCommitMessage,
        setFileContent,
        clearFile,
      }}
    >
      {children}
    </RepoContext.Provider>
  );
};

export default RepoProvider;
