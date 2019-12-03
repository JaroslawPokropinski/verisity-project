import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

import { CssBaseline } from '@material-ui/core';
import AppBar from './components/AppBar';

import Content from './Content';
import Media from './helpers/media';
import FriendsComponent from './friendList/FriendsComponent';
import InvitationComponent from './invitationList/InvitationComponent';
import axios from './axios';
import Drawer from './components/Drawer';
import AnswerDialog from './components/AnswerDialog';

const styles = (theme) => ({
  root: {
    display: 'flex',
    height: '100vh',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
});

function acceptFriend(email) {
  axios
    .post('/friends/invitations', { email })
    .then(() => {
      toast.success(`Friend ${email} accepted!`);
    })
    .catch(() => {
      toast.error('Failed to accept user');
    });
}

class Root extends React.Component {
  constructor() {
    super();
    this.state = {
      input: '',
      call: null,
      mobileOpen: false,
      answerDialogOpen: false,
      answerDialogAgree: () => {},
      answerDialogDisagree: () => {},
    };
    this.mediastream = null;
    this.videoRef = null;
    this.devices = { audio: false, video: false };
    this.selectedFriend = '';
    autoBind(this);
  }

  componentDidMount() {
    const { session, history } = this.props;

    if (!session.isSessionOnline) {
      history.push('/login');
      return;
    }
    const { peer, peerId } = session;
    // Register user as callable (online)
    axios.post('/peer', { id: peerId })
      .catch(() => {
        toast.error('Failed to register peer');
      });

    Media.getDevices()
      .then((devices) => {
        this.devices = devices;
        if (!this.devices.audio) {
          toast.warn('We couldn\'t detect microphone');
        }

        if (!this.devices.video) {
          toast.warn('We couldn\'t detect camera');
        }
      })
      .catch((error) => {
        toast.error(error);
      });


    peer.on('call', (call) => {
      call.on('error', (err) => {
        toast.error(`Call error: ${err}`);
      });

      const agree = () => {
        Media.getMedia(this.devices)
        .then((stream) => {
          call.answer(stream);
          call.on('stream', (incoming) => {
            // provide stream to video element
            if (this.videoRef && this.videoRef.current) {
              this.videoRef.current.srcObject = incoming;
              this.videoRef.current.play();
            }
          });
          this.setState({ call: { peer: call.peer } });
        })
        .catch((error) => {
          toast.error(`Failed to get video with error: ${error}`);
        });
        this.setState({ answerDialogOpen: false });
      };

      const disagree = () => {
        toast('close');
        call.close();
        this.setState({ answerDialogOpen: false });
      };

      this.setState({
        answerDialogOpen: true,
        answerDialogAgree: agree,
        answerDialogDisagree: disagree
      });
    });
  }

  onFriendCall(email) {
    axios.get(`/peer?email=${encodeURIComponent(email)}`)
      .then((response) => {
        this.onCall(response.data);
      })
      .catch(() => {
        toast.error('Failed to call user');
      });
    this.onFriendClick(email);
  }

  // on button 'call friend' pressed
  onCall(id) {
    // call server for 'to' id
    const { session } = this.props;
    const { peer } = session;
    Media.getMedia(this.devices)
      .then((stream) => {
        const call = peer.call(id, stream);
        call.on('stream', (incoming) => {
          // provide stream to video element
          if (this.videoRef && this.videoRef.current) {
            this.videoRef.current.srcObject = incoming;
            this.videoRef.current.play();
          }
        });
        this.setState({ call: { peer: call.peer } });
      })
      .catch((error) => {
        toast.error(`Failed to get video with error: ${error}`);
      });
  }

  onVideo(ref) {
    this.videoRef = ref;
  }

  onInput(e) {
    this.setState({ input: e.target.value });
  }

  onClick() {
    const { input } = this.state;
    this.onCall(input);
  }

  onMobileOpen() {
    const { mobileOpen } = this.state;
    this.setState({ mobileOpen: !mobileOpen });
  }


  onFriendClick(email) {
    this.setState({ selectedFriend: email });
  }

  getTextchatFriend() {
    const { selectedFriend } = this.state;
    return selectedFriend;
  }

  render() {
    const { classes } = this.props;
    const {
      call, mobileOpen, selectedFriend, answerDialogOpen, answerDialogAgree, answerDialogDisagree
    } = this.state;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AnswerDialog
          open={answerDialogOpen}
          onAgree={answerDialogAgree}
          onDisagree={answerDialogDisagree}
        />
        <AppBar handleDrawerToggle={this.onMobileOpen} />
        <Drawer handleDrawerToggle={this.onMobileOpen} mobileOpen={mobileOpen}>
          <div>
            <FriendsComponent
              onFriendClick={this.onFriendClick}
              onFriendCall={this.onFriendCall}
            />
            <InvitationComponent
              acceptFriend={acceptFriend}
            />
          </div>
        </Drawer>
        <Content
          className={classes.content}
          selected={selectedFriend}
          onCall={call}
          onVideo={this.onVideo}
        />

      </div>
    );
  }
}

Root.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  session: PropTypes.instanceOf(Object).isRequired,
};

const mapStateToProps = (state) => ({
  session: state.session
});

const containerRoot = connect(mapStateToProps)(Root);

export default withStyles(styles)(containerRoot);
