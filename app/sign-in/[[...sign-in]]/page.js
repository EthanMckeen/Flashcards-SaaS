import { AppBar, Container, Toolbar, Typography, Button, Box} from "@mui/material";
import { SignIn, SignOut } from "@clerk/nextjs";
import Link from "next/link";




export default function SignUpPage(){
    return (
        <Box width="100vw">
            <AppBar position="static">
                <Toolbar>
                    <Typography 
                    variant="h6" 
                    sx={{
                        flexGrow: 1
                    }}>
                        FlashNotes
                    </Typography>
                    <Button color= 'inherit'>
                        <Link href='/sign-in' passHref>
                            Login
                        </Link>
                    </Button>
                    <Button color= 'inherit'>
                        <Link href='/sign-up' passHref>
                            SignUp
                        </Link>
                    </Button>
                </Toolbar>
            </AppBar>
            
            <Box display='flex'
            flexDirection="column"
            alignItems='center'
            justifyContent='center'
            >
                <Typography variant="h4"> Sign in</Typography>
                <SignIn/>
            </Box>
        </Box>
    )
}