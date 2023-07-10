import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import {
  UploadApiResponse,
  UploadApiErrorResponse,
  v2 as cloudinary,
} from 'cloudinary';
import { UserService } from '../user/user.service';
import { Express, Request } from 'express';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const streamifier = require('streamifier');

type CloudinaryType = UploadApiErrorResponse | UploadApiResponse;

@Injectable()
export class UploadService {
  constructor(private userService: UserService) {}

  uploadfile(file: Express.Multer.File): Promise<CloudinaryType> {
    return new Promise<CloudinaryType>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async uploadProfileImgCloudinary(file: Express.Multer.File, req: Request) {
    try {
      const imageUrl = await this.uploadfile(file);

      const user = await this.userService.getUserById(req.user.id);

      if (!user) {
        throw Error("User doesn't exist");
      }

      const saveImg = await this.userService.updateImg(imageUrl.url, user.id);

      return saveImg;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async uploadProfileImgLocal(filename: string, req: Request) {
    try {
      const user = await this.userService.getUserById(req.user.id);

      if (!user) {
        throw Error("User doesn't exist");
      }

      const saveImg = await this.userService.updateImg(filename, user.id);

      return saveImg;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
