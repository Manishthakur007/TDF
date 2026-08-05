import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Upload image to Cloudinary via Backend
      let imageUrl = '';
      if (image) {
        const formData = new FormData();
        formData.append('file', image);
        const imageRes = await api.post('/images/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        imageUrl = imageRes.data.url;
      }

      // 2. Create the post
      const postData = {
        title,
        content,
        excerpt,
        categorySlug: category, // Assuming backend accepts categorySlug
        imageUrl
      };

      await api.post('/posts', postData);
      navigate('/dashboard');
    } catch (error) {
      console.error("Error creating post", error);
      alert("Failed to create post. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold font-serif mb-8 border-b border-gray-800 pb-4">Write a New Recipe</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-400 mb-2">Recipe Title</label>
          <input 
            type="text" 
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-lg p-3 text-white focus:border-primary outline-none"
            placeholder="e.g. The Perfect Chocolate Chip Cookies"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-400 mb-2">Category</label>
            <select 
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-lg p-3 text-white focus:border-primary outline-none"
            >
              <option value="">Select a category</option>
              <option value="recipes">Recipes</option>
              <option value="street-food">Street Food</option>
              <option value="healthy">Healthy</option>
              <option value="desserts">Desserts</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-400 mb-2">Cover Image</label>
            <input 
              type="file" 
              accept="image/*"
              required
              onChange={handleImageChange}
              className="w-full bg-gray-900 border border-gray-800 rounded-lg p-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-white hover:file:bg-gray-700"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-400 mb-2">Short Description (Excerpt)</label>
          <textarea 
            required
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-lg p-3 text-white focus:border-primary outline-none h-24"
            placeholder="A brief description of your recipe..."
          />
        </div>

        <div>
          <label className="block text-gray-400 mb-2">Full Recipe (Ingredients & Steps)</label>
          <div className="bg-white text-black rounded-lg overflow-hidden">
            <ReactQuill 
              theme="snow" 
              value={content} 
              onChange={setContent} 
              className="h-64 mb-12"
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-primary text-white rounded-lg py-4 font-bold text-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
        >
          {loading ? 'Publishing...' : 'Publish Recipe'}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
