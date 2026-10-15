import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ id, name: '', email: '', phone: '', address: '', image: '' });
  const [errors, setErrors] = useState({});
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    getUserData()
  },[])

  const getUserData = async() => {
    try{


      const response = await axios.get(`https://react-backend-1-djm1.onrender.com/api/get-singleuser/${id}`,{
        headers:{
          "Content-Type":"Application/JSON",
          "Authorization":"Bearer "+token
        }
      })
      setFormData(response.data.data)
    } catch(error){
      console.log(error.message)
    }
  }

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{6,15}$/;
    const mobileRegex = /^[6-9][0-9]{9}$/;

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Phone must be 6 to 15 digits';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file || null);
    setPreview(file ? URL.createObjectURL(file): '');
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    try{
      const data = new FormData();

      data.append('name',formData.name);
      data.append('email',formData.email);
      data.append('phone',formData.phone);
      data.append('address',formData.address);
      data.append('password',formData.password);
      console.log(image)
      if(image){
        data.append('image',image);
      }

      const response = await axios.put(`https://react-backend-1-djm1.onrender.com/api/update-user/${id}`,data,{
        headers:{
          "Content-Type":"multipart/form-data",
          "Authorization":"Bearer "+token
        }
      })
      if(response.data.data){
        navigate("/dashboard")
      }
    } catch(error){
      console.log(error.message)
    }
    console.log('Edit User Data:', formData);
    navigate('/dashboard');
  };

  const handleCancel = () => navigate('/dashboard');

  const inputClass = (field) =>
    `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
      errors[field] ? 'border-red-500' : 'border-gray-300'
    }`;

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Edit User</h2>
          <button
            type="button"
            onClick={handleCancel}
            className="text-sm text-blue-600 hover:underline"
          >
            &larr; Back to list
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="edit-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={inputClass('name')}
              placeholder="Enter full name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="text"
              id="edit-email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={inputClass('email')}
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="edit-phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="text"
              id="edit-phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={inputClass('phone')}
              placeholder="Enter phone number"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="add-address" className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              id="add-address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={inputClass('address')}
              placeholder="address"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="add-image" className="block text-sm font-medium text-gray-700 mb-1">
              Image
            </label>
            <input
              type="file"
              id="add-image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className={inputClass('image')}
            />
            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
            {preview && (
              <img src={preview} alt="Preview" className="mt-3 h-24 w-24 object-cover rounded-md border"/>
            )}
          </div>

          
          {/* <div className="mb-4">
            <label htmlFor="add-password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="add-password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={inputClass('password')}
              placeholder="password"
            />
          </div> */}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors"
            >
              Update User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditUser;
