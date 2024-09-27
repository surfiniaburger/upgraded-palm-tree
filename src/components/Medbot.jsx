'use client'

import React, { useEffect } from 'react';

const Chatbot = () => {
  useEffect(() => {
    // Load the Dialogflow Messenger script dynamically
    const script = document.createElement('script');
    script.src = 'https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/df-messenger.js';
    script.async = true;
    document.body.appendChild(script);

    // Clean up the script when component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/themes/df-messenger-default.css"
      />
      <df-messenger
        oauth-client-id="837262597425-pdt8j869f2dqlrkldflie8ip5lsj5s98.apps.googleusercontent.com"
        location="us-central1"
        project-id="gem-creation"
        agent-id="4f0888c1-2705-4fe1-9534-35da3e2b00b8"
        language-code="en"
        max-query-length="-1"
      >
        <df-messenger-chat-bubble chat-title="medZK Agent"></df-messenger-chat-bubble>
      </df-messenger>
      <style>
        {`
          df-messenger {
            z-index: 999;
            position: fixed;
            bottom: 16px;
            right: 16px;
          }
        `}
      </style>
    </>
  );
};

export default Chatbot;
