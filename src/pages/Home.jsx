import { useState, useEffect } from 'react';
import { databases, appwriteConfig } from '../appwrite/config';
import BlogPost from '../components/BlogPost';
import BlogEditor from '../components/BlogEditor';
import { Query } from 'appwrite';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth(); // Only needed for edit/create controls
  const [posts, setPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch posts on load
  useEffect(() => {
    fetchPosts();
  }, []);

  // Fetch all posts from Appwrite Database
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collectionId,
        [Query.orderDesc('$createdAt')]
      );
      setPosts(response.documents);
    } catch (error) {
      toast.error('Error fetching posts');
      console.error('Error fetching posts:', error);
    }
    setLoading(false);
  };

  // Handle post deletion
  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collectionId,
        postId
      );
      setPosts(posts.filter(post => post.$id !== postId));
      toast.success('Post deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete post.');
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div className=" container">
      {/* Show "Create Post" Button only if User is Logged In */}
      {user && !isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="mb-8 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create New Post
        </button>
      )}

      {/* Show Editor if Editing Mode is Active */}
      {isEditing ? (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            {editingPost ? 'Edit Post' : 'Create New Post'}
          </h2>
          <BlogEditor
            post={editingPost}
            onSave={() => {
              setIsEditing(false);
              setEditingPost(null);
              fetchPosts();
            }}
            onCancel={() => {
              setIsEditing(false);
              setEditingPost(null);
            }}
          />
        </div>
      ) : (
        <div className="cards">
          {loading ? (
            <p className="text-gray-500">Loading posts...</p>
          ) : posts.length === 0 ? (
            <p className="text-gray-500">No posts available.</p>
          ) : (
            posts.map((post) => (
              <BlogPost
                key={post.$id}
                post={post}
                onEdit={user ? () => setEditingPost(post) || setIsEditing(true) : null}
                onDelete={user ? handleDelete : null}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
