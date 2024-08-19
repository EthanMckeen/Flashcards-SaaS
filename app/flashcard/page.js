'use client'
import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { collection, doc, getDoc, getDocs, deleteDoc, writeBatch } from "firebase/firestore"
import { db } from "@/firebase"
import { useSearchParams } from "next/navigation"
import { CardActionArea, Card, Grid, Box, CardContent, Typography, Container, AppBar, Toolbar, Button, Dialog, DialogActions, DialogTitle, DialogContent, TextField } from "@mui/material"
import { useRouter } from "next/navigation"


export default function Flashcard(){
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState([])
    const [openDialog, setOpenDialog] = useState(false)
    const [deleteConfirmation, setDeleteConfirmation] = useState('')
    const [setToDelete, setSetToDelete] = useState('')
    




    const searchParams = useSearchParams()
    const search = searchParams.get('id')
    const router = useRouter()


    const handleLogoClick = () => {
        router.push('/');
      };

    useEffect(() => {
        async function getFlashcard() {
            if (!search || !user) return
            const colRef = collection(doc(collection(db, 'users'), user.id), search)
            const docs = await getDocs(colRef)
            const flashcards = []

            docs.forEach((doc) => {
                flashcards.push({ id: doc.id, ...doc.data() })
            })
            setFlashcards(flashcards)
        }
        getFlashcard()
    }, [user, search])   

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],  
        }))
    }

    const openDeleteDialog = (setName) => {
        setSetToDelete(setName)
        setOpenDialog(true)
    }

    const handleDialogClose = () => {
        setOpenDialog(false)
        setDeleteConfirmation('')
    }

    const handleEditClick = (id) =>{
        router.push(`/editflashcard?id=${id}`)
    }

    const handlePracticeClick = (id) => {
        router.push(`/practice?id=${id}`)
    }

    const handleQuizClick = (id) => {
        router.push(`/quiz?id=${id}`)
    }

    const handleLeaveClick = () => {
        router.push(`/flashcards`)
    }

    const handleDelete = async () => {
        if (deleteConfirmation !== setToDelete) {
            alert('Set name does not match.')
            return
        }

        try {
            const batch = writeBatch(db)
            const userDocRef = doc(collection(db, 'users'), user.id)
            const colRef = collection(userDocRef, setToDelete)

            // Delete all documents in the collection
            const docs = await getDocs(colRef)
            docs.forEach((doc) => {
                batch.delete(doc.ref)
            })

            // Remove the collection reference from the user's document
            const docSnap = await getDoc(userDocRef)
            if (docSnap.exists()) {
                const collections = docSnap.data().flashcards || []
                const updatedCollections = collections.filter((c) => c.name !== setToDelete)
                batch.set(userDocRef, { flashcards: updatedCollections }, { merge: true })
            }

            await batch.commit()
            alert('Collection deleted successfully')
            setOpenDialog(false)
            router.push('/flashcards')
        } catch (error) {
            console.error('Error deleting collection:', error)
            alert('Failed to delete collection')
        }
    }

    if (!isLoaded || !isSignedIn) {
        return <></>
    }

    return (
        <Box width='100vw'>
            <AppBar position='static'>
                <Toolbar>
                    <Typography variant="h6" style={{flexGrow: 1, cursor: 'pointer'}} onClick={handleLogoClick}>LOGO FlashNotes</Typography>
                    <SignedOut>
                        <Button color='inherit' href="/sign-in">Login</Button>
                        <Button color='inherit' href="/sign-up">Sign up</Button>
                    </SignedOut>
                    <SignedIn>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Button color="inherit" href="/generate" sx={{mr: 5}}>
                                Create New Sets
                            </Button>
                            <UserButton sx={{ ml: 2 }} />
                        </Box>
                    </SignedIn>
                </Toolbar>
            </AppBar>
            <Button onClick={handleLeaveClick} variant="contained" sx={{ m:5, p:2, bgcolor: '#98473e', '&:hover': { bgcolor: '#FF1900' } }}>
                 Leave
            </Button>
            <Container maxWidth="100vw">
                <Box
                    width="100vw" 
                    display="flex" 
                    flexDirection="column" 
                    justifyContent="center" 
                    alignItems="center" 
                    sx={{ textAlign: 'center', mt: 4}}
                >
                    
                    <Typography variant="h2">Your Set: {search}</Typography>
                    <Typography variant="h5">What would you like to do?</Typography>
                    <Box display='flex' flexDirection='row'>
                        <Button variant="contained" sx={{mt: 2, mx: 2, flex: 1, bgcolor: '#BF8F2E', '&:hover':{bgcolor: '#E69900'}}} onClick={() => handleEditClick(search)}>Edit</Button>
                        <Button variant="contained" sx={{mt: 2, mx: 2, flex: 1, bgcolor: '#664B89', '&:hover':{bgcolor: '#DE8EF1'}}} onClick={() => handlePracticeClick(search)}>Practice</Button>
                        <Button variant="contained" sx={{mt: 2, mx: 2, flex: 1, bgcolor: '#000293', '&:hover':{bgcolor: '#0278FF'}}} onClick={() => handleQuizClick(search)}>Quiz</Button>
                        <Button variant="contained" sx={{mt: 2, mx: 2, flex: 1, bgcolor: '#98473e', '&:hover':{bgcolor: '#FF1900'}}} onClick={() => openDeleteDialog(search)}>Delete</Button>
                    </Box>
                </Box>

                <Grid container spacing={3} sx={{mt: 4}}>
                    {flashcards.map((flashcard, index) => (
                        <Grid items xs={12} sm={6} md={4} key={index} p={2}>
                            <Card>
                                <CardActionArea onClick={() => handleCardClick(index)}>
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
                                                transform: flipped[index]
                                                    ? 'rotateY(180deg)'
                                                    : 'rotateY(0deg)',
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
                <Dialog open={openDialog} onClose={handleDialogClose}>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        <Typography variant="body1">Type the name of the set to confirm deletion:</Typography>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="confirmation"
                            label="Set Name"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={deleteConfirmation}
                            onChange={(e) => setDeleteConfirmation(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose}>Cancel</Button>
                        <Button onClick={handleDelete}>Delete</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    )
}

