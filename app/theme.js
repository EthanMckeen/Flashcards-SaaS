// theme.js
import { createTheme } from '@mui/material/styles';
import { Jost } from '@next/font/google'; // Replace Jost with your desired font

// Load the Google Font
const jost = Jost({
  subsets: ['latin'],
});

// Create a custom MUI theme
const theme = createTheme({
  typography: {
    fontFamily: jost.style.fontFamily, // Apply the Google Font
  },
  // Customize other theme aspects if needed
});

export default theme;
