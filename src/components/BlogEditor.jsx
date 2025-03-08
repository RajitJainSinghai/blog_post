import { useState, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { databases, storage, appwriteConfig } from '../appwrite/config';
import { useAuth } from '../context/AuthContext';
import { ID } from 'appwrite';
import toast from 'react-hot-toast';

export default function BlogEditor({ post, onSave, onCancel }) {
  const { user } = useAuth();
  const [title, setTitle] = useState(post?.title || '');
  const editorRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null); // For image upload
  const [imageUrl, setImageUrl] = useState(post?.imageUrl || ''); // Store image URL

  const handleImageUpload = async (file) => {
    if (!file) return;
    try {
      const response = await storage.createFile(
        appwriteConfig.bucketId,
        ID.unique(),
        file
      );
      const uploadedImageUrl = storage.getFilePreview(appwriteConfig.bucketId, response.$id).href;
      setImageUrl(uploadedImageUrl);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !editorRef.current) {
      toast.error("Title and content are required.");
      return;
    }

    const content = editorRef.current.getContent();
    if (!content.trim()) {
      toast.error("Content cannot be empty.");
      return;
    }

    if (!user?.$id) {
      toast.error("User authentication error.");
      return;
    }

    setLoading(true);
    try {
      const postData = {
        title,
        content,
        userId: user.$id,
        author: user.name || "Anonymous",
        imageUrl,
      };

      console.log("Post Data:", postData); // Debugging: Check data before sending

      let response;
      if (post) {
        response = await databases.updateDocument(
          appwriteConfig.databaseId,
          appwriteConfig.collectionId,
          post.$id,
          postData
        );
        toast.success("Post updated successfully!");
      } else {
        response = await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.collectionId,
          ID.unique(),
          postData
        );
        toast.success("Post created successfully!");
      }

      console.log("Response from Appwrite:", response); // Debugging: Check response
      onSave();
    } catch (error) {
      console.error("Error creating/updating post:", error);
      toast.error(post ? "Failed to update post." : "Failed to create post.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title"
        className="w-full p-2 border rounded"
        required
      />
      
      {/* Image Upload */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleImageUpload(e.target.files[0])}
        className="w-full p-2 border rounded"
      />
      {imageUrl && <img src={imageUrl} alt="Uploaded Preview" className="w-full h-40 object-cover rounded" />}

      <Editor
        apiKey={import.meta.env.VITE_APPWRITE_TINYMCE_API_KEY}
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue={post?.content || ''}
        init={{
          height: 500,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | image | help',
          images_upload_handler: (blobInfo, success, failure) => {
            const file = new File([blobInfo.blob()], blobInfo.filename(), { type: blobInfo.blob().type });
            handleImageUpload(file)
              .then(() => success(imageUrl))
              .catch(() => failure("Image upload failed."));
          },
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
      />

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Saving..." : post ? "Update Post" : "Create Post"}
        </button>
      </div>
    </form>
  );
}
