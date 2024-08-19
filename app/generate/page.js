'use client'

import { Box, Button, CardActionArea, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Paper, TextField, Typography, Card, Container, AppBar, Toolbar } from "@mui/material"
import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { db } from "@/firebase"
import { doc, collection, getDoc, setDoc} from "firebase/firestore"
import { writeBatch } from "firebase/firestore"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"


export default function Generate(){
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState([])
    const [text, setText] = useState('')
    const [name, setName] = useState('')
    const [open, setOpen] = useState(false)
    const router = useRouter()


    const handleSubmit=async ()=>{

        fetch('api/generate', {
            method: 'POST',
            body: text,
        })
            .then((res)=> res.json())
            .then((data) => setFlashcards(data))
    }

    const handleLogoClick = () => {
        router.push('/');
      };
      
    const handleCardClick=(id) =>{
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],  
        }))
    }

    const handleOpen =() => {
        setOpen(true)
    }

    const handleClose =() => {
        setOpen(false)
    }

    const saveFlashcards = async () => {
        if (!name) {
            alert('Please enter a name');
            return;
        }
    
        const batch = writeBatch(db);
        const userDocRef = doc(collection(db, 'users'), user.id);
        const docSnap = await getDoc(userDocRef);
    
        let collections = [];
    
        if (docSnap.exists()) {
            collections = docSnap.data().flashcards || [];
            if (collections.find((f) => f.name === name)) {
                alert("Flashcard collection with the same name already exists.");
                return;
            }
        }
    
        // Add the new collection name
        collections.push({ name });
    
        // Save the updated flashcards collection without functions
        batch.set(userDocRef, { flashcards: collections }, { merge: true });
    
        const colRef = collection(userDocRef, name);
    
        // Save each flashcard separately
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(colRef);
            batch.set(cardDocRef, { ...flashcard }); // Ensure flashcard data is plain and does not include functions
        });
    
        await batch.commit();
        handleClose();
        router.push('/flashcards');
    };

    return(
        <Box>
            <AppBar position='static'>
                <Toolbar>
                    <Typography variant="h6" style={{flexGrow: 1, cursor: 'pointer'}} onClick={handleLogoClick}>LOGO FlashNotes</Typography>
                    <SignedOut>
                        <Button color='inherit' href="/sign-in">Login</Button>
                        <Button color='inherit' href="/sign-up">Sign up</Button>
                    </SignedOut>
                    <SignedIn>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Button color="inherit" href="/flashcards" sx={{mr: 5}}>
                                View my Sets
                            </Button>
                            <UserButton sx={{ ml: 2 }} />
                        </Box>
                    </SignedIn>
                </Toolbar>
            </AppBar>
            <Box sx={{
                mt:4, mb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center'
            }}>
                <Typography variant='h4'> Generate Flashcards</Typography>
                <Paper sx={{p: 4, width: '80%'}}>
                        <TextField value = {text}
                        onChange={(e) => setText(e.target.value)} label='Enter text'
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        sx={{
                            mb: 2
                        }}/>
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            fullWidth
                            sx={{
                                backgroundColor: '#606C38', //light green
                                '&:hover': {
                                backgroundColor: '#283618', // Darker shade for hover state
                                },
                            }}
                            >
                            Submit
                        </Button>
                </Paper>
            </Box>
            
            {flashcards.length > 0 && (
                <Box sx={{mt:4}}>
                    <Container>
                        <Typography variant="h5" sx={{mb: 2}}>Flashcards Preview</Typography>
                        <Grid container spacing={3}>
                            {flashcards.map((flashcard, index) => (
                                <Grid items xs = {12} sm = {6} md= {4} key = {index} p={2}><Card>
                                    <CardActionArea onClick={()=>{
                                        handleCardClick(index)
                                    }}>
                                        <CardContent>
                                        <Box sx={{
                                            perspective: '1000px',
                                            '& > div': {
                                                transition: 'transform 0.6s',
                                                transformStyle: 'preserve-3d',
                                                position: 'relative',
                                                width: '100%',
                                                height: '200px',
                                                boxShadow: '0 4px 8px 0 rgba(0,0,0, 0.2)',
                                                transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                            },
                                            '& > div > div': {
                                                position: 'absolute',
                                                width: '100%',
                                                height: '100%',
                                                backfaceVisibility: 'hidden',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                padding: 2,
                                                boxSizing: 'border-box',
                                            },
                                            '& > div > div:nth-of-type(1)': {
                                                backgroundColor: 'tan',  // Front side color
                                                color: 'white',  // Optional text color for the front side
                                            },
                                            '& > div > div:nth-of-type(2)': {
                                                backgroundColor: 'white',  // Back side color
                                                color: 'black',  // Optional text color for the back side
                                                transform: 'rotateY(180deg)',
                                            },
                                        }}>
                                            <div>
                                                <div>
                                                    <Typography variant="h5" component="div">
                                                        {flashcard.front}
                                                    </Typography>
                                                </div>
                                                <div>
                                                    <Typography variant="h5" component="div">
                                                        {flashcard.back}
                                                    </Typography>
                                                </div>
                                            </div>
                                        </Box>

                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>


                
                <Box sx={{mt:4, display: 'flex', justifyContent: 'center'}}>
                    <Button
                        variant="contained"
                        onClick={handleOpen}
                        sx={{
                            backgroundColor: '#606C38', // Custom color (red)
                            '&:hover': {
                            backgroundColor: '#283618', // Darker shade for hover state
                            },
                            mb: 4
                        }}
                    >
                        Save
                    </Button>
                </Box>
            </Box>
            )}


            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Save Flashcards</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter a name for this flashcard collection
                    </DialogContentText>
                    <TextField
                    autoFocus
                    margin='dense'
                    label="collection Name"
                    type='text'
                    fullWidth
                    value = {name}
                    onChange={(e)=> setName(e.target.value)}
                    variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={saveFlashcards}>Save</Button>
                </DialogActions>
            </Dialog>







        </Box>
    )
}