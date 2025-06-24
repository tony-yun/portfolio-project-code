import { NextResponse, type NextRequest } from 'next/server'

export const config = {
  matcher: [
    // 정적 리소스 및 API 제외한 페이지 요청만 처리
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
    '/', // 루트 경로도 명시적으로 포함
  ],
}

export const middleware = (req: NextRequest) => {
  const authToken = req.cookies.get('auth-token')?.value

  const response = NextResponse.next()

  if (authToken) {
    console.log('[native authToken 확인]')

    response.headers.set('x-auth-token', authToken)

    response.cookies.set({
      name: 'x-auth-token',
      value: authToken,
    })
  }

  return response
}
