import { Status } from '@/types'

export function statusToString(status: Status) {
	if (status.error) return 'error'
	if (status.generating) return 'generating'
	if (status.ready) return 'ready'
	else return 'waiting'
}
