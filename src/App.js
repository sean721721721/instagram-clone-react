import React, { useState, useEffect } from 'react';
import Post from './Post';
import './App.css';
import { db } from './firebase';

function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    db.collection('posts').onSnapshot((snapshot) => {
      // every time a new post is added, this code fires ...
      setPosts(snapshot.docs.map((doc) => ({
        id: doc.id,
        post: doc.data(),
      })));
    });
  }, [posts]);

  return (
    <div className="app">
      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />
      </div>
      {
        posts.map(({ id, post }) => (
          <Post key={id} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
        ))
      }
    </div>
  );
}

export default App;
