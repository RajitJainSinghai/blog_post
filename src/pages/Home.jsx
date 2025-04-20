import { useState, useEffect } from 'react';
import { databases, appwriteConfig } from '../appwrite/config';
import BlogPost from '../components/BlogPost';
import BlogEditor from '../components/BlogEditor';
import { Query } from 'appwrite';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch posts on mount
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collectionId,
        [Query.orderDesc('$createdAt')]
      );
      setPosts(response.documents);
    } catch (error) {
      toast.error('Failed to fetch posts');
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collectionId,
        postId
      );
      setPosts((prev) => prev.filter((p) => p.$id !== postId));
      toast.success('Post deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete post.');
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Create Button */}
      {user && !isEditing && (
        <div className="mb-6 text-right">
          <button
            onClick={() => {
              setIsEditing(true);
              setEditingPost(null);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Create New Post
          </button>
        </div>
      )}

      {/* Blog Editor */}
      {isEditing ? (
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <p className="text-gray-500">Loading posts...</p>
          ) : posts.length === 0 ? (
            <p className="text-gray-500">No posts available.</p>
          ) : (
            posts.map((post) => (
              <BlogPost
                key={post.$id}
                post={post}
                onEdit={user ? () => {
                  setEditingPost(post);
                  setIsEditing(true);
                } : null}
                onDelete={user ? handleDelete : null}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
