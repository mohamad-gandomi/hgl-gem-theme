import React, { useState } from 'react'

export function VerifyForm({ copy, slug }) {
  const [code, setCode] = useState('')
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  const isLoading = status === 'loading'
  const messages = {
    empty: copy.ui.verifyEmpty || 'Please enter the report code.',
    loading: copy.ui.verifyLoading || 'Checking certificate...',
    success: copy.ui.verifySuccess || 'Certificate verified. Opening report...',
    error: copy.ui.verifyError || 'Could not verify this certificate. Please check the code and try again.',
    unavailable: copy.ui.verifyUnavailable || 'Certificate verification is not available yet.'
  }

  const submit = async (event) => {
    event.preventDefault()

    const trimmedCode = code.trim()

    if (!trimmedCode) {
      setStatus('error')
      setMessage(messages.empty)
      return
    }

    const restUrl = window.HGL_WP?.restUrl

    if (!restUrl) {
      setStatus('error')
      setMessage(messages.unavailable)
      return
    }

    setStatus('loading')
    setMessage(messages.loading)

    try {
      const response = await fetch(`${restUrl}certificates/verify`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...(window.HGL_WP?.nonce ? { 'X-WP-Nonce': window.HGL_WP.nonce } : {})
        },
        body: JSON.stringify({ code: trimmedCode, ...(slug ? { slug } : {}) })
      })
      const payload = await response.json().catch(() => ({}))

      if (!response.ok || !payload.downloadUrl) {
        throw new Error(payload?.message || messages.error)
      }

      setStatus('success')
      setMessage(messages.success)
      window.location.assign(payload.downloadUrl)
    } catch (error) {
      setStatus('error')
      setMessage(error.message || messages.error)
    }
  }

  return (
    <form onSubmit={submit}>
      <label className="block">
        <span className="text-sm font-medium text-ink">{copy.ui.license}</span>
        <input
          value={code}
          onChange={(event) => setCode(event.target.value)}
          className="mt-2 h-11 w-full rounded-lg border border-hairline bg-canvasSoft px-4 text-sm text-ink outline-none focus:border-primary"
          autoComplete="off"
          disabled={isLoading}
        />
      </label>
      {message && (
        <p className={`mt-3 min-h-6 text-sm leading-6 ${status === 'success' ? 'text-ink' : status === 'error' ? 'text-red-700' : 'text-body'}`} role="status">
          {message}
        </p>
      )}
      <button type="submit" disabled={isLoading} className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-ink hover:bg-primaryActive disabled:cursor-wait disabled:opacity-70">
        {isLoading ? messages.loading : copy.ui.verify}
      </button>
    </form>
  )
}
