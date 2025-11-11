export type PropsServe = {
  readonly fetch: (req: Request) => Response | Promise<Response>;
  readonly hostname: string;
  readonly port: number;
};
