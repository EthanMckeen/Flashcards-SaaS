'use client'
import Image from "next/image";
import { Box, Container, AppBar, Toolbar, Typography,Button, Grid } from "@mui/material";
import Head from "next/head";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import getStripe from "@/utils/get-stripe";
import { useRouter } from "next/navigation";

export default function Home() {
  
  const router = useRouter();
  const {isSignedIn} = useUser()

  const handleLogoClick = () => {
    router.push('/');
  };

  const handleSubmit = async () =>{
    const checkoutSession = await fetch('/api/checkout_session', {
      method: 'POST',
      headers: {
        origin: 'https://localhost:3000'
      }
    })

    const checkoutSessionJson = await checkoutSession.json()

    if (checkoutSession.statusCode === 500){
      console.error(checkoutSession.message)
      return
    }

    const stripe = await getStripe()
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })

    if(error){
      console.warn(error.message)
    }
      
  }


  const handleGetStarted =() =>{
    if(isSignedIn){
      router.push("/generate");
    } else {
      router.push("/sign-in");
    }
     
  }





  return (
    <Box height= '100vh' bgcolor='#EFEFEF'>
      <Head>
        <title>Flashcard SaaS</title>
        <meta name= "description" content="Create flashcards from your notes" />
      </Head>

    {
      //TOP BAR
    }
      <AppBar position = 'static'>
        <Toolbar>
          <Typography variant="h6" style={{flexGrow: 1, cursor: 'pointer'}} onClick={handleLogoClick}>LOGO FlashNotes</Typography>
          <SignedOut>
            <Button  href="/sign-in" sx={{mx:2, color: '#fff', '&:hover': { bgcolor: '#fff', color: '#4e5340'}}}>Login</Button>
            <Button chref="/sign-up" sx={{mx:2, color: '#fff', '&:hover': { bgcolor: '#fff', color: '#4e5340'}}}>Sign up</Button>
          </SignedOut>
          <SignedIn>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button color="inherit" href="/generate" sx={{mr: 5}}>
                  Create New Sets
                </Button>
                <Button color="inherit" href="/flashcards" sx={{mr: 5}}>
                  view my sets
                </Button>
                <UserButton sx={{ ml: 2 }} />
            </Box>
          </SignedIn>
        </Toolbar>
      </AppBar>



      {
      //Holds all none bar stuff if you dont know container type has auto margins
      }
      <Container maxWidth={false} sx={{ pb: 8, bgcolor: "#EFEFEF" }}> 

        {
        //TITLE CARD
        }
        <Box  
          sx={{
            textAlign: 'center',
            my: 4,
          }} 
        >
          
          <Typography variant="h2">Welcome to FlashNotes</Typography>
          <Typography variant="h5">Get to studying in a Flash!!!</Typography>
          <Button variant="contained" sx={{mt: 2, bgcolor: '#606c38', '&:hover':{bgcolor: '#283618' }}} onClick={handleGetStarted}>
            Get Started
          </Button>
        </Box>
        
        {
        //Features and Feature's children
        }
        <Box sx={{my: 6, mb: 2}}> 
          <Typography variant="h4" component="h2" mb={2}>
            Features
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
            <Box sx={{
               p: 3,
               boxShadow: 1,
               bgcolor: '#FFFFFF',
               border: '1px solid',
               borderColor: '#BABABA',
               borderRadius: '13px',
               display: 'flex',
               flexDirection: 'column',
               height: '100%', // Ensure all boxes grow to the same height
               transition: 'transform 0.3s ease-in-out', // Smooth transition for scaling
              '&:hover': {
                transform: 'scale(1.05)' // Slightly enlarge the box on hover
              }
            }}>
                <Typography variant="h6">Easy Text Input</Typography>
                <Typography>
                  {' '}
                  Simply input your text and let us do the rest, creating cards in a Flash.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
            <Box sx={{
               p: 3,
               boxShadow: 1,
               bgcolor: '#FFFFFF',
               border: '1px solid',
               borderColor: '#BABABA',
               borderRadius: '13px',
               display: 'flex',
               flexDirection: 'column',
               height: '100%', // Ensure all boxes grow to the same height
               transition: 'transform 0.3s ease-in-out', // Smooth transition for scaling
              '&:hover': {
                transform: 'scale(1.05)' // Slightly enlarge the box on hover
              }
            }}>
                <Typography variant="h6">Portable and Accessible</Typography>
                <Typography>
                  {' '}
                  Access anywhere on any device and study on the go.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
            <Box sx={{
               p: 3,
               boxShadow: 1,
               bgcolor: '#FFFFFF',
               border: '1px solid',
               borderColor: '#BABABA',
               borderRadius: '13px',
               display: 'flex',
               flexDirection: 'column',
               height: '100%', // Ensure all boxes grow to the same height
               transition: 'transform 0.3s ease-in-out', // Smooth transition for scaling
              '&:hover': {
                transform: 'scale(1.05)' // Slightly enlarge the box on hover
              }
            }}>
                <Typography variant="h6">Share With Friends</Typography>
                <Typography>
                  {' '}
                  Easily share your study decks with peers.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {
        //Pricing and Pricing's children
        }
        <Box sx={{my: 6, mb: 2}}>
          <Typography variant="h4" component="h2" mb={2}>Pricing</Typography>
          <Grid container spacing={4}>

            {
              //FREE TIER
            }
            <Grid item xs={12} md={4}>
              <Box sx={{
                  p: 3,
                  boxShadow: 1,
                  bgcolor: '#FFFFFF',
                  border: '1px solid',
                  borderColor: '#BABABA',
                  borderRadius: '13px',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%' // Ensure all boxes grow to the same height
                }}>
                  <Typography variant="h6" my={1}>Free</Typography>
                  <Typography  my={1}>
                    {' '}
                    Get access to these features 
                    {' '}
                    <span style={{ fontWeight: 'bold' }}> FREE</span> of charge!
                  </Typography>
                  <Box ml={5} p={1}>
                    <Typography my={1}>
                      {' '}
                      - Generate flashcards to help you study
                    </Typography>
                    <Typography my={1} sx={{ textDecoration: 'line-through' }}>
                      {' '}
                      - Test your knowledge with quizzes
                    </Typography>
                    <Typography my={1} sx={{ textDecoration: 'line-through' }}>
                      {' '}
                      - Share your flashcard sets with friends
                    </Typography>
                  </Box>
                  
                  <Button variant="contained" sx={{ width: '70%', alignSelf: 'center', mt: 1, bgcolor: '#606c38', '&:hover':{bgcolor: '#283618' }}} onClick={handleGetStarted}>Start Free</Button>
                </Box>
              </Grid>

            {
              //BASIC TIER
            }
            <Grid item xs={12} md={4}>
              <Box sx={{
                  p: 3,
                  boxShadow: 1,
                  bgcolor: '#FFFFFF',
                  border: '1px solid',
                  borderColor: '#BABABA',
                  borderRadius: '13px',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%', // Ensure all boxes grow to the same height
                }}>
                  <Typography variant="h6" my={1}>Basic</Typography>
                  <Typography  my={1}>
                    {' '}
                    Get access to these features with a Basic account for
                    {' '}
                    <span style={{ fontWeight: 'bold' }}>$1</span>!
                  </Typography>
                  <Box ml={5} p={1}>
                    <Typography my={1}>
                      {' '}
                      - Generate flashcards to help you study
                    </Typography>
                    <Typography my={1}>
                      {' '}
                      - Test your knowledge with quizzes
                    </Typography>
                    <Typography my={1} sx={{ textDecoration: 'line-through' }}>
                      {' '}
                      - Share your flashcard sets with friends
                    </Typography>
                  </Box>
                  
                  <Button variant="contained" sx={{ width: '70%', alignSelf: 'center', mt: 1, bgcolor: '#283618', '&:hover':{bgcolor: '#132a13' }}} onClick={handleSubmit}>Unlock Basic</Button>
                </Box>
              </Grid>

            {
              //PRO TIER
            }
            <Grid item xs={12} md={4}>
              <Box sx={{
                  p: 3,
                  boxShadow: 1,
                  bgcolor: '#FFFFFF',
                  border: '1px solid',
                  borderColor: '#BABABA',
                  borderRadius: '13px',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%' // Ensure all boxes grow to the same height
                }}>
                  <Typography variant="h6" my={1}>Pro</Typography>
                  <Typography  my={1}>
                    {' '}
                    Get access to these features with a Pro account for
                    {' '}
                    <span style={{ fontWeight: 'bold' }}>$3</span>!
                  </Typography>
                  <Box ml={5} p={1}>
                  <Typography my={1}>
                      {' '}
                      - Generate flashcards to help you study
                    </Typography>
                    <Typography my={1}>
                      {' '}
                      - Test your knowledge with quizzes
                    </Typography>
                    <Typography my={1}>
                      {' '}
                      - Share your flashcard sets with friends
                    </Typography>
                  </Box>

                  <Button variant="contained" sx={{ width: '70%', alignSelf: 'center', mt: 1, bgcolor: '#283618', '&:hover':{bgcolor: '#132a13' }}} onClick={handleSubmit}>Upgrade to Pro</Button>
                </Box>
              </Grid>

          </Grid>
        </Box>
      </Container>
    </Box>

  );
}
