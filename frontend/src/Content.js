import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import VideoChat from './components/VideoChat';
import TextChatComponent from './textChat/TextChatComponent';

const ContentContainer = styled.div`
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding: 8px;
  display: flex;
  flex-direction: column;
`;

const SubContainer = styled.div`
  width: 100%;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  text-align: center;
  border-radius: 4px;
  /* background-color: var(--primary-color); */
  text-align: center;
`;


const NoneSelected = () => (
  <span>
    Select friend to chat.
  </span>
);

const ConditionalContent = (props) => {
  const { selected, onCall, onVideo } = props;
  if (selected) {
    return (
      <SubContainer>
        <VideoChat onCall={onCall} onVideo={onVideo} />
        <TextChatComponent get_friend={selected} />
      </SubContainer>
    );
  }
  return (
    <SubContainer>
      <NoneSelected />
    </SubContainer>
  );
};

ConditionalContent.propTypes = {
  selected: PropTypes.string,
  onCall: PropTypes.instanceOf(Object),
  onVideo: PropTypes.func.isRequired,
};

ConditionalContent.defaultProps = {
  selected: '',
  onCall: null,
};

const styles = (theme) => ({
  toolbar: theme.mixins.toolbar,
});

// eslint-disable-next-line react/prefer-stateless-function
class Content extends React.Component {
  render() {
    const {
      selected, onCall, onVideo, classes
    } = this.props;
    return (
      <ContentContainer>
        <div className={classes.toolbar} />
        <ConditionalContent selected={selected} onCall={onCall} onVideo={onVideo} />
      </ContentContainer>
    );
  }
}

Content.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  selected: PropTypes.string,
  onCall: PropTypes.instanceOf(Object),
  onVideo: PropTypes.func.isRequired,
};

Content.defaultProps = {
  selected: '',
  onCall: null,
};

export default withStyles(styles)(Content);
