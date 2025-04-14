import React, { useState, useEffect } from 'react'
import { Button, Modal, Select } from 'antd'
import { CiImport } from 'react-icons/ci'
import {
  AccountTable,
  CompletedTable,
  EditModal,
  ImportModal,
  ImportProxyModal,
  LogTable,
} from './components/CheckLiveTextnow'

const { Option } = Select

const CheckLiveTextnow = () => {
  const [isImportModalVisible, setIsImportModalVisible] = useState(false)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [isVerifyModalVisible, setIsVerifyModalVisible] = useState(false)
  const [isImportProxyModalVisible, setIsImportProxyModalVisible] = useState(false)
  const [accounts, setAccounts] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [editAccount, setEditAccount] = useState(null)
  const [threadCount, setThreadCount] = useState(3) // Mặc định 3 luồng
  const [logs, setLogs] = useState([])
  const [proxies, setProxies] = useState([])
  const [completedAccounts, setCompletedAccounts] = useState([])
  const [ws, setWs] = useState(null)
  const [isWsConnected, setIsWsConnected] = useState(false)
  const [processingQueue, setProcessingQueue] = useState([]) // Hàng đợi tài khoản
  const [activeThreads, setActiveThreads] = useState(new Set()) // Tài khoản đang chạy

  const connectWebSocket = () => {
    const websocket = new WebSocket('ws://localhost:2727')
    setWs(websocket)

    websocket.onopen = () => {
      console.log('Đã kết nối tới WebSocket server!')
      setIsWsConnected(true)
    }

    websocket.onmessage = (event) => {
      const log = event.data
      parseAndAddLog(log)
    }

    websocket.onclose = () => {
      console.log('Ngắt kết nối WebSocket! Đang thử kết nối lại...')
      setIsWsConnected(false)
      setTimeout(connectWebSocket, 1000)
    }

    websocket.onerror = () => {
      console.error('WebSocket lỗi! Đang thử kết nối lại...')
      setIsWsConnected(false)
      websocket.close()
    }
  }

  useEffect(() => {
    connectWebSocket()
    return () => {
      if (ws) ws.close()
    }
  }, [])

  const parseAndAddLog = (log) => {
    const [threadPart, message] = log.split('] ')
    const threadMatch = threadPart.match(/Thread-\d+-(.*?@.*?\..*?)$/i)
    if (!threadMatch) return

    const email = threadMatch[1]
    const time = new Date().toLocaleTimeString()
    let status = message

    if (message.includes('Starting verification process')) {
      status = 'Starting'
    } else if (message.includes('Verify')) {
      status = 'Verified'
    } else if (message.includes('Account disabled')) {
      status = 'Disabled'
    } else if (message.includes('Error')) {
      status = 'No Data'
    } else if (message.includes('Profile stopped') || message.includes('Profile removed')) {
      return
    }

    setLogs((prev) => {
      const existingLogIndex = prev.findIndex((item) => item.email === email)
      const updatedLog = { key: email, email, status, time }
      if (existingLogIndex !== -1) {
        const updatedLogs = [...prev]
        updatedLogs[existingLogIndex] = updatedLog
        return updatedLogs
      } else {
        return [...prev, updatedLog]
      }
    })

    if (status === 'Verified' || status === 'Disabled' || status === 'No Data') {
      const account = accounts.find((acc) => acc.textnow_account === email)
      if (account) {
        setCompletedAccounts((prev) => {
          const exists = prev.some((item) => item.email === email)
          if (!exists) {
            return [...prev, { ...account, key: email, status, time }]
          }
          return prev.map((item) => (item.email === email ? { ...item, status, time } : item))
        })
      }

      setActiveThreads((prev) => {
        const newThreads = new Set(prev)
        if (!newThreads.has(email)) {
          console.log(`Tài khoản ${email} không có trong activeThreads, bỏ qua!`)
          return newThreads
        }
        newThreads.delete(email)
        console.log(
          `Hoàn tất ${email}. Active threads còn lại: ${newThreads.size}, Queue còn lại: ${processingQueue.length}`
        )
        if (newThreads.size === 0 && processingQueue.length > 0) {
          processNextBatch()
        }
        return newThreads
      })
    }
  }

  const showImportModal = () => setIsImportModalVisible(true)
  const handleImportCancel = () => setIsImportModalVisible(false)

  const handleImportOk = (parsedAccounts) => {
    setAccounts(parsedAccounts)
    setIsImportModalVisible(false)
  }

  const showEditModal = (record) => {
    setEditAccount(record)
    setIsEditModalVisible(true)
  }

  const handleEditCancel = () => {
    setIsEditModalVisible(false)
    setEditAccount(null)
  }

  const handleEditOk = (updatedAccount) => {
    setAccounts((prev) =>
      prev.map((item) => (item.key === updatedAccount.key ? { ...updatedAccount } : item))
    )
    setIsEditModalVisible(false)
    setEditAccount(null)
  }

  const handleRemove = (key) => {
    setAccounts((prev) => prev.filter((item) => item.key !== key))
    setSelectedRowKeys((prev) => prev.filter((k) => k !== key))
  }

  const handleSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys)
    console.log('Selected Row Keys:', newSelectedRowKeys)
  }

  const showVerifyModal = () => {
    if (selectedRowKeys.length === 0) {
      alert('Vui lòng chọn ít nhất một tài khoản!')
      return
    }
    if (proxies.length === 0) {
      alert('Vui lòng nhập danh sách proxy trước!')
      return
    }
    setIsVerifyModalVisible(true)
  }

  const handleVerifyCancel = () => {
    setIsVerifyModalVisible(false)
  }

  const processNextBatch = () => {
    if (!ws || ws.readyState !== WebSocket.OPEN || activeThreads.size > 0) {
      console.log('WebSocket chưa sẵn sàng hoặc batch trước chưa xong, bỏ qua batch mới.')
      return
    }

    setProcessingQueue((prevQueue) => {
      const batchSize = Math.min(threadCount, prevQueue.length)
      if (batchSize === 0) {
        console.log('Hàng đợi rỗng, không còn tài khoản để xử lý.')
        return prevQueue
      }

      const batch = prevQueue.slice(0, batchSize)
      const remainingQueue = prevQueue.slice(batchSize)

      let currentProxies = [...proxies]
      console.log(
        `Bắt đầu xử lý batch với ${batchSize} tài khoản. Queue còn lại: ${remainingQueue.length}`
      )

      batch.forEach((account) => {
        if (
          activeThreads.has(account.textnow_account) ||
          completedAccounts.some((acc) => acc.email === account.textnow_account)
        ) {
          console.log(`Tài khoản ${account.textnow_account} đã được xử lý hoặc đang chạy, bỏ qua!`)
          return
        }

        const proxy = currentProxies[0]
        if (!proxy) {
          console.error('Hết proxy để sử dụng!')
          return
        }

        console.log(`Gửi tin nhắn cho ${account.textnow_account} với proxy ${proxy}`)
        ws.send(
          JSON.stringify({
            type: 'verify',
            data: {
              textnow_account: account.textnow_account,
              textnow_password: account.textnow_password,
              textnow_phone: account.textnow_phone,
              textnow_date: account.textnow_date,
              hotmail_account: account.hotmail_account,
              hotmail_password: account.hotmail_password,
              hotmail_refresh_token: account.hotmail_refresh_token,
              hotmail_clientID: account.hotmail_clientID,
              proxy: proxy,
            },
          })
        )

        activeThreads.add(account.textnow_account) // Thêm vào activeThreads
        currentProxies = currentProxies.slice(1) // Xóa proxy đã dùng
      })

      setActiveThreads(new Set(activeThreads)) // Cập nhật state sau khi gửi batch
      setProxies(currentProxies)
      return remainingQueue // Trả về hàng đợi còn lại
    })
  }

  const handleVerifySubmit = () => {
    const selectedAccounts = accounts.filter((account) => selectedRowKeys.includes(account.key))

    if (proxies.length < selectedAccounts.length) {
      alert('Số proxy phải lớn hơn hoặc bằng số tài khoản được chọn!')
      return
    }

    console.log(
      `Bắt đầu xử lý ${selectedAccounts.length} tài khoản với threadCount = ${threadCount}`
    )
    setProcessingQueue(selectedAccounts)
    setActiveThreads(new Set()) // Reset activeThreads

    if (ws && ws.readyState === WebSocket.OPEN) {
      processNextBatch()
    } else {
      console.error('WebSocket chưa kết nối!')
      alert('WebSocket chưa kết nối! Đang thử kết nối lại...')
    }

    setIsVerifyModalVisible(false)
  }

  const showImportProxyModal = () => setIsImportProxyModalVisible(true)

  return (
    <div className='p-6 max-w-6xl mx-auto'>
      <h1 className='text-2xl font-bold mb-6'>Check Live TextNow</h1>

      <div className='flex space-x-4 mb-6'>
        <Button type='primary' onClick={showImportModal}>
          <CiImport /> Import Data
        </Button>
        <Button type='primary' onClick={showImportProxyModal}>
          <CiImport /> Import Proxy
        </Button>
        <Button type='primary' onClick={showVerifyModal}>
          Verify
        </Button>
      </div>

      <ImportModal
        visible={isImportModalVisible}
        onOk={handleImportOk}
        onCancel={handleImportCancel}
      />

      <EditModal
        visible={isEditModalVisible}
        account={editAccount}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
      />

      <Modal
        title='Select Thread Count'
        open={isVerifyModalVisible}
        onOk={handleVerifySubmit}
        onCancel={handleVerifyCancel}
        okText='Submit'
        cancelText='Cancel'
      >
        <Select
          value={threadCount}
          onChange={(value) => setThreadCount(value)}
          style={{ width: '100%' }}
          placeholder='Chọn số tài khoản mỗi lần chạy'
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <Option key={num} value={num}>
              {num}
            </Option>
          ))}
        </Select>
      </Modal>

      <ImportProxyModal
        visible={isImportProxyModalVisible}
        onOk={(proxyList) => {
          setProxies(proxyList)
          setIsImportProxyModalVisible(false)
        }}
        onCancel={() => setIsImportProxyModalVisible(false)}
      />

      <AccountTable
        accounts={accounts}
        selectedRowKeys={selectedRowKeys}
        onSelectChange={handleSelectChange}
        onEdit={showEditModal}
        onRemove={handleRemove}
      />

      {logs.length > 0 && <LogTable logs={logs} />}

      {completedAccounts.length > 0 && <CompletedTable completedAccounts={completedAccounts} />}
    </div>
  )
}

export default CheckLiveTextnow
