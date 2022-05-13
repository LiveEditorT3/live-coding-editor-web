import { useEffect, useState } from "react";
import { TinyliciousClient } from "@fluidframework/tinylicious-client";
import { SharedString } from "fluid-framework";

export const useSharedString = () => {
    const [sharedString, setSharedString] = useState();
    const getFluidData = async () => {
      // Configure the container.
      const client = new TinyliciousClient();
      const containerSchema= {
        initialObjects: { sharedString: SharedString }
      }
  
      // Get the container from the Fluid service.
      let container;
      const containerId = window.location.hash.substring(1);
      if (!containerId) {
        container = (await client.createContainer(containerSchema)).container;
        const id = await container.attach();
        window.location.hash = id;
      }
      else {
        container = (await client.getContainer(containerId, containerSchema)).container;
        if (!container.connected) {
          await new Promise((resolve) => {
            container.once("connected", () => {
              resolve();
            });
          });
        }
      }
      // Return the Fluid SharedString object.
      return container.initialObjects.sharedString;
    }
  
    // Get the Fluid Data data on app startup and store in the state
    useEffect(() => {
      getFluidData()
        .then((data) => setSharedString(data));
    }, []);
  
    return sharedString;
  }