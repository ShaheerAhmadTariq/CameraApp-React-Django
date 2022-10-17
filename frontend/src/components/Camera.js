import React from 'react'
import Webcam from "react-webcam";
import axios from 'axios';
function Camera() {
  const webcamRef = React.useRef(null);
  const mediaRecorderRef = React.useRef(null);
  const [capturing, setCapturing] = React.useState(false);
  const [result, setResult] = React.useState(false);
  const [recordedChunks, setRecordedChunks] = React.useState([]);
  
  const handleStartCaptureClick = React.useCallback(() => {
    console.log("Starting caputure")
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm"
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, setCapturing, mediaRecorderRef]);

  const handleDataAvailable = React.useCallback(
    ({ data }) => {
      console.log("handling data")
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]);

  const handleStopCaptureClick = React.useCallback(() => {
    console.log("Stopped")
    mediaRecorderRef.current.stop();
    setCapturing(false);
    console.log("Recorded Chunks length", recordedChunks.length)
  }, [mediaRecorderRef, webcamRef, setCapturing]);
 
  const handleDownload = React.useCallback(async () => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm"
      });
      console.log("Blob conatins", await blob.arrayBuffer())
      // converting blob to string
      const fileReader = new FileReader();
      let value = ""
      var url = 'http://127.0.0.1:8000/api/task-create/'
      const data = new FormData()
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
      fileReader.onload = (e) => {
        // console.log(e.target.result)
        console.log("#####################################################################################################3")
        // setResult(e.target.result)
        value = e.target.result
        console.log(value)
        data.append('video',value);
        axios.post(url, data, config).then(response => {
        console.log(response.data)
        })
      }
      fileReader.readAsDataURL(blob);
      console.log("result: ",value)
    
      setRecordedChunks([]);
    }
  }, [recordedChunks]);
  return (
    <>
      <h1>Camera is starting</h1>
      <Webcam audio={false} ref={webcamRef} />
      {capturing ? (
        <button onClick={handleStopCaptureClick}>Stop Capture</button>
      ) : (
        <button onClick={handleStartCaptureClick}>Start Capture</button>
      )}
      {recordedChunks.length > 0 && (
        <button onClick={handleDownload}>Download</button>
      )}
    </>
  )
}

export default Camera