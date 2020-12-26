import React, { useState } from 'react';
import Alert from '../components/Alert';

export default function Upload() {
    const [fileInputState, setFileInputState] = useState(''); // the state of the file to be inputed 
    const [previewSource, setPreviewSource] = useState(''); // the preview state of the selected file
    const [selectedFile, setSelectedFile] = useState(); // the state of the selected file  
    const [successMsg, setSuccessMsg] = useState(''); // the state of the success message
    const [errMsg, setErrMsg] = useState(''); // the state of the error message
    //this function handles when user selects a file to be changed
    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        previewFile(file);
        setSelectedFile(file);
        setFileInputState(e.target.value);
    };

    // this function helps user to preview what he selected before sbmiting
    const previewFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreviewSource(reader.result);
        };
    };


    // this method handles submittion of the file
    const handleSubmitFile = (e) => {
        // console.log('submitting');
        e.preventDefault();
        if (!selectedFile) return;
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend = () => {
            uploadImage(reader.result);
        };
        reader.onerror = () => {
            console.error('AHHHHHHHH!!');
            setErrMsg('something went wrong!');
        };
    };

    // this method handles the image upload
    const uploadImage = async (base64EncodedImage) => {
        try {
            await fetch('/api/upload', {
                method: 'POST',
                body: JSON.stringify({ data: base64EncodedImage }),
                headers: { 'Content-Type': 'application/json' },
            });
            setFileInputState('');
            setPreviewSource('');
            setSuccessMsg('Image uploaded successfully');
        } catch (err) {
            console.error(err);
            setErrMsg('Something went wrong!');
        }
    };
    return (
        <div>
            <h1 className="title">Upload an Image</h1>
            <Alert msg={errMsg} type="danger" />
            <Alert msg={successMsg} type="success" />
            <form onSubmit={handleSubmitFile} className="form">
                <input
                    id="fileInput"
                    type="file"
                    name="image"
                    onChange={handleFileInputChange}
                    value={fileInputState}
                    className="form-input"
                />
                <button className="btn" type="submit">
                    Submit
                </button>
            </form>
            {previewSource && (
                <img
                    src={previewSource}
                    alt="chosen"
                    style={{ height: '300px' }}
                />
            )}
        </div>
    );
}
