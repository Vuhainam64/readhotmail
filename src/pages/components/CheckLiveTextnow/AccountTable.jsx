import React from 'react'
import { Table, Button, Space } from 'antd'

import { MdEdit } from 'react-icons/md'
import { FaTrashAlt } from 'react-icons/fa'

const AccountTable = ({ accounts, selectedRowKeys, onSelectChange, onEdit, onRemove }) => {
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE],
  }

  // Cột chính (không mở rộng)
  const columns = [
    {
      title: 'TextNow Email',
      dataIndex: 'textnow_account',
      key: 'textnow_account',
    },
    {
      title: 'TextNow Password',
      dataIndex: 'textnow_password',
      key: 'textnow_password',
    },
    {
      title: 'TextNow Phone',
      dataIndex: 'textnow_phone',
      key: 'textnow_phone',
    },
    {
      title: 'TextNow Date',
      dataIndex: 'textnow_date',
      key: 'textnow_date',
    },
    {
      title: 'Operation',
      key: 'operation',
      render: (_, record) => (
        <Space size='middle'>
          <Button type='link' onClick={() => onEdit(record)}>
            <MdEdit /> Edit
          </Button>
          <Button type='link' danger onClick={() => onRemove(record.key)}>
            <FaTrashAlt />
            Remove
          </Button>
        </Space>
      ),
    },
  ]

  // Nội dung khi mở rộng (Expanded Row)
  const expandedRowRender = (record) => {
    const expandedColumns = [
      {
        title: 'Hotmail Email',
        dataIndex: 'hotmail_account',
        key: 'hotmail_account',
      },
      {
        title: 'Hotmail Password',
        dataIndex: 'hotmail_password',
        key: 'hotmail_password',
      },
      {
        title: 'Hotmail Refresh Token',
        dataIndex: 'hotmail_refresh_token',
        key: 'hotmail_refresh_token',
        render: (text) => <span>{text.slice(0, 20)}...</span>,
      },
      {
        title: 'Hotmail Client ID',
        dataIndex: 'hotmail_clientID',
        key: 'hotmail_clientID',
      },
    ]

    return (
      <Table
        columns={expandedColumns}
        dataSource={[record]} // Chỉ hiển thị thông tin của dòng hiện tại
        pagination={false}
        bordered
      />
    )
  }

  return (
    <Table
      rowSelection={rowSelection}
      columns={columns}
      dataSource={accounts}
      expandable={{ expandedRowRender }} // Thêm tính năng mở rộng
      pagination={{ pageSize: 10 }}
      bordered
      scroll={{ x: 1000 }} // Giảm chiều rộng cuộn vì ít cột hơn
    />
  )
}

export default AccountTable
