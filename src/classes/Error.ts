import { NextResponse } from 'next/server'

class CBGError {
	status: number
	message: string
	code: ErrorCode
	constructor(message: string, status: number, code: ErrorCode) {
		this.status = status
		this.message = message
		this.code = code
	}

	toResponse() {
		return NextResponse.json(
			{ error: this.message, code: this.code },
			{
				status: this.status,
			}
		)
	}
}

export default CBGError

export type ErrorCode =
	| 'MISSING_PARAM'
	| 'MISSING_BODY'
	| 'INTERNAL_SERVER_ERROR'
