import React from 'react'
import { Modal, Input } from 'antd'

const { TextArea } = Input

const EditModal = ({ visible, account, onOk, onCancel }) => {
  const [editAccount, setEditAccount] = React.useState(account)

  // Cập nhật editAccount khi account thay đổi
  React.useEffect(() => {
    setEditAccount(account)
  }, [account])

  const handleOk = () => {
    onOk(editAccount)
  }

  return (
    <Modal
      title='Edit Account'
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText='Save'
      cancelText='Cancel'
    >
      {editAccount && (
        <div className='space-y-4'>
          <Input
            addonBefore='TextNow Email'
            value={editAccount.textnow_account}
            onChange={(e) => setEditAccount({ ...editAccount, textnow_account: e.target.value })}
          />
          <Input
            addonBefore='TextNow Password'
            value={editAccount.textnow_password}
            onChange={(e) => setEditAccount({ ...editAccount, textnow_password: e.target.value })}
          />
          <Input
            addonBefore='TextNow Phone'
            value={editAccount.textnow_phone}
            onChange={(e) => setEditAccount({ ...editAccount, textnow_phone: e.target.value })}
          />
          <Input
            addonBefore='TextNow Date'
            value={editAccount.textnow_date}
            onChange={(e) => setEditAccount({ ...editAccount, textnow_date: e.target.value })}
          />
          <Input
            addonBefore='Hotmail Email'
            value={editAccount.hotmail_account}
            onChange={(e) => setEditAccount({ ...editAccount, hotmail_account: e.target.value })}
          />
          <Input
            addonBefore='Hotmail Password'
            value={editAccount.hotmail_password}
            onChange={(e) => setEditAccount({ ...editAccount, hotmail_password: e.target.value })}
          />
          <TextArea
            addonBefore='Hotmail Refresh Token'
            rows={2}
            value={editAccount.hotmail_refresh_token}
            onChange={(e) =>
              setEditAccount({ ...editAccount, hotmail_refresh_token: e.target.value })
            }
          />
          <Input
            addonBefore='Hotmail Client ID'
            value={editAccount.hotmail_clientID}
            onChange={(e) => setEditAccount({ ...editAccount, hotmail_clientID: e.target.value })}
          />
        </div>
      )}
    </Modal>
  )
}

export default EditModal
