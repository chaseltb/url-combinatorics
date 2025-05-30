import React, { useState } from 'react';
import { Button, Typography } from '@mui/material';
import { uploadImage } from '../api';
import UrlEditor from './UrlEditor';

export default function ImageUploader() {
  const [file, setFile] = useState(null);
  const [extractedUrl, setExtractedUrl] = useState('');
  
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    const result = await uploadImage(file);
    setExtractedUrl(result.urls?.[0] || '');
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <Button variant="contained" onClick={handleUpload} sx={{ mt: 2 }}>Extract URL</Button>

      {extractedUrl && (
        <UrlEditor initialUrl={extractedUrl} />
      )}
    </div>
  );
}
