import React, { useState } from 'react'
import { Input, Button, Card, message, Select } from 'antd'
import { CopyOutlined } from '@ant-design/icons'

const { TextArea } = Input
const { Option } = Select

const MergeHotmail = () => {
  const [leftInput, setLeftInput] = useState('')
  const [rightInput, setRightInput] = useState('')
  const [output, setOutput] = useState('')
  const [sortOption, setSortOption] = useState('none')

  const handleMerge = () => {
    // Parse input from right textarea
    const rightLines = rightInput.trim().split('\n')
    const rightData = rightLines.map((line) => {
      const [email, pass, refreshToken, clientId] = line.split('|')
      return { email, pass, refreshToken, clientId }
    })

    // Parse input from left textarea
    const leftLines = leftInput.trim().split('\n')
    let result = leftLines.map((leftLine) => {
      const parts = leftLine.split('|')
      let email,
        pass,
        clientId,
        prefix = [],
        suffix = []

      if (parts.length === 9) {
        // New format: MailTN|PassTN|Phone|Date|MailHM|PassMailHM|RefreshTokenCũ|ClientIDCũ|Named
        const [mailTN, passTN, phone, date, mailHM, passMailHM, , clientIDCũ, named] = parts
        email = mailHM
        pass = passMailHM
        clientId = clientIDCũ
        prefix = [mailTN, passTN, phone, date]
        suffix = [named]
      } else if (parts.length === 8) {
        // Existing format: MailTN|PassTN|Phone|Date|MailHM|PassMailHM|RefreshTokenCũ|ClientIDCũ
        const [mailTN, passTN, phone, date, mailHM, passMailHM, , clientIDCũ] = parts
        email = mailHM
        pass = passMailHM
        clientId = clientIDCũ
        prefix = [mailTN, passTN, phone, date]
      } else if (parts.length === 4) {
        // Old format: MailHM|PassMailHM|RefreshTokenCũ|ClientIDCũ
        const [mailHM, passMailHM, , clientIDCũ] = parts
        email = mailHM
        pass = passMailHM
        clientId = clientIDCũ
      } else {
        // Invalid format, return as is
        return leftLine
      }

      // Find matching email in rightData
      const rightMatch = rightData.find((item) => item.email === email)
      if (rightMatch) {
        return [
          ...prefix,
          email,
          pass,
          rightMatch.refreshToken,
          rightMatch.clientId,
          ...suffix,
        ].join('|')
      }
      return [...prefix, email, pass, 'Null', 'Null', ...suffix].join('|')
    })

    // Apply sorting based on sortOption
    let sortedResult = [...result]
    if (sortOption === 'a-z') {
      sortedResult.sort((a, b) => {
        const emailA = a.split('|').length >= 8 ? a.split('|')[4] : a.split('|')[0]
        const emailB = b.split('|').length >= 8 ? b.split('|')[4] : b.split('|')[0]
        return emailA.localeCompare(emailB)
      })
    } else if (sortOption === 'z-a') {
      sortedResult.sort((a, b) => {
        const emailA = a.split('|').length >= 8 ? a.split('|')[4] : a.split('|')[0]
        const emailB = b.split('|').length >= 8 ? b.split('|')[4] : b.split('|')[0]
        return emailB.localeCompare(emailB)
      })
    } else if (sortOption === 'null-last') {
      sortedResult.sort((a, b) => {
        const aIsNull =
          a
            .split('|')
            .slice(-2 - (a.split('|').length === 9 ? 1 : 0))
            .slice(0, 2)
            .join('|') === 'Null|Null'
        const bIsNull =
          b
            .split('|')
            .slice(-2 - (b.split('|').length === 9 ? 1 : 0))
            .slice(0, 2)
            .join('|') === 'Null|Null'
        if (aIsNull && !bIsNull) return 1
        if (!aIsNull && bIsNull) return -1
        return 0
      })
    }

    // Set output
    setOutput(sortedResult.join('\n'))
  }

  const handleSortChange = (value) => {
    setSortOption(value)
    if (output) {
      let sortedResult = output.trim().split('\n')
      if (value === 'a-z') {
        sortedResult.sort((a, b) => {
          const emailA = a.split('|').length >= 8 ? a.split('|')[4] : a.split('|')[0]
          const emailB = b.split('|').length >= 8 ? b.split('|')[4] : b.split('|')[0]
          return emailA.localeCompare(emailB)
        })
      } else if (value === 'z-a') {
        sortedResult.sort((a, b) => {
          const emailA = a.split('|').length >= 8 ? a.split('|')[4] : a.split('|')[0]
          const emailB = b.split('|').length >= 8 ? b.split('|')[4] : b.split('|')[0]
          return emailB.localeCompare(emailA)
        })
      } else if (value === 'null-last') {
        sortedResult.sort((a, b) => {
          const aIsNull =
            a
              .split('|')
              .slice(-2 - (a.split('|').length === 9 ? 1 : 0))
              .slice(0, 2)
              .join('|') === 'Null|Null'
          const bIsNull =
            b
              .split('|')
              .slice(-2 - (b.split('|').length === 9 ? 1 : 0))
              .slice(0, 2)
              .join('|') === 'Null|Null'
          if (aIsNull && !bIsNull) return 1
          if (!aIsNull && bIsNull) return -1
          return 0
        })
      }
      setOutput(sortedResult.join('\n'))
    }
  }

  const handleCopy = () => {
    navigator.clipboard
      .writeText(output)
      .then(() => {
        message.success('Output copied to clipboard!')
      })
      .catch(() => {
        message.error('Failed to copy output.')
      })
  }

  return (
    <div className='p-6 bg-gray-100 min-h-screen'>
      <Card title='Merge Hotmail Refresh Tokens' className='max-w-4xl mx-auto'>
        <div className='flex justify-between gap-6'>
          {/* Left TextArea */}
          <div className='flex-1'>
            <h3 className='text-lg font-semibold mb-2'>Input Left</h3>
            <TextArea
              rows={10}
              value={leftInput}
              onChange={(e) => setLeftInput(e.target.value)}
              placeholder='Enter left input (e.g., MailTN|PassTN|Phone|Date|MailHM|PassMailHM|RefreshTokenCũ|ClientIDCũ[|Named] or MailHM|PassMailHM|RefreshTokenCũ|ClientIDCũ)'
              className='w-full'
            />
          </div>

          {/* Right TextArea */}
          <div className='flex-1'>
            <h3 className='text-lg font-semibold mb-2'>Input Right</h3>
            <TextArea
              rows={10}
              value={rightInput}
              onChange={(e) => setRightInput(e.target.value)}
              placeholder='Enter right input (e.g., MailHM|PassMailHM|RefreshTokenMới|ClientIDMới)'
              className='w-full'
            />
          </div>
        </div>

        {/* Merge Button */}
        <div className='mt-6 text-center'>
          <Button type='primary' onClick={handleMerge} size='large'>
            Merge Refresh Tokens
          </Button>
        </div>

        {/* Output */}
        {output && (
          <div className='mt-6'>
            <div className='flex justify-between items-center mb-2'>
              <h3 className='text-lg font-semibold'>Output</h3>
              <div className='flex items-center gap-2'>
                <Select defaultValue='none' style={{ width: 150 }} onChange={handleSortChange}>
                  <Option value='none'>No Sort</Option>
                  <Option value='a-z'>Sort A-Z</Option>
                  <Option value='z-a'>Sort Z-A</Option>
                  <Option value='null-last'>Null Last</Option>
                </Select>
                <Button icon={<CopyOutlined />} onClick={handleCopy} type='default'>
                  Copy
                </Button>
              </div>
            </div>
            <TextArea rows={10} value={output} readOnly className='w-full' />
          </div>
        )}
      </Card>
    </div>
  )
}

export default MergeHotmail
