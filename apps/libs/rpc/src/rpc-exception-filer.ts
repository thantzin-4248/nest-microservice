import { ArgumentsHost, Catch, Logger } from "@nestjs/common";
import { BaseRpcExceptionFilter, RpcException } from "@nestjs/microservices";
import { RpcErrorPayload } from "./rpc.types.js";

// this filter run in microservice process
// our payload structure should follow the way that we want
@Catch()
export class RpcAllExceptionFilter extends BaseRpcExceptionFilter{
   private readonly logger = new Logger(RpcAllExceptionFilter.name);

   catch(exception: any, host: ArgumentsHost){
    if(exception instanceof RpcException){
        return super.catch(exception, host)
    }

    const status = exception?.getStatus?.();
    const errorMessage =
      exception instanceof Error
        ? exception.stack ?? exception.message
        : typeof exception === 'string'
          ? exception
          : typeof exception?.message === 'string'
            ? exception.message
            : 'Unknown RPC error';
    this.logger.error(errorMessage);

    if(status === 400){
        const payload: RpcErrorPayload = {
            code: 'VALIDATION_ERROR',
            message: 'Validation Failed'
        }

        return super.catch(new RpcException(payload), host);
    }

    const payload: RpcErrorPayload = {
            code: 'INTERNAL',
            message: 'Internal Error'
        }

        return super.catch(new RpcException(payload), host);
   }
}