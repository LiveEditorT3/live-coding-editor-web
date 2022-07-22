import TinyliciousClient from "@fluidframework/tinylicious-client";
import { SharedString } from "@fluidframework/sequence";
import { SharedStringHelper } from "@fluid-experimental/react-inputs";
import { createContext, useContext, useEffect, useState } from "react";
import Configuration from "../config";

const FluidContext = createContext({});

export const useFluidContext = () => {
  const { getFluidData } = useContext(FluidContext);
  const [sharedString, setSharedString] = useState();
  const [sharedStringHelper, setSharedStringHelper] = useState();
  const [audience, setAudience] = useState();

  useEffect(() => {
    const getData = async () => {
      const data = await getFluidData();
      setSharedString(data.sharedString);
      setSharedStringHelper(new SharedStringHelper(data.sharedString));
      setAudience(data.audience);
    };
    getData();
  }, [getFluidData]);

  return {
    sharedString,
    sharedStringHelper,
    audience,
  };
};

const FluidProvider = ({ children }) => {
  const client = new TinyliciousClient({
    connection: {
      domain: Configuration.TINYLICIOUS_DOMAIN,
      port: Configuration.TINYLICIOUS_PORT,
    },
  });

  const containerSchema = {
    initialObjects: { sharedString: SharedString },
  };

  const getFluidData = async () => {
    let container;
    let services;
    const containerId = window.location.hash.substring(1);
    if (!containerId) {
      ({ container, services } = await client.createContainer(containerSchema));
      const id = await container.attach();
      window.location.hash = id;
    } else {
      ({ container, services } = await client.getContainer(
        containerId,
        containerSchema
      ));
      // ConnectionState.Connected === 2
      if (container.connectionState !== 2) {
        await new Promise((resolve) => {
          container.once("connected", () => {
            resolve();
          });
        });
      }
    }
    return { ...container.initialObjects, audience: services.audience };
  };

  return (
    <FluidContext.Provider
      value={{
        getFluidData,
      }}
    >
      {children}
    </FluidContext.Provider>
  );
};

export default FluidProvider;
