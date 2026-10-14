import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() =>{
    getUserData()
  },[])

  const getUserData = async() => {
    try{
      const response = await axios.get("http://localhost:5000/api/get-user",{
        headers:{
          "Content-Type":"Application/JSON",
          "Authorization":"Bearer "+token
        }
      })
      setUsers(response.data.data)
    } catch(error){
      console.log(error.message)
    }
  }

  const handleDelete = async(id) => {
    try{
      const response = await axios.delete(`http://localhost:5000/api/delete-user/${id}`,{
          headers:{
            "Content-Type":"Application/JSON",
            "Authorization":"Bearer "+token
          }
        })
      if(response.data){
        getUserData()
      }
    } catch(error) {
      console.log(error.message)
    }
  };

  const handleAddUser = () => {
    navigate("/addUser")
  }

  const handleEdit = (id) => {
    navigate(`/edit-user/${id}`)
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">User List</h1>
          <button
            type="button"
            onClick={handleAddUser}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition-colors"
          >
            + Add User
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">#</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Phone</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Address</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Image</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700 border-b">{index + 1}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 border-b">{user.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 border-b">{user.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 border-b">{user.phone}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 border-b">{user.address}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 border-b"><img src ={user.image} width = "100px"/></td>
                    <td className="px-4 py-3 text-sm border-b">
                      <div className="flex justify-center gap-2">
                        <button
                          type="button"
                          onClick={()=>handleEdit(user._id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(user._id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
