import React, { useState, useEffect } from "react";
import NoteService from "../services/NoteService";

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import {  Link } from "react-router-dom";
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  table: {
    minWidth: 650,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

const NotesList = (props) => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    retriveNotes();
  }, []);


  const retriveNotes = () => {
    NoteService.getAll()
      .then(response => {
        setNotes(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };


  const deleteNote = (id) => {
    NoteService.remove(id)
      .then(response => {
        console.log(response.data);
        let filteredNotes = notes.filter(n => n._id !== id)
        console.log(filteredNotes)
        setNotes( filteredNotes )
      })
      .catch(e => {
        console.log(e);
      });
  };

  const editNote = (id) => {
    props.history.push('/notes/'+ id)
  }

  const addNote = (id) => {
    props.history.push('/add')
  }


  const classes = useStyles(); 

  return (  
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
              <Breadcrumbs aria-label="breadcrumb">
                <Link color="inherit" to="/" >
                  Home
                </Link>
                <Typography color="textPrimary">Notes List</Typography>
              </Breadcrumbs>
          </Paper>
        </Grid>
      
      
        <TableContainer component={Paper}>
        <Button variant="contained" color="primary" onClick = {addNote} >
          Add
        </Button>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">S.No</TableCell>
                <TableCell align="center">Title</TableCell>
                <TableCell align="center">Content</TableCell>
                <TableCell align="center">Image</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notes.length > 0 && notes.map((row, index) => (
                <TableRow key={index}>
                  <TableCell align="center">
                    {index + 1}
                  </TableCell>
                  <TableCell align="center">{row.title}</TableCell>
                  <TableCell align="center">{row.content}</TableCell>
                  <TableCell align="center">
                    <img src={row.imageUrl} width="50"/>
                  </TableCell>
                  <TableCell align="center">
                    <div className={classes.root}>
                      <Button variant="contained" color="primary" onClick = { e => editNote(row._id) }>
                        Edit
                      </Button>
                      <Button variant="contained" color="secondary" onClick = { e => deleteNote(row._id) }>
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </div>
  );
};

export default NotesList;