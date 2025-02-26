// POST endpoint:
  @post("/certificates")
  @response(200, {
    description: "Certificate model instance",
    content: { "application/json": { schema: getModelSchemaRef(Certificate) } },
  })
  async create(
    @requestBody({
      content: {
        "application/json": {
          schema: getModelSchemaRef(Certificate, {
            title: "NewCertificate",
            exclude: ["id_certificate"],
          }),
        },
      },
    })
    certificate: Omit<Certificate, "id_certificate" | "last_modified" | "last_modified_user_id">
  ): Promise<Certificate> {
    this.validateCertificate(certificate);

    return this.certificateRepository.create({
      ...certificate,
      last_modified: new Date().toISOString(),
    });
  }

  @post("/certificates/upload")
  @response(200, {
    description: "Carregamento de certificado para o Azure Blob Storage",
  })
  async uploadCertificate(
    @requestBody() certificateFile: { localPath: string }
  ): Promise<any> {
    try {
      const { localPath } = certificateFile;

      if (!process.env.AZURE_STORAGE_CONTAINER_NAME || !process.env.AZURE_STORAGE_CONTAINER_NAME || !process.env.AZURE_STORAGE_SAS_TOKEN) {
        throw new Error("Faltam variáveis de ambiente do Azure");
      }
  
      const blobServiceClient = new BlobServiceClient(
        `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/?${process.env.AZURE_STORAGE_SAS_TOKEN}`
      );
  
      const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_STORAGE_CONTAINER_NAME);
      const blobName = path.basename(localPath);
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      const fileStream = fs.createReadStream(localPath);
  
      await blockBlobClient.uploadStream(fileStream);
  
      return { message: "Certificado carregado com sucesso!", blobUrl: blockBlobClient.url };
    } catch (error) {
      throw new HttpErrors.BadRequest(`Erro ao carregar o arquivo: ${error.message}`);
    }
  }