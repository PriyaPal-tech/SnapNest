export interface userProps {
    userId: string,
    email: string,
    userName: string
    profilePicture?: string,
    userBio?:string,
    postIds?: string[],
    coverPhoto?:string
}

export interface postProps {
    postId: string,
    caption: string,
    postImages: string[],
    timestamp: string,
    likes: number,
    userId: string,
};

export interface Post {
    postId: string;
    caption: string;
    userId: string;
    userName: string;
    userProfilePic: string;
    postImages: string[];
    timestamp: string;
}