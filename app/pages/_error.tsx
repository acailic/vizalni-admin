import { Box, Container, Typography } from '@mui/material';
import { NextPageContext } from 'next';
import NextErrorComponent from 'next/error';
import React from 'react';

const ErrorPage = ({ statusCode, hasGetInitialProps, err }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #0C4076 0%, #C6363C 100%)',
      }}
    >
      <Container maxWidth="md">
        <Box textAlign="center" color="white">
          <Typography variant="h1" sx={{ fontSize: { xs: '5rem', md: '8rem' }, fontWeight: 900 }}>
            {statusCode || 500}
          </Typography>
          <Typography variant="h4" sx={{ mb: 2 }}>
            {statusCode
              ? `An error ${statusCode} occurred on server`
              : 'An error occurred on client'}
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
            We're sorry, something went wrong. Please try refreshing the page or go back to the homepage.
          </Typography>
          <Box
            component="a"
            href="/"
            sx={{
              backgroundColor: 'white',
              color: '#0C4076',
              fontWeight: 600,
              px: 3,
              py: 1,
              borderRadius: 1,
              textDecoration: 'none',
              display: 'inline-block',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: '#f5f5f5',
                transform: 'translateY(-2px)',
              },
            }}
          >
            Go to Homepage
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

ErrorPage.getInitialProps = async (context: NextPageContext) => {
  const errorInitialProps = await NextErrorComponent.getInitialProps(context);

  // Workaround for https://github.com/vercel/next.js/issues/8592, mark when
  // getInitialProps has run
  const hasGetInitialPropsRun = !!context.res;

  // Returning early because we don't want to log the error to Sentry in development
  if (process.env.NODE_ENV !== 'production') {
    return errorInitialProps;
  }

  // Workaround for https://github.com/vercel/next.js/issues/15542
  // Next.js doesn't pass err to _error page when error is thrown during data fetching
  const { err } = context as any;
  const errorEventId = 'error-id'; // Would normally send to Sentry

  return {
    ...errorInitialProps,
    hasGetInitialProps: hasGetInitialPropsRun,
    err,
    errorEventId,
  };
};

export default ErrorPage;