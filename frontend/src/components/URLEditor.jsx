import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import { validateUrl } from '../api';

export default function UrlEditor({ initialUrl }) {
  const [url, setUrl] = useState(initialUrl);
  const [result, setResult] = useState('');

  const handleCheck = async () => {
    const data = await validateUrl(url);
    setResult(data.valid_url || 'No valid URL found.');
  };

  return (
    <div>
      <TextField
        label="Detected URL"
        value={url}
        fullWidth
        onChange={(e) => setUrl(e.target.value)}
        sx={{ my: 2 }}
      />
      <Button variant="outlined" onClick={handleCheck}>Validate and Fix URL</Button>
      {result && (
        <Typography sx={{ mt: 2 }}>✅ Valid URL: <a href={result} target="_blank" rel="noopener noreferrer">{result}</a></Typography>
      )}
    </div>
  );
}
