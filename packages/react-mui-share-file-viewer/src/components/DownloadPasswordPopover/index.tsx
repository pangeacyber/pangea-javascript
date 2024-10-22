import { useEffect } from "react";

import { useDownloadPopover } from "./hooks";
import PasswordConfirmationModal from "../PasswordConfirmationModal";

export default function DownloadPopover() {
  const download = useDownloadPopover();

  useEffect(() => {
    useDownloadPopover.setState({
      download: undefined,
      onDone: undefined,
      onCancel: undefined,
    });
  }, []);

  const handleClose = () => {
    if (!!download.onCancel) download.onCancel();
    useDownloadPopover.setState({
      download: undefined,
      onDone: undefined,
      onCancel: undefined,
    });
  };

  const algo =
    download.download?.["vault-password-algorithm"] ??
    download?.download?.metadata_protected?.["vault-password-algorithm"] ??
    "AES-CFB-256";
  return (
    <div>
      <PasswordConfirmationModal
        open={!!download?.download}
        onContinue={async (password) =>
          !!download?.onDone && download.onDone(password, algo)
        }
        onClose={handleClose}
        title={"Download file"}
        description={"File requires a password to download"}
      />
    </div>
  );
}
