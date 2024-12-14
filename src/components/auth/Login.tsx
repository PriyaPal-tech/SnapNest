import { signInWithPopup } from 'firebase/auth';
import { useState } from 'react'
import { auth, provider } from '../../global/config';
import { saveToken } from '../../global/userService';
import { useNavigate } from 'react-router-dom';
import { userProps } from '../../global/types';
import { addUser, checkUserExists } from '../../db/addUsers';
import { useGlobalContext } from '../../context/GlobalContext';

const Login = () => {
    const {setUserToken} = useGlobalContext();
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const googleLogin = async () => {
        setLoading(true);
        signInWithPopup(auth, provider)
            .then(async (result) => {
                const user = result.user;
                const accessToken = await user.getIdToken()
                saveToken(accessToken);
                setUserToken(accessToken);
                const userDetails: userProps = {
                    userId: user.uid,
                    email: user.email ? user.email : '',
                    userName: user.displayName ? user.displayName : '',
                }
                const userExists = await checkUserExists(user.uid);
                if (!userExists) {
                    addUser(userDetails);
                }
                navigate('/user/feed');
                setLoading(false);
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error("user login errors", errorCode, errorMessage);
                setLoading(false);
            })
    }

    return (
        <div className="login-page">
            <div className="background-images">
                {[1, 2, 3].map((col) => (
                    <div key={col} className="image-column">
                        {Array.from({ length: 3 }).map((_, idx) => (
                            <img
                                key={idx}
                                src={`./media/image${col}-${idx + 1}.png`}
                                alt={`Column ${col} ${idx + 1}`}
                                className="bg-image"
                            />
                        ))}
                    </div>
                ))}
            </div>

            <div className="login-section">
                <div className='app-header'>
                    <img src='./media/app-logo.png' alt='snapnest'/>
                    SnapNest
                </div>
                <div className='app-sub-header mb-4'>Moments That Matter, Shared Forever.</div>
                <button
                    type="button"
                    onClick={googleLogin}
                    disabled={loading}
                    className="btn google-btn"
                >
                    <img src="./media/google-icon.svg" alt="google" height={18} className="pe-2" />
                    Continue with Google
                </button>
            </div>
        </div>
    )
}

export default Login
