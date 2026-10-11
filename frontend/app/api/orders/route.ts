import { NextResponse } from 'next/server'
import { getBackendApiUrl } from '@/lib/backend-api'

export async function POST(request: Request) {
  const backendUrl = getBackendApiUrl()
  if (!backendUrl) {
    return NextResponse.json({ error: 'Backend API URL is not configured.' }, { status: 503 })
  }

  try {
    const response = await fetch(`${backendUrl}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: await request.text(),
      signal: AbortSignal.timeout(10000),
    })
    const result = await response.json().catch(() => ({ error: 'Réponse invalide du serveur.' }))
    return NextResponse.json(result, { status: response.status })
  } catch {
    return NextResponse.json({ error: 'Le serveur de commande est indisponible. Vérifiez que le backend est démarré.' }, { status: 502 })
  }
}

export const runtime = 'nodejs'
