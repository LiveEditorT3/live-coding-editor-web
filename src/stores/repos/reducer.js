import { actions } from "./actions.js";

const reposReducer = (state, action) => {
  switch (action.type) {
    case actions.SET_CURRENT_FILE: {
      const { filepath, fileContent, fileSHA } = action.payload;
      return {
        ...state,
        filepath,
        fileContent,
        fileSHA,
      };
    }
    case actions.SET_CURRENT_REPO: {
      const selectedRepo = state.reposList.find(
        (repo) => repo.name === action.payload
      );
      if (!selectedRepo) {
        throw new Error(
          `Could not find specified ${action.payload} repo in repos list`
        );
      }
      return {
        ...state,
        repoName: selectedRepo.name,
        repoIsPrivate: selectedRepo.private,
      };
    }
    case actions.SET_REPOS_LIST: {
      return {
        ...state,
        reposList: action.payload,
      };
    }
    case actions.SET_FILES_LIST: {
      return {
        ...state,
        filesList: action.payload,
      };
    }
    case actions.SET_COMMIT_MESSAGE: {
      return {
        ...state,
        commitMessage: action.payload,
      };
    }
    case actions.SET_FILE_CONTENT: {
      return {
        ...state,
        fileContent: action.payload,
      };
    }
    case actions.CREATE_FILE: {
      const { filepath } = action.payload;
      return {
        ...state,
        filepath,
        fileContent: "",
        fileSHA: "",
        commitMessage: "",
      };
    }
    case actions.CLEAR_FILE: {
      return {
        ...state,
        filepath: "",
        fileContent: "",
        fileSHA: "",
        commitMessage: "",
      };
    }
    case actions.CLEAR_REPOS: {
      return {
        repoName: undefined,
        repoIsPrivate: undefined,
        reposList: [],
        filesList: [],
        filepath: undefined,
        fileContent: { content: "", refresh: true },
        fileSHA: undefined,
        commitMessage: "",
      };
    }
    default:
      throw new Error(`The action.type ${action.type} is not supported`);
  }
};

export default reposReducer;
