import { IMessageService } from "./IMessageService";

export function createRateLimitProxy(
  service: IMessageService,
  intervalMs: number
): IMessageService {
  let lastCallTime = 0;

  return new Proxy(service, {
    get(target, prop) {
      if(prop === "send") {
        return (message: string) => {
          const now = Date.now();
          if (now - lastCallTime >= intervalMs){
            lastCallTime = now;
            target.send(message)
          }
          console.log("[RateLimit] skipped")
        } 
      }
      return target[prop as keyof typeof target]
    },
  });
}
