import * as multer from 'multer'
import * as fs from 'fs'
import { Injectable } from '@nestjs/common'
import { MulterRequest } from 'src/types/multer.type';


@Injectable()
export class FileService {
    async uploadFile(req: MulterRequest, folder = '/'): Promise<{ file: any[]; body: any }> {
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                const path = `uploads/${folder}`;
                fs.mkdirSync(path, { recursive: true });
                cb(null, path)
            },
            filename: (req, file, cb) => {
                cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, '')}`);
            },
        });
        const upload = multer({ storage }).any()

        return new Promise((resolve, reject) => {
            upload(req, {} as any, async (err) => {
                if (err) return reject(err);

                try {
                    const files = req.files && req.files.length > 0
                        ? req.files.map((file) => ({
                            ...file,
                            path: `${file.path.replace(/\\/g, '/')}`,
                        })) : [];

                    resolve({ body: req.body, file: files })
                } catch (error) {
                    reject(error)
                }
            })
        })
    }

    async removeFile(files: any): Promise<void> {
        if (!files) {
            console.log("No files provided for deletion.")
            return;
        }

        try {
            if (Array.isArray(files)) {
                files.forEach((file) => {
                    const path = file.path ? file.path.replace(process.env.MULTER, '') : file.replace(process.env.MULTER, '')
                    fs.unlinkSync(path);
                    console.log('Files deleted');
                })
            } else {
                const path = files.path ? files.path.replace(process.env.MULTER, '') : files.replace(process.env.MULTER, '');
                fs.unlinkSync(path);
                console.log('File deleted')
            }
        } catch (error) {
            console.log(error.message)
        }
    }
}