'use client'
import { useUser } from "@clerk/nextjs"
import { use, useEffect, useState,  } from "react"

import { collection, doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/firebase"
import { useRouter } from "next/navigation"
import { CardActionArea, Card, Grid, Box, CardContent, Typography, Container, AppBar, Toolbar, Button } from "@mui/material"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Flashcard(){
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const router = useRouter()
    

    const handleLogoClick = () => {
        router.push('/');
      };

    useEffect(()=>{
        async function getFlashcards(){
            if(!user) return
            const docRef = doc(collection(db, 'users'), user.id)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()){
                const collections = docSnap.data().flashcards || []
                setFlashcards(collections)
            }
            else{
                await setDoc(docRef, {flashcards: []})
            }
        }
        getFlashcards()
    }, [user])   

    if (!isLoaded || !isSignedIn){
        return <></>
    }

    const handleCardClick = (id) =>{
        router.push(`/flashcard?id=${id}`)
    }

    return(
        <Box>
            <AppBar position = 'static'>
                <Toolbar>
                    <Typography variant="h6" style={{flexGrow: 1, cursor: 'pointer'}} onClick={handleLogoClick}>LOGO FlashNotes</Typography>
                    <SignedOut>
                        <Button color='inherit' href="/sign-in">Login</Button>
                        <Button color='inherit'href="/sign-up">Sign up</Button>
                    </SignedOut>
                    <SignedIn>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Button color="inherit" href="/generate" sx={{ mr: 5 }}>
                                Create New Sets
                            </Button>
                            <UserButton sx={{ ml: 2 }} />
                        </Box>
                    </SignedIn>
                </Toolbar>
            </AppBar>
            <Container maxwidth = "100vw">
            {flashcards.length === 0 ? (
                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                        sx={{ textAlign: 'center', mt: 4 }}
                    >
                        <Typography variant="h5">Looks like you don't have any sets.</Typography>
                        <Button variant="contained" sx={{ mt: 2 }} href="/generate">
                            Click here to make your first set
                        </Button>
                    </Box>
                ) : (
                    <Grid container spacing={3} sx={{ mt: 4 }}>
                        {flashcards.map((flashcard, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card>
                                    <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                                        <CardContent>
                                            <Typography variant="h6">{flashcard.name}</Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </Box>
    )
}