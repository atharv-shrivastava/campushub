const DEFAULT_API_URL = 'https://cube-backend-4k2b.onrender.com'
const API_URL = (process.env.NEXT_PUBLIC_CUBE_API_URL || DEFAULT_API_URL).replace(/\/$/, '')

async function request<T>(userId: string, path: string, init?: RequestInit, adminId?: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': userId,
      ...(adminId ? { 'X-Admin-Id': adminId } : {}),
      ...(init?.headers || {}),
    },
    cache: 'no-store',
  })
  if (!response.ok) {
    const body = await response.text()
    throw new Error(body || `Request failed with ${response.status}`)
  }
  return response.json() as Promise<T>
}

export type ApiResource = { id:number; title:string; subject:string; tag:string; teacher?:string; setName:string; fileName:string; votes:number; createdBy:string; createdAt:string }
export type ApiRequest = { id:number; title:string; detail:string; bounty:number; state:string; requesterExternalId:string; helperExternalId?:string; createdAt:string; deliveredAt?:string; autoReleaseAt?:string }
export type ApiWallet = { userId:string; name:string; monthly:number; spendable:number; conduct:number; role:'STUDENT'|'CLUB'|'ADMIN'; validPdfUploads:number; unlocked:boolean }
export type ApiClub = { id:number; name:string; ownerExternalId:string; status:string }
export type ApiEvent = { id:number; title:string; kind:string; venue:string; startsAt:string; status:string; clubId:number; submittedBy:string }

export const cubeApi = {
  enabled: () => Boolean(API_URL),
  user: (userId:string) => ({
    role: (role:'STUDENT'|'CLUB'|'ADMIN') => request<ApiWallet>(userId, `/api/v1/me/role?role=${role}`, {method:'POST'}),
    wallet: () => request<ApiWallet>(userId, '/api/v1/wallet'),
    resources: {
      list: (q='') => request<ApiResource[]>(userId, `/api/v1/resources${q ? `?q=${encodeURIComponent(q)}` : ''}`),
      create: (body: {title:string;subject:string;tag:string;teacher?:string;setName:string;fileHash:string;fileName:string}) => request<ApiResource>(userId,'/api/v1/resources',{method:'POST',body:JSON.stringify(body)}),
      uploadPdf: async (file:File, meta:{title:string;subject:string;tag?:string;teacher?:string;setName?:string}) => {
        const form = new FormData()
        form.append('file', file)
        form.append('title', meta.title)
        form.append('subject', meta.subject)
        form.append('tag', meta.tag || 'Notes')
        if (meta.teacher) form.append('teacher', meta.teacher)
        form.append('setName', meta.setName || 'A')
        const response = await fetch(`${API_URL}/api/v1/resources/upload`, {
          method: 'POST',
          headers: { 'X-User-Id': userId },
          body: form,
          cache: 'no-store',
        })
        if (!response.ok) throw new Error((await response.text()) || `Upload failed with ${response.status}`)
        return response.json() as Promise<ApiResource>
      },
      vote: (id:number) => request<{votes:number}>(userId,`/api/v1/resources/${id}/vote`,{method:'POST'}),
    },
    requests: {
      list: () => request<ApiRequest[]>(userId,'/api/v1/requests'),
      create: (body:{title:string;detail:string;bounty:number}) => request<ApiRequest>(userId,'/api/v1/requests',{method:'POST',body:JSON.stringify(body)}),
      accept:(id:number)=>request<ApiRequest>(userId,`/api/v1/requests/${id}/accept`,{method:'POST'}),
      deliver:(id:number)=>request<ApiRequest>(userId,`/api/v1/requests/${id}/deliver`,{method:'POST'}),
      complete:(id:number)=>request<ApiRequest>(userId,`/api/v1/requests/${id}/complete`,{method:'POST'}),
      dispute:(id:number)=>request<ApiRequest>(userId,`/api/v1/requests/${id}/dispute`,{method:'POST'}),
      cancel:(id:number)=>request<ApiRequest>(userId,`/api/v1/requests/${id}/cancel`,{method:'POST'}),
    },
    clubs: {
      register:(name:string)=>request<ApiClub>(userId,'/api/v1/clubs',{method:'POST',body:JSON.stringify({name})}),
      submitEvent:(body:{title:string;kind:string;venue:string;startsAt:string})=>request<ApiEvent>(userId,'/api/v1/events',{method:'POST',body:JSON.stringify(body)}),
    },
    events: { list:()=>request<ApiEvent[]>(userId,'/api/v1/events') },
  }),
  admin: (adminId:string) => ({
    wallet:()=>request<ApiWallet>(adminId,'/api/v1/wallet',undefined,adminId),
    pendingClubs:()=>request<ApiClub[]>(adminId,'/api/v1/clubs/pending',undefined,adminId),
    pendingEvents:()=>request<ApiEvent[]>(adminId,'/api/v1/events/pending',undefined,adminId),
    moderateClub:(id:number,approve:boolean)=>request<ApiClub>(adminId,`/api/v1/clubs/${id}/moderate?approve=${approve}`,{method:'POST'},adminId),
    moderateEvent:(id:number,approve:boolean)=>request<ApiEvent>(adminId,`/api/v1/events/${id}/moderate?approve=${approve}`,{method:'POST'},adminId),
  }),
}
