'use client';


import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import Vision from '@/components/Vision'
import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';

function Page() {
  return (
    <>
     <Vision/>
    </>
  );
}

export default withPageAuthRequired(Page, {
  onRedirecting: () => <Loading />,
  onError: error => <ErrorMessage>{error.message}</ErrorMessage>,
});
