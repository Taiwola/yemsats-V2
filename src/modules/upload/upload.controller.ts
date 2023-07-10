import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UploadedFiles,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { Express, Request } from 'express';
import { diskStorage } from 'multer';
import { Roles } from '../auth/decorators/user.roles';
import { RolesGaurd } from '../auth/gaurds/roles.gaurd';
import { UserRole } from '../user/entities/user.entity';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
  @UseGuards(RolesGaurd)
  @UseInterceptors(FileInterceptor('file'))
  @Post('profile-img/cloud')
  async handleUpload(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    return await this.uploadService.uploadProfileImgCloudinary(file, req);
  }

  @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
  @UseGuards(RolesGaurd)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './file',
        filename(req, file, callback) {
          const randomName = Array(32)
            .fill(null)
            .map(() => {
              const randomChar = Math.floor(Math.random() * 26) + 97; // Random lowercase character code
              return String.fromCharCode(randomChar);
            })
            .join('');

          const extension = file.originalname.split('.').pop(); // Extract the file extension

          const finalFileName = randomName + '.' + extension;

          // Assuming you want to pass the final file name to the callback function
          callback(null, finalFileName);
        },
      }),
    }),
  )
  @Post('profile-img/local')
  async testUploadImg(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    const filename = file.filename;
    return await this.uploadService.uploadProfileImgLocal(filename, req);
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('upload/test2')
  async testUploadImg2(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10000000 }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return {
      file: file.buffer.toString(),
    };
  }

  @Post('upload/test3')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'background', maxCount: 1 },
    ]),
  )
  uploadFile(
    @UploadedFiles()
    files: {
      avatar?: Express.Multer.File[];
      background?: Express.Multer.File[];
    },
  ) {
    console.log(files);
    return files;
  }
}
