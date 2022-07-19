import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { loggedIn, LoginContext } from "./loginContext";
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

  const refreshReposList = useCallback(async () => {
    try {
      const res = await ReposService.get();
      dispatchRepos({ type: actions.SET_REPOS_LIST, payload: res });
    } catch (err) {
      console.error(err);
    }
  }, [dispatchRepos]);

  const refreshFilesList = useCallback(async () => {
    try {
      const res = await ReposService.getFiles(user.login, repos.repoName);
      dispatchRepos({ type: actions.SET_FILES_LIST, payload: res });
    } catch (err) {
      console.error(err);
    }
  }, [dispatchRepos, user.login, repos.repoName]);

  useEffect(() => {
    // Get the list of repos if the current repo or the user changes
    if (loggedIn() && user && user.login) {
      refreshReposList();
    }
    // Get the list of files in the repo if the current repo or the user changes
    if (loggedIn() && user && user.login && repos.repoName) {
      refreshFilesList();
    }
  }, [user, repos.repoName, refreshReposList, refreshFilesList]);

  // Clear everything is the user signs out
  useEffect(() => {
    if (!user && !user.login) {
      dispatchRepos({ type: actions.CLEAR_REPOS });
    }
  }, [user, dispatchRepos]);

  return (
    <RepoContext.Provider
      value={{
        ...repos,
        selectCurrentRepo,
        selectCurrentFile,
        setCommitMessage,
        setFileContent,
        clearFile,
        refreshReposList,
        refreshFilesList,
      }}
    >
      {children}
    </RepoContext.Provider>
  );
};

export default RepoProvider;
