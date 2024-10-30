// src/components/VideoUpload.js

import { useState } from 'react';
import axios from 'axios';
import styles from './VideoUpload.module.css'

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
    } else if (keys.length === 3) {
      setMetadata({
        ...metadata,
        [keys[0]]: {
          ...metadata[keys[0]],
          [keys[1]]: {
            ...metadata[keys[0]][keys[1]],
            [keys[2]]: value,
          },
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
      const response = await axios.post(
        '/api/record/video',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
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
    <header>Upload Video Record</header>
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <div>
        <label>Patient ID:</label>
        <input
          type="text"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          required
        />
      </div>
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Metadata</legend>
        {/* Study Information */}
        <div>
          <label className={styles.label}>Study Date:</label>
          <input
            type="date"
            name="studyDate"
            value={metadata.studyDate}
            onChange={handleMetadataChange}
          />
        </div>
        <div>
          <label className={styles.label}>Study Time:</label>
          <input
            type="time"
            name="studyTime"
            value={metadata.studyTime}
            onChange={handleMetadataChange}
          />
        </div>
        <div>
          <label className={styles.label}>Modality:</label>
          <input
            type="text"
            name="modality"
            value={metadata.modality}
            onChange={handleMetadataChange}
          />
        </div>
        <div>
          <label>Study Description:</label>
          <input
            type="text"
            name="studyDescription"
            value={metadata.studyDescription}
            onChange={handleMetadataChange}
          />
        </div>
        {/* Scanner Details */}
        <fieldset  className={styles.fieldset}>
          <legend>Scanner Details</legend>
          <div>
            <label className={styles.label}>Manufacturer:</label>
            <input
              type="text"
              name="scannerDetails.manufacturer"
              value={metadata.scannerDetails.manufacturer}
              onChange={handleMetadataChange}
            />
          </div>
          <div>
            <label className={styles.label}>Model:</label>
            <input
              type="text"
              name="scannerDetails.model"
              value={metadata.scannerDetails.model}
              onChange={handleMetadataChange}
            />
          </div>
          <div>
            <label>Serial Number:</label>
            <input
              type="text"
              name="scannerDetails.serialNumber"
              value={metadata.scannerDetails.serialNumber}
              onChange={handleMetadataChange}
            />
          </div>
          <div>
            <label>Software Version:</label>
            <input
              type="text"
              name="scannerDetails.softwareVersion"
              value={metadata.scannerDetails.softwareVersion}
              onChange={handleMetadataChange}
            />
          </div>
        </fieldset>
        {/* Image Acquisition Parameters */}
        <fieldset  className={styles.fieldset}>
          <legend>Image Acquisition Parameters</legend>
          <div>
            <label>Repetition Time:</label>
            <input
              type="text"
              name="imageAcquisitionParameters.repetitionTime"
              value={metadata.imageAcquisitionParameters.repetitionTime}
              onChange={handleMetadataChange}
            />
          </div>
          <div>
            <label>Echo Time:</label>
            <input
              type="text"
              name="imageAcquisitionParameters.echoTime"
              value={metadata.imageAcquisitionParameters.echoTime}
              onChange={handleMetadataChange}
            />
          </div>
          {/* Add more acquisition parameters as needed */}
        </fieldset>
        {/* Contrast Agent Details */}
        <fieldset>
          <legend>Contrast Agent</legend>
          <div>
            <label>Type:</label>
            <input
              type="text"
              name="contrastAgent.type"
              value={metadata.contrastAgent.type}
              onChange={handleMetadataChange}
            />
          </div>
          <div>
            <label>Dose:</label>
            <input
              type="text"
              name="contrastAgent.dose"
              value={metadata.contrastAgent.dose}
              onChange={handleMetadataChange}
            />
          </div>
          {/* Add more contrast agent details as needed */}
        </fieldset>
        <div>
          <label>Notes:</label>
          <textarea
            name="notes"
            value={metadata.notes}
            onChange={handleMetadataChange}
          />
        </div>
      </fieldset>
      <div>
        <label>Video File:</label>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideoFile(e.target.files[0])}
          required
        />
      </div>
      <button type="submit">Upload Video</button>
    </form>
    {status && <p className={styles.statusMessage}>{status}</p>}
  </div>
  );
};

export default VideoUpload;
