import Image from "next/image";
import { Box, Container, AppBar, Toolbar, Typography,Button } from "@mui/material";
import Head from "next/head";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <Container maxWidth="lg">
      <Head>
        <title>Flashcard SaaS</title>
        <meta name= "description" content="Create flashcards from your notes" />
      </Head>

      <AppBar position = 'static'>
        <Toolbar>
          <Typography variant="h6">Flashcard SaaS</Typography>
          <SignedOut>
            <Button>Login</Button>
            <Button>Sign up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton/>
          </SignedIn>
        </Toolbar>
      </AppBar>
    </Container>
  );
}
