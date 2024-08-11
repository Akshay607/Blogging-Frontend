import logo from './logo.svg';
import React,{useContext, useMemo,createContext,useState} from 'react';
import { BrowserRouter, Routes, Route, Switch} from 'react-router-dom';
import { Auth, Login,Register,Logout } from './components/Auth';
import {Follower} from './components/Follow'
import { Profile } from './components/profile';
import {Nav} from './components/Nav'
import './output.css'
import { TweetsPage } from './components/Tweet';
import { DomainURL } from './constants';

//export const localStorage = createContext([])
function App() {
 
 
 
  return (
    <div className="App flex flex-col items-center  h-screen">
      <Nav/>
     <div className='w-2/3'>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/tweets' element={<TweetsPage/>}/>
          <Route path='/logout' element={<Logout/>}/>
          <Route path='/img' element={<Img/>}/>
        </Routes>
      </BrowserRouter>

      </div>
     
    </div>
  );
}


const Img = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    
   
    const formData = new FormData();
    const fileInput = document.getElementById('fileInput');

    if (fileInput.files.length > 0) {
      formData.append('image', fileInput.files[0]); // Ensure 'image' matches the field name in multer configuration

      try {
        const response = await fetch(`${DomainURL}/img-upload`, {
          method: 'POST',
          body: formData,
        });


        const result = await response.json();
        if (result.file) {
          // Display uploaded file
          displayFile(result.file.filename);
        } else {
          console.error('Upload failed:', result);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      console.error('No file selected');
    }
  };

  // Function to display uploaded file
  const displayFile = (filename) => {
    const filePreview = document.getElementById('filePreview');
    filePreview.innerHTML = `<h2>Uploaded Image:</h2><img src="${DomainURL}/file/${filename}" alt="${filename}" style="max-width: 100%; height: auto;">`;
  };

  return (
    <>
      <form id="uploadForm" onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="file" id="fileInput" name="file" accept="image/*" required />
        <button type="submit">Upload</button>
      </form>

      <div className="file-preview" id="filePreview">
        {/* Image preview will be inserted here */}
      </div>
    </>
  );
};



export default App;
