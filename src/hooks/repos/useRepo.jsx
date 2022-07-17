import { useEffect, useState } from "react";
import ReposService from "../../services/ReposService";

const useRepo = (name, user) => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const getFiles = async () => {
      const res = await ReposService.getFiles(user, name);
      setFiles(res);
    };
    if (!!user && !!name) getFiles();
  }, [name, user]);

  const getFile = (path) => ReposService.getFile(user, name, path);

  return {
    files,
    getFile,
  };
};

export default useRepo;
