import { HttpClient } from "./BaseService";

export default class ReposService {
  static get() {
    return HttpClient.get(`api/repos`);
  }

  static getFiles(user, repo) {
    return HttpClient.get(`api/${user}/repos/${repo}/files`);
  }

  static getFile(user, repo, path) {
    return HttpClient.get(`api/${user}/repos/${repo}/files/${path}`);
  }

  static create(name, isPrivate) {
    return HttpClient.post("api/repos", { name, isPrivate });
  }

  static commit(user, repo, commit) {
    return HttpClient.put(`api/${user}/repos/${repo}`, commit);
  }
}
