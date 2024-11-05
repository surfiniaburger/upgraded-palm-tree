'use client';


import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';
import DiabetesDashboard from "@/components/dashboard";

function Page() {
  return (
    <>
     <DiabetesDashboard/>
    </>
  );
}

export default withPageAuthRequired(Page, {
  onRedirecting: () => <Loading />,
  onError: error => <ErrorMessage>{error.message}</ErrorMessage>,
});
