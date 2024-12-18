'use client';


import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import ProofVerification from '@/components/ProofVerification'
import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';

function Page() {
  return (
    <>
     <ProofVerification/>
    </>
  );
}

export default withPageAuthRequired(Page, {
  onRedirecting: () => <Loading />,
  onError: error => <ErrorMessage>{error.message}</ErrorMessage>,
});
