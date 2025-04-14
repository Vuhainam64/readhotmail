import React from 'react'
import { Table } from 'antd'

const LogTable = ({ logs }) => {
  const logColumns = [
    {
      title: 'Textnow Email',
      dataIndex: 'email',
      key: 'email',
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
      <h2 className='text-xl font-semibold mb-4'>Verification Logs</h2>
      <Table
        columns={logColumns}
        dataSource={logs}
        pagination={{ pageSize: 10 }}
        bordered
        scroll={{ x: 800 }}
      />
    </div>
  )
}

export default LogTable
