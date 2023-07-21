import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { MulterError } from 'multer';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class CustomFileInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error: MulterError) => {
        console.error('File Interceptor Error:', error);
        throw error;
      }),
    );
  }
}
