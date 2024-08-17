'use client'
import React, { useState, useEffect } from 'react';
import { useUser } from "@clerk/nextjs";
import { Box, Button, Card, CardContent, Typography, IconButton, TextField, Dialog, DialogActions, DialogContent, DialogTitle, AppBar, Toolbar, } from '@mui/material';
import { ArrowBack, ArrowForward, Edit, Delete, Add } from '@mui/icons-material';
import { useSearchParams } from 'next/navigation';
import { collection, doc, getDocs, deleteDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { SignedOut, SignedIn, UserButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

const EditPage = () => {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(''); // 'edit', 'remove', 'add'
  const [newCard, setNewCard] = useState({ front: '', back: '' });
  const { isLoaded, isSignedIn, user } = useUser();
  const searchParams = useSearchParams();
  const search = searchParams.get('id');
  const router = useRouter();
  const handleLogoClick = () => {
    router.push('/');
  };

  useEffect(() => {
    async function getFlashcards() {
      if (!search || !user) return;

      const colRef = collection(doc(collection(db, 'users'), user.id), search);
      const docs = await getDocs(colRef);
      const fetchedCards = docs.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setCards(fetchedCards);
      if (fetchedCards.length > 0) {
        setCurrentIndex(0); // Set initial index to 0 if there are cards
      }
    }
    getFlashcards();
  }, [user, search]);

  const handleNext = () => {
    if (cards.length > 0 && currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (cards.length > 0 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleEdit = () => {
    if (cards.length > 0) {
      setDialogType('edit');
      setNewCard(cards[currentIndex]);
      setDialogOpen(true);
    }
  };

  const handleRemove = () => {
    if (cards.length > 0) {
      setDialogType('remove');
      setDialogOpen(true);
    }
  };

  const handleAdd = () => {
    setDialogType('add');
    setNewCard({ front: '', back: '' });
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleLeaveClick = () => {
    router.push(`/flashcard?id=${search}`)
  };


  const handleDialogSubmit = async () => {
    try {
        if (dialogType === 'edit' && cards.length > 0) {
            if (!newCard.id) {
                console.error("No card ID found for editing");
                return;
            }
            const updatedCards = [...cards];
            updatedCards[currentIndex] = newCard;
            setCards(updatedCards);

            // Update card in Firestore
            await setDoc(doc(db, 'users', user.id, search, newCard.id), newCard);
        } else if (dialogType === 'remove' && cards.length > 0) {
            const cardToRemove = cards[currentIndex];
            if (!cardToRemove || !cardToRemove.id) {
                console.error("No card ID found for removal");
                return;
            }
            const updatedCards = cards.filter((_, index) => index !== currentIndex);
            setCards(updatedCards);

            // Remove card from Firestore
            await deleteDoc(doc(db, 'users', user.id, search, cardToRemove.id));
            setCurrentIndex(0);
        } else if (dialogType === 'add') {
            const cardId = new Date().getTime().toString(); // Generate a unique ID
            const addedCard = { ...newCard, id: cardId };
            setCards([...cards, addedCard]);

            // Add card to Firestore
            await setDoc(doc(db, 'users', user.id, search, cardId), addedCard);
        }
        handleDialogClose();
    } catch (error) {
        console.error("Error handling dialog submit:", error);
    }
};

  return (
    <Box>
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
      <Button sx={{mt: 2, mx: 5, bgcolor: '#98473e', '&:hover':{bgcolor: '#FF1900'}}} onClick={() => handleLeaveClick()} variant="contained">
          Leave
        </Button>
        <Box sx={{ 
            p: 10,
            mt: 5,       
            justifyContent: 'center', // Center horizontally
            alignItems: 'center',   }}>
        {/* Display current card */}
        {cards.length > 0 && (
            <Card>
            <CardContent>
                <Typography variant="h5">{cards[currentIndex]?.front}</Typography>
                <Typography variant="body1">{cards[currentIndex]?.back}</Typography>
            </CardContent>
            </Card>
        )}

        {/* Navigation buttons */}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <IconButton onClick={handlePrev} disabled={currentIndex === 0 || cards.length === 0}>
            <ArrowBack />
            </IconButton>
            <IconButton onClick={handleNext} disabled={currentIndex === cards.length - 1 || cards.length === 0}>
            <ArrowForward />
            </IconButton>
        </Box>

        {/* Action buttons */}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="outlined" startIcon={<Edit />} onClick={handleEdit} disabled={cards.length === 0} sx={{color:'orange', borderColor:'orange'}}>Edit Card</Button>
            <Button variant="outlined" startIcon={<Delete />} onClick={handleRemove} disabled={cards.length === 0} sx={{color:'red', borderColor:'red'}}>Remove Card</Button>
            <Button variant="contained" startIcon={<Add />} onClick={handleAdd} sx={{bgcolor:'green'}}>Add Card</Button>
        </Box>

        {/* Dialog for adding/editing/removing a card */}
        <Dialog open={dialogOpen} onClose={handleDialogClose}>
            <DialogTitle>{dialogType === 'add' ? 'Add New Card' : dialogType === 'edit' ? 'Edit Card' : 'Remove Card'}</DialogTitle>
            <DialogContent>
            {(dialogType === 'add' || dialogType === 'edit') && (
                <>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Front"
                    fullWidth
                    variant="outlined"
                    value={newCard.front}
                    onChange={(e) => setNewCard({ ...newCard, front: e.target.value })}
                />
                <TextField
                    margin="dense"
                    label="Back"
                    fullWidth
                    variant="outlined"
                    value={newCard.back}
                    onChange={(e) => setNewCard({ ...newCard, back: e.target.value })}
                />
                </>
            )}
            {dialogType === 'remove' && (
                <Typography>Are you sure you want to remove this card?</Typography>
            )}
            </DialogContent>
            <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button onClick={handleDialogSubmit}>{dialogType === 'remove' ? 'Remove' : 'Submit'}</Button>
            </DialogActions>
        </Dialog>
        </Box>
    </Box>
  );
};

export default EditPage;

