import { useState } from 'react';
import './Vision.css';
import { z } from "zod";
import Image from 'next/image';

const formSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required."),
  metadata: z.string().optional(),
  images: z.array(z.instanceof(File)).min(1, "At least one image is required."),
});

const Vision = () => {
  const [patientId, setPatientId] = useState('');
  const [metadata, setMetadata] = useState('');
  const [images, setImages] = useState([]);
  const [diagnosticResult, setDiagnosticResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // Validate form inputs using Zod schema
      const formValues = { patientId, metadata, images };
      const validation = formSchema.safeParse(formValues);

      if (!validation.success) {
        const errorMessages = validation.error.errors.map((err) => err.message).join("\n");
        setError(errorMessages);
        return;
      }
      
      const formData = new FormData();
      // Explicitly set the patient ID as a string
      formData.set('patientId', patientId.toString());
      // Only add metadata if it's not empty
      if (metadata.trim()) {
        formData.set('metadata', JSON.stringify({ info: metadata }));
      }
      // Add each image with a unique key
      images.forEach((image, index) => {
        formData.append(`images`, image);
      });

      setLoading(true);
      
      // Log the FormData entries for debugging
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      console.log('Content-Type:', formData.get('patientId'));
      const formDataEntries = Array.from(formData.entries());
      console.log('All FormData entries:', formDataEntries);

      const response = await fetch('/api/record/image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! Status: ${response.status}`);
      }
      
      setDiagnosticResult(data.diagnosticResult);
      
      // Reset form on success
      setPatientId('');
      setMetadata('');
      setImages([]);
      setError('');
      
      alert("Record submitted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(error.message || "Failed to submit the record.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vision-container">
      <h2>Submit Medical Record</h2>
      {error && (
        <div className="error-message bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="vision-form">
        <div className="form-group">
          <label htmlFor="patientId" className="block mb-2">Patient ID:</label>
          <input
            id="patientId"
            type="text"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            required
            className="input-field w-full p-2 border rounded"
          />
        </div>
        <div className="form-group">
          <label htmlFor="metadata" className="block mb-2">Metadata:</label>
          <textarea
            id="metadata"
            value={metadata}
            onChange={(e) => setMetadata(e.target.value)}
            placeholder="Additional information..."
            className="textarea-field w-full p-2 border rounded"
          />
        </div>
        <div className="form-group">
          <label htmlFor="images" className="block mb-2">Medical Images:</label>
          <input
            id="images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="input-file w-full p-2 border rounded"
          />
          {images.length > 0 && (
            <div className="image-preview-container grid grid-cols-3 gap-4 mt-4">
              {images.map((image, index) => (
                <div key={index} className="image-preview relative">
                  <Image 
                    src={URL.createObjectURL(image)} 
                    alt={`preview ${index}`} 
                    width={70} 
                    height={70} 
                    className="object-cover rounded"
                  />
                  <button
                    type="button"
                    className="remove-image-button absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    onClick={() => handleRemoveImage(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <button 
          type="submit" 
          disabled={loading} 
          className={`submit-button w-full p-2 rounded mt-4 ${
            loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      {diagnosticResult && (
        <div className="result-container mt-4 p-4 bg-green-100 rounded">
          <h3 className="font-bold mb-2">Diagnostic Result:</h3>
          <p>{diagnosticResult}</p>
        </div>
      )}
    </div>
  );
};

export default Vision;