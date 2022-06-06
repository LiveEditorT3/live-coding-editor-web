import { useEffect, useState } from "react";
import reposService from "../../services/reposService";

const useRepo = (name, user) => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const getFiles = async () => {
      reposService.GetFiles(user, name).then((res) => setFiles(res));
    };
    if (!!user && !!name) getFiles();
  }, [name, user]);

  const getFile = (path) => reposService.GetFile(user, name, path);

  return {
    files,
    getFile,
  };
};

export default useRepo;
