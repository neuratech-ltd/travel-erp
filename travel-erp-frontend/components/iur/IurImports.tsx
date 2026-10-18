import { useEffect, useState } from 'react'

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

  async function loadImports() {
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
          pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
        })
        return
      }

      const importsResponse = await fetch('/api/iur/imports', {
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
      await loadImports()
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'Unable to save the IUR folder path')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p>Loading IUR imports...</p>

  if (error) {
    return (
      <div>
        <p role="alert">{error}</p>
        <button onClick={() => void loadImports()}>Retry</button>
      </div>
    )
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Sabre IUR Imports</h1>

        <button
          className="rounded-md border px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => void loadImports()}
          disabled={saving}
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
        {importError && <p className="mt-2 text-sm text-red-700" role="alert">{importError}</p>}
      </form>

      <p className="text-sm text-gray-500">{data?.pagination.total ?? 0} imported files</p>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-3">File</th>
              <th className="p-3">Passenger</th>
              <th className="p-3">Ticket</th>
              <th className="p-3">Source PC</th>
              <th className="p-3">Status</th>
              <th className="p-3">Records</th>
              <th className="p-3">Imported at</th>
            </tr>
          </thead>

          <tbody>
            {data?.items.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="p-3">{item.fileName}</td>
                <td className="p-3">{item.extractedData?.passenger.name ?? '-'}</td>
                <td className="p-3">{item.extractedData?.ticket.number ?? '-'}</td>
                {item.extractedData?.ticket.baseAmount && item.extractedData?.ticket.currency ? (
                  <td className="p-3">
                    {item.extractedData.ticket.baseAmount} {item.extractedData.ticket.currency}
                  </td>
                ) : (
                  <td className="p-3">-</td>
                )}
                <td className="p-3">{item.sourceDevice}</td>
                <td className="p-3">{item.status}</td>
                <td className="p-3">{item.parsedData?.records.length ?? 0}</td>
                <td className="p-3">{new Date(item.receivedAt).toLocaleString()}</td>
              </tr>
            ))}

            {data?.items.length === 0 && (
              <tr>
                <td colSpan={7} className="p-4 text-center">
                  No IUR imports found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
