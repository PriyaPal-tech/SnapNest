import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Post } from '../../global/types';
import { HiHeart } from 'react-icons/hi';
import { BiSolidNavigation } from 'react-icons/bi';
import ShareModal from './ShareModal';
import { IoMdArrowRoundBack } from 'react-icons/io';

const PostCard = ({
    post,
    isClickable
}: {
    post: Post,
    isClickable: boolean
}) => {
    const navigate = useNavigate();
    const [modalShow, setModalShow] = useState<boolean>(false);
    const handlePostClick = () => {
        if (isClickable) {
            navigate(`/user/post/${post.postId}`);
        }
    };
    const handleBack = () => {
        window.history.back();
    };
    const generatePostUrl = () => {
        return `${window.location.origin}/user/post/${post.postId}`; 
    };
    return (
        <div className={`${isClickable ? '' : 'postcard-container'}`}>
            <div className="post">
                <div className="post-header cursor-pointer" onClick={() => { navigate(`/user/profile/${post.userId}`) }}>
                    {!isClickable && <IoMdArrowRoundBack size={24} onClick={handleBack} className='back-button me-2' />}

                    <img
                        src={post.userProfilePic}
                        alt={`${post.userName}'s profile`}
                        className="picture"
                    />
                    <div className="header-text">
                        <p className="post-user">{post.userName}</p>
                        <p className="post-time">{new Date(post.timestamp).toLocaleString()}</p>
                    </div>
                </div>
                <div onClick={handlePostClick} className={`${isClickable ? 'cursor-pointer' : ''}`}>
                    <p className="post-content">{post.caption}</p>
                    <div className="post-carousel">
                        <ImageCarousel images={post.postImages} />
                    </div>
                </div>
                <div className="post-actions">
                    <div className="like-button">
                        <HiHeart size={16} color="#D95B7F" className='me-1' />
                    </div>
                    <div className="share-button" onClick={() => { setModalShow(true) }}>
                        <BiSolidNavigation size={16} /> Share
                    </div>
                </div>
            </div>
            <ShareModal show={modalShow} setShow={setModalShow} shareUrl={generatePostUrl()}/>
        </div>
    )
}

const ImageCarousel = ({ images }: { images: string[] }) => {
    return (
        <div className="carousel-container">
            {images.map((image, index) => (
                <div
                    key={index}
                    className="carousel-image"
                >
                    <img
                        src={image}
                        alt={`Slide ${index + 1}`}
                    />
                </div>
            ))}
        </div>
    );
};

export default PostCard
