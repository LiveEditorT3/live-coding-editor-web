import { HttpClient } from "./serviceBase";

class ReposService {
  Get = async () => await HttpClient.Get(`api/repos`);

  GetFiles = async (user, repo) => 
    await HttpClient.Get(`api/${user}/repos/${repo}/files`);

  GetFile = async (user, repo, path) => 
    await HttpClient.Get(`api/${user}/repos/${repo}/files/${path}`);

  Create = async (name, isPrivate) =>
    await HttpClient.Post("api/repos", { name, isPrivate });

  Commit = async (user, repo, commit) =>
    await HttpClient.Put(`api/${user}/repos/${repo}`, commit);
}

export default new ReposService();
