'use client'
import React, { useState, useEffect } from 'react';
import { useUser } from "@clerk/nextjs";
import { Box, Typography, TextField, Button, AppBar, Toolbar } from '@mui/material';
import { collection, doc, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import { useSearchParams } from 'next/navigation';
import { SignedOut, SignedIn, UserButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

const QuizPage = () => {
  const [cards, setCards] = useState([]);
  const [currentTerm, setCurrentTerm] = useState('');
  const [currentBackTerm, setCurrentBackTerm] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const { user } = useUser();
  const searchParams = useSearchParams();
  const search = searchParams.get('id');
  const router = useRouter();

  useEffect(() => {
    async function getFlashcards() {
      if (!search || !user) return;

      const colRef = collection(doc(collection(db, 'users'), user.id), search);
      const docs = await getDocs(colRef);
      const fetchedCards = docs.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setCards(fetchedCards);
      if (fetchedCards.length > 0) {
        loadNewQuestion(fetchedCards);
      }
    }
    getFlashcards();
  }, [user, search]);

  const loadNewQuestion = (cardsList) => {
    const randomCard = cardsList[Math.floor(Math.random() * cardsList.length)];
    setCurrentTerm(randomCard.front);
    setCurrentBackTerm(randomCard.back);
  };

  const handleSubmit = () => {
    if (userAnswer.toLowerCase() === currentBackTerm.toLowerCase()) {
      setScore(score + 1);
    }
    setQuestionCount(questionCount + 1);
    setUserAnswer('');
    if (questionCount < 9) {
      loadNewQuestion(cards);
    } else {
      setQuizFinished(true);
    }
  };

  const handleLogoClick = () => {
    router.push('/');
  };

  const handleLeaveClick = () => {
    router.push(`/flashcard?id=${search}`);
  };

  const handleRestartClick = () => {
    setScore(0);
    setQuestionCount(0);
    setQuizFinished(false);
    loadNewQuestion(cards);
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

      <Box sx={{ p: 3 }}>
        {quizFinished ? (
          <Box>
            <Typography variant="h4" gutterBottom>Quiz Finished!</Typography>
            <Typography variant="h6" gutterBottom>Your score: {score} out of 10</Typography>
            <Button onClick={handleRestartClick} variant="contained" sx={{ mt: 2, bgcolor: '#000293', '&:hover': { bgcolor: '#0278FF' } }}>
              Take Another Quiz
            </Button>
            <Button onClick={handleLeaveClick} variant="contained" sx={{ mt: 2, mx:5 , bgcolor: '#98473e', '&:hover': { bgcolor: '#FF1900' } }}>
              Leave
            </Button>
          </Box>
        ) : (
          <Box>
            <Typography variant="h4" gutterBottom>Quiz Time!</Typography>
            <Typography variant="h6" gutterBottom>Term: {currentTerm}</Typography>
            <TextField
              label="Your Answer"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              variant="outlined"
              fullWidth
            />
            <Button onClick={handleSubmit} variant="contained" sx={{ mt: 2, mx: 2, flex: 1, bgcolor: '#000293', '&:hover': { bgcolor: '#0278FF' } }}>
              Submit
            </Button>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Score: {score} | Questions Asked: {questionCount}
            </Typography>
            <Button onClick={handleLeaveClick} variant="contained" sx={{ mt: 2, mx: 2, bgcolor: '#98473e', '&:hover': { bgcolor: '#FF1900' } }}>
              Leave
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default QuizPage;

