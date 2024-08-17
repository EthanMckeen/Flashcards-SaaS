'use client'
import React, { useState, useEffect } from 'react';
import { useUser } from "@clerk/nextjs";
import { Box, Card, CardContent, Typography, IconButton, AppBar, Toolbar, Button } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { useSearchParams } from 'next/navigation';
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { SignedOut, SignedIn, UserButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

const PracticePage = () => {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const { user } = useUser();
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
        setCurrentIndex(0);
      }
    }
    getFlashcards();
  }, [user, search]);

  const handlePrev = () => {
    setShowBack(false); // Flip the card back to front
    // Wait for 0.6 seconds before changing the card index to match animation duration
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? cards.length - 1 : prevIndex - 1
      );
    }, 600);
  };

  const handleNext = () => {
    setShowBack(false); // Flip the card back to front
    // Wait for 0.6 seconds before changing the card index to match animation duration
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === cards.length - 1 ? 0 : prevIndex + 1
      );
    }, 600);
  };


  const handleCardClick = () => {
    setShowBack(!showBack); // Toggle between front and back of the card
  };

  const handleLeaveClick = () => {
    router.push(`/flashcard?id=${search}`)
  };

  return (
    <Box>
        <AppBar position='static'>
            <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1, cursor: 'pointer' }} onClick={handleLogoClick}>LOGO FlashNotes</Typography>
            <SignedOut>
                <Button href="/sign-in" sx={{ mx: 2, color: '#fff', '&:hover': { bgcolor: '#fff', color: '#4e5340' } }}>Login</Button>
                <Button href="/sign-up" sx={{ mx: 2, color: '#fff', '&:hover': { bgcolor: '#fff', color: '#4e5340' } }}>Sign up</Button>
            </SignedOut>
            <SignedIn>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button color="inherit" href="/generate" sx={{ mr: 5 }}>Create New Sets</Button>
                <Button color="inherit" href="/flashcards" sx={{ mr: 5 }}>View My Sets</Button>
                <UserButton sx={{ ml: 2 }} />
                </Box>
            </SignedIn>
            </Toolbar>
        </AppBar>
        <Button sx={{mt: 2, mx: 5, bgcolor: '#98473e', '&:hover':{bgcolor: '#FF1900'}}} onClick={() => handleLeaveClick()} variant="contained">
          Leave
        </Button>
        <Box sx={{ p: 10, mt: 5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {cards.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton onClick={handlePrev} disabled={currentIndex === 0 || cards.length === 0}>
                <ArrowBack />
                </IconButton>

                <Box sx={{
                perspective: '1000px',
                '& > div': {
                    transition: 'transform 0.6s',
                    transformStyle: 'preserve-3d',
                    position: 'relative',
                    width: '800px', // Adjust width as needed
                    height: '500px', // Adjust height as needed
                    boxShadow: '0 4px 8px 0 rgba(0,0,0, 0.2)',
                    transform: showBack ? 'rotateY(180deg)' : 'rotateY(0deg)',
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
                '& > div > div:nth-of-type(2)': {
                    transform: 'rotateY(180deg)',
                },
                }}>
                <div onClick={handleCardClick}>
                    <div>
                    <Typography variant="h5" component="div">
                        {cards[currentIndex]?.front}
                    </Typography>
                    </div>
                    <div>
                    <Typography variant="h5" component="div">
                        {cards[currentIndex]?.back}
                    </Typography>
                    </div>
                </div>
                </Box>

                <IconButton onClick={handleNext} disabled={currentIndex === cards.length - 1 || cards.length === 0}>
                <ArrowForward />
                </IconButton>
            </Box>
            )}
        </Box>
    </Box>
  )

};

export default PracticePage;