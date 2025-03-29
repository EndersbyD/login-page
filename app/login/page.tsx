"use client";
import React, { useState } from 'react';

const styles: { [key: string]: React.CSSProperties } = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f4f4f9',
      margin: 0,
      color: 'black'
    },
    formContainer: {
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      width: '300px',
    },
    heading: {
      marginBottom: '20px',
      fontSize: '1.5rem',
      textAlign: 'center',
    },
    formGroup: {
      marginBottom: '15px',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontSize: '0.9rem',
      color: 'black'
    },
    input: {
      width: '100%',
      padding: '8px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      color: 'black'
    },
    button: {
      width: '100%',
      padding: '10px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '1rem',
      cursor: 'pointer',
    },
  };

const LoginPage = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Username:', username);
    console.log('Password:', password);
    
    e.preventDefault();

    try {
      fetch(`/api/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      }).then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            // setMessage('Login successful!'); // Show success message
            document.cookie = `auth-token=${data.token}; path=/`; // Save JWT in a cookie
            console.log('JWT Token:', data.token);

            // Redirect to a protected page
            console.log('Redirecting to protected route...', decodeURIComponent(window.location.href.split('?')[1].split('=')[1]));
            window.location.href = decodeURIComponent(window.location.href.split('?')[1].split('=')[1]); // Change this to your protected route
          });
          
        } else {
          response.json().then((errorData) => errorData);
          // setError(errorData.error || 'Login failed');
        }
      })
    } catch (err) {
      // setError('An error occurred while connecting to the server.');
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.heading}>Login</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="username" style={styles.label}>Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <button type="submit" style={styles.button}>Login</button>
        </form>
      </div>
    </div>
  );
};



export default LoginPage;
