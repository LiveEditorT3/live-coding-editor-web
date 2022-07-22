import { createContext, useEffect, useState } from "react";
import { SharedString } from "@fluidframework/sequence";
import { SharedStringHelper } from "@fluid-experimental/react-inputs";
import TinyliciousClient from "@fluidframework/tinylicious-client";
import Configuration from "../config";

const containerSchema = {
  initialObjects: { sharedString: SharedString },
};

const client = new TinyliciousClient({
  connection: {
    domain: Configuration.TINYLICIOUS_DOMAIN,
    port: Configuration.TINYLICIOUS_PORT,
  },
});

async function getFluidData() {
  let container, services;
  const containerId = window.location.hash.substring(1);

  if (!containerId) {
    // Create a new session
    ({ container, services } = await client.createContainer(containerSchema));
    const id = await container.attach();
    window.location.hash = id;
  } else {
    // Restore a previous session
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
  return {
    sharedString: container.initialObjects.sharedString,
    audience: services.audience,
  };
}

export const FluidContext = createContext({});

const FluidProvider = ({ children }) => {
  const [sharedStringHelper, setSharedStringHelper] = useState();
  const [audience, setAudience] = useState();

  // Get the sharedString from the Fluid container and the audience.
  // Set this common state for other components to use.
  // This hook should run only once, when loading the session.
  useEffect(() => {
    const getData = async () => {
      const { sharedString, audience } = await getFluidData();
      setSharedStringHelper(new SharedStringHelper(sharedString));
      setAudience(audience);
    };
    getData();
  }, []);

  return (
    <FluidContext.Provider
      value={{
        sharedStringHelper,
        audience,
      }}
    >
      {children}
    </FluidContext.Provider>
  );
};

export default FluidProvider;
