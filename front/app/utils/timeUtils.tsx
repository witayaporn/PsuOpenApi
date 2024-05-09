const timeFormatter = (time: string) => {
    try {
        const h: string = time.slice(0, 2);
        const m: string = time.slice(2, 4);
        return h + ":" + m + " น.";
    } catch (e) {
        console.error(e);
    }
    return "-";
};

const dateToTHstr = (dateStr: string) => {
    try {
        const date = new Date(dateStr);
        const dateTHstr = date.toLocaleDateString("th-TH", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
        return dateTHstr;
    } catch (e) {
        console.log(e);
    }
};

const checkTimeOverlap = (
    firstStartT: string,
    firstStopT: string,
    secondStartT: string,
    secondStopT: string
) => {
    const fStartT: number = parseInt(firstStartT) / 100;
    const fStopT: number = parseInt(firstStopT) / 100;
    const sStartT: number = parseInt(secondStartT) / 100;
    const sStopT: number = parseInt(secondStopT) / 100;

    return !(fStartT > sStopT || sStartT > fStopT);
};

const checkDateTimeOverlap = (
    firstDate: string,
    fStartT: string,
    fStopT: string,
    secondDate: string,
    sStartT: string,
    sStopT: string
) => {
    return (
        firstDate == secondDate &&
        checkTimeOverlap(fStartT, fStopT, sStartT, sStopT)
    );
};

export { timeFormatter, dateToTHstr, checkTimeOverlap, checkDateTimeOverlap };
