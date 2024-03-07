import CBGError from '@/classes/Error'
import { ValidatorFunction } from '@/types'

export function ensureParams(
	params: Record<string, any>,
	requiredParams: string[]
): ValidatorFunction {
	console.log(params, requiredParams)
	const missingParams = requiredParams.filter((param) => !(param in params))

	if (missingParams.length > 0) {
		return {
			isError: true,
			error: new CBGError(
				'Missing required parameters: ' + missingParams.join(', '),
				400,
				'MISSING_PARAM'
			),
		}
	}

	return {
		isError: false,
	}
}
