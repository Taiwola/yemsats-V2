import { Module } from '@nestjs/common';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from '../../config/jwt.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from './entities/property.entity';
import { UploadModule } from '../upload/upload.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    UploadModule,
    JwtModule.registerAsync(jwtConfig),
    TypeOrmModule.forFeature([Property]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        dest: configService.get<string>('MULTER_DEST'),
        storage: diskStorage({
          destination: configService.get<string>('MULTER_DEST'),
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

            callback(null, finalFileName);
          },
        }),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [PropertyController],
  providers: [PropertyService],
  exports: [PropertyService],
})
export class PropertyModule {}
