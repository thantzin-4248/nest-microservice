import { ArgumentsHost, Catch } from "@nestjs/common";
import { BaseRpcExceptionFilter, RpcException } from "@nestjs/microservices";
import { RpcErrorPayload } from "./rpc.types.js";

// this filter run in microservice process
// our payload structure should follow the way that we want
@Catch()
export class RpcAllExceptionFilter extends BaseRpcExceptionFilter{
   catch(exception: any, host: ArgumentsHost){
    if(exception instanceof RpcException){
        return super.catch(exception, host)
    }

    const ctx = host.switchToHttp();
    const response  = ctx.getResponse<Response>();
    const status = exception?.getStatus?.();

    if(status === 400){
        const payload: RpcErrorPayload = {
            code: 'VALIDATION_ERROR',
            message: 'Validation Failed',
            details: response
        }

        return super.catch(new RpcException(payload), host);
    }

    const payload: RpcErrorPayload = {
            code: 'INTERNAL',
            message: 'Internal Error',
            details: response
        }

        return super.catch(new RpcException(payload), host);
   }
}