// 安装依赖: pnpm add dayjs

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_APP_VERSION: string;
      NEXT_PUBLIC_BUILD_DATE: string;
    }
  }
}

export {};
