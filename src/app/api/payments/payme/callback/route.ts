import { NextResponse } from 'next/server';
import { paymeService, PAYME_ERRORS } from '@/lib/payments/payme';
import { PaymeRpcRequest, PaymeRpcResponse } from '@/types';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    
    // Auth verification
    if (!paymeService.verifyAuthHeader(authHeader)) {
      const errorResponse: PaymeRpcResponse = {
        error: {
          code: PAYME_ERRORS.AUTH_ERROR,
          message: {
            ru: 'Ошибка аутентификации мерчанта Payme',
            uz: 'Autentifikatsiya xatosi',
            en: 'Authentication error',
          },
        },
        id: null as any,
      };
      return NextResponse.json(errorResponse);
    }

    const body: PaymeRpcRequest = await request.json();
    const { method, params, id } = body;

    let responseData: any = null;

    switch (method) {
      case 'CheckPerformTransaction': {
        responseData = paymeService.checkPerformTransaction(params as any);
        break;
      }
      case 'CreateTransaction': {
        responseData = paymeService.createTransaction(params as any);
        break;
      }
      case 'PerformTransaction': {
        responseData = paymeService.performTransaction(params as any);
        break;
      }
      case 'CheckTransaction': {
        responseData = paymeService.checkTransaction(params as any);
        break;
      }
      case 'CancelTransaction': {
        responseData = paymeService.cancelTransaction(params as any);
        break;
      }
      default: {
        return NextResponse.json({
          id,
          error: {
            code: -32601,
            message: {
              ru: `Метод ${method} не поддерживается`,
              uz: `Usul ${method} topilmadi`,
              en: `Method ${method} not found`,
            },
          },
        });
      }
    }

    return NextResponse.json({
      id,
      jsonrpc: '2.0',
      ...responseData,
    });
  } catch (err: any) {
    console.error('Payme callback error:', err);
    return NextResponse.json({
      error: {
        code: PAYME_ERRORS.SYSTEM_ERROR,
        message: {
          ru: 'Системная ошибка сервера',
          uz: 'Tizim xatosi',
          en: 'System error',
        },
      },
      id: null,
    });
  }
}
