export const format = (time, form = "YYYY-MM-dd HH:mm:ss", options) => {
    const base = new Date(time);
    const useAP = form.includes("AP");
    const year = base.getFullYear().toString();
    const mon = base.getMonth().toString();
    const date = base.getDate().toString();
    const h = base.getHours();
    const hour = (!useAP && options?.h24 ? h : h >= 12 ? h - 12 : h).toString();
    const is12 = h >= 12;
    const min = base.getMinutes().toString();
    const sec = base.getSeconds().toString();
    const ms = base.getMilliseconds().toString();
    return form.replace(/YYYY|MM|dd|HH|mm|ss|SSS|YY|M|d|H|m|s|S|AP/g, ($1) => {
        switch ($1) {
            case "YYYY":
                return year.padStart(4, "0");
            case "MM":
                return mon.padStart(2, "0");
            case "dd":
                return date.padStart(2, "0");
            case "HH":
                return hour.padStart(2, "0");
            case "mm":
                return min.padStart(2, "0");
            case "ss":
                return sec.padStart(2, "0");
            case "SSS":
                return ms.padStart(3, "0");
            case "YY":
                return year.slice(2);
            case "M":
                return mon;
            case "d":
                return date;
            case "H":
                return hour;
            case "m":
                return min;
            case "s":
                return sec;
            case "S":
                return ms;
            case "AP":
                return useAP ? (is12 ? "PM" : "AM") : "";
            default:
                return $1;
        }
    });
};
export const formatStamp = (time, options) => {
    const hour = Math.floor((time / 1000 / 60 / 60) % 12)
        .toString()
        .padStart(options?.padding ? 2 : 0, "0");
    const min = Math.floor((time / 1000 / 60) % 60)
        .toString()
        .padStart(options?.padding ? 2 : 0, "0");
    const sec = Math.floor((time / 1000) % 60)
        .toString()
        .padStart(options?.padding ? 2 : 0, "0");
    const ms = Math.floor(time % 1000)
        .toString()
        .padStart(options?.padding ? 3 : 0, "0");
    const builder = [hour, min, sec];
    const joined = [builder.join(":")];
    if (options?.showMs) {
        joined.push(ms);
    }
    return `${joined.join(".")}`;
};
