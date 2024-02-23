import { Button } from "@mui/material";
import { FC, useState } from "react";

import DownloadIcon from "@mui/icons-material/Download";
import { useAuditContext } from "../../hooks/context";

const DownloadButton: FC = () => {
  const [loading, setLoading] = useState(false);
  const { downloadResults, resultsId } = useAuditContext();

  const handleDownloadResults = () => {
    if (!downloadResults || !resultsId) return;

    setLoading(true);
    downloadResults({
      result_id: resultsId,
      format: "csv",
    }).finally(() => setLoading(false));
  };

  if (!downloadResults) return null;
  return (
    <Button
      variant="contained"
      color="primary"
      disabled={!resultsId || loading}
      onClick={handleDownloadResults}
      startIcon={<DownloadIcon fontSize="small" />}
    >
      {loading ? "Downloading..." : "Download"}
    </Button>
  );
};

export default DownloadButton;
