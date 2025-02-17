function adjustDateWithoutTime(date : string){

    const dateParse = Date.parse(date);

    const day = new Date(dateParse).getDate();

    const month = (new Date(dateParse).getMonth()) + 1;

    const year = new Date(dateParse).getFullYear();

    let finalDate = year + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day)

    return finalDate
}

export default adjustDateWithoutTime;