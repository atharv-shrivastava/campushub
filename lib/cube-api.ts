const API_URL = (process.env.NEXT_PUBLIC_CUBE_API_URL || '').replace(/\/$/, '')
const USER_ID = process.env.NEXT_PUBLIC_CUBE_USER_ID || 'demo-atharv'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_URL) throw new Error('CUBE API is not configured')
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', 'X-User-Id': USER_ID, ...(init?.headers || {}) },
    cache: 'no-store',
  })
  if (!response.ok) {
    const body = await response.text()
    throw new Error(body || `Request failed with ${response.status}`)
  }
  return response.json() as Promise<T>
}

export type ApiResource = {
  id:number; title:string; subject:string; tag:string; teacher?:string;
  setName:string; fileName:string; votes:number; createdBy:string; createdAt:string
}
export type ApiRequest = {
  id:number; title:string; detail:string; bounty:number; state:string;
  requesterExternalId:string; helperExternalId?:string; createdAt:string;
  deliveredAt?:string; autoReleaseAt?:string
}
export type ApiWallet = {
  userId:string; name:string; monthly:number; spendable:number; conduct:number
}

export const cubeApi = {
  enabled: () => Boolean(API_URL),
  resources: {
    list: (q='') => request<ApiResource[]>(`/api/v1/resources${q ? `?q=${encodeURIComponent(q)}` : ''}`),
    create: (body: {title:string;subject:string;tag:string;teacher?:string;setName:string;fileHash:string;fileName:string}) =>
      request<ApiResource>('/api/v1/resources', { method:'POST', body:JSON.stringify(body) }),
    vote: (id:number) => request<{votes:number}>(`/api/v1/resources/${id}/vote`, { method:'POST' }),
  },
  requests: {
    list: () => request<ApiRequest[]>('/api/v1/requests'),
    create: (body: {title:string;detail:string;bounty:number}) =>
      request<ApiRequest>('/api/v1/requests', { method:'POST', body:JSON.stringify(body) }),
    accept: (id:number) => request<ApiRequest>(`/api/v1/requests/${id}/accept`, { method:'POST' }),
    deliver: (id:number) => request<ApiRequest>(`/api/v1/requests/${id}/deliver`, { method:'POST' }),
    complete: (id:number) => request<ApiRequest>(`/api/v1/requests/${id}/complete`, { method:'POST' }),
    dispute: (id:number) => request<ApiRequest>(`/api/v1/requests/${id}/dispute`, { method:'POST' }),
    cancel: (id:number) => request<ApiRequest>(`/api/v1/requests/${id}/cancel`, { method:'POST' }),
  },
  wallet: () => request<ApiWallet>('/api/v1/wallet'),
}
