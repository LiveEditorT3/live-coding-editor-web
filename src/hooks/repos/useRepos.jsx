import { useEffect, useState } from "react";
import reposService from "../../services/reposService";

const useRepos = (sent) => {
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    const getRepos = async () => {
      reposService.Get().then((res) => setRepos(res));
    };
    getRepos();
  }, [sent]);

  const createRepo = (name, isPrivate) => {
    reposService.Create(name, isPrivate).catch((err) => console.error(err));
  };

  const commitFile = (user, repo, commit) =>
    // console.log(user, repo, commit)
    reposService.Commit(user, repo, commit).catch((err) => console.error(err));

  return {
    repos,
    createRepo,
    commitFile,
  };
};

export default useRepos;
