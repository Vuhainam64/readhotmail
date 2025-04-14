import React, { useState } from 'react'
import { Modal, Input } from 'antd'

const { TextArea } = Input

const ImportModal = ({ visible, onOk, onCancel }) => {
  const [inputData, setInputData] = useState('')

  const handleOk = () => {
    const accountLines = inputData
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)

    const parsedAccounts = accountLines.map((line, index) => {
      const [
        textnow_account,
        textnow_password,
        textnow_phone,
        textnow_date,
        hotmail_account,
        hotmail_password,
        hotmail_refresh_token,
        hotmail_clientID,
      ] = line.split('|')
      return {
        key: index.toString(),
        textnow_account,
        textnow_password,
        textnow_phone,
        textnow_date,
        hotmail_account,
        hotmail_password,
        hotmail_refresh_token,
        hotmail_clientID,
      }
    })

    onOk(parsedAccounts)
    setInputData('')
  }

  const handleCancel = () => {
    onCancel()
    setInputData('')
  }

  return (
    <Modal
      title='Import Accounts'
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText='Save'
      cancelText='Cancel'
    >
      <TextArea
        rows={6}
        value={inputData}
        onChange={(e) => setInputData(e.target.value)}
        placeholder='Nhập danh sách tài khoản, mỗi dòng một tài khoản'
      />
    </Modal>
  )
}

export default ImportModal
