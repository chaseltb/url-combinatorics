import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, CircularProgress } from "@mui/material";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const UploadAndValidate = () => {
  const [file, setFile] = useState(null);
  const [urls, setUrls] = useState([]);
  const [selectedUrl, setSelectedUrl] = useState("");
  const [validatedUrl, setValidatedUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(`${API_BASE}/upload-image`, formData);
    setUrls(response.data.urls);
    setSelectedUrl(response.data.urls[0] || "");
  };

  const handleValidate = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("original_url", selectedUrl);

    try {
      const response = await axios.post(`${API_BASE}/validate-url`, formData);
      setValidatedUrl(response.data.valid_url);
    } catch (err) {
      setValidatedUrl("No valid URL found.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <Button onClick={handleUpload} variant="contained" sx={{ mt: 2 }}>
        Extract URLs
      </Button>

      {urls.length > 0 && (
        <>
          <TextField
            label="Detected URL"
            fullWidth
            variant="outlined"
            margin="normal"
            value={selectedUrl}
            onChange={(e) => setSelectedUrl(e.target.value)}
          />
          <Button
            onClick={handleValidate}
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Validate URL"}
          </Button>
        </>
      )}

      {validatedUrl && (
        <p style={{ marginTop: "1rem" }}>
          ✅ Validated URL: <strong>{validatedUrl}</strong>
        </p>
      )}
    </div>
  );
};

export default UploadAndValidate;
