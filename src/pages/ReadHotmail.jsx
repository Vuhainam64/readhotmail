import React, { useState, useEffect } from "react";
import { Modal, Input, Button, message, Skeleton } from "antd";

import { FaPlus } from "react-icons/fa";
import { FiRefreshCcw } from "react-icons/fi";
import { MdOutlineMailOutline } from "react-icons/md";

import { readEmails } from "../api/hotmail";

const ReadHotmail = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inboxData, setInboxData] = useState("");
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [email, setEmail] = useState([]);
  const [loading, setLoading] = useState(false);
  const [emailContent, setEmailContent] = useState("");
  const [selectedEmailPopup, setSelectedEmailPopup] = useState("");
  const [emailModalVisible, setEmailModalVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("hotmailInboxes");
    if (stored) {
      setEmails(stored.split("\n").filter((line) => line.trim() !== ""));
    }
  }, []);

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

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

  const handleDelete = (index) => {
    const newEmails = emails.filter((_, i) => i !== index);
    setEmails(newEmails);
    localStorage.setItem("hotmailInboxes", newEmails.join("\n"));
  };

  const handleDeleteAll = () => {
    setEmails([]);
    localStorage.removeItem("hotmailInboxes");
  };

  const handleEmailClick = async (email) => {
    setSelectedEmail(email);
    const stored = localStorage.getItem("hotmailInboxes");
    if (!stored) {
      message.warning("No inboxes found in localStorage.");
      return;
    }

    const inboxData = stored.split("\n").find((line) => line.startsWith(email));
    if (!inboxData) {
      message.warning(`No data found for email: ${email}`);
      return;
    }

    const [mail, , token, clientId] = inboxData.split("|");

    try {
      setLoading(true);
      const emailData = await readEmails(mail, clientId, token, 10);
      if (emailData && emailData.length > 0) {
        setEmail(emailData);
        message.success(`Found ${emailData.length} email(s)`);
      } else {
        message.warning("No emails found for this account.");
      }
    } catch (error) {
      console.error("Error reading emails:", error);
      message.error("Failed to read emails.");
    } finally {
      setLoading(false);
    }
  };

  const handleHeaderClick = (header) => {
    setSelectedEmailPopup(header.subject);
    setEmailModalVisible(true);
    setEmailContent(header.html);
  };

  const handleCopyEmail = () => {
    if (selectedEmail) {
      navigator.clipboard.writeText(selectedEmail);
      message.success(`Email "${selectedEmail}" is copied!`);
    }
  };

  const handleRefresh = () => {
    if (selectedEmail) {
      handleEmailClick(selectedEmail);
    } else {
      message.warning("Please select an email account to refresh.");
    }
  };

  return (
    <div className="grid grid-cols-5 gap-1">
      <div className="bg-gray-800 text-white p-4 h-screen space-y-4">
        <div className="text-2xl font-semibold w-full items-center text-center border-b">
          Read Hotmail
        </div>
        <div>
          <div
            className="flex items-center justify-between hover:bg-gray-900 p-2 cursor-pointer"
            onClick={showModal}
          >
            <div>Add Inbox</div>
            <FaPlus />
          </div>
          <div
            className="mt-4 space-y-2 max-h-[500px] overflow-y-auto scrollbar-thin 
            scrollbar-thumb-gray-700 scrollbar-track-gray-500"
          >
            {emails.map((line, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-700 p-2 rounded 
                hover:bg-gray-600 cursor-pointer"
                onClick={() => handleEmailClick(line.split("|")[0])}
              >
                <span>{line.split("|")[0]}</span>
                <button
                  onClick={() => handleDelete(index)}
                  className="text-red-500 font-bold"
                >
                  -
                </button>
              </div>
            ))}
          </div>
          {emails.length > 0 && (
            <div className="mt-4 text-center">
              <Button
                onClick={handleDeleteAll}
                type="primary"
                danger
                className="w-full"
              >
                Delete All Email
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="bg-gray-100 col-span-4">
        <div className="bg-white border-b">
          <div
            className="text-gray-600 p-4 space-x-2 flex items-center cursor-pointer hover:text-gray-800"
            onClick={handleCopyEmail}
          >
            <MdOutlineMailOutline />
            <div>{selectedEmail || "Email"}</div>{" "}
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-semibold">Inbox</div>
            <Button
              onClick={handleRefresh}
              type="primary"
              loading={loading}
              className="flex space-x-2 items-center"
            >
              {!loading && <FiRefreshCcw />}
              <div>Refresh</div>
            </Button>
          </div>
          {loading ? (
            <Skeleton active />
          ) : (
            email.length > 0 && (
              <div className="space-y-2 mt-4">
                {email.map((header, index) => (
                  <div
                    key={index}
                    className="cursor-pointer bg-white p-4 rounded-md hover:bg-slate-200"
                    onClick={() => handleHeaderClick(header)}
                  >
                    <div className="grid grid-cols-2 gap-1">
                      <div>
                        <div className="font-semibold">{header.subject}</div>
                        <div className="text-sm">{header.from}</div>
                      </div>
                      <div className="justify-end w-full flex">
                        <div className="text-gray-600">{header.date}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>

      <Modal
        title="Add Inbox"
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={handleSave}
      >
        <Input.TextArea
          rows={6}
          placeholder="mail|pass|client_id|token"
          value={inboxData}
          onChange={(e) => setInboxData(e.target.value)}
        />
      </Modal>

      {/* New Modal to display email content */}
      <Modal
        title={selectedEmailPopup}
        open={emailModalVisible}
        onCancel={() => setEmailModalVisible(false)}
        footer={null}
        width={800}
      >
        <div dangerouslySetInnerHTML={{ __html: emailContent }} />
      </Modal>
    </div>
  );
};

export default ReadHotmail;
