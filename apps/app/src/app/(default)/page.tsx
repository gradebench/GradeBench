"use client";

import { AuthLoading, SignedIn, useAuthenticate } from "@gb/auth/index";
import { H1, P } from "@gb/design-system/components/ui/typography";

const HomePage = () => {
  const { user, data } = useAuthenticate({
    enabled: true,
    authView: "SIGN_IN",
  });
  return (
    <>
      <AuthLoading>
        <H1>Loading...</H1>
      </AuthLoading>
      <SignedIn>
        <H1>Welcome to GradeBench!</H1>
        <P>{JSON.stringify(user)}</P>
        <P>{JSON.stringify(data)}</P>
      </SignedIn>
    </>
  );
};

export default HomePage;
