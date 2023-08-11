import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [password, setPassword] = useState('');
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [isFaceRecognized, setIsFaceRecognized] = useState(false);
  const [wifiName, setWifiName] = useState('');
  const [isAttendanceMarked, setIsAttendanceMarked] = useState(false);
  const [isFaceChecked, setIsFaceChecked] = useState(false);

  const videoRef = useRef(null); // Create a ref for the video element

  useEffect(() => {
    if (isFaceRecognized) {
      fetchConnectedWifi();
    }
  }, [isFaceRecognized]);

  useEffect(() => {
    // Reset the attendance marked status when the face recognition is started again
    setIsAttendanceMarked(false);
  }, [isFaceChecked]);

  async function handlePasswordSubmit(event) {
    event.preventDefault();
    // Perform your password verification logic here
    if (password === 'secret123') {
      setIsPasswordVerified(true);
    } else if (password === 'secret456') {
      setIsPasswordVerified(true);
      setIsFaceRecognized(false);
    } else {
      alert('Password incorrect. Please try again.');
    }
  }

  async function startFaceRecognition() {
    const video = videoRef.current; // Access the video element using the ref
    const stream = await setupCamera();
    video.srcObject = stream; // Set the stream as the video source
    video.play();

    setTimeout(() => {
      setIsFaceChecked(true); // Set flag to indicate face checking is complete
      if (password !== 'secret456') {
        setIsFaceRecognized(true);
      }
    }, 5000); // Recognize face for 5 seconds
  }

  async function setupCamera() {
    const video = videoRef.current; // Access the video element using the ref
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    return stream;
  }

  async function fetchConnectedWifi() {
    // Fetch connected WiFi information
    try {
      const wifiInfo = await navigator.connection.effectiveType;
      setWifiName(wifiInfo);
    } catch (error) {
      console.error('Error fetching WiFi information:', error);
    }
  }

  async function markAttendance() {
    // Mark attendance logic here
    // For this mock, let's assume attendance is successfully marked
    setIsAttendanceMarked(true);
  }

  return (
    <div className="App">
      <h1>Attendance System</h1>
      {!isPasswordVerified ? (
        <form onSubmit={handlePasswordSubmit}>
          <label htmlFor="password">Enter Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Verify Password</button>
        </form>
      ) : (
        <>
          <h2>Welcome! Your Password is Verified.</h2>
          {!isFaceChecked ? (
            <div>
              <p>Looking for your face...</p>
              <video ref={videoRef} width="640" height="480" autoPlay />
              <button onClick={startFaceRecognition}>Start Face Recognition</button>
            </div>
          ) : (
            <div>
              {isFaceRecognized ? (
                <p>Your Face is Recognized.</p>
              ) : (
                <p>No face recognized for this password.</p>
              )}
              {wifiName ? (
                <p>Connected to WiFi: {wifiName}</p>
              ) : (
                <button onClick={fetchConnectedWifi}>Fetch WiFi</button>
              )}
              {!isAttendanceMarked && isFaceRecognized ? (
                <button onClick={markAttendance}>Mark Attendance</button>
              ) : (
                <p>{isAttendanceMarked ? 'Attendance Marked!' : 'Cannot mark attendance.'}</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
