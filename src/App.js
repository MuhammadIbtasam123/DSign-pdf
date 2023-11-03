//example project for implementation of pdf viewer in react
import './App.css';
import { useState } from 'react';
import PdfViewerComponent from './PdfViewerComponent.js';
import Button from './Button.js';

function App() {
  const [documentUrl, setDocumentUrl] = useState(null);
  const selectFile = (e) => {
    // Assuming the selected file is an ArrayBuffer 
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // You can create an object URL to use as a temporary URL for the selected file
      const url = URL.createObjectURL(selectedFile);
      setDocumentUrl(url);
    }
  };
  return (
    <div className="App">
      <div className="PDF-Viewer">
        <div className="nav">
          <Button selectFile={selectFile} />
        </div>
        {documentUrl && 
        <PdfViewerComponent 
          document={documentUrl} 
        />}
      </div>
    </div>
  );
}

export default App;
