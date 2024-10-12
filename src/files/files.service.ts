import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { Repository } from 'typeorm';
import { AllConfigType } from 'src/config/config.type';

@Injectable()
export class FilesService {
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  async uploadFile(
    file: Express.Multer.File | Express.MulterS3.File,
  ): Promise<FileEntity> {
    if (!file) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            file: 'selectFile',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    console.log(file, '------- file object -------');

    const driver = this.configService.get('file.driver', { infer: true });
    let path = '';

    if (driver === 's3') {
      path = (file as Express.MulterS3.File).location;
    } else {
      path = `/${this.configService.get('app.apiPrefix', {
        infer: true,
      })}/v1/files/${file.filename}`;
    }

    console.log({ path }, '------- file upload -------');

    return this.fileRepository.save(
      this.fileRepository.create({
        name: file.originalname,
        filename: file.filename,
        // url: path[
        //   this.configService.getOrThrow('file.driver', { infer: true })
        // ],
        url: path,
      }),
    );
  }
}
