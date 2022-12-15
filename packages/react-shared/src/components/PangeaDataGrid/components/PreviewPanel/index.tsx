import { FC } from "react";

interface PreviewPanelProps<DataType> {
  onClose: () => void;
  data: DataType;
}

export type PreviewPanel<DataType = any> = FC<PreviewPanelProps<DataType>>;
