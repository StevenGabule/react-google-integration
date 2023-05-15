import { decodeJwt } from 'jose';
import './App.css';
import { useGoogleOneTapLogin } from '@react-oauth/google'
import axios from 'axios';

function App() {
  useGoogleOneTapLogin({
    onSuccess: (credentialResponse) => {
      const { credential } = credentialResponse;
      const payload = credential ? decodeJwt(credential) : undefined;
      if (payload) {
        axios.get('http://localhost:5000/protected', {
          headers: {
            Authorization: `Bearer ${credential}`
          }
        })
          .then(res => console.log(res.data))
          .catch(err => console.log(err))
      }
    },
    onError: error => console.log(error)
  })

  return (
    <div className="App">
      <h3>React Google OAuth Authentication</h3>
      {/* <GoogleLogin
        useOneTap
      /> */}
    </div>
  );
}

export default App;
