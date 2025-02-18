import React, { useState, useEffect } from "react";
import { Modal, Table, Button, Tooltip, Input, message } from "antd";
import { FaRegCopy } from "react-icons/fa";

const columns = [
  {
    title: "Email",
    dataIndex: "email",
    render: (text) => (
      <Tooltip title={text}>
        <span>{text.length > 30 ? text.slice(0, 30) + "..." : text}</span>
      </Tooltip>
    ),
  },
  {
    title: "Password",
    dataIndex: "password",
    render: (text) => (
      <Tooltip title={text}>
        <span>{text.length > 30 ? text.slice(0, 30) + "..." : text}</span>
      </Tooltip>
    ),
  },
  {
    title: "Token",
    dataIndex: "token",
    render: (text) => (
      <Tooltip title={text}>
        <span>{text.length > 30 ? text.slice(0, 30) + "..." : text}</span>
      </Tooltip>
    ),
  },
  {
    title: "Client ID",
    dataIndex: "clientId",
    render: (text) => (
      <Tooltip title={text}>
        <span>{text.length > 30 ? text.slice(0, 30) + "..." : text}</span>
      </Tooltip>
    ),
  },
  {
    title: "Operation",
    render: (_, record) => (
      <Button
        icon={<FaRegCopy />}
        onClick={() => handleCopy(record)}
        size="small"
      >
        Copy
      </Button>
    ),
  },
];

const handleCopy = (record) => {
  const { email, password, token, clientId } = record;
  const textToCopy = `Email: ${email}\nPassword: ${password}\nToken: ${token}\nClient ID: ${clientId}`;
  navigator.clipboard.writeText(textToCopy);
  message.success("Copied to clipboard!");
};

const EditMail = ({
  editModalVisible,
  setEditModalVisible,
  refresh,
  setRefresh,
  setIsModalVisible,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");

  useEffect(() => {
    if (editModalVisible) {
      const storedData = localStorage.getItem("hotmailInboxes");
      if (storedData) {
        const parsedData = storedData.split("\n").map((line, index) => {
          const [email, password, token, clientId] = line.split("|");
          return {
            key: index,
            email,
            password,
            token,
            clientId,
          };
        });
        setDataSource(parsedData);
        setFilteredData(parsedData);
      }
    }
  }, [editModalVisible]);

  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const onDelete = () => {
    const newDataSource = dataSource.filter(
      (item) => !selectedRowKeys.includes(item.key)
    );
    setDataSource(newDataSource);
    setFilteredData(newDataSource);
    setSelectedRowKeys([]);

    const newStoredData = newDataSource
      .map(
        (item) =>
          `${item.email}|${item.password}|${item.token}|${item.clientId}`
      )
      .join("\n");
    localStorage.setItem("hotmailInboxes", newStoredData);
    setRefresh(refresh + 1);
    message.success(`Deleted ${selectedRowKeys.length} selected rows!`);
  };

  const onSearch = (e) => {
    const value = e.target.value;
    setSearchEmail(value);

    const filtered = dataSource.filter((item) =>
      item.email.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: "odd",
        text: "Select Odd Row",
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return false;
            }
            return true;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
      {
        key: "even",
        text: "Select Even Row",
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return true;
            }
            return false;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
    ],
  };

  return (
    <Modal
      title="Edit Mail"
      open={editModalVisible}
      onCancel={() => setEditModalVisible(false)}
      footer={null}
      width={1400}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-2 items-center">
          <div>Search with Email:</div>
          <Input
            placeholder="Search by Email"
            value={searchEmail}
            onChange={onSearch}
            style={{ width: 300 }}
          />
        </div>
        <div className="flex space-x-2 items-center">
          <Button
            onClick={() => {
              setIsModalVisible(true);
              setEditModalVisible(false);
            }}
          >
            Add Mail
          </Button>
          <Button
            onClick={onDelete}
            danger
            disabled={selectedRowKeys.length === 0}
          >
            Delete {selectedRowKeys.length > 0 && `(${selectedRowKeys.length})`}
          </Button>
        </div>
      </div>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 7 }}
      />
    </Modal>
  );
};

export default EditMail;
