/* eslint-disable no-alert */
/* eslint-disable no-console */
import { Button } from '@material-ui/core';
import React, { useState, useRef } from 'react';
import firebase from 'firebase';
import { storage, db } from './firebase';
import './ImageUpload.css';

function ImageUpload({ username }) {
  const [image, setImage] = useState('');
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState('');
  const fileInput = useRef(null);
  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // progress function ...
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        );
        setProgress(progress);
      },
      (error) => {
        // Error function...
        console.log(error);
        alert(error.message);
      },
      () => {
        // complete function ...
        storage
          .ref('images')
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            // post image inside db
            db.collection('posts').add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption,
              imageUrl: url,
              username,
            });

            setProgress(0);
            setCaption('');
            setImage(null);
            fileInput.current.value = '';
          });
      },
    );
  };

  return (
    <div className="imageupload">
      <progress className="imageupload__progress" value={progress} max="100" />
      <input type="text" placeholder="Enter a caption..." onChange={(event) => setCaption(event.target.value)} value={caption} />
      <input ref={fileInput} type="file" onChange={handleChange} />
      <Button onClick={handleUpload}>
        Upload
      </Button>
    </div>
  );
}

export default ImageUpload;
