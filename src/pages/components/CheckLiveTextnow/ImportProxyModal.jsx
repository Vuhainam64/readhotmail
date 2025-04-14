import React, { useState } from 'react'
import { Modal, Input } from 'antd'

const { TextArea } = Input

const ImportProxyModal = ({ visible, onOk, onCancel }) => {
  const [proxyInput, setProxyInput] = useState('')

  const handleOk = () => {
    const proxyList = proxyInput
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
    onOk(proxyList)
    setProxyInput('')
  }

  const handleCancel = () => {
    onCancel()
    setProxyInput('')
  }

  return (
    <Modal
      title='Import Proxies'
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText='Save'
      cancelText='Cancel'
    >
      <TextArea
        rows={6}
        value={proxyInput}
        onChange={(e) => setProxyInput(e.target.value)}
        placeholder='Nhập danh sách proxy, mỗi dòng một proxy (ví dụ: 170.106.187.7:9424)'
      />
    </Modal>
  )
}

export default ImportProxyModal
