import { NextResponse } from 'next/server'
import { getBackendApiUrl } from '@/lib/backend-api'

async function forwardAdminRequest(request: Request, method: 'GET' | 'PATCH') {
  const adminKey = request.headers.get('x-admin-key')
  if (!adminKey) {
    return NextResponse.json({ error: 'La clé administrateur est requise.' }, { status: 401 })
  }

  const backendUrl = getBackendApiUrl()
  if (!backendUrl) {
    return NextResponse.json({ error: 'Backend API URL is not configured.' }, { status: 503 })
  }

  try {
    const response = await fetch(`${backendUrl}/api/admin/orders`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': adminKey,
      },
      body: method === 'PATCH' ? await request.text() : undefined,
      cache: 'no-store',
      signal: AbortSignal.timeout(10000),
    })
    const result = await response.json().catch(() => ({ error: 'Réponse invalide du serveur.' }))
    return NextResponse.json(result, { status: response.status, headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return NextResponse.json({ error: 'Le backend est indisponible. Vérifiez qu’il est démarré.' }, { status: 502 })
  }
}

export async function GET(request: Request) {
  return forwardAdminRequest(request, 'GET')
}

export async function PATCH(request: Request) {
  return forwardAdminRequest(request, 'PATCH')
}

export const runtime = 'nodejs'
