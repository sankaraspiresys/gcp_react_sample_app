import React, { useState, useEffect } from "react";
import NoteService from "../services/NoteService";
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import {  Link } from "react-router-dom";

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import config from '../config.json'
import NotesList from "./NotesList";

const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    root1: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  }));

const AddNote = (props) => {

  const classes = useStyles();

  const initialNoteState = {
    id: null,
    title: "",
    content: "",
    imageFile: "",
    imageUrl: "",
    editMode: false,
    noteId: ""
  };


  const [note, setNote] = useState(initialNoteState);
  const [submitted, setSubmitted] = useState(false);
  const [currentNote, setCurrentNote] = useState(initialNoteState);
  
  useEffect(() => {
    console.log(props.match.params.id)
    if(props.match.params.id != undefined){
      let currentId = props.match.params.id;
      getNote(currentId);
    }
  }, []);
  


  const handleInputChange = event => {
    const { name, value } = event.target;
    setNote({ ...note, [name]: value });
  };

  const handleInputFile = event => {
    const { name, value } = event.target;
    setNote({ ...note, [name] : event.target.files[0]})
  }

  const saveNote = () => {
    var data = {
      "title": note.title,
      "content": note.content,
      "imageUrl": note.imageUrl
    };

    if(note.imageUrl == '' || note.title == '' || note.content == '') return;
    
    if(note.editMode == false){
      NoteService.create(data)
      .then(response => {
        setNote({
          id: response.data.id,
          title: response.data.title,
          content: response.data.content,
          imageUrl: response.data.imageUrl
        });
        setSubmitted(true);
        props.history.push('/notes')
      })
      .catch(e => {
        console.log(e);
      });
    }else{ console.log(note.noteId)
      NoteService.update(note.noteId, data)
      .then(response => {
        setNote({ ...note, editMode: false, noteId: "" })
        props.history.push('/notes');
      })
      .catch(e => {
        console.log(e);
      });
    }
    
  };

  const upload = () => {
    if(note.imageFile == undefined) return;
    var data = {
      "file": note.imageFile
    };
    var xhr  = new XMLHttpRequest();
    xhr.onload = function (e) {
      let imageurl = JSON.parse(e.currentTarget.response).data
      setNote(
        { ...note, imageUrl: imageurl }
      );
    }
    var formData = new FormData();
    xhr.open("POST", config.api_url+"upload", true);
    formData.append('file', note.imageFile);
    xhr.send(formData);
  };

  const getNote = id => {
    NoteService.get(id)
      .then(response => {
        let res = response.data;
        setNote({
          ...response.data, editMode: true, noteId: id
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const newNote = () => {
    setNote(initialNoteState);
    setSubmitted(false);
  };

  return (

    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Breadcrumbs aria-label="breadcrumb">
              <Link color="inherit" to="/" >
                Home
              </Link>
              <Typography color="textPrimary">{note.editMode? "Edit ": "Add "} Notes</Typography>
            </Breadcrumbs>
          </Paper>
        </Grid>
        <Grid item xs={8}>
          <Paper className={classes.paper}>
          {
          <div>
              <form className={classes.root} noValidate autoComplete="off">
                  <TextField id="title" name="title" label="Title" value={note.title} onChange={handleInputChange} />
                <TextField id="content" name="content" label="Content" value={note.content} onChange={handleInputChange} />
                <br /> <TextField id="imageFile" name="imageFile" type="file" label="Select Image"  onChange={handleInputFile} />
    
                  <Button size="small" className={classes.root} variant="contained" color="secondary" onClick={upload}>
                      Upload
                  </Button>
                  
              </form>
            
              <div className={classes.root}>
                  {
                    note.editMode ? <Button variant="contained" color="primary" onClick={saveNote}>Update</Button> :
                    <Button variant="contained" color="primary" onClick={saveNote}>
                      Submit
                    </Button>
                  }
              </div>
          </div>
         }
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper className={classes.paper}> <img src={note.imageUrl}/> </Paper>
        </Grid>
      </Grid>
    </div>
    
  );
};

export default AddNote;