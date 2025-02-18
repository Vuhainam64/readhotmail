import React from "react";
import { Modal } from "antd";

const ReadContent = ({
  selectedEmailPopup,
  emailModalVisible,
  setEmailModalVisible,
  emailContent,
}) => {
  return (
    <Modal
      title={selectedEmailPopup}
      open={emailModalVisible}
      onCancel={() => setEmailModalVisible(false)}
      footer={null}
      width={800}
    >
      <div dangerouslySetInnerHTML={{ __html: emailContent }} />
    </Modal>
  );
};

export default ReadContent;
