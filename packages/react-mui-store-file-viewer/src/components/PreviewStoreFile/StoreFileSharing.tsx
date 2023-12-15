import { FC, useEffect, useState } from "react";
import { ObjectStore } from "../../types";
import { useStoreFileViewerContext } from "../../hooks/context";
import ShareObject from "../ShareObject";
import { Stack } from "@mui/material";
import CreateNewShareButton from "../CreateNewShareButton";

interface Props {
  object: ObjectStore.ObjectResponse;
  onClose: () => void;
}

const StoreFileSharing: FC<Props> = ({ object }) => {
  const { apiRef } = useStoreFileViewerContext();

  const [shares, setShares] = useState<ObjectStore.ShareObjectResponse[]>([]);

  useEffect(() => {
    handleFetchShares();
  }, [object.id]);

  const handleFetchShares = () => {
    if (!object.id || !apiRef.share?.list) return;

    // FIXME: Share list needs filtering
    apiRef.share.list({}).then((response) => {
      if (
        response.status === "Success" &&
        !!response.result.share_link_objects
      ) {
        setShares(
          response.result.share_link_objects?.filter(
            (link) => !!link && link.targets?.includes(object.id)
          )
        );
      } else {
        setShares([]);
      }
    });
  };

  const handleDeleteShare = () => {
    handleFetchShares();
  };

  return (
    <>
      {!!object?.id && (
        <CreateNewShareButton
          object={object}
          onDone={() => {
            setTimeout(() => {
              handleFetchShares();
            }, 500);
          }}
        />
      )}
      <Stack spacing={1} paddingTop={1}>
        {shares.map((share) => {
          return (
            <ShareObject
              key={`share-object-${share.id}`}
              object={share}
              onDelete={handleDeleteShare}
            />
          );
        })}
      </Stack>
    </>
  );
};

export default StoreFileSharing;
