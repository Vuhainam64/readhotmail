import React from 'react'
import { Table } from 'antd'

const CompletedTable = ({ completedAccounts }) => {
  const completedColumns = [
    {
      title: 'Textnow Email',
      dataIndex: 'textnow_account',
      key: 'textnow_account',
      width: '30%',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      width: '25%',
    },
  ]

  return (
    <div className='mt-6'>
      <h2 className='text-xl font-semibold mb-4'>Completed Accounts</h2>
      <Table
        columns={completedColumns}
        dataSource={completedAccounts}
        pagination={{ pageSize: 10 }}
        bordered
        scroll={{ x: 800 }}
      />
    </div>
  )
}

export default CompletedTable
