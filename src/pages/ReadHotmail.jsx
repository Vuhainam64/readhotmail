import React, { useState, useEffect } from "react";
import { Button, message, Skeleton } from "antd";

import { FaMinus, FaPlus } from "react-icons/fa";
import { FiRefreshCcw } from "react-icons/fi";
import { MdOutlineMailOutline } from "react-icons/md";

import { Cloud } from "../assets/img";
import { readEmails } from "../api/hotmail";
import { AddMail, EditMail, ReadContent } from "./components/ReadHotmail";

const ReadHotmail = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [email, setEmail] = useState([]);
  const [loading, setLoading] = useState(false);
  const [emailContent, setEmailContent] = useState("");
  const [selectedEmailPopup, setSelectedEmailPopup] = useState("");
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("hotmailInboxes");
    if (stored) {
      const emailList = stored.split("\n").filter((line) => line.trim() !== "");
      setEmails(emailList);
      if (emailList.length > 0) {
        handleEmailClick(emailList[0].split("|")[0]);
      }
    }
  }, [refresh]);

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
    message.success(`Email "${selectedEmail}" is copied!`);
    navigator.clipboard.writeText(selectedEmail);
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
            onClick={() => setIsModalVisible(true)}
          >
            <div>Add Inbox</div>
            <FaPlus />
          </div>
          <div
            className="mt-4 space-y-2 max-h-[500px] overflow-y-hidden hover:overflow-y-auto scrollbar-thin 
            scrollbar-thumb-gray-700 scrollbar-track-gray-500"
          >
            {emails.map((line, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-700 p-2 rounded 
                hover:bg-gray-600 cursor-pointer"
                onClick={() => handleEmailClick(line.split("|")[0])}
              >
                <span>{line.split("|")[0].split("@")[0]}</span>
                <button
                  onClick={() => handleDelete(index)}
                  className="text-red-500 font-bold"
                >
                  <FaMinus />
                </button>
              </div>
            ))}
          </div>
          {emails.length > 0 && (
            <div className="mt-4 text-center space-y-4">
              <Button
                onClick={handleDeleteAll}
                type="primary"
                danger
                className="w-full"
              >
                Delete All Email
              </Button>
              <Button
                onClick={() => setEditModalVisible(true)}
                type="primary"
                className="w-full"
              >
                Edit Mail
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
          ) : email.length > 0 ? (
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
          ) : (
            <div
              className="flex flex-wrap justify-center w-full h-screen items-center"
              style={{ maxHeight: "calc(100vh - 218px)" }}
            >
              <div className="flex flex-col items-center space-y-4">
                <img src={Cloud} alt="No Emails" className="w-80" />
                <div className="w-full mt-4 text-center text-xl text-gray-900 font-semibold">
                  No emails found
                </div>
                <Button
                  onClick={() => setIsModalVisible(true)}
                  className="flex items-center gap-2 px-6 py-3 text-lg"
                >
                  <FaPlus size={10} />
                  Add Email
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <AddMail
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        setEmails={setEmails}
      />

      {/* New Modal to display email content */}
      <ReadContent
        selectedEmailPopup={selectedEmailPopup}
        emailModalVisible={emailModalVisible}
        setEmailModalVisible={setEmailModalVisible}
        emailContent={emailContent}
      />

      <EditMail
        editModalVisible={editModalVisible}
        setEditModalVisible={setEditModalVisible}
        refresh={refresh}
        setRefresh={setRefresh}
        setIsModalVisible={setIsModalVisible}
      />
    </div>
  );
};

export default ReadHotmail;
