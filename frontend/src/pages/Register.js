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
import auth from "./Auth";
import { useHistory } from 'react-router-dom'
import { withRouter } from "react-router-dom";
import logo from './TradePal.png';

const theme = createTheme();









export const Register = props => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  

  async function registerCredentials(event){
    event.preventDefault()
    const response = await fetch('http://localhost:1337/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
      })
    })

    const data = await response.json()
    if (data.status === 'ok') {
			loginCredentials()
		}
    console.log(data)
  }

  async function loginCredentials(){
    const response = await fetch('http://localhost:1337/api/login', {
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
      auth.login(() => {
        props.history.push("/home");
      });
			alert('Login successful')
			
		} else {
			alert('Please check your username and password')
		}
  }

  

  return (
    <ThemeProvider theme={theme}>
      <Helmet>
        <style>{'body { background-color: #060b26;}}'}</style>
      </Helmet>
      <Container component="main" maxWidth="xs">
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
            Sign up
          </Typography>
          <Box component="form" onSubmit={registerCredentials}  sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  
                  name="firstName"
                  value={firstName} 
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  value={lastName} 
                  onChange={(e) => setLastName(e.target.value)} 
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  label="Email Address"
                  name="email"
                  
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  
                  
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, bgcolor:'#060b26' }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-start">
              <Grid item>
                <Link href="/" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
export default withRouter(Register);