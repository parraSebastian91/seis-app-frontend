

export interface ImgAsset {
    format: string;
    headers: string;
    height: number;
    width: number;
    path: string;
}


export interface UserImageProfile {
    avatar: {
        sm: ImgAsset;
        md: ImgAsset;
        lg: ImgAsset;
    },
    banner: {
        sm: ImgAsset;
        md: ImgAsset;
        lg: ImgAsset;
    }
}
