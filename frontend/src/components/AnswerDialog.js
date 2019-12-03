import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function AnswerDialog({ open, onAgree, onDisagree }) {
  return (
    <div>
      <Dialog
        open={open}
        onClose={onDisagree}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Answer call?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" />
        </DialogContent>
        <DialogActions>
          <Button onClick={onDisagree} color="primary">
            Disagree
          </Button>
          <Button onClick={onAgree} color="primary" autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
