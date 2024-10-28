'use client';

import React, { useState } from 'react';
import { Button } from 'reactstrap';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';

import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';

function RecordPage() {
  const [state, setState] = useState({ isLoading: false, response: null, error: null });

  const callApi = async (endpoint: any) => {
    setState({ isLoading: true, response: null, error: null });

    try {
      const response = await fetch(`/record/search/991`);
      const data = await response.json();
      setState({ isLoading: false, response: data, error: null });
    } catch (error) {
      console.error("API request failed:", error);
      
    }
  };

  const handleRequest = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, endpoint: string) => {
    event.preventDefault();
    callApi(endpoint);
  };

  const { isLoading, response, error } = state;

  return (
    <>
      <div className="mb-5" data-testid="record-page">
        <h1 data-testid="record-title">Health Record API</h1>
        <p className="lead">Access the Health Record API endpoints by clicking the buttons below:</p>
        
        <Button color="primary" className="mt-3" onClick={(e) => handleRequest(e, 'create')}>
          Create Record
        </Button>
        <Button color="primary" className="mt-3" onClick={(e) => handleRequest(e, 'search?id=991')}>
          Search Record by ID
        </Button>

        <div className="result-block-container">
          {isLoading && <Loading />}
          {(error || response) && (
            <div className="result-block" data-testid="record-result">
              <h6 className="muted">Result</h6>
              {error && <ErrorMessage>{error}</ErrorMessage>}
              {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default withPageAuthRequired(RecordPage, {
  onRedirecting: () => <Loading />,
  onError: error => <ErrorMessage>{error.message}</ErrorMessage>,
});
