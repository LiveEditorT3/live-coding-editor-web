import TinyliciousClient from "@fluidframework/tinylicious-client";
import { SharedMap } from "@fluidframework/map";
import { SharedString } from "@fluidframework/sequence"
import { createContext, useContext, useEffect, useState } from "react";

const FluidContext = createContext({});
const MODE_KEY = "mode";

export const useFluidContext = () => {
    const { getFluidData } = useContext(FluidContext)
    const [sharedString, setSharedString] = useState()
    const [sharedMap, setSharedMap] = useState()

    useEffect(() => {
        getFluidData().then((data) => {
            setSharedString(data.sharedString)
            setSharedMap(data.sharedMap)
        });
      }, [getFluidData]);

    return {
        sharedString,
        sharedMap
    }
}

const FluidProvider = ({ children }) => {
    const client = new TinyliciousClient();

    const containerSchema = {
        initialObjects: { sharedMap: SharedMap, sharedString: SharedString }
    };

    const getFluidData = async () => {
        let container;
        const containerId = window.location.hash.substring(1);
        if (!containerId) {
            ({ container } = await client.createContainer(containerSchema));
            container.initialObjects.sharedMap.set(MODE_KEY, "python");
            const id = await container.attach();
            window.location.hash = id;
        } else {       
            ({ container } = await client.getContainer(containerId, containerSchema));
            if (!container.connected) {
                await new Promise((resolve) => {
                  container.once("connected", () => {
                    resolve();
                  });
                });
              }
        }
        return container.initialObjects;
    }

    return (
        <FluidContext.Provider
          value={{
            getFluidData
          }}
        >
          {children}
        </FluidContext.Provider>
      );
    };
    
export default FluidProvider;
