

export interface ErrorLike {
  status?: number
  [any: string]: any
}

export type ErrorBody = string | object

export interface ErrorFormatter {
  (statusCode?: number, body?: ErrorBody): Response
  (error: ErrorLike): Response
}

const getMessage = (code: number): string => {
  return (
    {
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      500: 'Internal Server Error',
    }[code] || 'Unknown Error'
  )
}
//@ts-expect-error
export const error: ErrorFormatter = (a = 500, b?: ErrorBody) => {
  // handle passing an Error | StatusError directly in
  //@ts-expect-error
  if (a instanceof Error) {
      //@ts-expect-error
    const { message, ...err } = a
      //@ts-expect-error
    a = a.status || 500
    b = {
      errors: [{message:message || getMessage(a)}],
      ...err,
    }
  }

  b = {
    ...(typeof b === 'object' ? b : { errors: [{message: b || getMessage(a) }]}),
  }

  return new Response(JSON.stringify(b), {
		headers: {
			'content-type': 'application/json',
		},
		status: a,
	})
}