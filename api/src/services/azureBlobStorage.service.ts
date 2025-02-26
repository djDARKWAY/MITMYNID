import { BlobServiceClient } from "@azure/storage-blob";
import { inject } from "@loopback/core";

export class AzureStorageService {
  private blobServiceClient: BlobServiceClient;
  private containerName = process.env.AZURE_STORAGE_CONTAINER || "certificados";

  constructor(@inject("services.AzureStorage") private connectionString: string) {
    this.blobServiceClient = BlobServiceClient.fromConnectionString(this.connectionString);
  }

  async uploadCertificate(
    fileName: string,
    fileBuffer: Buffer
  ): Promise<string> {
    const containerClient = this.blobServiceClient.getContainerClient(
      this.containerName
    );
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    await blockBlobClient.upload(fileBuffer, fileBuffer.length);

    return blockBlobClient.url;
  }
}
