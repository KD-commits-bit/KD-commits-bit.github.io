import {useEffect, useState} from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [data, setData] = useState('')

  useEffect(() => {
    axios.get('/api')
        .then(res => setData(res.data))
        .catch(err => console.log(err))
  }, []);

  console.log(data);

  return (
    <>
      받아온 값 : {data}
    </>
  )
}

export default App
