'use client';


import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import VideoUpload from '@/components/VideoUpload'
import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';

function Page() {
  return (
    <>
     <VideoUpload/>
    </>
  );
}

export default withPageAuthRequired(Page, {
  onRedirecting: () => <Loading />,
  onError: error => <ErrorMessage>{error.message}</ErrorMessage>,
});
