
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

import type { AwsS3UploadResult } from './../interfaces/aws-s3-upload.interface.js';

@Injectable()
export class AwsS3Service {
  private readonly logger = new Logger(AwsS3Service.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor() {
    const region = process.env.AWS_REGION;

    this.bucketName = process.env.AWS_S3_BUCKET_NAME ?? '';

    if (!region || !this.bucketName) {
      throw new Error('AWS_REGION and AWS_S3_BUCKET_NAME must be configured');
    }

    this.s3Client = new S3Client({
      region,
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    key: string,
  ): Promise<AwsS3UploadResult> {
    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
          ContentLength: file.size,
        }),
      );

      return {
        bucket: this.bucketName,
        key,
        mimeType: file.mimetype,
        fileSize: file.size,
      };
    } catch (error) {
      this.logger.error(
        `Failed to upload file to S3: ${key}`,
        error instanceof Error ? error.stack : String(error),
      );

      throw new InternalServerErrorException(
        'Failed to upload document to storage',
      );
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        }),
      );
    } catch (error) {
      this.logger.error(
        `Failed to delete file from S3: ${key}`,
        error instanceof Error ? error.stack : String(error),
      );

      throw new InternalServerErrorException(
        'Failed to delete document from storage',
      );
    }
  }
}
