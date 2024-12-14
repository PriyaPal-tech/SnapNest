import React, { Dispatch, SetStateAction, useState } from 'react';
import { Modal, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaReddit, FaDiscord, FaFacebookMessenger, FaTelegram, FaInstagram, FaCopy } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";
import '../../styles/ShareModal.css'
import { IoLogoWhatsapp } from 'react-icons/io';

const ShareModal = ({
    show,
    setShow,
    shareUrl
}: {
    show: boolean,
    setShow: Dispatch<SetStateAction<boolean>>;
    shareUrl: string
}) => {
    
    const [shortUrl, setShortUrl] = useState<string>(shareUrl);

    const encodeURI = encodeURIComponent(shortUrl);
    const shareLinks = {
        whatsapp: `https://wa.me/?text=${encodeURI}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURI}`,
        reddit: `https://www.reddit.com/submit?url=${encodeURI}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURI}`,
        discord: `https://discord.com/channels/@me`,
        messenger: `https://www.facebook.com/dialog/send?link=${encodeURI}&app_id=YOUR_APP_ID`,
        telegram: `https://t.me/share/url?url=${encodeURI}`,
        instagram: `https://www.instagram.com/create/select/?url=${encodeURI}`,
    };
    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(shortUrl).then(() => {
            alert("Link copied to clipboard!");
        }).catch((error) => {
            console.error("Failed to copy text: ", error);
        });
    };

    return (
        <Modal show={show}
            onHide={() => setShow(false)}
            centered
        >
            <Modal.Header closeButton className='border-bottom-0'>
                <Modal.Title>Share Post</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row className="social-icons-grid">
                    <Col xs={3} className="social-icon">
                        <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer">
                            <div className='social-icon-box' style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                                <FaXTwitter size={24} color='#fff' /></div>
                        </a>
                        <p>Twitter</p>
                    </Col>
                    <Col xs={3} className="social-icon">
                        <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer">
                            <div className='social-icon-box' style={{ backgroundColor: 'rgba(24, 119, 242, 0.09)' }}>
                                <FaFacebook size={24} color='#1877F2' />
                            </div>
                        </a>
                        <p>Facebook</p>
                    </Col>
                    <Col xs={3} className="social-icon">
                        <a href={shareLinks.reddit} target="_blank" rel="noopener noreferrer">
                            <div className='social-icon-box' style={{ backgroundColor: 'rgba(255, 87, 34, 0.09)' }}>
                                <FaReddit size={24} color='#FF5722' />
                            </div>
                        </a>
                        <p>Reddit</p>
                    </Col>
                    <Col xs={3} className="social-icon">
                        <a href={shareLinks.discord} target="_blank" rel="noopener noreferrer">
                            <div className='social-icon-box' style={{ backgroundColor: 'rgba(102, 101, 210, 0.09)' }}>
                                <FaDiscord size={24} color='#6665D2' />
                            </div>
                        </a>
                        <p>Discord</p>
                    </Col>
                    <Col xs={3} className="social-icon">
                        <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer">
                            <div className='social-icon-box' style={{ backgroundColor: 'rgba(103, 193, 94, 0.09)' }}>
                                <IoLogoWhatsapp size={24} color='#67C15E' />
                            </div>
                        </a>
                        <p>WhatsApp</p>
                    </Col>
                    <Col xs={3} className="social-icon">
                        <a href={shareLinks.messenger} target="_blank" rel="noopener noreferrer">
                            <div className='social-icon-box' style={{ backgroundColor: 'rgba(30, 136, 229, 0.09)' }}>
                                <FaFacebookMessenger size={24} color='#1E88E5' />
                            </div>
                        </a>
                        <p>Messenger</p>
                    </Col>
                    <Col xs={3} className="social-icon">
                        <a href={shareLinks.telegram} target="_blank" rel="noopener noreferrer">
                            <div className='social-icon-box' style={{ backgroundColor: 'rgba(27, 146, 209, 0.09)' }}>
                                <FaTelegram size={24} color='#1B92D1' />
                            </div>
                        </a>
                        <p>Telegram</p>
                    </Col>
                    <Col xs={3} className="social-icon">
                        <a href={shareLinks.instagram} target="_blank" rel="noopener noreferrer">
                            <div className='social-icon-box' style={{ backgroundColor: '#FF40C617' }}>
                                <img src='../../media/instagram.svg' width={24} />
                            </div>
                        </a>
                        <p>Instagram</p>
                    </Col>
                </Row>
                <div className="shortened-url">
                    <p className='page-link-header'>Page Link</p>
                    <div className="link-with-icon">
                        <span style={{ paddingTop: '7px', paddingBottom: '7px' }}>{shortUrl}</span>
                        <FaCopy size={15} color='#212121' onClick={handleCopyToClipboard} className='cursor-pointer' />
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ShareModal;
