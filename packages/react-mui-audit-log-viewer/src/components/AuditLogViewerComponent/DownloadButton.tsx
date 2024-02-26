import { Button } from "@mui/material";
import { FC, useState } from "react";

import DownloadingIcon from "@mui/icons-material/Downloading";
import DownloadIcon from "@mui/icons-material/Download";
import { useAuditContext } from "../../hooks/context";

const DownloadButton: FC = () => {
  const [loading, setLoading] = useState(false);
  const {
    downloadResults,
    resultsId,
    total,
    loading: searching,
  } = useAuditContext();

  const handleDownloadResults = () => {
    if (!downloadResults || !resultsId) return;

    setLoading(true);
    downloadResults({
      result_id: resultsId,
      format: "json",
    }).finally(() => setLoading(false));
  };

  if (!downloadResults) return null;
  return (
    <Button
      variant="contained"
      color="secondary"
      disabled={!resultsId || loading || !total || !!searching}
      onClick={handleDownloadResults}
      startIcon={
        loading ? (
          <DownloadingIcon fontSize="small" />
        ) : (
          <DownloadIcon fontSize="small" />
        )
      }
    >
      {loading ? "Downloading..." : "Download"}
    </Button>
  );
};

export default DownloadButton;
