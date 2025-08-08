import { BadRequestException, NotFoundException } from "@nestjs/common"

export const SendError = (message: string) => {
    throw new BadRequestException(message)
}

export const otpGenerator = (size: number) => {
    const value = Math.pow(10, size - 1);
    const otp = Math.floor(value + Math.random() * (9 * value));
    return String(otp)
};

export const responseSender = (message: string, status: number, success: boolean, data: any) => {
    return {
        message, status, success, data
    }
}

export const parameterNotFound = (key: string, message: string) => {
    if (!key) {
        throw new NotFoundException(message);
    }
}

export const getPages = (page: string | number, limit: string | number) => {
    page = Number(page) || 1;
    limit = Number(limit) || 10;
    const offset = Number((page - 1) * limit);
    return { page, limit, offset }
}

export const generatePagination = (data: { rows: any[], count: number }, page: number, limit: number) => {
    return {
        data: data.rows,
        pageInfo: {
            total: data.count,
            currentPage: page,
            totalPage: Math.ceil(data.count / limit)
        }
    }
}

export const generateFileName = (videoId: string, resolution: string) => {
    const filename = `${videoId}_${resolution}.mp4`
    return filename
}