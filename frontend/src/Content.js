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
  justify-content: stretch;
  align-items: center;
  border-radius: 4px;
  /* background-color: var(--primary-color); */
  text-align: center;
  overflow: hidden;
`;


const NoneSelected = () => (
  <span>
    Select friend to chat.
  </span>
);

const ConditionalContent = (props) => {
  const { selected, onCall, onVideo } = props;
  if (selected || onCall) {
    return (
      <SubContainer>
        {(onCall) ? <VideoChat onCall={onCall} onVideo={onVideo} /> : null}

        {(selected) ? <TextChatComponent get_friend={selected} /> : null}


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
