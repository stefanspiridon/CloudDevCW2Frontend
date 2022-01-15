import React, {useState} from 'react'
import {Helmet} from 'react-helmet';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { withRouter } from "react-router-dom";
import auth from "./Auth";
import logo from './TradePal.png';



const theme = createTheme();




export const Login = props => {

  const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

  async function loginCredentials(event){
    event.preventDefault()
    const response = await fetch('https://tradepal-backend.nw.r.appspot.com/api/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email,
				password,
			}),
		})

		const data = await response.json()

		if (data.user) {
			localStorage.setItem('token', data.user)
			alert('Login successful')
      auth.login(() => {
        props.history.push("/home");
      });
			// window.location.href = '/home'
		} else {
			alert('Please check your username and password')
		}
  }

  
  return (
    <ThemeProvider theme={theme} >
      <Helmet>
        <style>{'body { background-color: #060b26;}}'}</style>
      </Helmet>
      
      
      <Container component="main" maxWidth="xs" sx={{alignItems: 'center'}}>
        <CssBaseline />
        <img src={logo} alt="Logo" style={{marginLeft: '50px', marginTop:'50px'}}/>
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: 'white',
            borderRadius: '25px',
            paddingX: '15px',
            paddingBottom: '20px',
            boxShadow: '0px -10px'
          }}
        >
          
          <Avatar sx={{ m: 1, bgcolor: '#060b26' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form"  sx={{ mt: 1 }}>
            <TextField
              
              margin="normal"
              required
              fullWidth
              value={email}
					    onChange={(e) => setEmail(e.target.value)}
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              value={password}
					    onChange={(e) => setPassword(e.target.value)}
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              onClick={loginCredentials}
              variant="contained"
              
              sx={{ mt: 3, mb: 2, bgcolor:'#060b26' }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default withRouter(Login);