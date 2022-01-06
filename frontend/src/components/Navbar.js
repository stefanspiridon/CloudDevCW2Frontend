import React, {useEffect,useState} from 'react'
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as CgIcons from "react-icons/cg";
import { Link } from "react-router-dom";
import { SidebarData } from "./SidebarContent";
import './Navbar.css'
import { IconContext } from 'react-icons';
import { TopbarData} from '../pages/loginDropdown';
import Typography from '@mui/material/Typography';
import jwt from 'jsonwebtoken'
import { useHistory } from 'react-router-dom'
import { withRouter } from "react-router-dom";
import auth from "../pages/Auth";






export const Navbar = props =>  {
    const [sidebar, setSidebar] = useState(false);
    const showSidebar = () => setSidebar(!sidebar);

    const [topbar, setTopbar] = useState(false);
    const showTopbar = () => setTopbar(!topbar);

    const history = useHistory()
	const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')

    
    async function getUser(){
        const req = await fetch('http://localhost:1337/api/userinfo', {
			headers: {
				'x-access-token': localStorage.getItem('token'),
			},
		})

		const data = await req.json()
		if (data.status === 'ok') {
			setFirstName(data.firstName)
            setLastName(data.lastName)
		} else {
			alert(data.error)
		}
    }

    useEffect(() => {
		const token = localStorage.getItem('token')
		if (token) {
			const user = jwt.decode(token)
			if (!user) {
				localStorage.removeItem('token')
				history.replace('/')
			} else {
				getUser()
			}
		}
	}, [])

    return (
        <>
            <IconContext.Provider value={{color: '#fff'}}>
                <div className='navbar'>
                    <Link to="#" className="menu-bars">
                        <FaIcons.FaBars onClick={showSidebar}/>
                         
                    </Link>
                    <Typography component="h1" variant="h5" display={"block"} color={"white"} position={"relative"} top={"1px"} left={"57%"} >
                            {firstName + " " + lastName}
                               
                    </Typography>
                    <Typography component="h1"  color={"white"} position={"relative"} top={"25px"} left={"25%"}>
                        LOGGED IN
                    </Typography> 
                    <Link to="#" className="top-bars">
                        
                        <CgIcons.CgProfile onClick={showTopbar}/>
                    </Link>
                </div>
                <nav className={topbar ? 'top-menu active' : 'top-menu'}>
                    <ul className='top-menu-items' onClick={showTopbar}>
                        <li className='topbar-toggle'></li>
                        {TopbarData.map((item,index) => {
                            return (
                                <li key={index} className={item.cName}>
                                    <Link onClick={() => {
                                        auth.logout(() => {props.history.push("/");
                                        });
                                        }}
                                    >
                                        {item.icon}
                                        <span>{item.title}</span> 
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </nav>
                <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                    <ul className='nav-menu-items' onClick={showSidebar}>
                        <li className='navbar-toggle'></li>
                        {SidebarData.map((item,index) => {
                            return (
                                <li key={index} className={item.cName}>
                                    <Link to={item.path}>
                                        {item.icon}
                                        <span>{item.title}</span> 
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </nav>
            </IconContext.Provider>
        </>
    )
}


export default withRouter(Navbar);

