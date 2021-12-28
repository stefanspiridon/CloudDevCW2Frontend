import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import './Home.css'

export const NewsData = [
    {
        id: 0,
        name: 'Elon Musk',
        date: '13 Jan, 2021',
        content: 'This is some dummy content'
    },
    {
        id: 1,
        name: 'Elon Musk',
        date: '13 Jan, 2021',
        content: 'This is some dummy content'
    },
    {
        id: 2,
        name: 'Elon Musk',
        date: '13 Jan, 2021',
        content: 'This is some dummy content'
    },
]

export default function NewsDataTable() {
    return (
      
      <React.Fragment >
        <h5 className='title'>Recent News</h5>
        <Table size="small" >
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Content</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {NewsData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.content}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Link color="primary" href="#" className='seeMore'>
          See more
        </Link>
      </React.Fragment>
    );
}