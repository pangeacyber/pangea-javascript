import PangeaRequest from "@src/request.js";
import { FileData, TransferMethod } from "@src/types.js";
import PangeaConfig from "@src/config.js";

export class FileUploader {
  protected serviceName: string = "FileUploader";
  protected request_: PangeaRequest | undefined = undefined;

  constructor() {}

  private get request(): PangeaRequest {
    if (this.request_) {
      return this.request_;
    }

    this.request_ = new PangeaRequest(
      this.serviceName,
      "notatoken",
      new PangeaConfig()
    );
    return this.request_;
  }

  // TODO: Docs
  public async uploadFile(
    url: string,
    fileData: FileData,
    options: {
      transfer_method?: TransferMethod;
    }
  ) {
    if (
      !options.transfer_method ||
      options.transfer_method === TransferMethod.PUT_URL
    ) {
      await this.request.putPresignedURL(url, fileData);
    } else if (options.transfer_method === TransferMethod.POST_URL) {
      await this.request.postPresignedURL(url, fileData);
    }
  }
}

export default FileUploader;
