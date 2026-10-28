import { Fragment, useEffect, useState } from 'react'

type IurImport = {
  id: string
  fileName: string
  sourceDevice: string
  fileSize: number
  status: string
  errorMessage: string | null
  invoiceId: string | null
  receivedAt: string
  parsedData: {
    records: Array<{ type: string; raw: string }>
  } | null
  extractedData: {
    invoice?: {
      ticketNo: string | null
      pnr: string | null
      route: string | null
      class: string | null
      baseFare: number | null
      taxesCommission: number | null
      aitTax: number | null
      clientPrice: number | null
      commission: number | null
      calculatedCommission: number | null
      purchaseCost: number | null
      netCommission: number | null
      discount: number | null
      extraFee: number | null
      profit: number | null
      passengerName: string | null
      passengerType: string | null
      passportNo: string | null
      contactNo: string | null
      passengerEmail: string | null
      dateOfBirth: string | null
      passportIssueDate: string | null
      passportExpiryDate: string | null
      journeyDate: string | null
      returnDate: string | null
      travelSegment: string | null
      ticketingRemarks: string | null
    }
    passenger: { name: string | null }
    ticket: { number: string | null; currency: string | null; baseAmount: number | null }
    itinerary: Array<unknown>
  } | null
}

type ImportResponse = {
  items: IurImport[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

type IurConfiguration = {
  directory: string
  configured: boolean
}

export default function IurImports() {
  const [data, setData] = useState<ImportResponse | null>(null)
  const [configuration, setConfiguration] = useState<IurConfiguration | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [importError, setImportError] = useState('')
  const [directory, setDirectory] = useState('')

  async function loadImports(page = 1) {
    try {
      setLoading(true)
      setError('')

      const configurationResponse = await fetch('/api/iur/configuration', {
        credentials: 'include',
      })

      if (!configurationResponse.ok) {
        throw new Error('Unable to load IUR configuration')
      }

      const configurationResult: IurConfiguration = await configurationResponse.json()
      setConfiguration(configurationResult)
      setDirectory((current) => current || configurationResult.directory)

      if (!configurationResult.configured) {
        setData({
          items: [],
          pagination: { page, limit: 20, total: 0, totalPages: 0 },
        })
        return
      }

      const importsResponse = await fetch(`/api/iur/imports?page=${page}&limit=20`, {
        credentials: 'include',
      })

      if (!importsResponse.ok) {
        throw new Error('Unable to load IUR imports')
      }

      const result: ImportResponse = await importsResponse.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadImports()
  }, [])

  async function saveDirectory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setSaving(true)
      setImportError('')

      const response = await fetch('/api/iur/configuration', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ directory: directory.trim() }),
      })

      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as { message?: string } | null
        throw new Error(result?.message ?? 'Unable to save the IUR folder path')
      }

      const result: { directory: string; configured: boolean; scan: unknown } = await response.json()
      setConfiguration({ directory: result.directory, configured: result.configured })
      setDirectory(result.directory)
      await loadImports(1)
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'Unable to save the IUR folder path')
    } finally {
      setSaving(false)
    }
  }

  if (loading && !data) {
    return <p className="p-8 text-sm text-slate-500">Loading IUR imports...</p>
  }

  if (error) {
    return (
      <div>
        <p role="alert">{error}</p>
        <button onClick={() => void loadImports()}>Retry</button>
      </div>
    )
  }

  return (
    <section className="flex-1 overflow-y-auto bg-slate-50 p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Sabre IUR Imports</h1>
          <p className="mt-1 text-xs text-slate-500">Load, review, and use extracted IUR ticket data.</p>
        </div>

        <button
          className="rounded-md border px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => void loadImports(data?.pagination.page ?? 1)}
          disabled={saving || loading}
        >
          Refresh
        </button>
      </div>

      <form className="rounded-lg border p-4" onSubmit={(event) => void saveDirectory(event)}>
        <label className="block text-sm font-medium" htmlFor="iur-folder">
          IUR folder path
        </label>
        <p className="mt-1 text-sm text-gray-500">
          Save the server folder path once. IUR TXT files will be read from this folder whenever the list loads.
        </p>
        <input
          id="iur-folder"
          type="text"
          value={directory}
          onChange={(event) => setDirectory(event.target.value)}
          placeholder="C:\IUR"
          required
          disabled={saving}
          className="mt-3 block w-full rounded-md border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={saving || !directory.trim()}
          className="mt-3 rounded-md bg-black px-3 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? 'Saving and scanning...' : configuration?.configured ? 'Update folder path' : 'Save folder path'}
        </button>
        {importError && (
          <p className="mt-2 text-sm text-red-700" role="alert">
            {importError}
          </p>
        )}
      </form>

      <p className="text-sm text-gray-500">{data?.pagination.total ?? 0} imported files</p>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              {/* <th className="p-3">File</th> */}
              <th className="p-3">Passenger</th>
              <th className="p-3">Ticket</th>
              <th className="p-3">PNR</th>
              <th className="p-3">Route</th>
              <th className="p-3">Class</th>
              <th className="p-3">Base fare</th>
              <th className="p-3">Passenger type</th>
              <th className="p-3">Contact</th>
              <th className="p-3">Journey date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Records</th>
              <th className="p-3">Imported at</th>
            </tr>
          </thead>

          <tbody>
            {data?.items.map((item) => {
              const invoice = item.extractedData?.invoice
              return (
                <Fragment key={item.id}>
                  <tr className="border-b">
                    {/* <td className="p-3">{item.fileName}</td> */}
                    <td className="p-3">{invoice?.passengerName ?? item.extractedData?.passenger.name ?? '-'}</td>
                    <td className="p-3">{invoice?.ticketNo ?? item.extractedData?.ticket.number ?? '-'}</td>
                    <td className="p-3">{invoice?.pnr ?? '-'}</td>
                    <td className="p-3">{invoice?.route ?? '-'}</td>
                    <td className="p-3">{invoice?.class ?? '-'}</td>
                    <td className="p-3">{invoice?.baseFare ?? '-'}</td>
                    <td className="p-3">{invoice?.passengerType ?? '-'}</td>
                    <td className="p-3">{invoice?.contactNo ?? '-'}</td>
                    <td className="p-3">{invoice?.journeyDate ?? '-'}</td>
                    <td className="p-3">{item.status}</td>
                    <td className="p-3">{item.parsedData?.records.length ?? 0}</td>
                    <td className="p-3">{new Date(item.receivedAt).toLocaleString()}</td>
                  </tr>
                  {/* <tr>
                    <td colSpan={13} className="border-t bg-gray-50 p-3">
                      <div className="grid min-w-[900px] grid-cols-4 gap-2 text-xs">
                        <span>Taxes commission: {invoice?.taxesCommission ?? '-'}</span>
                        <span>AIT tax: {invoice?.aitTax ?? '-'}</span>
                        <span>Client price: {invoice?.clientPrice ?? '-'}</span>
                        <span>Commission: {invoice?.commission ?? '-'}</span>
                        <span>Calculated commission: {invoice?.calculatedCommission ?? '-'}</span>
                        <span>Purchase cost: {invoice?.purchaseCost ?? '-'}</span>
                        <span>Net commission: {invoice?.netCommission ?? '-'}</span>
                        <span>Profit: {invoice?.profit ?? '-'}</span>
                        <span>Passport no: {invoice?.passportNo ?? '-'}</span>
                        <span>Email: {invoice?.passengerEmail ?? '-'}</span>
                        <span>Date of birth: {invoice?.dateOfBirth ?? '-'}</span>
                        <span>Passport issue: {invoice?.passportIssueDate ?? '-'}</span>
                        <span>Passport expiry: {invoice?.passportExpiryDate ?? '-'}</span>
                        <span>Return date: {invoice?.returnDate ?? '-'}</span>
                        <span>Travel segment: {invoice?.travelSegment ?? '-'}</span>
                        <span>Remarks: {invoice?.ticketingRemarks ?? '-'}</span>
                      </div>
                    </td>
                  </tr> */}
                </Fragment>
              )
            })}

            {data?.items.length === 0 && (
              <tr>
                <td colSpan={13} className="p-4 text-center">
                  No IUR imports found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between rounded-lg border bg-white px-4 py-3 text-sm">
        <span className="text-slate-500">
          Page {data?.pagination.page ?? 1} of {Math.max(data?.pagination.totalPages ?? 1, 1)}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-md border px-3 py-1.5 text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={loading || (data?.pagination.page ?? 1) <= 1}
            onClick={() => void loadImports((data?.pagination.page ?? 1) - 1)}
          >
            Previous
          </button>
          <button
            type="button"
            className="rounded-md border px-3 py-1.5 text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={loading || (data?.pagination.page ?? 1) >= (data?.pagination.totalPages ?? 1)}
            onClick={() => void loadImports((data?.pagination.page ?? 1) + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  )
}
