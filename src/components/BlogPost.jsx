import { useState } from 'react';
import { databases } from '../appwrite/config';
import { useAuth } from '../context/AuthContext';
import parse from 'html-react-parser';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function BlogPost({ post, onEdit, onDelete }) {
  const altImg = "https://imgv3.fotor.com/images/blog-cover-image/a-shadow-of-a-boy-carrying-the-camera-with-red-sky-behind.jpg";
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    setLoading(true);
    try {
      await databases.deleteDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_COLLECTION_ID,
        post.$id
      );
      onDelete(post.$id);
      toast.success('Post deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete post.');
    }
    setLoading(false);
  };

  return (
    <div className="cardsize">
      {/* Display Image if Available, Else Show Placeholder */}
      <img 
        src={post.imageUrl || altImg} 
        alt="Blog post image" 
        className="w-full h-64 object-cover rounded-lg mb-4"
      />

      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold">{post.title}</h2>
        {user?.$id === post.userId && (
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(post)}
              className="text-blue-600 hover:text-blue-800"
              disabled={loading}
            >
              <PencilIcon className="h-5 w-5" />
            </button>
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800"
              disabled={loading}
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Blog Content */}
      <div className="prose max-w-none">
        {parse(post.content)}
      </div>

      {/* Author & Date Info */}
      <div className="mt-4 text-sm text-gray-500">
        Posted by {post.author} on {new Date(post.$createdAt).toLocaleDateString()}
      </div>
    </div>
  );
}
