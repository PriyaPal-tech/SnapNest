import React from 'react'
import { FaPlus } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
const CreatePostButton = ({ handleCreatePost }: { handleCreatePost: () => void }) => {
    return (
        <div className='create-icon' onClick={handleCreatePost}>
            <FaPlus size={20} />
        </div>
    )
}

export default CreatePostButton
