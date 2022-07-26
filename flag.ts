export default function getIpFlag(ipVersion: string) {
  let ipFlag = "";

  switch (ipVersion) {
    case "ipv4":
      ipFlag = "-4";
      break;
    case "ipv6":
      ipFlag = "-6";
      break;
    default:
      ipFlag = "";
  }

  return ipFlag;
}