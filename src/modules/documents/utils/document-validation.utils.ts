
import { BadRequestException } from '@nestjs/common';
import { extname } from 'node:path';

import { DOCUMENT_CONSTANTS } from '../document-management/constants/document.constants.js';
export const validateDocumentFile = (
  file: Express.Multer.File,
): void => {
  if (!file || !file.buffer || file.size === 0) {
    throw new BadRequestException('Document file is required.');
  }

  if (file.size > DOCUMENT_CONSTANTS.FILE.MAX_SIZE) {
    throw new BadRequestException(
      'File size must not exceed 5 MB.',
    );
  }

  const extension = extname(file.originalname).toLowerCase();

  if (
    !DOCUMENT_CONSTANTS.FILE.ALLOWED_EXTENSIONS.includes(
      extension as (typeof DOCUMENT_CONSTANTS.FILE.ALLOWED_EXTENSIONS)[number],
    )
  ) {
    throw new BadRequestException('Unsupported file extension.');
  }

  if (
    !DOCUMENT_CONSTANTS.FILE.ALLOWED_MIME_TYPES.includes(
      file.mimetype as (typeof DOCUMENT_CONSTANTS.FILE.ALLOWED_MIME_TYPES)[number],
    )
  ) {
    throw new BadRequestException('Unsupported file type.');
  }
};
