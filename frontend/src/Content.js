import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

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
  const { selected } = props;
  if (selected) {
    return <SubContainer><Chat /></SubContainer>;
  }
  return <SubContainer><NoneSelected /></SubContainer>;
};

ConditionalContent.propTypes = {
  selected: PropTypes.instanceOf(Object)
};

ConditionalContent.defaultProps = {
  selected: null
};

class Content extends React.Component {
  constructor() {
    super();
    this.videoRef = React.createRef();
  }

  render() {
    const { selected } = this.props;
    return (
      <ContentContainer>
        <ConditionalContent selected={selected} />
      </ContentContainer>
    );
  }
}

Content.propTypes = {
  selected: PropTypes.instanceOf(Object)
};

Content.defaultProps = {
  selected: null
};

export default Content;
