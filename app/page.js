import Image from "next/image";
import { Box, Container, AppBar, Toolbar, Typography,Button, Grid } from "@mui/material";
import Head from "next/head";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Home() {
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
          <Typography variant="h6" style={{flexGrow: 1}}>LOGO FlashNotes</Typography>
          <SignedOut>
            <Button color='inherit'>Login</Button>
            <Button color='inherit'>Sign up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton/>
          </SignedIn>
        </Toolbar>
      </AppBar>



      {
      //Holds all none bar stuff if you dont know container type has auto margins
      }
      <Container> 

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
          <Button variant="contained" sx={{mt: 2}}>Get Started</Button>
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
               height: '100%' // Ensure all boxes grow to the same height
            }}>
                <Typography variant="h6">Easy text input</Typography>
                <Typography>
                  {' '}
                  Simply input your text and let us do the rest. Creating cards in a Flash.
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
               height: '100%' // Ensure all boxes grow to the same height
            }}>
                <Typography variant="h6">Portable and Acessible</Typography>
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
               height: '100%' // Ensure all boxes grow to the same height
            }}>
                <Typography variant="h6">Share with friends</Typography>
                <Typography>
                  {' '}
                  Easily share your Study decks with Peers.
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
                    Get access to these feature with a free account for no cost
                  </Typography>
                  <Box ml={5} p={1}>
                    <Typography my={1}>
                      {' '}
                      feature 1 yes
                    </Typography>
                    <Typography my={1}>
                      {' '}
                      feature 2 no
                    </Typography>
                    <Typography my={1}>
                      {' '}
                      feature 3 no
                    </Typography>
                  </Box>
                  
                  <Button variant="contained" sx={{ width: '70%', alignSelf: 'center', mt: 1}}>Start Free</Button>
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
                  height: '100%' // Ensure all boxes grow to the same height
                }}>
                  <Typography variant="h6" my={1}>Basic</Typography>
                  <Typography  my={1}>
                    {' '}
                    Get access to these feature with a Basic account for $1
                  </Typography>
                  <Box ml={5} p={1}>
                    <Typography my={1}>
                      {' '}
                      feature 1 yes
                    </Typography>
                    <Typography my={1}>
                      {' '}
                      feature 2 yes
                    </Typography>
                    <Typography my={1}>
                      {' '}
                      feature 3 no
                    </Typography>
                  </Box>
                  
                  <Button variant="contained" sx={{ width: '70%', alignSelf: 'center', mt: 1}}>Unlock Basic</Button>
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
                    Get access to these feature with a Pro account for $3
                  </Typography>
                  <Box ml={5} p={1}>
                    <Typography my={1}>
                      {' '}
                      feature 1 yes
                    </Typography>
                    <Typography my={1}>
                      {' '}
                      feature 2 yes
                    </Typography>
                    <Typography my={1}>
                      {' '}
                      feature 3 yes
                    </Typography>
                  </Box>

                  <Button variant="contained" sx={{ width: '70%', alignSelf: 'center', mt: 1}}>Upgrade to Pro</Button>
                </Box>
              </Grid>

          </Grid>
        </Box>



      </Container>
    </Box>

  );
}
