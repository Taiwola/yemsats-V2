import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import {
  UploadApiResponse,
  UploadApiErrorResponse,
  v2 as cloudinary,
} from 'cloudinary';
import { UserService } from '../user/user.service';
import { PropertyService } from '../property/property.service';
import { Express, Request } from 'express';
import { rejects } from 'assert';
import { error } from 'console';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const streamifier = require('streamifier');

type CloudinaryType = UploadApiErrorResponse | UploadApiResponse;

@Injectable()
export class UploadService {
  constructor(
    private userService: UserService,
    private propertyService: PropertyService,
  ) {}

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

  uploadMultipleFiles(files: Express.Multer.File[]): Promise<CloudinaryType[]> {
    const uploadPromises = files.map((file) => {
      return this.uploadfile(file);
    });

    return Promise.all(uploadPromises);
  }

  // uploadMultipleFiles(files: Express.Multer.File[]): Promise<CloudinaryType[]> {
  //   const uploadPromises = files.map((file) => {
  //     return new Promise<CloudinaryType>((resolve, reject) => {
  //       const uploadStream = cloudinary.uploader.upload_stream(
  //         (error, result) => {
  //           if (error) return reject(error);
  //           resolve(result);
  //         },
  //       );

  //       streamifier.createReadStream(file.buffer).pipe(uploadStream);
  //     });
  //   });

  //   return Promise.all(uploadPromises);
  // }

  uploadVideo(filePath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        filePath,
        {
          resource_type: 'video',
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );
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

  async uploadPropertyImg(
    id: string,
    files: Express.Multer.File[],
    req: Request,
  ) {
    const property = await this.propertyService.findProperty(id);

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (req.user.id !== property.ADMIN.id) {
      throw new HttpException('not authorized', HttpStatus.UNAUTHORIZED);
    }

    const images = await this.uploadMultipleFiles(files);

    const imgUrl = images.map((image) => {
      const url = image.url;
      return url;
    });

    if (imgUrl.length > 0) {
      const imgsUrl = this.propertyService.saveImg(imgUrl, id);
      return imgsUrl;
    } else {
      throw new HttpException('no url', HttpStatus.BAD_REQUEST);
    }
  }

  async uploadPropertyVideo(
    file: Express.Multer.File,
    id: string,
    req: Request,
  ) {
    const property = await this.propertyService.findProperty(id);

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (req.user.id !== property.ADMIN.id) {
      throw new HttpException('not authorized', HttpStatus.UNAUTHORIZED);
    }

    const result = await this.uploadVideo(file.path);

    const resultUrl = result.url as string;

    const saveVideo = await this.propertyService.saveVideo(resultUrl, id);

    return saveVideo;
  }
}
