import { useState } from 'react';
import axios from 'axios';
import styles from './VideoUpload.module.css';

const VideoUpload = () => {
  const [patientId, setPatientId] = useState('');
  const [metadata, setMetadata] = useState({
    studyDate: '',
    studyTime: '',
    modality: '',
    studyDescription: '',
    accessionNumber: '',
    seriesNumber: '',
    seriesDescription: '',
    numberOfImages: '',
    imageNumber: '',
    anatomicalRegion: '',
    referringPhysician: '',
    performingTechnician: '',
    clinicalHistory: '',
    indications: '',
    scannerDetails: {
      manufacturer: '',
      model: '',
      serialNumber: '',
      softwareVersion: '',
    },
    imageAcquisitionParameters: {
      repetitionTime: '',
      echoTime: '',
      flipAngle: '',
      sliceThickness: '',
      resolution: '',
      fieldOfView: '',
    },
    patientPosition: '',
    contrastAgent: {
      type: '',
      dose: '',
      administrationRoute: '',
      timeAfterAdministration: '',
    },
    notes: '',
  });
  const [videoFile, setVideoFile] = useState(null);
  const [status, setStatus] = useState('');

  const handleMetadataChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split('.');
    if (keys.length === 1) {
      setMetadata({ ...metadata, [name]: value });
    } else if (keys.length === 2) {
      setMetadata({
        ...metadata,
        [keys[0]]: {
          ...metadata[keys[0]],
          [keys[1]]: value,
        },
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientId || !videoFile) {
      setStatus('Please provide both Patient ID and Video file.');
      return;
    }

    const formData = new FormData();
    formData.append('patientId', patientId);
    formData.append('metadata', JSON.stringify(metadata));
    formData.append('video', videoFile);

    try {
      setStatus('Uploading video...');
      const response = await axios.post('/api/record/video', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setStatus(`Success: ${response.data.message}`);
      // Reset form
      setPatientId('');
      setMetadata({
        studyDate: '',
        studyTime: '',
        modality: '',
        studyDescription: '',
        accessionNumber: '',
        seriesNumber: '',
        seriesDescription: '',
        numberOfImages: '',
        imageNumber: '',
        anatomicalRegion: '',
        referringPhysician: '',
        performingTechnician: '',
        clinicalHistory: '',
        indications: '',
        scannerDetails: {
          manufacturer: '',
          model: '',
          serialNumber: '',
          softwareVersion: '',
        },
        imageAcquisitionParameters: {
          repetitionTime: '',
          echoTime: '',
          flipAngle: '',
          sliceThickness: '',
          resolution: '',
          fieldOfView: '',
        },
        patientPosition: '',
        contrastAgent: {
          type: '',
          dose: '',
          administrationRoute: '',
          timeAfterAdministration: '',
        },
        notes: '',
      });
      setVideoFile(null);
    } catch (error) {
      console.error('Error uploading video:', error);
      setStatus(
        error.response?.data?.error || 'Error uploading video. Please try again.'
      );
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>Upload Video Record</header>
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <div className={styles.container}>
          <label className={styles.label}>Patient ID:</label>
          <input
            type="text"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            required
            className={styles.formInput}
          />
        </div>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Metadata</legend>
          <div>
            <label className={styles.label}>Study Date:</label>
            <input
              type="date"
              name="studyDate"
              value={metadata.studyDate}
              onChange={handleMetadataChange}
              className={styles.formInput}
            />
          </div>
          <div>
            <label className={styles.label}>Study Time:</label>
            <input
              type="time"
              name="studyTime"
              value={metadata.studyTime}
              onChange={handleMetadataChange}
              className={styles.formInput}
            />
          </div>
          {/* Add other input fields with appropriate styles */}
        </fieldset>
        <div>
          <label>Video File:</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
            required
            className={styles.formInput}
          />
        </div>
        <button type="submit" className={styles.submitButton}>Upload Video</button>
      </form>
      {status && <p className={styles.statusMessage}>{status}</p>}
    </div>
  );
};

export default VideoUpload;
