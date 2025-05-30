import React from 'react';
import { Container, Typography } from '@mui/material';
import ImageUploader from './components/ImageUploader';

function App() {
  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        URL Combinatorics
      </Typography>
      <ImageUploader />
    </Container>
  );
}

export default App;
