function adjustDate(date : string){

    const dateParse = Date.parse(date);

    let getDate = new Date(dateParse).toISOString().slice(0, 10);

    let getTime = new Date(dateParse).toLocaleTimeString();

    const finalDate = getDate + " " + getTime;

    return finalDate
}

export default adjustDate;