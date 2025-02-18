import React, { useState } from "react";
import { Input, Modal } from "antd";

const AddMail = ({ isModalVisible, setIsModalVisible, setEmails }) => {
  const [inboxData, setInboxData] = useState("");

  const handleSave = () => {
    const lines = inboxData.split("\n").filter((line) => line.trim() !== "");
    const stored = localStorage.getItem("hotmailInboxes");
    const existing = stored
      ? stored.split("\n").filter((line) => line.trim() !== "")
      : [];
    const updated = [...lines, ...existing];
    localStorage.setItem("hotmailInboxes", updated.join("\n"));
    setEmails(updated);
    setIsModalVisible(false);
  };

  return (
    <Modal
      title="Add Inbox"
      open={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      onOk={handleSave}
    >
      <Input.TextArea
        rows={6}
        placeholder="mail|pass|token|clientId"
        value={inboxData}
        onChange={(e) => setInboxData(e.target.value)}
      />
    </Modal>
  );
};

export default AddMail;
