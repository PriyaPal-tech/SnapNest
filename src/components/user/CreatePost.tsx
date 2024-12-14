import React, { useEffect, useRef, useState } from 'react';
import '../../styles/CreatePost.css'
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useGlobalContext } from '../../context/GlobalContext';
import { addPost } from '../../db/addPost';
import { uploadMedia } from '../../db/uploadMedia';
import { postProps } from '../../global/types';

const CreatePost = () => {
    const [media, setMedia] = useState<File[]>([]);
    const [postText, setPostText] = useState<string>("");
    const [mediaUrls, setMediaUrls] = useState<string[]>([]);
    const { currentUser } = useGlobalContext();
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const handleBack = () => {
        window.history.back();
    };

    const isMobile = () => {
        return /Mobi|Android/i.test(navigator.userAgent);
    };

    const handleMediaSelect = async (type: string) => {
        try {
            const fileInput = document.createElement('input');
            if (isMobile()) {
                if (type === 'photos') {
                    fileInput.type = 'file';
                    fileInput.accept = 'image/*';
                } else if (type === 'video') {
                    fileInput.type = 'file';
                    fileInput.accept = 'video/*';
                } else if (type === 'camera') {
                    fileInput.type = 'file';
                    fileInput.accept = 'image/*';
                    fileInput.setAttribute('capture', 'camera');
                }
            } else {
                fileInput.type = 'file';
                fileInput.accept = 'image/*,video/*';
            }
            fileInput.onchange = (e) => {
                const target = e.target as HTMLInputElement;
                if (target.files) {
                    const files = Array.from(target.files);
                    setMedia((prev) => [...prev, ...files]);
                }
            };

            fileInput.click();
        } catch (err) {
            console.error("Error selecting media:", err);
        }
    };

    const handleCreate = async () => {
        if (!postText && media.length === 0) {
            console.error("Please add some content or media to create a post.");
            return;
        }
        if (currentUser) {
            setLoading(true);
            try {
                const postId = uuidv4();
                const postImages = await uploadMedia(media);
                const postPayload: postProps = {
                    postId,
                    caption: postText,
                    postImages,
                    timestamp: new Date().toISOString(),
                    likes: 0,
                    userId: currentUser.userId,
                };
                await addPost(postPayload);
                navigate('/user/feed')
                setPostText("");
                setMedia([]);
            } catch (error) {
                console.error("Error creating post:", error);
                alert("Error creating post!");
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        const urls = media.map((file) => URL.createObjectURL(file));
        setMediaUrls(urls);
        return () => {
            urls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [media]);

    return (
        <div className="create-post">
            <header className="create-post-header">
                <IoMdArrowRoundBack size={24} onClick={handleBack} className='back-button me-2' />
                <p className='create-header'>New post</p>
            </header>
            {media.length > 0 && (
                <div className='position-relative mb-4'>
                    <div className="media-carousel">
                        <div className="carousel-items">
                            {media.map((file, index) => (
                                <>
                                    <div
                                        key={index}
                                        className="carousel-media-item"
                                        style={{
                                            backgroundImage: file.type.startsWith('image')
                                                ? `url(${mediaUrls[index]})`
                                                : undefined,
                                        }}
                                    >
                                        {file.type.startsWith('video') && (
                                            <video
                                                className="video-preview"
                                                src={mediaUrls[index]}
                                                controls
                                            ></video>
                                        )}
                                        <div className="media-counter">
                                            {index + 1}/{media.length}
                                        </div>
                                    </div>
                                </>
                            ))}
                        </div>
                        {/* <div className="carousel-dots">
                            {media.map((_, i) => (
                                <span
                                    key={i}
                                    className={`dot ${i === currentMediaIndex ? 'active' : ''}`}
                                ></span>
                            ))}
                        </div> */}
                    </div>

                </div>
            )}
            {media.length > 0 && (

                <div className="media-options">
                    {<div onClick={() => handleMediaSelect('photos')}
                        className='d-flex align-items-center cursor-pointer'
                    >
                        <img src="../media/gallery.png" className='me-1' />
                        Add more Photos
                    </div>
                    }
                </div>
            )}
            <textarea
                placeholder="What's on your mind?"
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                className="post-textarea"
                rows={8}
            ></textarea>
            {media.length === 0 && (
                <div className="media-options">
                    {isMobile() ?
                        <>
                            <div onClick={() => handleMediaSelect('photos')}
                                className='d-flex align-items-center cursor-pointer'
                            >
                                <img src="../media/gallery.png" className='me-1' />
                                Photos
                            </div>
                            <div onClick={() => handleMediaSelect('video')}
                                className='d-flex align-items-center cursor-pointer'
                            >
                                <img src="../media/video.png" className='me-1' />
                                Video
                            </div>
                        </> :
                        <>
                            <div onClick={() => handleMediaSelect('photos')}
                                className='d-flex align-items-center cursor-pointer'
                            >
                                <img src="../media/folder.png" className='me-1' />
                                Choose the file
                            </div>
                        </>}
                    <div onClick={() => handleMediaSelect('camera')}
                        className='d-flex align-items-center cursor-pointer'
                    >
                        <img src="../media/camera.png" className='me-1' />
                        Camera
                    </div>
                </div>
            )}

            <footer className="create-post-footer">
                <button onClick={handleCreate} className="create-button" disabled={loading}>
                    {loading ? 'CREATING...' : 'CREATE'}
                </button>
            </footer>
        </div>
    );
};

export default CreatePost;
