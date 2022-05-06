import { createContext, useContext, useState } from "react";

const RepoContext = createContext({})

export const useRepo = () => {
    const { name, isPrivate, commit, setName, setPrivate, setCommit } = useContext(RepoContext)

    const setRepoName = (name) => 
        setName(name)

    const setRepoPrivate = (value) => 
        setPrivate(value)

    const setContent = (content) => 
        setCommit({ ...commit, content })

    const setCommitMessage = (message) => 
        setCommit({ ...commit, message })
    
    const setFileName = (path) => 
        setCommit({ ...commit, path })

    return {
        name,
        isPrivate,
        commit,
        setRepoName,
        setRepoPrivate,
        setContent,
        setCommitMessage,
        setFileName
    }
}

const RepoProvider = ({ children }) => {
    const [name, setName] = useState('')
    const [isPrivate, setPrivate] = useState(true)
    const [commit, setCommit] = useState({
        content: '',
        path: 'untitled.py',
        message: '',
    })

    return(
        <RepoContext.Provider value={{ name, isPrivate, commit, setName, setPrivate, setCommit }}>
            {children}
        </RepoContext.Provider>
    )
}

export default RepoProvider