import React, { useRef, useState, useEffect, KeyboardEvent } from 'react'
import './globals.css'

export interface OTPInputProps {
  otp: string
  setOtp: (otp: string) => void
}

const OTPInput = React.forwardRef<HTMLInputElement, OTPInputProps>(function OTPInput(
  { otp, setOtp },
  ref,
) {
  const [showTooltip, setShowTooltip] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    setOtp(otp)
  }, [otp, setOtp])

  const onPaste = (e: React.ClipboardEvent, index: number) => {
    e.preventDefault()
    const paste = e.clipboardData.getData('text').split('')
    if (paste.every((item) => !isNaN(Number(item)))) {
      let newInputValue = [...otp]
      for (let i = 0; i < paste.length; i++) {
        if (index + i < otp.length) {
          newInputValue[index + i] = paste[i]
        }
      }
      setOtp(newInputValue.join(''))
    }
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const keyCode = parseInt(e.key)
    if (
      e.key !== 'Backspace' &&
      e.key !== 'Delete' &&
      e.key !== 'Tab' &&
      !(e.metaKey && e.key === 'v') &&
      !(keyCode >= 0 && keyCode <= 9)
    ) {
      e.preventDefault()
      setShowTooltip(true)
      setTimeout(() => setShowTooltip(false), 2000)
    }
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const input = e.target.value

    if (!isNaN(Number(input))) {
      let newOtp = otp.split('')
      newOtp[index] = input
      setOtp(newOtp.join(''))

      if (input !== '' && index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus()
      }
    }
  }

  const onKeyUp = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      let newOtp = otp.split('')
      newOtp[index] = ''
      setOtp(newOtp.join(''))

      if (index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
    }
  }
  const resetInputs = () => {
    setOtp('')
    inputRefs.current[0]?.focus()
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // TODO: Add your Database logic here
  }

  return (
    <div className="flex flex-wrap space-x-2">
      <label className="text-gray-300 mx-2 text-sm font-bold mb-2" htmlFor="passcode">
        OTP
      </label>
      <form className="w-full space-x-2" onSubmit={handleSubmit}>
        {otp.split('').map((value: string, index: number) => (
          <input
            key={`index-${index}`}
            ref={(el) => el && (inputRefs.current[index] = el)}
            inputMode="numeric"
            maxLength={1}
            name="passcode"
            type="text"
            value={value}
            onChange={(e) => onChange(e, index)}
            onKeyUp={(e) => onKeyUp(e, index)}
            onKeyDown={(e) => onKeyDown(e)}
            onPaste={(e) => onPaste(e, index)}
            className="w-12 h-12 border-2 border-gray-200 text-black focus:outline-none focus:border-blue-400 text-center"
            autoComplete="off"
            accessKey={String(index)}
          />
        ))}
        <button type="submit" style={{ display: 'none' }} /> {/* hidden submit button */}
      </form>
      {showTooltip ? (
        <div className="flex mt-6 p-1 h-12 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:border-blue-400 text-center">
          <div className="mt-2 text-sm text-red-500">Only numbers are allowed.</div>
        </div>
      ) : (
        <div className="flex space-x-2 mt-4">
          <button
            type="button"
            onClick={resetInputs}
            className="bg-blue-500 text-white px-4 py-2 rounded">
            Reset
          </button>
        </div>
      )}
    </div>
  )
})

export default OTPInput
