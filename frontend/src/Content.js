import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import VideoChat from './components/VideoChat';

const ContentContainer = styled.div`
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding: 8px;
`;

const SubContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  text-align: center;
  border-radius: 4px;
  background-color: var(--primary-color);
  text-align: center;
`;

const Chat = styled.div``;

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
        <Chat />
      </SubContainer>
    );
  }
  return <SubContainer><NoneSelected /></SubContainer>;
};

ConditionalContent.propTypes = {
  selected: PropTypes.instanceOf(Object),
  onCall: PropTypes.instanceOf(Object),
  onVideo: PropTypes.func.isRequired,
};

ConditionalContent.defaultProps = {
  selected: null,
  onCall: null,
};

// eslint-disable-next-line react/prefer-stateless-function
class Content extends React.Component {
  render() {
    const { selected, onCall, onVideo } = this.props;
    return (
      <ContentContainer>
        <ConditionalContent selected={selected} onCall={onCall} onVideo={onVideo} />
      </ContentContainer>
    );
  }
}

Content.propTypes = {
  selected: PropTypes.instanceOf(Object),
  onCall: PropTypes.instanceOf(Object),
  onVideo: PropTypes.func.isRequired,
};

Content.defaultProps = {
  selected: null,
  onCall: null,
};

export default Content;
