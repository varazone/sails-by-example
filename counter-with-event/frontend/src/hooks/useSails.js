import { useEffect, useState } from "react";
import { Sails } from "sails-js";
import { SailsIdlParser } from "sails-js-parser";
import { useApi } from "../contexts/ApiContext";

export const useSails = (idl, programId) => {
  const { api } = useApi();
  const [sails, setSails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!api || !idl || !programId) {
      setLoading(false);
      return;
    }

    const initializeSails = async () => {
      try {
        setLoading(true);
        setError(null);

        const parser = await SailsIdlParser.new();
        const sailsInstance = new Sails(parser);

        sailsInstance.parseIdl(idl);
        sailsInstance.setProgramId(programId);
        sailsInstance.setApi(api);

        setSails(sailsInstance);

        // Expose to window for debugging (optional)
        window.api = api;
        window.sails = sailsInstance;
      } catch (err) {
        console.error("Failed to initialize Sails:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    initializeSails();
  }, [api, idl, programId]);

  return { sails, loading, error };
};
