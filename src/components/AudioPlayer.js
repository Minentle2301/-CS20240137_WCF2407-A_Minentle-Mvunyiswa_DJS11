// Import necessary hooks from React
import React, { useRef, useState } from "react";

// Define the AudioPlayer component, which takes a `src` prop
const AudioPlayer = ({ src }) => {
  // State to track whether the audio is currently playing
  const [playing, setPlaying] = useState(false);

  // useRef to create a reference to the <audio> element
  const audioRef = useRef(null);

  // Function to toggle the play/pause state of the audio
  const togglePlay = () => {
    // If the audio is playing, pause it
    if (playing) {
      audioRef.current.pause(); // Access the audio element via the ref and pause it
    } 
    // If the audio is not playing, play it
    else {
      audioRef.current.play(); // Access the audio element via the ref and play it
    }
    // Update the `playing` state to the opposite of its current value
    setPlaying(!playing);
  };

  // Render the audio player UI
  return (
    <div className="audio-player">
      {/* Audio element with the `src` prop and the `audioRef` reference */}
      <audio ref={audioRef} src={src}></audio>

      {/* Button to toggle play/pause functionality */}
      <button onClick={togglePlay}>
        {/* Display "Pause" if playing, otherwise display "Play" */}
        {playing ? "Pause" : "Play"}
      </button>
    </div>
  );
};

// Export the AudioPlayer component as the default export
export default AudioPlayer;

