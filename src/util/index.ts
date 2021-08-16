import moment from "moment";
import "moment-timezone";

// 현재시간 조회
export const getCurrentDate = (pFormat?: string) => {
  pFormat = pFormat || "YYYYMMDDHHmmss";
  return moment().tz("Asia/Seoul").format(pFormat);
};

export const sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

/**
 * 로그 메시지
 */
export const asyncLog = (msg: any) => {
  return new Promise((resolve) => {
    console.log(`${getCurrentDate("YYYY-MM-DD HH:mm:ss")} ${msg}`);
    return resolve("");
  });
};

export const getErrorMessage = (err: any) => {
  const {
    config: { url, data },
    data: { error_code, description },
  } = err.response;
  const errMessage = `error ${error_code}: ${description}
    ${url}
    ${data}`;
  return errMessage;
};
