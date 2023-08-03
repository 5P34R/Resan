import axios from 'axios';

const endpoint = axios.create({
  baseURL: 'http://localhost:8000/', // Your API base URL here
});

export default endpoint;