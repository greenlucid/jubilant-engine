import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const tokenConfig = (token) => (
  {
    headers: { Authorization: `bearer ${token}` }
  }
)

const create = async (blog, token) => {
  const response = await axios.post(baseUrl, blog, tokenConfig(token))
  return response.data
}

const like = async (blog) => {
  const updatedFields = { likes: blog.likes + 1 }
  const response = await axios.put(`${baseUrl}/${blog.id}`, updatedFields)
  return response.data
}

const remove = async (blog, token) => {
  const response = await axios.delete(`${baseUrl}/${blog.id}`, tokenConfig(token))
  return response.data
}

export default { getAll, create, like, remove }