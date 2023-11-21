import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLogin, isLoggedIn }) => {
    const [formdata, setFormData] = useState({
        "userName": '',
        "password": ''
    });

    const [responseState, setResponseState] = useState('');

    const handleInputChange = (e) => {
        setFormData({ ...formdata, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5179/Authentication/Login', formdata);

            if (response && response.data && response.data.token) {
                // Add the token to the axios defaults for subsequent requests
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

                console.log(response.data);
                setResponseState(response.data);
                onLogin(); // Call the onLogin callback from the parent component
            } else {
                console.error('Invalid response:', response);
                setResponseState(response.data);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                console.error('Login failed:', error.response.data);
                setResponseState(error.response.data);
            } else {
                console.error('Unexpected error:', error);
                setResponseState(error.response.data);
            }
        }
    };

    return (
        <div>
            {responseState === '' ? (
                <div>
                    <h2>Login</h2>
                    <form onSubmit={handleSubmit}>
                        <label>Username:</label>
                        <input type='text' name='userName' value={formdata.userName} onChange={handleInputChange} required />
                        <label>Password:</label>
                        <input type='password' name='password' value={formdata.password} onChange={handleInputChange} required />
                        <button type='submit'>Submit</button>
                    </form>
                </div>
            ) : (
                responseState.hasOwnProperty("Bad credentials") ? (
                    <div>
                        {responseState["Bad credentials"][0]}
                    </div>
                ) : <div>{responseState.userName} has been successfully logged in.</div>
            )}
        </div>
    );

};

export default Login;