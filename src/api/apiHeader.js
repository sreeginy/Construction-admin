
const headers = () => ({'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('jwt-token')}`});

export default headers;
