import React, { useState } from 'react'
import { Input, Button, Card, message } from 'antd'
import { CopyOutlined } from '@ant-design/icons'

const { TextArea } = Input

const MergeHotmail = () => {
  const [leftInput, setLeftInput] = useState('')
  const [rightInput, setRightInput] = useState('')
  const [output, setOutput] = useState('')

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
      const [email, pass, ,] = leftLine.split('|')
      // Find matching email in rightData
      const rightMatch = rightData.find((item) => item.email === email)
      if (rightMatch) {
        // Replace refreshToken with the one from rightData
        return `${email}|${pass}|${rightMatch.refreshToken}|${rightMatch.clientId}`
      }
      // If no match found, return Null for refreshToken and clientId
      return `${email}|${pass}|Null|Null`
    })

    // Set output
    setOutput(result.join('\n'))
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
              placeholder='Enter left input (e.g., email|pass|refreshToken|clientId)'
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
              placeholder='Enter right input (e.g., email|pass|refreshToken|clientId)'
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
              <Button icon={<CopyOutlined />} onClick={handleCopy} type='default'>
                Copy
              </Button>
            </div>
            <TextArea rows={10} value={output} readOnly className='w-full' />
          </div>
        )}
      </Card>
    </div>
  )
}

export default MergeHotmail
