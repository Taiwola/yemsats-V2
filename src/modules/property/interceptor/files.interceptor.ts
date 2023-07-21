import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MulterError } from 'multer';

@Injectable()
export class CustomFilesInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error: MulterError) => {
        console.error('File Interceptor Error:', error);
        throw error;
      }),
    );
  }
}
