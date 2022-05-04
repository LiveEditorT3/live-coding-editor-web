import { HttpClient } from "./serviceBase";

class ReposService {
    Get = async () =>
        await HttpClient.Get(`api/repos`)

    Create = async (name, isPrivate) => 
        await HttpClient.Post('api/repos', { name, isPrivate })

    Commit = async (user, repo, commit) =>
        await HttpClient.Put(`api/${user}/repos/${repo}`, commit)
}

export default new ReposService()